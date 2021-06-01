const dotenv = require('dotenv');
const mongoose = require("mongoose");
dotenv.config();
const URI = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@cluster0.0nfke.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

// mongodb+srv://XXXXXXXXX:rXXXXXXXXX@cluster0.0nfke.mongodb.net/XXXXXXXXX?retryWrites=true&w=majority
mongoose
  .connect(URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((event) =>
    console.log("Successfully connected to:", event.connection.name)
  )
  .catch((error) => console.log("ERROR DETECTED: ", error));
// rN31ulvuJ9Hx9EGF;
