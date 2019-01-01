const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {BlogPosts} = require('./models');

// we're going to add some posts to blog
// so there's some data to look at
//title, content, author, publishDate

BlogPosts.create(
  'Freedom to Build, Freedom to Write', 
  'This new editing experience provides a more consistent treatment of design as well as content. If you are building client sites, you can create reusable blocks. This lets your clients add new content anytime, while still maintaining a consistent look and feel.', 
  'John T', 
  'Dec 11, 2018');
BlogPosts.create(
  'A Stunning New Default Theme', 
  'The Classic Editor plugin restores the previous WordPress editor and the Edit Post screen. It lets you keep using plugins that extend it, add old-style meta boxes, or otherwise depend on the previous editor. To install, visit your plugins page and click the “Install Now” button next to “Classic Editor”. After the plugin finishes installing, click “Activate”. That’s it!', 
  'Sebastion M', 
  'Dec 12, 2018');

// send back JSON representation of all posts
// on GET requests to root
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});



router.post('/', jsonParser, (req, res) => {
  // ensure fields are in request body
  const requiredFields = ['title', 'content','author','publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content,req.body.author,req.body.publishDate);
  res.status(201).json(item);
});
//title, content, author, publishDate
// Delete recipes (by id)!
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted post item \`${req.params.ID}\``);
  res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {

  const requiredFields = ['title', 'content','author','publishDate', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post item \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  //res.status(200).end();
  res.json(updatedItem);
})

module.exports = router;