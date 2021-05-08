// This module (Middleware) is used to check/ensure exists an active user logged (Like Auth.current from Google Auths)
const helpers = {}; // This objects will have more methods
// Here isAuthenticated() is a helpers(object) property
helpers.isAuthenticated = (req, res, next) => {
  // req.isAuthenticated() is a Passport functionality that allows to  know if a user is active (returns boolean)
  if (req.isAuthenticated()) {
    // console.log(res)
    // console.log(res.req.user);
    return next();
  } else {
    res.redirect("/");
  }
};
module.exports = helpers;
