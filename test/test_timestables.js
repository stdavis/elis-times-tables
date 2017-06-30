var expect = require('chai').expect;
var timestables = require('../timestables');


describe('timestables', function () {
    describe('getTable', function () {
        it('returns a problem', function () {
            expect(timestables.getTable(2).split(' times ')[0]).to.equal('2');
        });
    });
    describe('getAnswer', function () {
        it('returns the answer', function () {
            expect(timestables.getAnswer('2 times 3')).to.equal(6);
            expect(timestables.getAnswer('5 times 12')).to.equal(60);
        });
    });
});
