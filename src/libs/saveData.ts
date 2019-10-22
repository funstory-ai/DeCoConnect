import * as CryptoJS from 'crypto-js';
import * as firebase from 'firebase';
import * as config from '../config.json';

export interface ItextData {
  title: string;
  chapter: string;
  number: number[];
  content: string;
  text: string;
  user: string;
}

export const firebaseApp = firebase.initializeApp(config.firebaseConfig);


export async function get(bookname: string, chapternum:string, user?:string) {
  const ref = firebaseApp.database().ref(`${bookname}/${chapternum}`)
  let list: any[] = [];
  if (user){
    const res = await ref.orderByChild("user").equalTo(user).once("value");
    list = res.val();
  }else{
    const res = await ref.once("value");
    list = res.val();
  }
  return list;
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
