import * as database from '../../libs/database';
import * as utils from '../../libs/utils';
import * as CryptoJS from 'crypto-js';
import * as ReactDOM from 'react-dom/client';
import BrushApplet from '../../components/BrushApplet';

let errorDataCache: any = [];
let getDataDestory: any = () => { };
let optionBoxRoot: any = optionBox();

export async function selection() {
  // setTimeout(() => {
  console.log('selection init');
  bindSelectEvent();
  // await errorHighlight();
  getDataDestory();
  getDataDestory = database.getData2(utils.getBook(), utils.getBookInfo().chapter, utils.getUser(), (dataSnapshot: any) => {
    // console.log('on child_added',dataSnapshot.val());
    errorDataCache.push(dataSnapshot.val());
    errorHighlight(errorDataCache);
  });
  // }, 1000);
}

export async function extensionInit() {

}

// 绑定错误选择事件
export async function bindSelectEvent() {
  const txtdomArr: HTMLElement[] = [...window.document.querySelectorAll('p')];
  console.log('start bind select event & content Dom list:', txtdomArr);
  const urlbookinfo = utils.getBookInfo();
  const urlChapterNum = parseInt(urlbookinfo.chapter.replace('c', ''), 10);
  txtdomArr.forEach(preElm => {
    if (!preElm) { return; }
    // const cnum = parseInt(getChapterFromPreElement(preElm).replace('c',''),10);
    // 当前url是章6  则给章5,章6,章7的内容进行事件绑定，其他章节取消事件绑定
    // 因为当前url最多可以同时看到上下两章内容
    // console.log(getChapterFromPreElement(preElm));
    preElm.style.userSelect = 'text';
    preElm.onmouseup = mouseUpHandle;
  });
  return true;
}

export function isHighlightBox(element: HTMLElement) {
  return !!element.className.match('janusError');
}

export function getRightTxtIndex(): IRightTxtIndex | null {
  const selectionObj: any = window.getSelection();
  // console.log(selectionObj);
  if (selectionObj.toString() === '') {
    return null;
  }
  // 排除选中两段内容的情况
  let startNodeData: string = '';
  let endNodeData: string = '';
  if (isHighlightBox(selectionObj.anchorNode.parentElement)) {
    startNodeData = selectionObj.anchorNode.parentElement.parentElement.textContent;
  } else {
    startNodeData = selectionObj.anchorNode.parentElement.textContent;
  }

  if (isHighlightBox(selectionObj.focusNode.parentElement)) {
    endNodeData = selectionObj.focusNode.parentElement.parentElement.textContent;

  } else {
    endNodeData = selectionObj.focusNode.parentElement.textContent;
  }
  if (startNodeData !== endNodeData) {
    console.warn('selected more than 1 paragraphs!!!!');
    return null;
  }

  // 查出选中文字在整段中位置
  let startNodeIndex: number = 0;
  let endNodeIndex: number = 0;
  // 选中的是个textnode 文本中有高亮错误在的话 整段文本会被切成多个textnode  正确的index需要计算出来
  if (isHighlightBox(selectionObj.anchorNode.parentElement) || selectionObj.anchorNode.parentElement.textContent !== selectionObj.anchorNode.nodeValue) {
    let txtmatch = selectionObj.anchorNode.parentElement.textContent.match(selectionObj.anchorNode.nodeValue);
    if (isHighlightBox(selectionObj.anchorNode.parentElement)) {
      txtmatch = selectionObj.anchorNode.parentElement.parentElement.textContent.match(selectionObj.anchorNode.nodeValue);
    }
    if (txtmatch && txtmatch.length === 1) {
      startNodeIndex = selectionObj.anchorOffset + txtmatch.index;
    } else {
      throw new Error('worng match');
    }
  } else {
    startNodeIndex = selectionObj.anchorOffset;
  }

  if (isHighlightBox(selectionObj.focusNode.parentElement) || selectionObj.focusNode.parentElement.textContent !== selectionObj.focusNode.nodeValue) {
    let txtmatch = selectionObj.focusNode.parentElement.textContent.match(selectionObj.focusNode.nodeValue);
    if (isHighlightBox(selectionObj.focusNode.parentElement)) {
      txtmatch = selectionObj.focusNode.parentElement.parentElement.textContent.match(selectionObj.focusNode.nodeValue);
    }
    if (txtmatch && txtmatch.length === 1) {
      endNodeIndex = selectionObj.focusOffset + txtmatch.index;
    } else {
      throw new Error('worng match');
    }
  } else {
    endNodeIndex = selectionObj.focusOffset;
  }

  // 从后往前选文字时  前后index需要换一下
  if (endNodeIndex < startNodeIndex) {
    const saveIndex = startNodeIndex;
    startNodeIndex = endNodeIndex;
    endNodeIndex = saveIndex;
  }

  let preElement: HTMLElement;
  if (isHighlightBox(selectionObj.focusNode.parentElement)) {
    preElement = selectionObj.anchorNode.parentElement.parentElement.parentElement;
  } else {
    preElement = selectionObj.anchorNode.parentElement.parentElement;
  }
  const chapter = getChapterFromPreElement(preElement);
  if (!chapter) {
    return null;
  }

  return {
    txt: selectionObj.toString(),
    textIndex: [startNodeIndex, endNodeIndex],
    selectedParagraph: startNodeData,
    chapter,
  };
}

