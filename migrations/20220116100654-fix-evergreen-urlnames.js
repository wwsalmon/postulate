const {format} = require("date-fns");
const short = require("short-uuid");

module.exports = {
  async up(db, client) {
    const noUrlNameEvergreens = await db.collection("nodes").find({type: "evergreen", "body.urlName": {$exists: false}, "body.publishedTitle": {$exists: true}}).toArray();

    console.log(`found ${noUrlNameEvergreens.length} nodes...`);

    let requests = [];

    for (let node of noUrlNameEvergreens) {
      const urlName =
          format(new Date(node.body.lastPublishedDate), "yyyy-MM-dd") +
          "-" + encodeURIComponent(node.body.publishedTitle.split(" ").slice(0, 5).join("-")) +
          "-" + short.generate();

      requests.push({
        updateOne: {
          filter: {_id: node._id},
          update: {$set: {"body.urlName": urlName}},
        }
      });
    }

    console.log("requests finished");

    console.log("making requests...");

    await db.collection("nodes").bulkWrite(requests);
  },
};
