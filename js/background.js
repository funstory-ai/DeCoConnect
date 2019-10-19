'use strict';

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // read changeInfo data and do something with it
  // like send the new url to contentscripts.js
  if (changeInfo.url) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      const tab = tabs[0];
      const url = tab.url;
      if (/^https?:\/\/(www\.)?babelnovel\.com\/books\/[a-z0-9\-]+\/chapters\//g.test(url)) {
        alert('hi');
        chrome.tabs.executeScript({
          file: 'js/janus.js'
        });
      }
    });
  }
});
