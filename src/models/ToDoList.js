const {
    Schema, model
} = require('mongoose'); // حقوق جيك يمنيوك

const schema = new Schema({
    listID: String,
    children: [{
        content: String,
        done: Boolean,
        listID: {
            default: '',
            type: String
        }
    }],
    done: Boolean
});
module.exports = model('ToDoList', schema);