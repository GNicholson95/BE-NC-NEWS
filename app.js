const express = require('express');
const app = express();
const { getTopics, getEndpoints } = require('./controllers/controller'); 


app.get('/api/topics', getTopics); 

app.get('/api', getEndpoints);



app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    res.status(404).send({ msg: "Not Found" });
});

module.exports = app;