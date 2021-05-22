const {
    Schema, model
} = require('mongoose'); 

const schema = new Schema({
    name: String,
    listID: String,
    ownerID: String,
    createdAt: String,
    children: [{
        content: String,
        done: {
      type: Boolean,
      default: false
    },
        listID: {
            default: '',
            type: String
        }
    }],
    done: {
      type: Boolean,
      default: false
    },
  
}, {
  timestamps: true
});
module.exports = model('ToDoList', schema);