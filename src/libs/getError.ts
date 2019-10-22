import { save, get } from './saveData';

export async function getSelection() {
  console.log('window loaded');
  const txtdom = window.document.querySelectorAll('pre')[0];
  console.log('content Dom', txtdom);

  if (txtdom) {
    console.log(txtdom.children);
    // if (txtdom.children){
    //   [...txtdom.children].map(async (cdom) => {
    //     const hashdata = await digestMessage(cdom.innerText)
    //     console.log(hashdata.toString());
    //   })
    // }
    // 清除 文本禁选
    txtdom.style.userSelect = 'text';
    txtdom.onmouseup = async (event: any) => {
      console.log(event);

      const selectionObj: any = window.getSelection();
      const selectedParagraph: string = selectionObj.focusNode && selectionObj.focusNode.data;
      const txt = selectedParagraph.slice(selectionObj.anchorOffset, selectionObj.focusOffset);
      if (txt) {
          save({
            title: 'bookname',
            user: 'lala',
            chapter: 'chapternum',
            number: [selectionObj.anchorOffset, selectionObj.focusOffset],
            content: selectedParagraph,
            text: txt,
          })
        const list = await get('bookname','chapternum','zlk');
        console.log(list);
        
      }
    }
  }
  return true;
}
