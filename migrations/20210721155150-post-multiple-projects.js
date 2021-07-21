module.exports = {
  async up(db, client) {
    // get all snippets and posts
    const allPosts = await db.collection("posts").find({slateBody: {$exists: true}}).toArray();

    // make and execute link creation requests
    let requests = [];

    for (let post of allPosts) {
      requests.push({
        updateOne: {
          filter: {_id: post._id},
          update: {$set: {projectIds: [post.projectId]}},
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
