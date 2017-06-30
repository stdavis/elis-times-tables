const random = require('lodash.random');


const timesText = ' times ';

module.exports = {
    getTable(level) {
        return `${level}${timesText}${random(1, 12)}`;
    },
    getAnswer(table) {
        const [first, second] = table.split(timesText);
        return parseInt(first) * parseInt(second);
    }
};
