var steem = require("steem");

function updateSteemArticles(username) {
  steem.api.getDiscussionsByBlog({ limit: 10, tag: username }, function(
    err,
    result
  ) {
    for (var i = 0; i < result.length; i++) {
      const {
        title,
        body,
        category,
        author,
        permlink,
        created,
        json_metadata
      } = result[i];
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
        for (let j = 0; j < images.length; j++) {
          cont = cont.replace(images[j], "");
        }

        const categories = tags[0];
        const excerpt =
          `<img src="images[0].replace(/\)/g, '')" />` +
          cont.substring(0, 200) +
          ".....";

        let t = title.replace(/"(.*)"/g, "“$1”").replace(/"/g, "“"); //.replace(/\[|\]|:|-|#|\(|\)|\'/g, '').replace('?', '').replace('?', '');
        // console.log(t, tags);
        hexo.post.create(
          {
            slug: `${category}/${author}/${permlink}`,
            title: title.replace(/"(.*)"/g, "“$1”").replace(/"/g, "“"),
            content,
            date,
            tags,
            author,
            categories
            // excerpt,
          },
          true
        );
      }
    }
  });
}

if (hexo.config.steem_users) {
  for (var i = 0; i < hexo.config.steem_users.length; i++) {
    updateSteemArticles(hexo.config.steem_users[i]);
  }
} else {
  console.log("No steem usernames found, please add to the _config.yml");
}
