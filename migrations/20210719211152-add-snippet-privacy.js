module.exports = {
  async up(db, client) {
    await db.collection("snippets").update({_id: {$exists: true}}, {$set: {privacy: "private"}});
  }
}