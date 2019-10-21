import * as CryptoJS from 'crypto-js';
import * as firebase from 'firebase';
import * as config from '../config.json';

export interface IerrorData {
  title: string;
  chapter: string;
  number: number[];
  content: string;
  text: string;
  user: string;
}

export const firebaseApp = firebase.initializeApp(config.firebaseConfig);

// firebaseApp.database().ref().once("value")
//   .then(function (snapshot) {
//     var key = snapshot.key; // null
//     console.log('@@', key);

//     console.log(snapshot.val());
//     var childKey = snapshot.child("aa").key; // "ada"
//     console.log(childKey);

//   });

export function save(errorData:IerrorData){

  firebaseApp.database()
    .ref(`${errorData.title.replace(/\s/, '')}_${errorData.chapter}_${errorData.user}`)
    .push({
      ...errorData,
      hash: CryptoJS.SHA256(errorData.content).toString(),
    });

}


// export async function digestMessage(message: string) {
//   const msgUint8 = new window.TextEncoder().encode(message); // encode as (utf-8) Uint8Array
//   const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
//   const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
//   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
//   return hashHex;
// }