// 通过文本中的标题获取章节号
export function getChapterFromPreElement(preElement: HTMLElement): string {
  // if (preElement.nodeName !== 'PRE') {
  //   return '';
  // }
  // 因为一页中可能同时出现两章内容，这边通过章节标题的文本来提取章号，而不是url里取
  return preElement.querySelector('h3').innerText.match(/[cC]\d+/)[0].toLowerCase();
}



export async function mouseUpHandle(event: MouseEvent) {
  // console.log('@@onmouseup');
  // 修复 场景：选中一段文字，点击选中的文字，会出现错误选择框，这里加个延时就不会有了
  await utils.waitTime(50);
  // console.log(event);
  const rightIndex = getRightTxtIndex();
  // 如果有选中文本显示错误类型选择框
  if (rightIndex) {
    const { selectedParagraph, txt, textIndex, chapter } = rightIndex;
    // 显示选择框
    // $(optionBox()).css({
    //   left: `${event.pageX}px`,
    //   top: `${event.pageY}px`
    // }).empty();
    const pos = {
      left: `${event.pageX}px`,
      top: `${event.pageY}px`
    };
    optionBoxRoot.render(BrushApplet(selectedParagraph, txt, textIndex, chapter, pos));
  }
}

// 过滤掉混淆的代码
export function filterTrueNodes(nodeArr: HTMLElement[]) {
  return nodeArr.filter(node => window.getComputedStyle(node).height !== '0px');
}

export async function errorHighlight(listCache: ItextData[]) {
  console.log(listCache)
  const hashNodeObj = {};
  const hashErrorObj = {};
  // dom节点按hash做成字典
  [...window.document.querySelectorAll('p')].forEach((preNode: HTMLElement) => {
    hashNodeObj[CryptoJS.SHA256(preNode.textContent).toString()] = preNode;
  });
  // 段落内标出文本高亮
  listCache.forEach((errorData: ItextData) => {
    if (!hashErrorObj[errorData.hash]) {
      hashErrorObj[errorData.hash] = [];
    }
    hashErrorObj[errorData.hash].push(errorData);
  });

  Object.keys(hashErrorObj).forEach((key: string) => {
    const errorDataArr: ItextData[] = hashErrorObj[key];
    if (hashNodeObj[errorDataArr[0].hash]) {
      highlightText(hashNodeObj[errorDataArr[0].hash], errorDataArr);
    }
  });
}

// 高亮段落中的错误
export function highlightText(matchNode: HTMLElement, matchErrorArr: ItextData[]) {
  // let alltext = matchNode.firstChild.nodeValue; BUG：只匹配1个关键词  改进参考https://juejin.im/post/5c2434856fb9a049f362269f
  let alltextArr: string | string[] = matchNode.innerText.trim().split('');

  matchErrorArr.sort((a, b) => a.number[0] - b.number[0]);
  for (let index = 0; index < matchErrorArr.length; index++) {
    const matchError = matchErrorArr[index];
    alltextArr[matchError.number[0]] = `@@@$${matchError.errType}$@@@${alltextArr[matchError.number[0]]}`;
    alltextArr[matchError.number[1]] = `${alltextArr[matchError.number[1]]}$$$@@$$$`;
  }

  alltextArr = alltextArr.join('');

  for (let index = 0; index < 5; index++) {
    const spanReg = new RegExp(`@@@\\$${index + 1}\\$@@@`, 'g');
    // console.log(spanReg);

    alltextArr = alltextArr.replace(spanReg, `<span class="janusError janusErrorType${index + 1}">`);
    // console.log(alltextArr);

  }
  alltextArr = alltextArr.replace(/\$\$\$@@\$\$\$/g, `</span>`);

  matchNode.innerHTML = alltextArr;


  // var highlightEl = document.createElement('span');
  // $('pre').children[45].innerHTML = `At this moment, a rather authoritative voice resounded in the arena. A tall and middle-aged man stepped on the air as he arrived, and his entire body emitted a domineering imposing manner. He was the current Sect Master of Celestial Sect, Wu Kuangyun!`
  // var node = $('pre').children[45].firstChild
  // var matchResult = node.data.match('authoritative voice reso');
  // var matchNode = node.splitText(matchResult.index);
  // matchNode.splitText(matchResult[0].length);
  // var highlightTextNode = document.createTextNode(matchNode.data);
  // highlightEl.appendChild(highlightTextNode);
  // matchNode.parentNode.replaceChild(highlightEl, matchNode);

  // matchNode.innerHTML = alltext
  //   .split(matchErrorArr[0].text)
  //   .join(`<span class="janusError janusErrorType${matchErrorArr[0].errType}">${matchErrorArr[0].text}</span>`)
  // matchNode.firstChild.nodeValue = alltext.split(matchError.text).join(`<span style="background:red;">${matchError.text}</span>`)
}

// 获取错误选择框
export function optionBox() {
  const optionBoxDiv = document.createElement('div');
  optionBoxDiv.id = 'optionBoxDiv';
  document.querySelector('body').append(optionBoxDiv);
  optionBoxRoot = ReactDOM.createRoot(document.querySelector('#optionBoxDiv'))
  return optionBoxRoot;
}

// 隐藏错误选择框
function hidebox() {
  $(optionBox()).hide();//.empty();
}