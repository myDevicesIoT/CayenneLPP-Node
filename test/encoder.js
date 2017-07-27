const LPPEncoder = require('../lib/encoder');
const assert = require('assert');

describe('encoder', () => {
    it('should return a valid temperature payload', () => {
        const cyn = new LPPEncoder();
        cyn.addTemperature(99, 33.0);
        const pl = cyn.getPayload().toString('base64');
        assert.equal('Y2cBSg==', pl);
    });
});