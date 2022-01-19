module.exports = {
  async up(db, client) {
    const sources = await db.collection("nodes").find({type: "source"}).toArray();

    let requests = [];

    for (let source of sources) {
      let setObj = {"body.sourceInfo": [{type: "p", children: [{text: source.body.link}]}]};
      if (source.body.publishedLink) setObj["body.publishedSourceInfo"] = [{type: "p", children: [{text: source.body.publishedLink}]}];

      requests.push({
        updateOne: {
          filter: {_id: source._id},
          update: {$set: setObj},
        }
      });
    };

    await db.collection("nodes").bulkWrite(requests);
  },
};
