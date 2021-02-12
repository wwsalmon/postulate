require("dotenv").config();

const config = {
  mongodb: {
    url: process.env.MONGODB_URL,

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  migrationsDir: "migrations",

  changelogCollectionName: "changelog",

  migrationFileExtension: ".js"
};

module.exports = config;
