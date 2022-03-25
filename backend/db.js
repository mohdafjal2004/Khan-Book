const mongoose = require("mongoose");

const conn = () => {
  mongoose.connect("mongodb+srv://codewithharry:codewithharry@cluster0.2cdxj.mongodb.net/harry?retryWrites=true&w=majority")
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((error) => {
      console.log(error); 
    });
};
module.exports = conn;