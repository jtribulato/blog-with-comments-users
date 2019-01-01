'use strict';

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const uuid = require('uuid');

// this is our schema to represent a blog
const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: {  
      firstName : String,
      lastName : String
  },      
  created: { type: Date, required: true, default: Date.now }
});

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)

blogSchema.virtual("authorString").get(function() {
  return `${this.author.firstname} ${this.author.lastname}`.trim();
});



blogSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorString,
    created: this.created
  };
};

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const BlogPosts = mongoose.model("BlogPosts", blogSchema);

module.exports = { BlogPosts };


