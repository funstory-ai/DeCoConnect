import './style/index.less';
import { adaptorsMap } from './adaptors/tables';
const createMetaMaskProvider = require('metamask-extension-provider');

const provider = createMetaMaskProvider();
window.ethereum = provider;
// import React from 'react';
adaptorsMap['babelnovel']();
window.addEventListener("unhandledrejection", event => {
    console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
  });