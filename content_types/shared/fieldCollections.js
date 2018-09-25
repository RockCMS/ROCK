// Common field collections.
const FieldBases = require('./fieldBases');

const base = new FieldBases();

module.exports = function () {

  return {
    testFieldCollection: () => {
      return {
        inputType: 'fieldCollection',
        name: 'headlines field collection',
        transform: {
          send: true,
          type: 'object',
        },
        fields: {
          headline: base.headline({ title: 'FC TEST HEADLINE' }),
          deck: base.deck({ title: 'FC TEST DECK' }),
        }
      }
    }
  }
}
