const express = require("express");
const server = express();
const names = ['Gregory', 'Chris', 'Paris', 'Martin'];

server.use(express.json());

requests = 0;

function trackRequests (req, res, next) {
	console.time('req');
	requests++;
	next();
	console.timeEnd('req');

	console.log(requests);
}

function checkIndexExists (req, res, next) {
	if (!req.params.index) {
		return res.status(400).json({"message": "Você precisa passar o parâmetro 'index'"});
	}
	
	return next();
}

function checkPeopleExists (req, res, next) {
	const { index } = req.params;
	if (!names[index]) {
		return res.status(400).json({"message": "Pessoa não encontrada"});
	}
	
	return next();
}

server.use(trackRequests);

server.get('/peoples', (req, res) => {
	return res.status(200).json(names);
});

server.get('/peoples/:index', checkIndexExists, checkPeopleExists, (req, res) => {
	const { index } = req.params;

	return res.status(200).json(names[index]);
});

server.post('/peoples', (req, res) => {
	const { name } = req.body;
	names.push(name);

	return  res.status(200).json(names);
});

server.put('/peoples/:index', checkIndexExists, checkPeopleExists, (req, res) => {
	const { index } = req.params;
	const { name } = req.body;

	names[index] = name;

	return res.status(200).json(names);
});

server.delete('/peoples/:index', checkIndexExists, checkPeopleExists, (req, res) => {
	const { index } = req.params;

	names.splice(index, 1)

	return res.status(200).json(names);
});

server.listen(3000);