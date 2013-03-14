var fs = require('fs')
var assert = require('assert')

var rework = require('rework')
var inherit = require('../')

function read(file) {
  return fs.readFileSync('test/fixtures/' + file + '.css', 'utf8')
}

function test(file, msg) {
  var out = rework(read(file)).use(inherit()).toString()
  assert.equal(out, read(file + '.out'), msg + ': ' + out)
}

test('clearfix', 'Clearfix failed')
test('clearfix.zoom', 'Clearfix with zoom failed')
test('combined', 'Combined inherits failed')