const { Router } = require("express");
const newsController = require('../controllers/news');
const { MESSAGES } = require("../utils/constants");

class Routes extends Router {
  constructor() {
    super();
    this.get('/', (_, res) => res.send(MESSAGES.WELCOME_MESSAGE));
    this.get('/api/news', newsController.getNews);
    this.get('/api/news/search', newsController.searchNews);
  }
}

module.exports = Routes;