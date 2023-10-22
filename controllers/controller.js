const { fetchTopics, selectArticleById, fetchArticles, selectCommentsByArticleId, updateArticles} = require('../models/model')
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
  exports.getAllArticles = (req, res, next) => {
	fetchArticles().then((articles) => {
		res.status(200).send({ articles });
	}).catch(next)
};

exports.patchArticleById = (req, res, next) =>{
	const { article_id } = req.params
	const newVotes = req.body.inc_votes;
	updateArticles(newVotes, article_id)
	.then((result)=>{
		res.status(201).send(result)
	}).catch(next)
}