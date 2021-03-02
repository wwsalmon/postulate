const mongoose = require("mongoose");

module.exports = {
  async up(db, client) {
    await db.collection("posts").updateMany({}, {
      $set: { privacy: "public" },
    })
  },
};