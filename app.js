const express = require('express');
const app = express();
const { getTopics, getEndpoints, getArticleById, getAllArticles, getCommentsByArticleId, postComment} = require('./controllers/controller'); 

app.use(express.json());

app.get('/api/topics', getTopics); 

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postComment);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({msg:'Bad request'});
  }else if(err.code === '22P02'){
    res.status(400).send({msg:'Bad request'})
  }else if(err.status === 404){
    res.status(404).send({msg:'Resource not found'})
  }else{
      console.log(err);
      res.status (500). send ({ msg: 'internal server error!' });
    }
  });

module.exports = app;