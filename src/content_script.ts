import './style/index.less';
import { windowLoaded } from './libs/utils';
// import * as Jquery from 'jquery';
import { getSelection } from './libs/getError';
import { showError } from './libs/showError';
import { sideComments } from './libs/sideComments'


async function init() {
  sideComments();

  // 由于url更新，整个js都会重新运行
  if (!window.janusWindowLoaded){
    window.janusWindowLoaded=true;
    await windowLoaded();
  }
  
  
  getSelection();
  showError();
}

init();
