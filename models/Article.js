const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
const ArticleSchema = new Schema({
  
  // `title is required and of type String
  title: {
    type: String,
    required: true
  },

  // `link is required and of type String
  link: {
    type: String,
    required: true
  },

  // `subhead is required and of type String
  subhead: {
    type: String,
    required: true
  },
  
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the note model
  // This allows us to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
