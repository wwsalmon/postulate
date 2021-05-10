const findLinks = nodes => {
  let links = [];
  for (let node of nodes) {
    if (node.type === "a") links.push(node.url);
    if (node.children) links.push(...findLinks(node.children));
  }
  return links;
}

module.exports = {
  async up(db, client) {
    // delete all links
    await db.collection("links").deleteMany({nodeType: {$exists: true}});

    // get all snippets and posts
    const allSnippets = await db.collection("snippets").find({slateBody: {$exists: true}}).toArray();
    const allPosts = await db.collection("posts").find({slateBody: {$exists: true}}).toArray();

    // make and execute link creation requests
    let requests = [];

    for (let snippet of allSnippets) {
      const thisUrls = findLinks(snippet.slateBody);

      if (thisUrls.length) {
        for (let url of thisUrls) {
          requests.push({
            insertOne: {
              document: {
                nodeType: "snippet",
                nodeId: snippet._id,
                targetType: "url",
                targetUrl: url,
              }
            }
          });

          if (requests.length % 100 === 0) console.log("creating request " + requests.length);
          if (requests.length === 500) {
            console.log("making bulk requests");
            await db.collection("links").bulkWrite(requests);
            requests = [];
          }
        }
      }
    }

    for (let post of allPosts) {
      const thisUrls = findLinks(post.slateBody);

      if (thisUrls.length) {
        for (let url of thisUrls) {
          requests.push({
            insertOne: {
              document: {
                nodeType: "post",
                nodeId: post._id,
                targetType: "url",
                targetUrl: url,
              }
            }
          });

          if (requests.length % 100 === 0) console.log("creating request " + requests.length);
          if (requests.length === 500) {
            console.log("making bulk requests");
            await db.collection("links").bulkWrite(requests);
            requests = [];
          }
        }
      }
    }

    await db.collection("links").bulkWrite(requests);

  },
};
