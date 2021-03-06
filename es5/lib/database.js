"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _knex = require("knex");

var _knex2 = _interopRequireDefault(_knex);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _queryJs = require("./query.js");

var _queryJs2 = _interopRequireDefault(_queryJs);

var _mockQueryJs = require("./mockQuery.js");

var _mockQueryJs2 = _interopRequireDefault(_mockQueryJs);

exports.Query = _queryJs2["default"];
exports.MockQuery = _mockQueryJs2["default"];

var newQuery = Symbol();

var Database = (function () {
	function Database(databaseConfig) {
		_classCallCheck(this, Database);

		var _ = (0, _incognito2["default"])(this);

		_.config = databaseConfig;
		_.knex = (0, _knex2["default"])(databaseConfig);
		_.mockQueries = [];
	}

	_createClass(Database, [{
		key: "close",
		value: function close(callback) {
			(0, _incognito2["default"])(this).knex.destroy(callback);
		}
	}, {
		key: "select",
		value: function select() {
			var query = this[newQuery]();
			return query.select.apply(query, arguments);
		}
	}, {
		key: "insert",
		value: function insert(data) {
			var query = this[newQuery]();
			return query.insert(data);
		}
	}, {
		key: "update",
		value: function update(data) {
			var query = this[newQuery]();
			return query.update(data);
		}
	}, {
		key: "count",
		value: function count() {
			var query = this[newQuery]();
			return query.count.apply(query, arguments);
		}
	}, {
		key: "dropTable",
		value: function dropTable(tableName) {
			var query = this[newQuery]();
			return query.dropTable(tableName);
		}
	}, {
		key: "createTable",
		value: function createTable(tableName, tableConstructor) {
			var query = this[newQuery]();
			return query.createTable(tableName, tableConstructor);
		}
	}, {
		key: "createDatabase",
		value: function createDatabase(databaseName) {
			var query = this[newQuery]();
			return query.createDatabase(databaseName);
		}
	}, {
		key: "load",
		value: function load(fixtures, callback) {
			var _this = this;

			var databaseSetupSteps = [];

			var setupDeleteTable = function setupDeleteTable(tableName) {
				databaseSetupSteps.push(function (done) {
					_this.dropTable(tableName).results(function () {
						done();
					});
				});
			};

			var setupCreateTable = function setupCreateTable(tableName, fixtureData) {
				databaseSetupSteps.push(function (done) {
					_this.createTable(tableName, function (table) {
						table.increments();

						var firstFixtureData = fixtureData[0];

						for (var fixtureProperty in firstFixtureData) {
							if (fixtureProperty !== "id") {
								var fixtureValue = firstFixtureData[fixtureProperty];

								if (isNaN(fixtureValue)) {
									table.string(fixtureProperty);
								} else {
									table.integer(fixtureProperty);
								}
							}
						}
					}).results(function (error) {
						if (error) {
							throw error;
						}
						done();
					});
				});
			};

			var setupInsertData = function setupInsertData(tableName, fixtureData) {
				fixtureData.forEach(function (rowData) {
					databaseSetupSteps.push(function (done) {
						_this.insert(rowData).into(tableName).results(function (error) {
							if (error) {
								throw error;
							}
							done();
						});
					});
				});
			};

			for (var tableName in fixtures) {
				var fixtureData = fixtures[tableName];
				setupDeleteTable(tableName);
				setupCreateTable(tableName, fixtureData);
				setupInsertData(tableName, fixtureData);
			}

			_flowsync2["default"].series(databaseSetupSteps, callback);
		}
	}, {
		key: "results",

		// unmock() {
		// 	this.mockQueries = undefined;
		// }

		value: function results() {
			throw new Error("Cannot perform query without valid query stack. See docs for proper usage.");
		}
	}, {
		key: newQuery,
		value: function value() {
			return new _queryJs2["default"](this);
		}
	}, {
		key: "config",
		get: function get() {
			return (0, _incognito2["default"])(this).config;
		}
	}, {
		key: "delete",
		get: function get() {
			var query = this[newQuery]();
			return query["delete"];
		}
	}, {
		key: "mock",
		get: function get() {
			return new _mockQueryJs2["default"](this);
		}
	}]);

	return Database;
})();

exports["default"] = Database;