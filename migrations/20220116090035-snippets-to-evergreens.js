const strip = require("remove-markdown");
const ellipsize = require("ellipsize");

module.exports = {
  async up(db, client) {
    const publicSnippets = await db.collection("snippets").find({privacy: "public"}).toArray();

    console.log("snippets fetched");

    const newEvergreens = publicSnippets.map(snippet => {
      const body = snippet.slateBody;
      const {updatedAt, createdAt, projectId, userId} = snippet;

      // make title
      const firstLine = snippet.body.split("\n")[0];
      const firstLineStripped = strip(firstLine);
      const title = ellipsize(firstLineStripped, 60);

      return ({
        userId: userId,
        projectId: projectId,
        type: "evergreen",
        body: {
          title,
          body,
          publishedTitle: title,
          publishedBody: body,
          lastPublishedDate: updatedAt,
          publishedDate: createdAt,
        },
        updatedAt: updatedAt,
        createdAt: createdAt,
      });
    });

    console.log("new evergreens created");

    await db.collection("nodes").insertMany(newEvergreens);
  },
};
