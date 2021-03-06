declare module 'side-comments/release/side-comments.js';
declare interface Window extends Window {
  SideComments: any;
  optionBox: any;
  ethereum: any;
  $: any;
  janusWindowLoaded:any;
  janusAlreadyInit:any;
  janusRetryTime: number;
}
// declare interface CustomWindow extends Window {
//   customAttribute: any;
// }

declare interface ItextData {
  title: string;
  chapter: string;
  number: number[];
  content: string;
  text: string;
  user: string;
  errType: string;
  hash?: string;
}
declare interface IBookInfo {
  title: string;
  chapter: string;
}
declare interface IRightTxtIndex {
  selectedParagraph: string;
  txt: string;
  textIndex: number[];
  chapter: string;
}