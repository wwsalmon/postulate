const customDeserializeMD = require("../utils/slate/dist/customDeserializeMD");

module.exports = {
  async up(db, client) {
    const allSnippets = await db.collection("snippets").find({slateBody: {$exists: false}}).toArray();
    const allPosts = await db.collection("posts").find({slateBody: {$exists: false}}).toArray();
    let requests = [];

    const slateInitValue = [{
      type: "p",
      children: [{text: ""}],
      id: 0,
    }];

    for (let snippet of allSnippets) {
      const slateBody = snippet.body ? customDeserializeMD(snippet.body) : slateInitValue;
      requests.push({
        updateOne: {
          filter: {_id: snippet._id},
          update: {$set: {slateBody: slateBody}},
        }
      });
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
      const slateBody = post.body ? customDeserializeMD(post.body) : slateInitValue;
      requests.push({
        updateOne: {
          filter: {_id: post._id},
          update: {$set: {slateBody: slateBody}},
        }
      });
      if (requests.length % 100 === 0) console.log("creating request " + requests.length);
      if (requests.length === 500) {
        console.log("making bulk requests");
        await db.collection("posts").bulkWrite(requests);
        requests = [];
      }
    }

    console.log("making bulk requests");
    await db.collection("posts").bulkWrite(requests);
  },
};