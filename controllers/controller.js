
const { fetchTopics, selectArticleById, fetchArticles, selectCommentsByArticleId, insertComment, fetchUsers, deleteCommentById, updateArticles} = require('../models/model')

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

  exports.getAllArticles = (req, res, next) => {
	const { topic } = req.query;
	fetchArticles(topic).then((articles) => {
		res.status(200).send({ articles });
	}).catch(next)
};

exports.getCommentsByArticleId  = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id).then((result) =>{
		return selectCommentsByArticleId(article_id).then((comments) => {
			res.status(200).send({ comments });
		  })
	}).catch(next)
  };


exports.getAllUsers = (req, res, next) => {
	fetchUsers().then((users) => {
		res.status(200).send({ users });
	}).catch(next)
};


exports.postComment = (req, res, next) => {
	// gets url
	const { article_id } = req.params;
	// gets user name and body 
	const { username, body } = req.body;
	insertComment(article_id, username, body).then((result) => {
		res.status(201).send({comment : result});
	}).catch(next)
  };


  exports.deleteComment = (req, res, next) =>{
	const { comment_id } = req.params
	deleteCommentById(comment_id)
	.then(()=>{
		res.status(204).send();
	}).catch(next)
  }
  
  exports.patchArticleById = (req, res, next) =>{
	const { article_id } = req.params
	const newVotes = req.body.inc_votes;
	updateArticles(newVotes, article_id)
	.then((result)=>{
		res.status(201).send(result)
	}).catch(next)
}
