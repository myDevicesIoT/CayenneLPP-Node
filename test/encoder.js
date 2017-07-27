const LPPEncoder = require('../lib/encoder');
const assert = require('assert');

describe('encoder', () => {
    it('should return a valid temperature payload', () => {
        const cyn = new LPPEncoder();
        cyn.addAnalogInput(13, -13.131313);
        cyn.addTemperature(99, 33.2);
        cyn.addDigitalInput(10, 1);
        const pl = cyn.getPayload().toString('base64');
        assert.equal('DQL63mNnAUwKAAE=', pl);
    });
});