const mongoose = require("mongoose");

module.exports = {
  async up(db, client) {
    await db.collection("users").updateMany({}, {
      $set: { featuredPosts: [], featuredProjects: [] },
    })
  },
};