const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/User");

passport.use(
  new localStrategy(
    {
      // Select inputs 'name'attributes
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // Check E-mail & password exists in database
        const checkUser = await User.findOne({ email: email }); // return boolean
        if (!checkUser) {
          // Error case: E-mail does not exists in database
          console.log("E-mail does not exists");

          return done(null, false, { text: "This E-mail does not exists" });
        } else {
          // Match password
          const match = await checkUser.matchPassword(password); // Return boolean
          if (!match) {
            console.log("Incorrect password for this account");
            return done(null, false, { text: "Incorrect password, try again" });
          } else {
            return done(null, checkUser);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);
// Save ID user in a session
passport.serializeUser((user, done) => {
  // First param to set No-error, second param User's ID
  done(null, user.id);
});

// Almacenar en una sesión al usuario mediante el id generamos al usuario
passport.deserializeUser((id, done) => {
  // If a user exists...
  User.findById(id, (err, user) => {
    // Buscara por id a ese usuario, puede haber un error o encontrarlo
    done(err, user); // Si no hay error devuelve el user
  });
});
