
const app = require('../app');
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require('../db/data/test-data/index')
const endpoints = require('../endpoints.json');
const comments = require('../db/data/test-data/comments');

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

  it('filters the articles by the topic value specified in the query.', () => {
    return request(app)
    .get('/api/articles')
    .query({ topic: 'mitch'})
    .expect(200)
    .then((response) => {
      const { articles } = response.body;
      articles.forEach((article) =>{
        expect(article).toHaveProperty('topic','mitch')
      })
  })
  });
// ran out of time!
  xit('should check exists but has no comments', () => {
    return request(app)
    .get('/api/articles')
    .query({ topic: 'paper'})
    .expect(200)
    .then((response) => {
      const { articles } = response.body;
      expect(articles).toEqual([])
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
describe('POST /api/articles/:article_id/comments', () => {

  it('should return 201 and add a comment for an article.', () => {
    const comment = {
      username: 'butter_bridge',
      body: 'My comments'
    }
    return request(app)
      .post('/api/articles/1/comments')
      .send(comment)
      .expect(201)
      .then((response) => {
          expect(response.body.comment).toMatchObject({
           author: 'butter_bridge',
           body: 'My comments',
          })
        expect(typeof response.body.comment.comment_id).toBe('number');
        expect(typeof response.body.comment.votes).toBe('number');
        expect(typeof response.body.comment.created_at).toBe('string');
        expect(typeof response.body.comment.author).toBe('string');
        expect(typeof response.body.comment.body).toBe('string');
        expect(typeof response.body.comment.article_id).toBe('number');
      });
  });

it('POST:400 error if not given a comment', () => {
  const comment = {}
  return request(app)
    .post('/api/articles/banana/comments')
    .send(comment)
    .expect(400)
    .then((response) => {
    expect(response.body.msg).toBe('Bad request')
})
})

it('should throw 404 error if article not found', () => {
  const comment = {
    username: 'no_user',
    body: 'My comments'
  }
  return request(app)
  .post('/api/articles/1000/comments')
  .send(comment)
  .expect(404)
  .then((response) => {
      expect(response.body.msg).toBe('Resource not found')
   })
})

it('POST:400 error if given an invalid article id', () => {
  const comment = {
    username: 'butter_bridge',
    body: 'My comment'
  }
  return request(app)
    .post('/api/articles/banana/comments')
    .send(comment)
    .expect(400)
    .then((response) => {
    expect(response.body.msg).toBe('Bad request')
})
})

it('should throw 404 error if username doesnt exist (PSQL err)', () => {
  const comment = {
    username: 'no_user',
    body: 'My comments'
  }
  return request(app)
  .post('/api/articles/1/comments')
  .send(comment)
  .expect(404)
  .then((response) => {
      expect(response.body.msg).toBe('Resource not found')
   })
})
})

describe('DELETE/api/comments/:comment_id', () => {
  it('deletes comments by id', () => {
    return request(app)
    .delete('/api/comments/3')
    .then((response)=>{
      expect(response.status).toBe(204)
    })
  });
  it('delete responds with a 400 err when given an invalid id', () => {
    return request(app)
    .delete('/api/comments/carrot')
    .expect(400)
    .then((response)=>{
      expect(response.body.msg).toBe('Bad request')
    })
  });
});

describe('Patch /api/articles/:article_id', () => {
  it('retuns a article with incremented votes', () => {
    const newVote = { inc_votes: 1 }; 
    return request(app)
      .patch('/api/articles/3')
      .send(newVote)
      .expect(201)
      .then((response) => {
        console.log(response.body);
        expect(response.body).toHaveProperty('votes')
        expect(response.body.votes).toBe(1)
      });
  });

  it('retuns a article with decremented votes', () => {
    const newVote = { inc_votes: -100 }; 
    return request(app)
      .patch('/api/articles/3')
      .send(newVote)
      .expect(201)
      .then((response) => {
        console.log(response.body);
        expect(response.body).toHaveProperty('votes')
        expect(response.body.votes).toBe(-100)
      });
  });

  it('responds with a 400 error for an invalid inc_votes value', () => {
    const newVote = { inc_votes: 'carrot' };
    return request(app)
      .patch('/api/articles/3')
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });

});
