'use strict';

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const uuid = require('uuid');

// this is our schema to represent a blog
const authorSchema = mongoose.Schema({
  firstName: 'string',
  lastName: 'string',
  userName: {
    type: 'string',
    unique: true
  }
});
const commentSchema = mongoose.Schema({ content: 'string' })

const blogPostSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },  
  comments: [commentSchema],
  created: { type: Date, default: Date.now() }  
});

blogPostSchema.pre('find', function(next) {
  this.populate('author');
  next();
});
blogPostSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});  

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)

blogPostSchema.virtual("authorName").get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});




blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    comments: this.comments
  };
};

authorSchema.methods.serialize = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    userName: this.userName
     
  };
};

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.

const Author = mongoose.model('Author', authorSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);



module.exports = { BlogPost, Author}; 

