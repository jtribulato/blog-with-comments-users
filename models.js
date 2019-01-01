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
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the address object
// we're storing in Mongo.
blogSchema.virtual("authorString").get(function() {
  return `${this.author.firstname} ${this.author.lastname}`.trim();
});

// // this virtual grabs the most recent grade for a restaurant.
// blogSchema.virtual("grade").get(function() {
//   const gradeObj =    
//     this.grades.sort((a, b) => {
//       return a.date - b.date;
//     })[0] || {};
//   return gradeObj.grade;
// });

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


