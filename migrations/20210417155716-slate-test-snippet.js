const mongoose = require("mongoose");
const customDeserializeMD = require("../utils/slate/dist/customDeserializeMD");

module.exports = {
  async up(db, client) {
    const post = await db.collection("snippets").findOne({_id: mongoose.Types.ObjectId("601596dc08e5902b5044da0e")});
    console.log(post, customDeserializeMD);
    const slateBody = customDeserializeMD(post.body);
    console.log(slateBody);
    await db.collection("snippets").update({_id: mongoose.Types.ObjectId("601596dc08e5902b5044da0e")}, {
      $set: { slateBody: slateBody }
    });
  },

  async down(db, client) {
  }
};
