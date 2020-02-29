var steem = require("steem");

let alltags = [];

function updateSteemArticles(username, limit, permlink = "") {
  steem.api.getDiscussionsByBlog(
    {
      limit: limit,
      tag: username,
      start_author: username,
      start_permlink: permlink
    },
    function(err, result) {
      const count = result.length;

      if (count == 0) return;

      let startPermlink = "";

      for (var i = 1; i < result.length; i++) {
        const {
          title,
          body,
          category,
          author,
          permlink,
          created,
          json_metadata
        } = result[i];

        if (author != username) continue;

        startPermlink = permlink;
        if (result[i].author == username) {
          // || hexo.config.steem_resteems) {
          const tags = JSON.parse(json_metadata).tags || [];
          const date = new Date(`${created}Z`);
          const content = body
            .replace(/\|/g, "|")
            .replace(/%/g, "％")
            .replace(/{/g, "｛")
            .replace(/}/g, "｝");
          var regImageMarkdown = /(?:(?:(https?|ftp|telnet):\/\/|[\s\t\r\n\[\]\`\<\>\"\'])((?:[\w$\-_\.+!*\'\(\),]|%[0-9a-f][0-9a-f])*\:(?:[\w$\-_\.+!*\'\(\),;\?&=]|%[0-9a-f][0-9a-f])+\@)?(?:((?:(?:[a-z0-9\-가-힣]+\.)+[a-z0-9\-]{2,})|(?:[\d]{1,3}\.){3}[\d]{1,3})|localhost)(?:\:([0-9]+))?((?:\/(?:[\w$\-_\.+!*\'\(\),;:@&=ㄱ-ㅎㅏ-ㅣ가-힣]|%[0-9a-f][0-9a-f])+)*)(?:\/([^\s\/\?\.:<>|#]*(?:\.[^\s\/\?:<>|#]+)*))?(\/?[\?;](?:[a-z0-9\-]+(?:=[^\s:&<>]*)?\&)*[a-z0-9\-]+(?:=[^\s:&<>]*)?)?(#[\w\-]+)?)/gim;
          var images = body.match(regImageMarkdown);
          var cont = content.replace(/\!\[\]\(/g, "");

          if (images && images.length && images.length > 0) {
            for (let j = 0; j < images.length; j++) {
              cont = cont.replace(images[j], "");
            }
          }

          let categories = "";

          if (
            tags.indexOf("kr-dev") > -1 ||
            tags.indexOf("sct-dev") > -1 ||
            tags.indexOf("dev") > -1 ||
            tags.indexOf("development") > -1 ||
            tags.indexOf("solidity") > -1 ||
            tags.indexOf("klaytn") > -1 ||
            tags.indexOf("firebase") > -1
          ) {
            categories = "dev";
          } else if (
            tags.indexOf("tasteem") > -1 ||
            tags.indexOf("tasteem-kr") > -1 ||
            tags.indexOf("muksteem") > -1 ||
            tags.indexOf("food") > -1 ||
            tags.indexOf("kr-cook") > -1
          ) {
            categories = "food";
          } else if (
            tags.indexOf("sct-bitcoin") > -1 ||
            tags.indexOf("coinstory") > -1 ||
            tags.indexOf("sct-altcoin") > -1 ||
            tags.indexOf("bitcoin") > -1 ||
            tags.indexOf("erc-20") > -1 ||
            tags.indexOf("coinkorea") > -1 ||
            tags.indexOf("blockchain") > -1 ||
            tags.indexOf("cryptocurrency") > -1
          ) {
            categories = "blockchain";
          } else if (
            tags.indexOf("kr-daddy") > -1 ||
            tags.indexOf("children") > -1 ||
            tags.indexOf("family") > -1 ||
            tags.indexOf("baby") > -1 ||
            tags.indexOf("father") > -1
          ) {
            categories = "baby";
          } else if (
            tags.indexOf("photography") > -1 ||
            tags.indexOf("appics") > -1
          ) {
            categories = "picture";
          } else if (
            tags.indexOf("spt") > -1 ||
            tags.indexOf("sct-game") > -1 ||
            tags.indexOf("sct-ror") > -1 ||
            tags.indexOf("rors") > -1 ||
            tags.indexOf("klaytnknights") > -1 ||
            tags.indexOf("steemmonster") > -1 ||
            tags.indexOf("kr-game") > -1 ||
            tags.indexOf("eosknights") > -1 ||
            tags.indexOf("drugwars") > -1
          ) {
            categories = "game";
          } else if (
            tags.indexOf("sct-movie") > -1 ||
            tags.indexOf("aaa") > -1 ||
            tags.indexOf("aaa-movie") > -1 ||
            tags.indexOf("kr-movie") > -1
          ) {
            categories = "game";
          } else {
            categories = "life";
          }

          tags.forEach(t => alltags.push(t));

          const imageScript =
            images && images.length > 0 ? images[0].replace(/\)/g, "") : "";
          const excerpt =
            `<img src="${imageScript}" />\r\n` +
            cont
              .substring(0, 200)
              .replace(/\r/g, " ")
              .replace(/\n/g, " ") +
            ".....";

          let t = title.replace(/"(.*)"/g, "“$1”").replace(/"/g, "“"); //.replace(/\[|\]|:|-|#|\(|\)|\'/g, '').replace('?', '').replace('?', '');

          if (t.indexOf("Mining Report") > -1) continue;

          hexo.post.create(
            {
              slug: `${category}/${author}/${permlink}`,
              title: title.replace(/"(.*)"/g, "“$1”").replace(/"/g, "“"),
              content,
              date,
              tags,
              author,
              categories,
              excerpt
            },
            true
          );
        }
      }

      if (count == limit) {
        updateSteemArticles(username, limit, startPermlink);
      } else {
        // const all = alltags.filter(
        //   (item, index) => alltags.indexOf(item) === index
        // );
        // console.log(all);
        return;
      }
    }
  );
}

if (hexo.config.steem_users) {
  for (var i = 0; i < hexo.config.steem_users.length; i++) {
    updateSteemArticles(hexo.config.steem_users[i], 100);
  }
} else {
  console.log("No steem usernames found, please add to the _config.yml");
}
// updateSteemArticles("happyberrysboy", 100);
