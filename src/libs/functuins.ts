
export function getCurrentUser() {
  // Demo data for now
  return {
    id: 1,
    avatarUrl: "http://f.cl.ly/items/0s1a0q1y2Z2k2I193k1y/default-user.png",
    name: "You"
  };
}

export function getBook() {
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