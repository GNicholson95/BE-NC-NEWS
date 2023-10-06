
const app = require('../app');
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require('../db/data/test-data/index')
const endpoints = require('../endpoints.json');

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

describe('GET/api/articles/:article_id', () => {
  it('GET:200 and should respond with an object containing correct article properties', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        })
      });
    });
  it('should throw 400 error if given a bad request', () => {
    return request(app)
    .get('/api/articles/banana')
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad request')
  })
  });
  it('should throw 404 error if given id doesnt exist', () => {
    return request(app)
    .get('/api/articles/1000')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Resource not found')
  })
  });
});

describe('GET/api/articles', () => {
  it("gets all articles", () => {
    return request(app).get("/api/articles").then((response) => {
            expect(response.body.articles.length).toBe(13);
         });
     });
  it('GET:200 and should respond with an articles array all article objects', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        articles.forEach((article) => {
          expect(typeof article.author).toBe('string');
          expect(typeof article.title).toBe('string');
          expect(typeof article.article_id).toBe('number');
          expect(typeof article.topic).toBe('string');
          expect(typeof article.created_at).toBe('string');
          expect(typeof article.votes).toBe('number');
          expect(typeof article.article_img_url).toBe('string');
          expect(typeof article.comment_count).toBe('string');
            });
      });
      
  });

  it('should return the articles sorted by date in descending order.', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toBeSortedBy('created_at',{
          descending: true,
        });
      });
  });

  it('should return the articles without a body property present on any of the article objects.', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(Array.isArray(articles)).toBe(true)
        articles.forEach((article) => {
          expect(article.hasOwnProperty('body')).toBe(false);
            });
      });
  });
  
  it('should throw 404 error if given id doesnt exist', () => {
    return request(app)
    .get('/api/articles/1000')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Resource not found')
  })
  });
});


describe('GET/api/articles/:article_id/comments', () => {
  it('GET:200 and should respond with an an array of comments for the given article_id', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments.length).toBe(11);
        expect(comments[1]).toMatchObject({
          comment_id: 2,
          votes: 14,
          author: 'butter_bridge',
          body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
          article_id: 1,
        })
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe('number');
          expect(typeof comment.votes).toBe('number');
          expect(typeof comment.created_at).toBe('string');
          expect(typeof comment.author).toBe('string');
          expect(typeof comment.body).toBe('string');
          expect(typeof comment.article_id).toBe('number');
        });
      });
    });
    it('should return the comments sorted by date in descending order.', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toBeSortedBy('created_at',{
            descending: true,
          });
        });
    });
  it('should throw 400 error if given a bad request', () => {
    return request(app)
    .get('/api/articles/banana/comments')
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad request')
  })
  });
  it('should throw 404 error if given id doesnt exist', () => {
    return request(app)
    .get('/api/articles/1000/comments')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Resource not found')
  })
  });

  it('should check exists but has no comments', () => {
    return request(app)
    .get('/api/articles/2/comments')
    .expect(200)
    .then((response) => {
      const { comments } = response.body;
      expect(comments).toEqual([])
  })
  });
});

describe('GET/api/users', () => {
     it("get all users", () => {
      return request(app).get("/api/users").then((response) => {
              expect(response.body.users.length).toBe(4);
           });
       });
  it('GET:200 and should respond with an users array all user objects', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then((response) => {
        const { users } = response.body;
        users.forEach((user) => {
          expect(typeof user.username).toBe('string');
          expect(typeof user.name).toBe('string');
          expect(typeof user.avatar_url).toBe('string');
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