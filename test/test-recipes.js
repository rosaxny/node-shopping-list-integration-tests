const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const should = chai.should();
chai.use(chaiHttp);

describe('Recipes', function() {
	// start server
	before(function() {
		return runServer();
	});

	// close server
	after(function() {
		return closeServer();
	});

	// GET
	it('should list items on GET', function() {
		return chai.request(app)
			.get('/recipes')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.length.should.be.at.least(1);
				const keys = ['id', 'name', 'ingredients'];
				res.body.forEach(function(item) {
					item.should.be.a('object');
					item.should.include.keys(keys);
				});
			});
	});

	// POST
	it('should add an item on POST', function() {
		const item = {name:'cereal', ingredients: ['cereal', 'milk']};
		return chai.request(app)
			.post('/recipes')
			.send(item)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('id','name','ingredients');
				res.body.id.should.not.be.null;
				res.body.should.deep.equal(Object.assign(item, {id: res.body.id}));
			});
	});

	it('should update items on PUT', function() {
		const updateItem = {name: 'beans', ingredients: ['a can of beans', 'can opener']};
		return chai.request(app)
			.get('/recipes')
			.then(function(res) {
				updateItem.id = res.body[0].id;
				return chai.request(app)
					.put(`/recipes/${updateItem.id}`)
					.send(updateItem);
			})
			.then(function(res) {
				res.should.have.status(204);
			});
	});

	it('should delete items on DELETE', function() {
		return chai.request(app)
			.get('/recipes')
			.then(function(res) {
				return chai.request(app)
					.delete(`/recipes/${res.body[0].id}`);
			})
			.then(function(res) {
				res.should.have.status(204);
			});
	});

});