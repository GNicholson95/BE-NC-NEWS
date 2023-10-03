const { fetchTopics, fetchAllEndpoints } = require('../models/model')
const endpoints = require('../endpoints.json')

exports.getTopics = (req, res) => {
	fetchTopics().then((topics) => {
		res.status(200).send({ topics });
	})
};

exports.getEndpoints = (req, res) => {
    console.log('in controller');
        res.status(200).send(endpoints);
};

