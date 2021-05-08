const router = require("express").Router();
const { isAuthenticated } = require("../../helpers/authenticate-middleware"); // Protect pages for no-Logers
const Post = require("../../models/Post");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const md5 = require("md5");

router.post("/:image_id/comment", isAuthenticated, async (req, res) => {
  // console.log("comment section: ", req.body) // Input form values
  // console.log("New comment: ", newComment) // Creating a new Schema Object
  // console.log("image ID: ", req.params.image_id) // Get the ID for comment Image
  try {
    // Check for empty comments
    if (req.body.comment == "") {
      console.log("EMPTY COMMENT");
      return;
    }
    // Check if commented Image exists in database
    const image = await Post.findOne({ _id: req.params.image_id });
    if (image) {
      const newComment = new Comment(req.body); // Create a new 'Comment' Schema using input values
      newComment.gravatar = md5(newComment.email); // Add a encrypted email as property
      newComment.image_id = image._id; // Add comment image reference
      newComment.userId = req.body.id;
      console.log("New comment: ", newComment);
      await newComment.save();
      res.redirect("/home/");
    } else {
      console.log("Something went wrong in comments");
    }
  } catch (error) {
    console.log(error);
  }
});
// This route is only request once user have "liked" a post
router.post("/:image_id/like", isAuthenticated, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.image_id });
  // 'likedUsers' is an ARRAY property of post Object, search if current user have liked this post
  let likedUser = post.likedUsers.find((el) => el == req.user.id);
  if (likedUser) {
    console.log("This user has liked this previously");

    return;
  } else {
    if (post) {
      console.log("First like");
      post.likes = post.likes + 1;
      post.likedUsers.push(req.user._id); // adding user to likedUsers
      post.liked = true;
      await post.save();
      res.json({ likes: post.likes });
    } else {
      //*** NEXT UPDATE: ERROR VIEW */
      res.status(500).json({ error: "Fatal Error!" });
    }
  }
});
// This route is only request once user have "disliked" a post
router.post("/:image_id/dislike", isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.image_id }); // Capture liked post
    // console.log("actual liked users: ", post.likedUsers)
    if (post) {
      let newLikedUser = post.likedUsers.filter(
        (value) => value != req.user.id
      );
      // console.log("Nuevo likedUser array: ", newLikedUser)
      post.likes = post.likes - 1;
      post.likedUsers = newLikedUser;
      post.liked = false;
      await post.save();
      res.json({ likes: post.likes });
    } else {
      //*** NEXT UPDATE: ERROR VIEW */
      res.status(500).json({ error: "Fatal Error!" });
    }
  } catch (error) {
    console.log(error);
  }
});
// Delete a image (click trash icon)
router.post("/:image_id/delete", isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.image_id }); // Capture liked post
    if (post) {
      await Post.findOneAndDelete({ _id: req.params.image_id });
      await Comment.find({ image_id: req.params.image_id }).deleteMany();
      res.json({ deleteMessage: "Successfully deleted! (including comments)" });
    } else {
      //*** NEXT UPDATE: ERROR VIEW */
      res.status(500).json({ error: "Fatal Error while deleting!" });
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
