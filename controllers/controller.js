const { fetchTopics, selectArticleById } = require('../models/model')
const endpoints = require('../endpoints.json')

exports.getTopics = (req, res) => {
	fetchTopics().then((topics) => {
		res.status(200).send({ topics });
	}).catch((err) => {
        return err
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

