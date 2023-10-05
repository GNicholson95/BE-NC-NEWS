const db = require("../db/connection");

exports.fetchTopics = () => {
	return db.query("SELECT * FROM topics;").then(({ rows }) => {
		return rows;
	})
};

exports.selectArticleById = (article_id) => {
	return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
	  .then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Resource not found' });
		}
		return result.rows[0];
	  })
  };

  exports.selectCommentsByArticleId = (article_id) => {
	return db
	  .query('SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC;', [
		article_id
	  ])
	  .then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Resource not found' });
		}
		return result.rows;
	  });
  };