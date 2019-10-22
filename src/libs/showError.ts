import * as CryptoJS from 'crypto-js';
import { getData } from './database';

export async function showError() {
  const list = await getData('bookname', 'chapternum');
  const hashObj = {};
  [...window.document.querySelectorAll('pre')[0].childNodes].forEach(node => {
    hashObj[CryptoJS.SHA256(node.textContent).toString()] = node;
  })
  // console.log(list);
  Object.keys(list).forEach(key=>{
    const matchError = list[key];
    addColor(hashObj[matchError.hash], matchError)
  })
}

export function addColor(matchNode: HTMLElement, matchError: ItextData) {
  // let alltext = matchNode.firstChild.nodeValue;
  let alltext = matchNode.innerText.trim();
  matchNode.innerHTML = alltext
    .split(matchError.text)
    .join(`<span class="janusErrorType${matchError.errType}">${matchError.text}</span>`)
  // matchNode.firstChild.nodeValue = alltext.split(matchError.text).join(`<span style="background:red;">${matchError.text}</span>`)
}