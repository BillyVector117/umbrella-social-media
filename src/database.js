const mongoose = require("mongoose");
const URI = `mongodb+srv://billy:rN31ulvuJ9Hx9EGF@cluster0.0nfke.mongodb.net/Umbrella?retryWrites=true&w=majority`;

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
