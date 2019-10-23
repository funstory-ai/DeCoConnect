import * as database from './database';
// import { utils.getBookInfo, utils.getUser } from './utils';
import * as utils from './utils';
import * as CryptoJS from 'crypto-js';

let errorDataHash:any = {};
let getDataDestory:any;

export async function selection() {
  bindSelectEvent();
  // await errorHighlight();
  getDataDestory = database.getData2(utils.getBook(), utils.getBookInfo().chapter, utils.getUser(), (dataSnapshot:any)=>{
    console.log('on child_added',dataSnapshot.val());
    errorDataHash[`${new Date().getTime().toString(36)}`] = dataSnapshot.val()
    errorHighlight(errorDataHash);
  });
  // 每次更新页面后需要重新绑定DOM事件跟 错误高亮
  let observer = new MutationObserver(() => { 
    // console.log('@@');
    setTimeout(()=>{
      bindSelectEvent();
      // errorHighlight();
      getDataDestory()
      getDataDestory = database.getData2(utils.getBook(), utils.getBookInfo().chapter, utils.getUser(), (dataSnapshot: any) => {
        console.log('on child_added', dataSnapshot.val());
        errorDataHash[`${new Date().getTime().toString(36)}`] = dataSnapshot.val()
        errorHighlight(errorDataHash);
      });
    }, 1000)
  });
  observer.observe(document.querySelector('div[class^=page-container]').parentElement, { childList: true });
}


// 绑定错误选择事件
export async function bindSelectEvent() {
  // console.log('window.optionBox',window.optionBox);
  // console.log('window loaded');
  const txtdomArr: HTMLElement[] = [...window.document.querySelectorAll('pre')];
  console.log('content Dom', txtdomArr);
  txtdomArr.forEach((txtdom)=>{
    console.log(txtdom);
    if (txtdom) {
      // 清除 文本禁选
      txtdom.style.userSelect = 'text';
      txtdom.onmouseup = async (event: any) => {
        // console.log('@@onmouseup');
        // console.log(event);
        const selectionObj: any = window.getSelection();
        if (selectionObj.baseNode.data !== selectionObj.focusNode.data) {
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
          }).empty().append(`
            <div class="errorOption" check-data="1">G - wrong Gender of pronoun</div>
            <div class="errorOption" check-data="2">IT - Inconsist ent Term</div>
            <div class="errorOption" check-data="3">AAA - Abuse of Adjective / Adverb</div>
            <div class="errorOption" check-data="4">IS - Incomplet e Sent ence</div>
            <div class="errorOption" check-data="5">B - Bad t ranslat ion</div>
          `).show();
          // 绑定选择点击事件
          $('.errorOption').click((event) => {
            hidebox();
            const bookinfo = utils.getBookInfo();
            // 因为一页中可能同时出现两章内容，这边通过章节标题的文本来提取章号，而不是url里取
            // console.log(selectionObj.focusNode.parentNode);
            // console.log(selectionObj);
            // const chapter = selectionObj.focusNode.parentNode.parentNode.parentNode.querySelector('h1').innerText.match(/[cC]\d+/)[0].toLowerCase();
            // console.log(event.target.attributes['check-data'].value);
            // console.log('@@click');
            database.save({
              title: bookinfo.title,
              user: utils.getUser(),
              chapter: bookinfo.chapter,
              number: [selectionObj.anchorOffset, selectionObj.focusOffset],
              content: selectedParagraph,
              text: txt,
              errType: event.target.attributes['check-data'].value,
            });
          })
        }
      }
    }
  })
  return true;
}

// 筛选出有错误的段落，并高亮
export async function errorHighlight(listCache?) {
  const { title, chapter } = utils.getBookInfo();
  let list = listCache;
  if (!list){
    // BUG 这边需要考虑到同时显示两章的情况
    list = await database.getData(title, chapter, utils.getUser());
  }
  if (!list) return;
  const hashObj = {};
  // dom节点按hash做成字典
  [...window.document.querySelectorAll('pre')].forEach((preNode:HTMLElement)=>{
    [...preNode.childNodes].forEach(node => {
      hashObj[CryptoJS.SHA256(node.textContent).toString()] = node;
    })
  })
  // console.log(list);
  // console.log(hashObj);
  Object.keys(list).forEach(key => {
    const matchError = list[key];
    if (hashObj[matchError.hash]) {
      highlightText(hashObj[matchError.hash], matchError)
    }
  })
  errorDataHash = list;
  return list;
}

// 高亮段落中的错误
export function highlightText(matchNode: HTMLElement, matchError: ItextData) {
  // let alltext = matchNode.firstChild.nodeValue;
  let alltext = matchNode.innerText.trim();
  matchNode.innerHTML = alltext
    .split(matchError.text)
    .join(`<span class="janusError janusErrorType${matchError.errType}">${matchError.text}</span>`)
  // matchNode.firstChild.nodeValue = alltext.split(matchError.text).join(`<span style="background:red;">${matchError.text}</span>`)
}

// 获取错误选择框
export function optionBox() {
  let box = document.querySelector('#optionBoxDiv');
  const rootContainer: HTMLElement = document.querySelector('#root')
  if (rootContainer) {
    rootContainer.onmousedown = () => {
      hidebox();
    }
  }
  // console.log(box);
  if (box) {
    return box;
  }
  const optionBoxDiv = document.createElement('div');
  optionBoxDiv.id = 'optionBoxDiv'
  document.querySelector('body').append(optionBoxDiv)
  // $('body').append('<div id="janusOptionBox">Test</p>')
  // $('#optionBoxDiv').append(`
  //   <div class="errorOption" check-data="1">G - wrong Gender of pronoun</div>
  //   <div class="errorOption" check-data="2">IT - Inconsist ent Term</div>
  //   <div class="errorOption" check-data="3">AAA - Abuse of Adjective / Adverb</div>
  //   <div class="errorOption" check-data="4">IS - Incomplet e Sent ence</div>
  //   <div class="errorOption" check-data="5">B - Bad t ranslat ion</div>
  // `);
  return document.querySelector('#optionBoxDiv');
}

// 隐藏错误选择框
function hidebox() {
  $(optionBox()).hide()//.empty();
}