import './style/index.less';
import { windowLoaded } from './libs/utils';
import { selection } from './libs/selections';
// import { sideComments } from './libs/sideComments';
// import * as Jquery from 'jquery';


async function init() {
  // sideComments();
  // 由于url更新，整个js都会重新运行
  if (!window.janusWindowLoaded){
    window.janusWindowLoaded=true;
    await windowLoaded();
    selection();
  }
}

init();
