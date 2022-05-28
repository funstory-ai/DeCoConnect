import './style/index.less';
import { adaptorsMap } from './adaptors/tables';

adaptorsMap['babelnovel']();
window.addEventListener("unhandledrejection", event => {
    console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
  });