import './style/index.less';
import { windowLoaded, waitTime } from './libs/utils';
import { selection } from './libs/selections';
import { setInterval } from 'timers';
// import { sideComments } from './libs/sideComments';
// import * as Jquery from 'jquery';


async function init() {

  console.log('@@', window.janusWindowLoaded);
  if (!window.location.pathname.match(/\/books\/[a-z\-]+\/chapters\/c\d+/)){
    // 去其他页面后返回章节详情页需要重新触发运行selection
    window.janusAlreadyInit = false;
    return;
  }
  // sideComments();
  // 由于chrome插件的特性：url更新后能匹配manifest.json中配置的url，这个js就会重新运行一遍
  // 第一次运行selection，需要等待页面加载完成后
  // 之后滚动页面加载新章节会更新url，触发运行selection
  // if (!window.janusWindowLoaded || !window.janusAlreadyInit){
  if (!window.janusWindowLoaded){
    console.log('page first init');
    if (!window.janusWindowLoaded){
      await windowLoaded();
      console.log('windowLoaded');
      // window.janusWindowLoaded = true;
    }
    // if (window.janusAlreadyInit){
    //   return;
    // }
    // window.janusAlreadyInit = true;
    await waitTime(1000);
    selection();
    // 由于小说站交互特性：滚动加载下一章内容时，url更新前，就会加载数据更新dom，刷新掉之前的绑定在dom上的事件跟高亮
    // 这里加了个dom更新事件绑定. dom更新就触发运行selection
    let observer = new window.MutationObserver((records, itself) => {
      console.log('dom updated', records, itself);
      selection();
    });
    observer.observe(document.querySelector('div[class^=page-container]').parentElement, { childList: true });
  }
  // else{
  //   console.log('pageurl update');
  //   await waitTime(1000);
  //   selection();
  // }
}

init();
