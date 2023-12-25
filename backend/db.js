const mongoose = require('mongoose');
// const mongoURI = "mongodb://0.0.0.0:27017/inotebook"

connectToMongo = () => {
    mongoose.connect(mongoURI)
    console.log("Connected to Mongo successfully!");
}

module.exports = connectToMongo;