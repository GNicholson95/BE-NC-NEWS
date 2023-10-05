const { fetchTopics, selectArticleById, selectCommentsByArticleId} = require('../models/model')
const endpoints = require('../endpoints.json')

exports.getTopics = (req, res) => {
	fetchTopics().then((topics) => {
		res.status(200).send({ topics });
	})
};

exports.getEndpoints = (req, res) => {
        res.status(200).send(endpoints);
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
	.then((article) => {
	  res.status(200).send({ article });
	})
	.catch(next)
  };


exports.getCommentsByArticleId  = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id).then((result) =>{
		return selectCommentsByArticleId(article_id).then((comments) => {
			res.status(200).send({ comments });
		  })
	}).catch(next)
  };
