const router = require("express").Router();
const User = require("../models/User");
const passport = require("passport");
router.get("/", (req, res) => {
  // render index.hbs (views path)
  res.render("index");
});
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", async (req, res) => {
  try {
    // Extract input values
    const { username, email, password, confirm_Password } = req.body;
    console.log(req.body);
    const errors = [];
    // Validations
    if (password != confirm_Password) {
      errors.push({ text: "Check your password and try again" });
    }
    if (password.length < 3) {
      errors.push({ text: "Password too short" });
    }
    if (username.length <= 0) {
      errors.push({ text: "Enter your username" });
    }
    if (email.length <= 0) {
      errors.push({ text: "Enter your email" });
    }
    if (password.length <= 0) {
      errors.push({ text: "Enter your password" });
    }
    if (confirm_Password.length <= 0) {
      errors.push({ text: "Confirm your password" });
    }
    if (errors.length > 0) {
      const iterator = errors.values();
      for (const key of iterator) {
        console.log(key);
      }
      console.log(`errors confirmed: ${errors.length}`);
      res.render("users/signup", {
        errors,
        username,
        email,
        password,
        confirm_Password,
      });
    } else {
      // Validate used E-mail
      const usedEmail = await User.findOne({ email: email }); // Return boolean
      if (usedEmail) {
        currentInputValues = req.body; // To send this valie as placeholder input
        errors.push({ text: "E-mail is taken, choose another one" });
        res.render("users/signup", { errors, currentInputValues });
        console.log(errors);
        return;
      }
      // Success case: create user
      // const imagePath =  "/assets/newUser.jpg" // Default image profile (set in Schema)
      const newUser = new User({ username, email, password });
      newUser.password = await newUser.encryptPassword(password); // Hash password
      await newUser.save();
      res.render("index", { messages: "Successfully registered" }); // MISSING MESSAGE
    }
  } catch (error) {
    console.log(error);
  }
});
// Login route has two middlewares
// (to authenticate inputs and send messages, and Passport authentications)
router.post(
  "/login",
  async (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];
    if (email.length <= 0) {
      errors.push({ text: "Enter your email" });
    }
    if (password.length <= 0) {
      errors.push({ text: "Enter your password" });
    }
    if (errors.length > 0) {
      res.render("index", {
        errors,
        email,
      });
      return;
    } else {
      // Check E-mail & password exists in database (WITHOUT PASSPORT YET)
      const checkUser = await User.findOne({ email: email }); // return boolean
      if (!checkUser) {
        // Error case: E-mail does not exists in database
        errors.push({ text: "This E-mail does not exists" });
        console.log("E-mail does not exists");
      } else {
        const match = await checkUser.matchPassword(password); // Return boolean
        if (!match) {
          errors.push({ text: "Incorrect password for this account" });
          console.log("Incorrect password for this account");
        }
      }
      if (errors.length > 0) {
        const iterator = errors.values();
        for (const key of iterator) {
          console.log(key); // Store each error
        }
        console.log(`errors confirmed: ${errors.length}`);
        res.render("index", {
          errors,
          email,
        });
        return;
      }
    }
    next();
  },
  passport.authenticate("local", {
    // To authenticate users with authenticate() method of passport.js (/ strategy )
    successRedirect: "/home", // Success case: redirect to /home section (protected)
    failureRedirect: "/",
    failureFlash: false,
  })
);

router.get("/logout", (req, res) => {
  req.logOut(); // Kill session with Passport method
  console.log("Success loggin out");
  res.redirect("/");
});

// SignIn Without Passport
/* try {
    const errors = [];
    const { email, password } = req.body;
    if (email.length <= 0) {
      errors.push({ text: "Enter your email" });
    }
    if (password.length <= 0) {
      errors.push({ text: "Enter your password" });
    }
    if (errors.length > 0) {
      res.render("index", {
        errors,
        email,
      });
    }
    // Check E-mail & password exists in database (WITHOUT PASSPORT)
    const checkUser = await User.findOne({ email: email }); // return boolean
    if (!checkUser) {
      // Error case: E-mail does not exists in database
      errors.push({ text: "This E-mail does not exists" });
      console.log("E-mail does not exists");
    } else {
      const match = await checkUser.matchPassword(password); // Return boolean
      if (!match) {
        errors.push({ text: "Incorrect password for this account" });
        console.log("Incorrect password for this account");
      }
    }
    if (errors.length > 0) {
      const iterator = errors.values();
      for (const key of iterator) {
        console.log(key); // Store each error
      }
      console.log(`errors confirmed: ${errors.length}`);
      res.render("index", {
        errors,
        email,
      });
    } else {
      res.redirect("/home"); // This route is defined at 'index.js' Routers
    }
  } catch (error) {
    console.log(error);
  } */
module.exports = router;
