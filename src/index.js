const express = require("express");
const path = require("path");
const handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const multer = require("multer"); // Uploader images
const passport = require("passport");
const session = require("express-session");
require("./config/passport");
// const upload = multer({dest: "public/uploads"});

// EXPRESS INITIALIZATION
const app = express();

// DATABASE/MONGODB INITIALIZATION
require("./database");

// SETTINGS
const port = process.env.PORT || 3000;

// MULTER CONFIG TO STORE IMAGES
const storage = multer.diskStorage({
  // Get main path and create a public/uploads directory
  destination: path.join(__dirname, "public/uploads"),
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// Multer initialization ( .single() receive the input File name from HTML)
app.use(
  multer({
    storage: storage,
    dest: path.join(__dirname, "public/uploads"),
  }).single("image")
);

// Use multer with 'storage' config, and just watch changes for 'image' input
/*  app.use(multer({ storage }).single("image")); */

// STATIC VIEWS FILES
app.set("views", path.join(__dirname, "views"));

// Template-Engine Object Config (Handlebars)
app.engine(
  ".hbs",
  exphbs({
    // Necessary config
    defaultLayout: "main", // Main file
    layoutsDir: path.join(app.get("views"), "layouts"), // Main File path (layout)
    partialsDir: path.join(app.get("views"), "partials"), // Partials (footer, mensajes, nav)
    extname: ".hbs", // Extension file
    handlebars: allowInsecurePrototypeAccess(handlebars), // To avoid error Logs
  })
);
// Setting Handlebars as Template-Engine
app.set("view engine", ".hbs");

// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// app.use(methodOverride("_method"));
// Object config to use 'session' (Express-module) to create user's session
app.use(
  session({
    secret: "secretApp", // Secret word
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize()); // Init passport
app.use(passport.session()); // Passport will use session from 'Express-session' mixed
// ROUTES
app.use("/", require("./routes/singleRoutes"));
app.use("/home", require("./routes/home.js"));
app.use("/user/", require("./routes/user/index"));
app.use("/images", require("./routes/images/index"));

// STATIC FILES (static files config ('public' directoy))
app.use(express.static(path.join(__dirname, "public")));

// LISTENER
app.listen(port, () => {
  console.log(`server listening on port ${port} !`);
});
