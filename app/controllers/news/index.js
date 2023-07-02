const { HTTP_CODES, MESSAGES } = require("../../utils/constants");
const newsService = require("../../services/news");

class NewsController {

  async getNews(req, res) {
    try {
      const result = await newsService.getNews({ lang: req.query?.lang });
      if (result.result) {
        return res.status(HTTP_CODES.SUCCESS).send({ result: result.result });
      }
      return res.status(result.status).send({ message: MESSAGES.FIX_ERRORS, errors: result.errors });
    } catch (err) {
      console.log("Error while fetching headlines:", err);
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send({ message: MESSAGES.ERROR_FETCHING_NEWS });
    }
  }
  async searchNews(req, res) {
    try {
      if (!req.query?.q || !req.query.q.trim()) {
        return res.status(HTTP_CODES.BAD_REQUEST).send({ message: MESSAGES.FIX_ERRORS, errors: [MESSAGES.INVALID_QUERY] });
      }
      const result = await newsService.searchNews(req.query);
      if (result.result) {
        return res.status(HTTP_CODES.SUCCESS).send({ result: result.result });
      }
      return res.status(result.status).send({ message: MESSAGES.FIX_ERRORS, errors: result.errors });
    } catch (err) {
      console.log("Error while searching news:", err);
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send({ message: MESSAGES.ERROR_FETCHING_NEWS });
    }
  }
}

module.exports = new NewsController();