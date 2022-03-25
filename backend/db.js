const mongoose = require("mongoose");

const conn = () => {
  mongoose.connect("mongodb+srv://<username>:<password>@cluster0.2cdxj.mongodb.net/harry?retryWrites=true&w=majority")
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((error) => {
      console.log(error); 
    });
};
module.exports = conn;
