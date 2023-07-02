# News API

## Application Setup
* First install the dependencies - 
* ```
    npm ci
  ```

* Please create an account in gnews.io to get the api key. Replace the actual api key with <Apikey> in below export command, 
* ```
  export NODE_CONFIG='{"gnews": {"apiKey":"<apikey>"}}'
  ```
* To start the application, 
* ```
    npm run start
  ```
* To run the test cases,
* ```
    npm run test
  ```

## Problem Summary
* Users should be able to  see latest news.
* Users should be able to search news, fetch n news, search by title author keywords and results should be stored in cache.

## Summary of Changes
* Layering architecture with singleton patten has been adopted.
* config module is used to manage configs.
* Two APIs /api/news and /api/news/search are introduced. 

## API Changes

### GET */api/news*
* This API is used to get top headlines from gnews and return the result.
* *lang* is the only query parameter this API accepts. If lang is not passed, it will return top-headlines of all languages.
* To know more about languages supported, please refer [here](https://gnews.io/docs/v4#languages)
* Sample Request - 
  * ```
    curl http://localhost:3000/api/news?lang=en
    ``` 
* Sample response - 
  * ```
      {
        "result": [
          {
            "title":"FIA offloads Hungary-bound passenger over fake documents","description":"The Federal Investigation Authority (FIA) has offloaded a Hungary-bound passenger at Lahore International Airport for carrying fake travel documents.",
            "url":"https://www.nation.com.pk/02-Jul-2023/fia-offloads-hungary-bound-passenger-over-fake-documents","image":"https://www.nation.com.pk/digital_images/large/2023-07-02/fia-offloads-hungary-bound-passenger-over-fake-documents-1688283992-9662.jpg","publishedAt":"2023-07-02T07:46:46Z","source":{
              "name":"The Nation","url":"https://www.nation.com.pk"
            }
          }
        ]
      } 
    ```

### GET */api/news/search*
* This API is used to search news articles.
* q query param is required to search the articles, if not passed, the api will throw bad request error.
* Please refer [here](https://gnews.io/docs/v4#query-syntax) to understand how keywords can be passed in q query param.
* Check this [link](https://gnews.io/docs/v4#search-endpoint-query-parameters) to understand the query parameters supported and it's values.
* Sample Request - 
  * ```
      curl http://localhost:3000/api/news/search?q=microsoft&lang=en
    ``` 
* Sample response - 
  * ```
    {
        "result": [
          {
            "title":"FIA offloads Hungary-bound passenger over fake documents","description":"The Federal Investigation Authority (FIA) has offloaded a Hungary-bound passenger at Lahore International Airport for carrying fake travel documents.",
            "url":"https://www.nation.com.pk/02-Jul-2023/fia-offloads-hungary-bound-passenger-over-fake-documents","image":"https://www.nation.com.pk/digital_images/large/2023-07-02/fia-offloads-hungary-bound-passenger-over-fake-documents-1688283992-9662.jpg","publishedAt":"2023-07-02T07:46:46Z","source":{
              "name":"The Nation","url":"https://www.nation.com.pk"
            }
          }
        ]
      } 
    ```
* Basic validation is added to check q query param is passed, if not passed, api will throw bad request error.
* For successful search, result will be cached in in-memory store and will be returned for same search query params in subsequent requests.

## Additional Insights
* To make the assignment simpler and for easy delivery, in-memory cache has been used. Definitely in-memory databases like redis or pushing to CDN are better options for production purpose.
* search is only applicable for search api of gnews, eventhough gnews provides search in top-headlines as well. This is done to avoid confusion whether user is search top-headlines or all articles.