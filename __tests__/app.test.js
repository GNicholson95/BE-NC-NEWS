const app = require('../app');
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require('../db/data/test-data/index')
const endpoints = require('../endpoints.json')

beforeEach(() => {
	return seed(data);
});
afterAll(() => db.end());

describe('GET /api/topics', () => {
    it("checks a good connection to api", () => {
          return request(app).get("/api/topics").expect(200)
      });
      it("get all topics", () => {
        return request(app).get("/api/topics").then((response) => {
                expect(response.body.topics.length).toBe(3);
             });
         });
      it("sends an array of topics of the correct format", () => {
          return request(app).get("/api/topics").then((response) => {
            response.body.topics.forEach((topic) => {
                expect (topic.hasOwnProperty('slug')) .toBe(true);
                expect (topic.hasOwnProperty('description')) .toBe(true)
                expect(typeof topic.description).toBe("string");
                expect(typeof topic.slug).toBe("string");
                  });
              });
      });
      it('should respond not found for invalid endpoint', () => {
        return request(app).get('/invalid-endpoint')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Path not found')
        })
    });
  });

  describe('GET/api', () => {
    it('should respond with an object describing all endpoints', () => {
        return request(app).get('/api')
          .expect(200).then((response) => {
            expect(response.body).toEqual(endpoints)
            expect(typeof response.body).toBe('object')
        })
    })
    });
// test push
describe('GET/api/articles/:article_id', () => {
  it('GET:200 and should respond with an object containing correct article properties', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(typeof article).toBe('object')
        expect (article.hasOwnProperty('author')).toBe(true);
        expect (article.hasOwnProperty('title')).toBe(true);
        expect (article.hasOwnProperty('article_id')).toBe(true);
        expect (article.hasOwnProperty('body')).toBe(true);
        expect (article.hasOwnProperty('topic')).toBe(true);
        expect (article.hasOwnProperty('created_at')).toBe(true);
        expect (article.hasOwnProperty('votes')).toBe(true);
        expect (article.hasOwnProperty('article_img_url')).toBe(true);
      });
  });
  it('should throw 404 error if given id doesnt exist', () => {
    return request(app)
    .get('/api/articles/1000')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Path not found')
  })
  });
});

