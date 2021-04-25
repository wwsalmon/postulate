const mongoose = require("mongoose");
const customDeserializeMD = require("../utils/slate/dist/customDeserializeMD");

module.exports = {
  async up(db, client) {
    const post = await db.collection("posts").findOne({_id: mongoose.Types.ObjectId("60257d09143e8b270ccdc7e8")});
    console.log(post, customDeserializeMD);
    const slateBody = customDeserializeMD(post.body);
    console.log(slateBody);
    await db.collection("posts").update({_id: mongoose.Types.ObjectId("60257d09143e8b270ccdc7e8")}, {
      $set: { slateBody: slateBody }
    });
  },

  async down(db, client) {
  }
};
