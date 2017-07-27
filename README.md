# CayenneLPP-Node
Cayenne Low Power Payload Encoder and Decoder in Node.JS

## Usage

```javascript

const LPPEncoder = require('../lib/encoder');
const cyn = new LPPEncoder();
cyn.addTemperature(99, 33.0);
const pl = cyn.getPayload().toString('base64');
```


## Test

```bash
npm test
```