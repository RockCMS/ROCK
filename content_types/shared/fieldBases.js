// Common field bases
// These are base definitions that can be overridden.

module.exports = function () {

  return {
    // Title field.
    headline: function (overrides = {}) {
      return {
        inputType: 'inputTextField',
        title: overrides.title || 'Headline',
        name: 'headline',
        id: 'headline',
        class: 'headline',
        "settings": {
          "collapsed": false
        },
        transform: {
          send: true,
          type: 'text',
        },
        validation: {
          presence: true,
          length: {
            minimum: 3,
            maximum: 20
          },
          format: {
            pattern: "[a-z0-9]+",
            flags: "i",
            message: "Headlines can only contain a-z and 0-9"
          }
        }
      }
    },
    // Deck field.
    deck: function (overrides = {}) {
      return {
        inputType: 'inputTextAreaField',
        title: overrides.title || 'Deck',
        name: 'deck',
        id: 'deck',
        class: 'headline',
        "settings": {
          "collapsed": false
        },
        transform: {
          send: true,
          type: 'text',
        },
        validation: {
          presence: true,
          length: {
            minimum: 3,
            maximum: 20
          },
          format: {
            pattern: "[a-z0-9]+",
            flags: "i",
            message: "The Deck can only contain a-z and 0-9"
          }
        }
      }
    },
  }
}
