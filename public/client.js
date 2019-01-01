
var blogItemTemplate = (
    '<li class="js-blog-item">' + 
    '</li>'
  );
  
  var postTemplate = (
    '<div class="post js-post js-blog-item">' +
      '<h2 class="js-post-title"></h2>' +

      '<li class="js-post-content">' +
      '</li>' +
      '<li>  <span class="js-post-author">' +
      '</span> - ' +
      '<span class="js-post-publishDate">' +
      '</span>' +
      '</li>' +
      '<div class="post-controls">' +
        '<button class="js-blog-item-delete" id="js-post-delete">' +
          '<span class="button-label">Delete</span>' +
        '</button>' +
        '<hr>' +
      '</div>' +
    '</div>'
  );
  
  
  const BLOG_URL = '/posts';
  
  
  function getAndDisplayPosts() {
    console.log('Retrieving blog listings')
    $.getJSON(BLOG_URL, function(posts) {
      console.log('Rendering posts');
      let sortedData = posts.reverse();
      var postsElement = sortedData.map(function(post) {
        var element = $(postTemplate);
        element.attr('id', post.id);
        element.find('.js-post-title').text(post.title);
        element.find('.js-post-content').text(post.content);
        element.find('.js-post-author').text(post.author);
        element.find('.js-post-publishDate').text(post.publishDate);
        return element;
        
      });
      $('.blogListings').html(postsElement)
    });
  }
  
  function handlePostAdd() {
    $('#js-post-form').submit(function(e) {
      e.preventDefault();
      
      addPost({
        title: $(e.currentTarget).find('#js-title').val(),
        content: $(e.currentTarget).find('#js-content').val(),
        author: $(e.currentTarget).find('#js-author').val(),
        publishDate: $(e.currentTarget).find('#js-publishDate').val()
      });
    });
  }
 
  function addPost(post) {
    console.log('Adding post: ' + post);
    $.ajax({
      method: 'POST',
      url: BLOG_URL,
      data: JSON.stringify(post),
      success: function(data) {
        getAndDisplayPosts();
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }
  
  function handleBlogItemDelete() {
    console.log('testing the handleBlogItemDelete');
    $('.js-blog-list').on('click', '.js-blog-item-delete', function(e) {
      e.preventDefault();
      deleteBlogItem(
        $(e.currentTarget).closest('.js-blog-item').attr('id'));  
    });
  }

  function deleteBlogItem(itemId) {
    console.log('Deleting blog item `' + itemId + '`');
    $.ajax({
      url: BLOG_URL + '/' + itemId,
      method: 'DELETE',
      success: getAndDisplayPosts
    });
  }

  $(function() {
    handleBlogItemDelete();
    getAndDisplayPosts();
    handlePostAdd();
  });


  