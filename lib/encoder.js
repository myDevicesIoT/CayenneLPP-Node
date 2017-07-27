var _ = require('lodash');
const LPP_TYPE = require('./common');

var Encoder = function() {
    // Data ID + Data Type + Data Size
    const LPP_DIGITAL_INPUT_SIZE       =3       // 1 byte
    const LPP_DIGITAL_OUTPUT_SIZE      =3       // 1 byte
    const LPP_ANALOG_INPUT_SIZE        =4       // 2 bytes, 0.01 signed
    const LPP_ANALOG_OUTPUT_SIZE       =4       // 2 bytes, 0.01 signed
    const LPP_LUMINOSITY_SIZE          =4       // 2 bytes, 1 lux unsigned
    const LPP_PRESENCE_SIZE            =3       // 1 byte, 1
    const LPP_TEMPERATURE_SIZE         =4       // 2 bytes, 0.1°C signed
    const LPP_RELATIVE_HUMIDITY_SIZE   =3       // 1 byte, 0.5% unsigned
    const LPP_ACCELEROMETER_SIZE       =8       // 2 bytes per axis, 0.001G
    const LPP_BAROMETRIC_PRESSURE_SIZE =4       // 2 bytes 0.1 hPa Unsigned
    const LPP_GYROMETER_SIZE           =8       // 2 bytes per axis, 0.01 °/s
    const LPP_GPS_SIZE                 =11      // 3 byte lon/lat 0.0001 °, 3 bytes alt 0.01 meter

    var maxsize = 13;
    var buffer = new Buffer(maxsize);
    var cursor = 0;

    const validate = (channel, value) => {
        if (channel > 99) {
            throw new Error('Channels above 100 are reserved.');
        }
    };
    

    return {

        /**
        @description Creates a payload with type LPP_ANALOG_INPUT.
        type = DataTypes.TYPE.ANALOG_SENSOR
        unit = DataTypes.UNIT.ANALOG
        @param {int} channel The channel for this sensor.
        @param {float} value A floating point number accurate to two decimal place. lodash.floor(value, 2)
         */
        addAnalogInput: (channel, value) => {

            validate(channel, value);

            if ((cursor + LPP_ANALOG_INPUT_SIZE) > maxsize) {
                return 0;
            }

            var floorVal = _.floor(value, 2) * 100;

            buffer.writeUInt8(channel, cursor++);
            buffer[cursor++] = LPP_TYPE.ANALOG_INPUT;
            buffer.writeInt16BE(floorVal, cursor);
            cursor += 2;

            return cursor;
        },
        /**
        @description Creates a payload with type LPP_DIGITAL_INPUT.
        type = DataTypes.TYPE.DIGITAL_SENSOR
        unit = DataTypes.UNIT.DIGITAL
        @param {int} channel The channel for this sensor.
        @param {int} value The value, unsigned int8, should be 0 or 1.
         */
        addDigitalInput: (channel, value) => {

            validate(channel, value);

            if ((cursor + LPP_DIGITAL_INPUT_SIZE) > maxsize) {
                return 0;
            }

            buffer.writeUInt8(channel, cursor++);
            buffer[cursor++] = LPP_TYPE.DIGITAL_INPUT;
            buffer.writeUInt8(value, cursor++);

            return cursor;
        },

        /**
        @description Creates a payload with type LPP_TEMPERATURE.
        type = DataTypes.TYPE.TEMPERATURE
        unit = DataTypes.UNIT.CELSIUS
        @param {int} channel The channel for this sensor.
        @param {float} value A floating point number accurate to one decimal place. lodash.floor(value, 1)
         */
        addTemperature: (channel, value) => {

            validate(channel, value);

            if ((cursor + LPP_TEMPERATURE_SIZE) > maxsize) {
                return 0;
            }
            var floorVal = _.floor(value, 1) * 10;

            buffer.writeUInt8(channel, cursor++);
            buffer[cursor++] = LPP_TYPE.TEMPERATURE;
            buffer.writeInt16BE(floorVal, cursor);
            cursor +=2;

            return cursor;
        },

        /**
        @description Creates a payload with type LPP_LUMINOSITY.
        type = DataTypes.TYPE.LUMINOSITY
        unit = DataTypes.UNIT.LUX
        @param {int} channel The channel for this sensor.
        @param {float} value An unsigned int16 value. 0-65535.
         */
        addLuminosity: (channel, value) => {

            validate(channel, value);

            if ((cursor + LPP_LUMINOSITY_SIZE) > maxsize) {
                return 0;
            }
            buffer.writeUInt8(channel, cursor++);
            buffer[cursor++] = LPP_TYPE.LUMINOSITY;
            buffer.writeUInt16BE(value, cursor);
            cursor +=2;

            return cursor;
        },

        /**
        @description Creates a payload with type LPP_HUMIDITY. 
        type = DataTypes.TYPE.RELATIVE_HUMIDITY
        unit = DataTypes.UNIT.PERCENT
        @param {int} channel The channel for this sensor.
        @param {float} value A floating point number (%) accurate to one decimal place in 0.5 increments. Math.floor10(value, -1)
         */
        addRelativeHumidity: (channel, value) => {

            validate(channel, value);

            if ((cursor + LPP_RELATIVE_HUMIDITY_SIZE) > maxsize) {
                return 0;
            }
            //Multiply by 2 because codec resolution is set to 0.5 and precision 1
            var floorVal = _.floor(value * 2);

            buffer.writeUInt8(channel, cursor++);
            buffer[cursor++] = LPP_TYPE.HUMIDITY;
            buffer.writeUInt8(floorVal, cursor++);

            return cursor;
        },

        getPayload: () => {
            var buff = buffer.slice(0, cursor);
            return buff;
        }
    }
}

module.exports = Encoder;