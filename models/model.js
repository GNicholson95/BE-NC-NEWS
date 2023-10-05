const db = require("../db/connection");

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

exports.selectCommentsByArticleId = (Article_id) => {
	return db
	  .query('SELECT * FROM comments WHERE comments.Article_id = $1 ORDER BY created_at DESC;', [
		Article_id
	  ])
	  .then((result) => {
		console.log(result.rows);
		return result.rows;
	  });
  };