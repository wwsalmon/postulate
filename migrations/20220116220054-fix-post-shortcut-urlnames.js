module.exports = {
  async up(db, client) {
    const postShortcutsWithoutUrlName = await db.collection("shortcuts").find({type: "post", urlName: {$exists: false}}).toArray();

    for (let shortCut of postShortcutsWithoutUrlName) {
      const originalPost = await db.collection("nodes").findOne({_id: shortCut.targetId});
      console.log(originalPost.body.urlName);

      await db.collection("shortcuts").updateOne({_id: shortCut._id}, {$set: {urlName: originalPost.body.urlName}});
    }
  },
};
