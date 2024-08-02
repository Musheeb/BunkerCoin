const mongoose = require('mongoose');
// require('dotenv').config();

module.exports = function createDatabaseConnection() {
  mongoose.connect(process.env.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    readPreference: "secondaryPreferred",
    serverSelectionTimeoutMS: 10000,
  }).then(() => {
    console.log("Database connected");
  }).catch((e) => {
    console.log(`Database hasn't connected successfully. Check URL or Your internet connection`);
  });
};


// const Sequelize = require('sequelize')
// const sequelize = new Sequelize(
//    'node_al', // TutorialsPoint
//    'root', // root
//    '', //root
//    {
//       dialect: 'mysql',
//       host: 'localhost',
//       logging: false
//    }
// );
// module.exports = sequelize