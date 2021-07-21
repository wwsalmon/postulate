const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function htmlDecode(input) {
  const dom = new JSDOM(input);
  return dom.window.document.body.textContent;
}

module.exports = {
  async up(db, client) {
    // get all snippets and posts
    const allSnippets = await db.collection("snippets").find({slateBody: {$exists: true}}).toArray();
    const allPosts = await db.collection("posts").find({slateBody: {$exists: true}}).toArray();

    // make and execute link creation requests
    let requests = [];

    for (let snippet of allSnippets) {
      requests.push({
        updateOne: {
          filter: {_id: snippet._id},
          update: {$set: {body: htmlDecode(htmlDecode(htmlDecode(snippet.body)))}},
        }
      })
      if (requests.length % 100 === 0) console.log("creating request " + requests.length);
      if (requests.length === 500) {
        console.log("making bulk requests");
        await db.collection("snippets").bulkWrite(requests);
        requests = [];
      }
    }

    await db.collection("snippets").bulkWrite(requests);
    requests = [];

    for (let post of allPosts) {
      requests.push({
        updateOne: {
          filter: {_id: post._id},
          update: {$set: {body: htmlDecode(htmlDecode(htmlDecode(post.body)))}},
        }
      })
      if (requests.length % 100 === 0) console.log("creating request " + requests.length);
      if (requests.length === 500) {
        console.log("making bulk requests");
        await db.collection("posts").bulkWrite(requests);
        requests = [];
      }
    }

    await db.collection("posts").bulkWrite(requests);
    requests = [];
  },
};
