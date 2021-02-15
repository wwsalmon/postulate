const mongoose = require("mongoose");

const userId = mongoose.Types.ObjectId("60146334b31e8c41981e2957");

module.exports = {
  async up(db, client) {
    await db.collection("snippets").updateMany({}, {
      $set: { userId: userId },
    })
  },
};
