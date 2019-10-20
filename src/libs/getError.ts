import * as CryptoJS from 'crypto-js';

export async function getSelection() {
  console.log('window loaded');
  const txtdom = document.querySelectorAll('pre')[0];
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
    txtdom.onmouseup = async (event) => {
      console.log(event);

      const selectionObj: any = window.getSelection();
      const selectedParagraph: string = selectionObj.focusNode && selectionObj.focusNode.data;
      const txt = selectedParagraph.slice(selectionObj.anchorOffset, selectionObj.focusOffset);
      if (txt) {
        // const hashdata = await digestMessage(selectedParagraph);
        // 这里引了个库测试下hash库与浏览器原生的哈希结果是否一样
        console.log(selectedParagraph, CryptoJS.SHA256(selectedParagraph).toString());
        // console.log(hashdata);
        console.log(txt);

      }
    }
  }
}

export async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}
