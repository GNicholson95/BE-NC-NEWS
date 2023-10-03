const express = require('express');
const app = express();
const { getTopics, getEndpoints, getArticleById } = require('./controllers/controller'); 


app.get('/api/topics', getTopics); 

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticleById);

// app.use((req, res, next) => {
//     const error = new Error("Not Found");
//     error.status = 404;
//     next(error);
// });

app.use((err, req, res, next) => {
    console.log(err);
    if (err.status === 400) {
      res.status(400).send({msg:'Bad request'});
    }else if(err.status === 404){
        res.status(404).send({msg:'Path not found'})
    }else{
        res.status (500). send ({ msg: 'internal server error!' });
    }
  });

app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
});

module.exports = app;