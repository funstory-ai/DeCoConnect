
export async function windowLoaded():Promise<void> {
  return new Promise((resolve) => {
    window.onload = ()=>{
      // console.log($('#janusOptionBox'),'@@@');
      resolve();
    };
    
  });
}

export async function waitTime(ms: number = 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function getBookInfo(): IBookInfo {
  // const titledom:HTMLElement = document.querySelector('div[class^=top-bar]').querySelector('div[class^=title-wrapper]')
  // if (titledom){
  //   const bookinfo = titledom.innerText.replace(/[\r\n]+/g, '').split('/');
  //   const cnumMatch = bookinfo[1].match(/\d+/);
  //   return {
  //     bookname: bookinfo[0],
  //     chapter: bookinfo[1],
  //     cnum: cnumMatch && cnumMatch[0],
  //   }
  // }
  // return null;
  return {
    title: location.pathname.split('/')[2],
    chapter: location.pathname.split('/')[4],
  };
}


export function getUser() {
  return document.querySelector('div[class^=top-bar]').querySelector('img').src.split('/')[5];
}



export function getCurrentUser() {
  // Demo data for now
  return {
    id: 1,
    avatarUrl: "http://f.cl.ly/items/0s1a0q1y2Z2k2I193k1y/default-user.png",
    name: "You"
  };
}

export function getBook(): string {
  return window.location.pathname.split(/books\/([a-z0-9\-]+)\/chapters/g)[1];
}

export function getChapters() {
  return $("[class^=content-container__] > h1").text().split(/(C\d+)/g).filter(ch => ch);
}

export function readExistingComments(book, chapters) {
  // Demo data for now
  return chapters.reduce(function (acc, cur) {
    return acc.concat([
      {
        "sectionId": `${cur}-1`,
        "comments": [
          {
            "authorAvatarUrl": "http://f.cl.ly/items/1W303Y360b260u3v1P0T/jon_snow_small.png",
            "authorName": "Jon Sno",
            "comment": "I'm Ned Stark's bastard. Related: I know nothing."
          },
          {
            "authorAvatarUrl": "http://f.cl.ly/items/2o1a3d2f051L0V0q1p19/donald_draper.png",
            "authorName": "Donald Draper",
            "comment": "I need a scotch."
          }
        ]
      },
      {
        "sectionId": `${cur}-3`,
        "comments": [
          {
            "authorAvatarUrl": "http://f.cl.ly/items/0l1j230k080S0N1P0M3e/clay-davis.png",
            "authorName": "Senator Clay Davis",
            "comment": "These Side Comments are incredible. Sssshhhiiiiieeeee."
          }
        ]
      }
    ]);
  }, []);
}

export function markCommentableSections() {

  $("[class^=page-container__]").parent().attr("id", "commentable-area");
  $("[class^=content-container__]").each(function () {
    const chapter = $(this).find("h1").text();
    const sections = $(this).find("pre").children();
    let idx = 1;
    sections.each(function () {
      const block = $(this);
      if (block.width() > 0 && block.height() > 0) {
        block.addClass("commentable-section");
        block.attr("data-section-id", `${chapter}-${idx}`);
        idx++;
      }
    });
  });
}