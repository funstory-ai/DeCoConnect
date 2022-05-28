import './style/index.less';
import { windowLoaded, waitTime } from './libs/utils';
import { selection } from './libs/selections';
import { setInterval } from 'timers';
// import { sideComments } from './libs/sideComments';
// import * as Jquery from 'jquery';


// background.ts: url更新chrome就会运行content_script.ts
async function init() {
  // sideComments();
  console.log('executeScript', `\njanusWindowLoaded:${window.janusWindowLoaded}`, `\njanusAlreadyInit: ${window.janusAlreadyInit}`);

  // 第一次进入小说站，需要等待页面加载完成后再运行
  if (!window.janusWindowLoaded) {
    console.log('page first init');
    await windowLoaded();
    console.log('windowLoaded');
    window.janusWindowLoaded = true;
  }

  // 非详情页不触发事件绑定，并且初始化
  if (!/\/books\/[a-z0-9\-]+\/chapters\/c\d+/.test(window.location.pathname)){
    window.janusAlreadyInit = false;
    window.janusRetryTime = 1;
    return;
  }

  // 详情页加载更多章节
  if (window.janusAlreadyInit){
    selection();
    return;
  }
  
  // 初次进入详情页
  // 如果DOM没有渲染完成 500毫秒后重新初始化 重试次数越多间隔时间越长
  if (!document.querySelector('div[class^=pc_page]').querySelector('section').querySelector('h3')) {
    console.log('retry');
    window.janusAlreadyInit = false;
    window.janusRetryTime = window.janusRetryTime ? window.janusRetryTime + 1 : 1;
    await waitTime(window.janusRetryTime * 500);
    init();
    return;
  }
  window.janusAlreadyInit = true;
  selection();
  // dom更新就触发运行selection
  let observer = new window.MutationObserver((records, itself) => {
    console.log('dom updated', records, itself);
    selection();
  });
  observer.observe(document.querySelector('div[class^=pc_page]').parentElement, { childList: true });

}

init();
