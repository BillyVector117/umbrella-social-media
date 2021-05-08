const router = require("express").Router();
const { isAuthenticated } = require("../../helpers/authenticate-middleware"); // Protect pages for no-Logers
const Post = require("../../models/Post");
const User = require("../../models/User");

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const activeUser = req.user;
    // Extract user's ID from Url-Params
    const { id } = req.params;
    console.log("current user: ", req.user.id);
    // Check current user is the owner of visited profile, 'req.user.id' is a global variable created by Passport
    let realUser;
    if (id == req.user.id) {
      realUser = true;
    } else {
      realUser = false;
    }
    const currentUser = await User.findById(id);
    // Find all documents from the visited profile ('id' from Url-Params)
    const allPosts = await Post.find({ user: id }); // Only wich 'user' property == id from Url-Params
    console.log("Post from this user profile: ", allPosts);

    res.render("profile/index", {
      visitedUser: currentUser, // visited profile
      realUser: realUser,
      posts: allPosts,
      user: activeUser,
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id/settings", isAuthenticated, async (req, res) => {
  try {
    // Extract user's ID from Url-Params
    const { id } = req.params;
    // console.log("current user: ", req.user.id);
    // Check current user is the owner of visited profile, 'req.user.id' is a global variable created by Passport
    let realUser;
    if (id == req.user.id) {
      realUser = true;
    } else {
      realUser = false;
    }
    // Find that user and send its credentials
    const currentUser = await User.findById(id);
    // console.log("User profile visited: ", currentUser);
    // res.json(currentUser)
    res.render("profile/settings", {
      user: currentUser,
      realUser: realUser,
    });
  } catch (error) {
    console.log(error);
  }
});
//update username
router.post("/:id/settings", isAuthenticated, async (req, res) => {
  try {
    console.log("Updating: ", req.body.updateInput);
    await User.findByIdAndUpdate(req.params.id, {
      username: req.body.updateInput,
    }); // Update username field
    console.log("successfully updated!");
    res.redirect(`/user/${req.params.id}/settings`);
  } catch (error) {
    console.log(error);
  }
});
router.post("/updatePicture", isAuthenticated, async (req, res) => {
  try {
    // Extract user's ID from Url-Params
    // console.log('upload picture user: ',req.user);
    const { originalname } = req.file;
    await User.findByIdAndUpdate(req.user.id, {
      imagePath: `/uploads/${originalname}`,
    });
    await Post.find({ user: req.user.id }).updateMany({
      avatarCard: `/uploads/${originalname}`,
    });
    console.log("successfully updated!");
    res.redirect("/home/");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
