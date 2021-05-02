var mongoose = require("mongoose");

var newsSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   created_at: { type: Date, default: Date.now },
   category: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   counter:{
        type: Number,
    },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("News", newsSchema);