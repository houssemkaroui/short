const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema;

const URLSchema = new mongoose.Schema({
    urlCode:  {type: String}, 
    longUrl:  {type: String},
    shortUrl:  {type: String},
    userId:{
        type: ObjectId,
        ref: "users",
        required: true,
    }
})


const Url = mongoose.model('Url', URLSchema);

module.exports = Url;
