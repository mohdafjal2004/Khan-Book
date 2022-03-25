const express = require("express");
const connectToMongo = require("./db");
const port = 5000;
const app = express();
const cors = require("cors");
connectToMongo();

//to use req.body in backend
app.use(express.json());

app.use(cors());

//Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});
