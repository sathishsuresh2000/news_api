module.exports = {
  headlinesResponse: {
    data: {
      articles: [
        {
          content: "testcontent1",
          description: "test description1",
          title: "People desperate to reach Europe"
        },
        {
          content: "testcontent2",
          description: "test description2",
          title: "People desperate to reach USA"
        }
      ]
    },
    status: 200,
  },
  headlinesErrorResponse: {
    status: 401,
    data: {
      errors: ["Invalid api key"]
    }
  },
};

