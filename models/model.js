const db = require("../db/connection");
const checkExists = require('../db/seeds/utils')

exports.fetchTopics = () => {
	return db.query("SELECT * FROM topics;").then(({ rows }) => {
		return rows;
	})
};

exports.selectArticleById = (Article_id) => {
	return db.query('SELECT * FROM articles WHERE Article_id = $1;', [Article_id])
	  .then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Resource not found' });
		}
		return result.rows[0];
	  })
  };

  exports.fetchArticles = () => {
	return db.query(`SELECT articles.article_id,title,topic,articles.author,articles.created_at,articles.votes,article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;
	`).then(({ rows }) => {
		return rows;
	})
};
  