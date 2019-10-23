import * as CryptoJS from 'crypto-js';
import { getData } from './database';
import { getBookInfo, getUser} from './utils';

export async function showError() {
  const { title, chapter } = getBookInfo();
  const list = await getData(title, chapter, getUser());
  if (!list) return;
  const hashObj = {};
  [...window.document.querySelectorAll('pre')[0].childNodes].forEach(node => {
    hashObj[CryptoJS.SHA256(node.textContent).toString()] = node;
  })
  console.log(list);
  console.log(hashObj);

  Object.keys(list).forEach(key=>{
    const matchError = list[key];
    if (hashObj[matchError.hash]){
      addColor(hashObj[matchError.hash], matchError)
    }
  })
}

export function addColor(matchNode: HTMLElement, matchError: ItextData) {
  // let alltext = matchNode.firstChild.nodeValue;
  let alltext = matchNode.innerText.trim();
  matchNode.innerHTML = alltext
    .split(matchError.text)
    .join(`<span class="5janusError janusErrorType${matchError.errType}">${matchError.text}</span>`)
  // matchNode.firstChild.nodeValue = alltext.split(matchError.text).join(`<span style="background:red;">${matchError.text}</span>`)
}

