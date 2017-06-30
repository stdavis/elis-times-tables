const Alexa = require('alexa-sdk');
const timesTables = require('timestables');


const states = {
    START: 'START',
    ANSWER: 'ANSWER'
};

const generalHandlers = {
    'NewSession': function () {
        this.handler.state = states.START;

        this.emit(':ask', 'What level do you want?', 'What level was that?');
    }
};

const newSessionHandlers = Alexa.CreateStateHandler(states.START, {
    'StartLevel': function () {
        const level = parseInt(this.event.request.intent.slots.level.value);
        this.attributes['currentLevel'] = level;
        this.attributes['numCorrect'] = 0;
        this.attributes['numWrong'] = 0;

        this.handler.state = states.ANSWER;

        const table = timesTables.getTable(level);
        this.attributes['currentTable'] = table;

        this.emit(':ask', `3, 2, 1 go. ${table}`);
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', 'I\'d love to help you learn your times tables. Try saying, level 2.', 'Try saying level 2.');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'Unhandled': function() {
        this.emit(':ask', 'Sorry, I didn\'t get that. Try saying level 2.', 'Try saying level 2.');
    }
});

const answerHandlers = Alexa.CreateStateHandler(states.ANSWER, {
    'AnswerNumber': function () {
        const userAnswer = parseInt(this.event.request.intent.slots.answer.value);

        const correctAnswer = timesTables.getAnswer(this.attributes.currentTable);

        let msg;
        if (userAnswer === correctAnswer) {
            msg = 'That is correct!';
            this.attributes.numCorrect++;
        } else {
            msg = `The correct answer is ${correctAnswer}.`;
            this.attributes.numWrong++;
        }

        if (this.attributes.numCorrect + this.attributes.numWrong < 10) {
            const nextTable = timesTables.getTable(this.attributes.currentLevel);
            this.attributes.currentTable = nextTable;

            this.emit(':ask', `${msg} ${nextTable}`);
        } else {
            this.emit(':tell', `${msg} You got ${this.attributes.numCorrect} out of 10.`);
        }
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', `Try solving the times table of ${this.attributes.currentTable}`, 'Try guessing a number.');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'Unhandled': function() {
        this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
    }
});

exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(generalHandlers, newSessionHandlers, answerHandlers);
    alexa.execute();
};
