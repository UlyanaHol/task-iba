var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
	created_at: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);