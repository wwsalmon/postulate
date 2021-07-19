module.exports = {
  async up(db, client) {
    await db.collection("snippets").updateMany({_id: {$exists: true}}, {$set: {privacy: "private"}});
  }
}