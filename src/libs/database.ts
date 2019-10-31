import * as CryptoJS from 'crypto-js';
import * as firebase from 'firebase';
import * as config from '../config.json';
import { resolve } from 'url';
import { rejects } from 'assert';

export const firebaseApp = firebase.initializeApp(config.firebaseConfig);

export async function getData(bookname: string, chapternum:string, user?:string) {
  const ref = firebaseApp.database().ref(`${bookname}/${chapternum}`);
  let list: any[] = [];
  if (user){
    const res = await ref.orderByChild("user").equalTo(user).once("value");
    list = res.val();
  }else{
    const res = await ref.once("value");
    list = res.val();
  }
  // console.log('@@@', list);
  return list;
}

export function getData2(bookname: string, chapternum: string, user: string, callBack: any) {
  const ref = firebaseApp.database().ref(`${bookname}/${chapternum}`);
  ref.orderByChild("user").equalTo(user).on("child_added", callBack);
  return ()=>{
    ref.orderByChild("user").equalTo(user).off("child_added", callBack);
  };
}

export function save(textData:ItextData){

  firebaseApp.database()
    .ref(`${textData.title.replace(/\s/, '')}/${textData.chapter}`)
    .push({
      ...textData,
      hash: CryptoJS.SHA256(textData.content).toString(),
    });

}

// export async function digestMessage(message: string) {
//   const msgUint8 = new window.TextEncoder().encode(message); // encode as (utf-8) Uint8Array
//   const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
//   const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
//   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
//   return hashHex;
// }
