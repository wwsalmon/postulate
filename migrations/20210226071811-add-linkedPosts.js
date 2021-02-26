const mongoose = require("mongoose");

module.exports = {
  async up(db, client) {
    await db.collection("snippets").updateMany({}, {
      $set: { linkedPosts: [] },
    })
  },
};
