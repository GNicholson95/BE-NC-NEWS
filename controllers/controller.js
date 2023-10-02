const { fetchTopics } = require('../models/model')

exports.getTopics = (req, res) => {
	fetchTopics().then((topics) => {
       
		res.status(200).send({ topics });
	})
};