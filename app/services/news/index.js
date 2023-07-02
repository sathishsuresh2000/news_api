const qs = require("qs");
const axios = require("axios");
const gnewsConfig = require("config").get("gnews");
const { HTTP_CODES, MESSAGES } = require("../../utils/constants");
const cacheStore = require("../../cacheStore");

class NewsService {

  async getNews(queryObj) {
    return this._fetchNews(gnewsConfig.headlinesApi, queryObj);
  }

  async searchNews(queryObj) {
    return this._fetchNews(gnewsConfig.searchApi, queryObj);
  }

  async _fetchNews(api, queryObj = {}) {
    const queryString = qs.stringify(queryObj);
    if (queryObj.q && cacheStore.has(queryString)) {
      return { result: cacheStore.get(queryString) };
    }
    const response = await this._getRequest(this._constructUrl(api, queryString));
    if (response?.status === HTTP_CODES.SUCCESS) {
      if (queryObj.q && response?.data?.articles) {
        cacheStore.set(queryString, response.data.articles);
      }
      return { result: response?.data?.articles || [] };
    }
    return { errors: response?.data?.errors || [MESSAGES.ERROR_FETCHING_NEWS], status: response?.status || HTTP_CODES.INTERNAL_SERVER_ERROR };
  }

  _constructUrl(api, queryString) {
    return `${gnewsConfig.server}${gnewsConfig.apiVersion}${api}?apikey=${gnewsConfig.apiKey}&${queryString}`;
  }

  _getRequest(url) {
    return axios({ url, ValidityStatus: this._validateStatus });
  }

  _validateStatus(status) {
    return status >= HTTP_CODES.SUCCESS && status <= HTTP_CODES.NETWORK_AUTH_ERROR;
  }
}

module.exports = new NewsService();