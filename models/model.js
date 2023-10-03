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
		console.log(result.rows);
		if (result.rows.length === 0) {
			console.log('hello');
			return Promise.reject({ status: 404, msg: 'Resource not found' });
		}
		return result.rows[0];
	  })
  };

