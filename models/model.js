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

  exports.selectCommentsByArticleId = (article_id) => {
	return db
	  .query('SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC;', [
		article_id
	  ])
	  .then((result) => {
		return result.rows;
	  });
  };

  exports.fetchArticles = (topic) => {
	// console.log(topic);
	if (topic) {
	  return db.query('SELECT * FROM articles WHERE topic = $1;', [topic]).then((result) => {
		if (result.rows.length === 0) {
		  return Promise.reject({ status: 404, msg: 'Resource not found' });
		}
		return result.rows;
	  });
	} else {
	  return db.query(`
		SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count
		FROM articles
		LEFT JOIN comments ON articles.article_id = comments.article_id
		GROUP BY articles.article_id
		ORDER BY created_at DESC;
	  `).then(({ rows }) => {
		return rows;
	  });
	}
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
		return result.rows[0];
	  });
  };


  exports.deleteCommentById = (Comment_id) =>{
	return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;',
	[Comment_id])
	.then((result) =>{
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Resource not found' });
		}
		return result.rows[0]
	})
  }

  exports.updateArticles =(newVotes, article_id)=>{
	return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`
	,[newVotes, article_id])
	.then((result)=>{
		if (result.rows.length === 0) {
			return Promise.reject({status:404, msg:'Resource not found'})
		}
		return result.rows[0]
	})
}
