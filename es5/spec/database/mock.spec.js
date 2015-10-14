"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../database.json").testing;

describe(".mock", function () {

  var database = undefined;

  beforeEach(function () {
    database = new _libDatabaseJs2["default"](databaseConfig);
  });

  it("should return an instance of itself for chaining", function () {
    database.mock.should.eql(database);
  });
});