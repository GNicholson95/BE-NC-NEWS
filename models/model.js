const db = require("../db/connection");

exports.fetchTopics = () => {
	return db.query("SELECT * FROM topics;")
	.then(({ rows }) => {
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

  exports.fetchArticles = () => {
	return db.query(`SELECT articles.article_id,title,topic,articles.author,articles.created_at,articles.votes,article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;
	`).then(({ rows }) => {
		return rows;
	})
};

  exports.selectCommentsByArticleId = (article_id) => {
	return db
	  .query('SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC;', [
		article_id
	  ])
	  .then((result) => {
		return result.rows;
	  });
  };

  exports.fetchArticles = () => {
	return db.query(`SELECT articles.article_id,title,topic,articles.author,articles.created_at,articles.votes,article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;
	`).then(({ rows }) => {
		return rows;
	})
};

exports.fetchUsers = () => {
	return db.query("SELECT * FROM users;")
	.then(({ rows }) => {
		return rows;
	})
};
  
exports.insertComment = (article_id, username, body ) => {
	return db
	  .query(
		'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;',
		[article_id, username, body]
	  )
	  .then((result) => {
		// if (result.rows.length === 0) {
		// 	return Promise.reject({ status: 404, msg: 'Resource not found' });
		// }
		return result.rows[0];
	  });
  };
