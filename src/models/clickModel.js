const mongoose = require('mongoose');

const clicsSchema = new mongoose.Schema(
  {
    clicsNb: {
      type: Number,
      default: 0,
    },
   
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    URlId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Url',
    },
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: true,
    }
   
  },

);

const Clic = mongoose.model('Clic', clicsSchema);
module.exports = Clic;
