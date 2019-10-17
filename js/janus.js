// Demo data
var currentUser = {
  id: 1,
  avatarUrl: "http://f.cl.ly/items/0s1a0q1y2Z2k2I193k1y/default-user.png",
  name: "You"
};

var existingComments = [
  {
    "sectionId": "1",
    "comments": [
      {
        "authorAvatarUrl": "http://f.cl.ly/items/1W303Y360b260u3v1P0T/jon_snow_small.png",
        "authorName": "Jon Sno",
        "comment": "I'm Ned Stark's bastard. Related: I know nothing."
      },
      {
        "authorAvatarUrl": "http://f.cl.ly/items/2o1a3d2f051L0V0q1p19/donald_draper.png",
        "authorName": "Donald Draper",
        "comment": "I need a scotch."
      }
    ]
  },
  {
    "sectionId": "3",
    "comments": [
      {
        "authorAvatarUrl": "http://f.cl.ly/items/0l1j230k080S0N1P0M3e/clay-davis.png",
        "authorName": "Senator Clay Davis",
        "comment": "These Side Comments are incredible. Sssshhhiiiiieeeee."
      }
    ]
  }
];

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
});
