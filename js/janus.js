// Delay 2s to allow the page to be rendered.
setTimeout(function() {
  markCommentableSections();
  const currentUser = getCurrentUser();
  const existingComments = readExistingComments(getBook(), getChapters());

  // Require side-comments module.
  var SideComments = require('side-comments');

  // Create a new SideComments instance, passing in the wrapper element and the optional the current user and any existing comments.
  sideComments = new SideComments('#commentable-area', currentUser, existingComments);

  // Listen to "commentPosted", and send a request to your backend to save the comment.
  // More about this event in the "docs" section.
  sideComments.on('commentPosted', function( comment ) {
    $.ajax({
      url: '/comments',
      type: 'POST',
      data: comment,
      success: function( savedComment ) {
        // Once the comment is saved, you can insert the comment into the comment stream with "insertComment(comment)".
        sideComments.insertComment(comment);
      }
    });
  });

  // Listen to "commentDeleted" and send a request to your backend to delete the comment.
  // More about this event in the "docs" section.
  sideComments.on('commentDeleted', function( commentId ) {
    $.ajax({
      url: '/comments/' + commentId,
      type: 'DELETE',
      success: function( success ) {
          // Do something.
      }
    });
  });
}, 2000);

/*
alert(currentUser);

// First require it.
var SideComments = require('side-comments');

// Then, create a new SideComments instance, passing in the wrapper element and the optional the current user and any existing comments.
sideComments = new SideComments('#commentable-area', currentUser, existingComments);

// Listen to "commentPosted", and send a request to your backend to save the comment.
// More about this event in the "docs" section.
sideComments.on('commentPosted', function( comment ) {
  $.ajax({
    url: '/comments',
    type: 'POST',
    data: comment,
    success: function( savedComment ) {
      // Once the comment is saved, you can insert the comment into the comment stream with "insertComment(comment)".
      sideComments.insertComment(comment);
    }
  });
});

// Listen to "commentDeleted" and send a request to your backend to delete the comment.
// More about this event in the "docs" section.
sideComments.on('commentDeleted', function( commentId ) {
  $.ajax({
    url: '/comments/' + commentId,
    type: 'DELETE',
    success: function( success ) {
        // Do something.
    }
  });
}); */
