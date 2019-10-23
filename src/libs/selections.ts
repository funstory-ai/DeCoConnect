import * as database from './database';
import { getBookInfo, getUser } from './utils';
import * as CryptoJS from 'crypto-js';



export async function selection() {
  selectionGetError();
  showError();
}


export function optionBox() {
  let box = document.querySelector('#optionBoxDiv');
  // console.log(box);
  if (box){
      return box;
  }
  const optionBoxDiv = document.createElement('div');
  optionBoxDiv.id = 'optionBoxDiv'
  document.querySelector('body').append(optionBoxDiv)
  // $('body').append('<div id="janusOptionBox">Test</p>')
  $('#optionBoxDiv').append(`
    <div class="errorOption" check-data="1">G - wrong Gender of pronoun</div>
    <div class="errorOption" check-data="2">IT - Inconsist ent Term</div>
    <div class="errorOption" check-data="3">AAA - Abuse of Adjective / Adverb</div>
    <div class="errorOption" check-data="4">IS - Incomplet e Sent ence</div>
    <div class="errorOption" check-data="5">B - Bad t ranslat ion</div>
  `);
  return document.querySelector('#optionBoxDiv');
}

function hidebox() {
  $(optionBox()).hide()//.empty();
  
}

export async function selectionGetError() {
  // console.log('window.optionBox',window.optionBox);
  // console.log('window loaded');
  const txtdom = window.document.querySelectorAll('pre')[0];
  console.log('content Dom', txtdom);
  if (txtdom) {
    // console.log(txtdom.children);
    // if (txtdom.children){
    //   [...txtdom.children].map(async (cdom) => {
    //     const hashdata = await digestMessage(cdom.innerText)
    //     console.log(hashdata.toString());
    //   })
    // }
    // 清除 文本禁选
    txtdom.style.userSelect = 'text';

    const rootContainer:HTMLElement = document.querySelector('#root')
    if (rootContainer){
      rootContainer.onmousedown = ()=>{
        hidebox();
      }
    }
    txtdom.onmouseup = async (event: any) => {
      // console.log(event);
      const selectionObj: any = window.getSelection();
      if (selectionObj.baseNode.data !== selectionObj.focusNode.data){
        return;
      }
      const selectedParagraph: string = selectionObj.focusNode && selectionObj.focusNode.data;
      const txt = selectedParagraph.slice(selectionObj.anchorOffset, selectionObj.focusOffset);
      // 如果有选中文本显示错误类型选择框
      if (txt) {

          // 显示选择框
          $(optionBox()).css({
            left: `${event.pageX}px`,
            top: `${event.pageY}px`
          }).show();

          // 绑定选择点击事件
          $('.errorOption').click((event)=>{
            hidebox();
            const bookinfo = getBookInfo();
            console.log(event.target.attributes['check-data'].value);
            database.save({
              title: bookinfo.title,
              user: getUser(),
              chapter: bookinfo.chapter,
              number: [selectionObj.anchorOffset, selectionObj.focusOffset],
              content: selectedParagraph,
              text: txt,
              errType: event.target.attributes['check-data'].value,
            });
          })
        // const list = await get('bookname','chapternum','zlk');
        // console.log(list);
      }
    }
  }
  return true;
}



export async function showError() {
  const { title, chapter } = getBookInfo();
  const list = await database.getData(title, chapter, getUser());
  if (!list) return;
  const hashObj = {};
  [...window.document.querySelectorAll('pre')[0].childNodes].forEach(node => {
    hashObj[CryptoJS.SHA256(node.textContent).toString()] = node;
  })
  console.log(list);
  console.log(hashObj);

  Object.keys(list).forEach(key => {
    const matchError = list[key];
    if (hashObj[matchError.hash]) {
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


