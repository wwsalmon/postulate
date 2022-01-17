const mongodb = require("mongodb");

module.exports = {
  async up(db, client) {
    console.log("finding single project posts...");

    const singleProjectPosts = await db.collection("posts").find({"projectIds.1": {$exists: false}}).toArray();

    console.log(`${singleProjectPosts.length} single project posts found...`);

    let nodesToWrite = singleProjectPosts.map(post => getNodeFromPost(post));

    console.log("single project posts converted...");

    console.log("finding multi project posts...");

    const multiProjectPosts = await db.collection("posts").find({"projectIds.1": {$exists: true}}).toArray();

    console.log(`${multiProjectPosts.length} multi project posts found...`);

    let shortcutsToWrite = [];

    for (let post of multiProjectPosts) {
      const thisId = new mongodb.ObjectId();

      nodesToWrite.push(getNodeFromPost(post, thisId));

      const extraProjectIds = post.projectIds.slice(1);

      const {userId, createdAt} = post;

      for (let extraProjectId of extraProjectIds) {
        shortcutsToWrite.push({
          userId,
          projectId: extraProjectId,
          targetId: thisId,
          type: "post",
          createdAt,
          updatedAt: createdAt,
        })
      }
    }

    console.log("multi project posts converted...");

    console.log(nodesToWrite.slice(-5), shortcutsToWrite.slice(0, 5));

    // throw new Error("purposely crashing");

    await db.collection("nodes").insertMany(nodesToWrite);

    console.log("posts inserted...");

    await db.collection("shortcuts").insertMany(shortcutsToWrite);

    console.log("shortcuts inserted...");
  },
};

function getNodeFromPost(post, id, projectId) {
  const {slateBody, projectIds, title, userId, urlName, createdAt, updatedAt, privacy} = post;

  let body = {
    body: slateBody,
    title,
  }

  if (privacy === "public") {
    body = {
      ...body,
      publishedBody: slateBody,
      publishedTitle: title,
      lastPublishedDate: updatedAt,
      publishedDate: createdAt,
      urlName,
    }
  }

  let thisNode = {
    projectId: projectId || projectIds[0],
    userId,
    body,
    type: "post",
    createdAt,
    updatedAt,
  };

  if (id) thisNode["_id"] = id;

  return thisNode;
}
