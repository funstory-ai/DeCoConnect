
export async function windowLoaded() {
  return new Promise((resolve) => {
    window.onload = ()=>{

      // console.log($('#janusOptionBox'),'@@@');
      
      resolve();
    }
    
  })
}