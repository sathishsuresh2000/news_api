const axios = require("axios");
const qs = require("qs");
const newsController = require("../../../app/controllers/news");
const { HTTP_CODES, MESSAGES } = require("../../../app/utils/constants");
const mockData = require("../../../mockData/mockNewsData");
const newsService = require("../../../app/services/news");
const gnewsConfig = require("config").get("gnews");
const cacheStore = require(".../../../app/cacheStore");

jest.mock("axios");

describe("news controller", () => {

  let res = {};
  beforeEach(() => {
    res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    axios.mockClear();
  });

  describe("getNews", () => {

    test("should return the headlines", async () => {
      axios.mockResolvedValueOnce(mockData.headlinesResponse);
      await newsController.getNews({}, res);
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.SUCCESS);
      expect(res.send).toHaveBeenCalledWith({ result: mockData.headlinesResponse.data.articles });
    });

    test("should return error when news api throws error", async () => {
      axios.mockResolvedValueOnce(mockData.headlinesErrorResponse);
      await newsController.getNews({}, res);
      expect(res.status).toHaveBeenCalledWith(mockData.headlinesErrorResponse.status);
      expect(res.send).toHaveBeenCalledWith({ errors: mockData.headlinesErrorResponse.data.errors, message: MESSAGES.FIX_ERRORS });
    });

    test("should allow language to be passed to news api to get headlines", async () => {
      axios.mockResolvedValueOnce(mockData.headlinesResponse);
      await newsController.getNews({ query: { lang: "en" } }, res);
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.SUCCESS);
      queryString = qs.stringify({ lang: "en" });
      const url = `${gnewsConfig.server}${gnewsConfig.apiVersion}${gnewsConfig.headlinesApi}?apikey=${gnewsConfig.apiKey}&${queryString}`;
      expect(axios).toHaveBeenCalledWith({ ValidityStatus: newsService._validateStatus, url });
    });
  });

  describe("searchNews", () => {

    describe("validation", () => {

      test("should throw bad request when query is not passed or invalid", async () => {
        await newsController.searchNews({}, res);
        expect(res.status).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST);
        expect(res.send).toHaveBeenCalledWith({ message: MESSAGES.FIX_ERRORS, errors: [MESSAGES.INVALID_QUERY] });
      });
    });

    test("should return the search results and cache as well", async () => {
      const setMock = jest.spyOn(cacheStore, "set");
      axios.mockResolvedValueOnce(mockData.headlinesResponse);
      const query = { lang: "en", q: "test" };
      await newsController.searchNews({ query }, res);
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.SUCCESS);
      queryString = qs.stringify(query);
      const url = `${gnewsConfig.server}${gnewsConfig.apiVersion}${gnewsConfig.headlinesApi}?apikey=${gnewsConfig.apiKey}&${queryString}`;
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.SUCCESS);
      expect(res.send).toHaveBeenCalledWith({ result: mockData.headlinesResponse.data.articles });
      expect(setMock).toHaveBeenCalledWith(queryString, mockData.headlinesResponse.data.articles);
      setMock.mockClear();
    });

    test("when same query is search again, should return from the cache", async () => {
      const getMock = jest.spyOn(cacheStore, "get");
      axios.mockResolvedValueOnce(mockData.headlinesResponse);
      const query = { lang: "en", q: "test1" };
      await newsController.searchNews({ query }, res);
      queryString = qs.stringify(query);
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.SUCCESS);
      expect(axios).toHaveBeenCalled();
      await newsController.searchNews({ query }, res);
      expect(getMock).toHaveBeenCalledWith(queryString);
      expect(res.status).toHaveBeenCalledWith(HTTP_CODES.SUCCESS);
      expect(res.send).toHaveBeenCalledWith({ result: mockData.headlinesResponse.data.articles });
      expect(axios).toHaveBeenCalled();
      getMock.mockClear();
    });
  });
});