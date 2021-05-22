const {
    Schema, model
} = require('mongoose'); 

const schema = new Schema({
    name: String,
    dm: Boolean,
    reminderID: String,
    ownerID: String,
  channelID: {
    default: null,
    type: 'string'
  },
    finishsAt: String
}, {
  timestamps: true
});
module.exports = model('Reminder', schema);