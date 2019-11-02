
// function polling() {
//   console.log('polling');
//   setTimeout(polling, 1000 * 30);
// }
// console.log('34');

// polling();

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it
  // like send the new url to contentscripts.js
  if (changeInfo.url) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      const tab = tabs[0];
      const url = tab.url;
      // if (/^https?:\/\/(www\.)?babelnovel\.com\/books\/[a-z0-9\-]+\/chapters\//g.test(url)) {
      if (/^https?:\/\/(www\.)?babelnovel\.com\//g.test(url)) {
        chrome.tabs.executeScript({
          file: 'js/content_script.js'
        });
      }
    });
  }
});