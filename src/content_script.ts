import './style/index.less';
import { windowLoaded } from './libs/utils';
// import * as Jquery from 'jquery';
import { 
  markCommentableSections,
  getCurrentUser,
  readExistingComments,
  getBook,
  getChapters,
} from './libs/functions';
import { getSelection } from './libs/getError';
import { showError } from './libs/showError';

function main() {
  markCommentableSections();
  const currentUser = getCurrentUser();
  const existingComments = readExistingComments(getBook(), getChapters());
  // console.log($,$("[class^=page-container__]"));
  // Create a new SideComments instance, passing in the wrapper element and the optional the current user and any existing comments.
  const sideComments = new window.SideComments('#commentable-area', currentUser, existingComments);
  // console.log(window.SideComments, $('#commentable-area'));
  // Listen to "commentPosted", and send a request to your backend to save the comment.
  // More about this event in the "docs" section.
  sideComments.on('commentPosted', function (comment) {
    $.ajax({
      url: '/comments',
      type: 'POST',
      data: comment,
      success: function (savedComment) {
        // Once the comment is saved, you can insert the comment into the comment stream with "insertComment(comment)".
        sideComments.insertComment(comment);
      }
    });
  });

  // Listen to "commentDeleted" and send a request to your backend to delete the comment.
  // More about this event in the "docs" section.
  sideComments.on('commentDeleted', function (commentId) {
    $.ajax({
      url: '/comments/' + commentId,
      type: 'DELETE',
      success: function (success) {
        // Do something.
      }
    });
  });

}

async function init() {
  await windowLoaded();
  setTimeout(()=>{
    main();
  }, 3000)
  
  getSelection();
  showError();
}

init();
