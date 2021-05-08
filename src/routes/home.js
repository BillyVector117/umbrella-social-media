const router = require("express").Router();
// const multer = require("multer");
//const upload = require("../index")
const { isAuthenticated } = require("../helpers/authenticate-middleware"); // Protect pages for no-Logers
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

// Complete Uri: home/index - isAuthenticated is a middleare to ensure exists an active user
router.get("/", isAuthenticated, async (req, res) => {
  console.log("You are loged as: ", req.user); // Here is saved the current user
  const activeUser = req.user;
  // Get all posts and the owner (Includes ANY user)
  let posts = await Post.find().sort({ $natural: -1 }); // Object array
  // console.log("Posts before forEach: ", posts);
  let allPosts = posts;
  try {
    let newData = await Promise.all(
      allPosts.map(async (post) => {
        let islike = post.likedUsers.find((el) => el == req.user.id);
        if (islike) {
          post.liked = true;
        } else {
          post.liked = false;
        }
        let owner = await User.findById(post.user);
        // console.log("owner: ", owner.username);
        let decodeName = owner.username;
        if (post) {
          post.decodedUser = decodeName;
          let mydate = post.date; // Extract real date, then transform to legible date
          // myparse = Date.parse(mydate); // Converts ISODate to TimeStamp
          // # 1 ISODate to TimeStamp
          /* post.decodedDate =
          mydate.getFullYear() +
          "-" +
          (mydate.getMonth() + 1) +
          "-" +
          mydate.getDate(); */
          //  # 2 Date Transform
          // console.log("Second form: ", mydate.toISOString().substring(0, 10))
          post.decodedDate = mydate.toISOString().substring(0, 10);
          // Get all comments for each Image/Post
          const comments = await Comment.find({ image_id: post._id });
          if (comments) {
            post.comments = comments;
          } else {
            post.comments = null;
          }
          post.views = post.views + 1;
          await post.save(); // Saving views number
          // console.log("comentarios: ", post.comments)
        }
        // console.log("HOME POSTS: ", post);
        return post;
      })
    );
    console.log("Posts in home section: ", newData);
    // Send user info to: /home view (To allow greeting), and all Posts in database
    res.render("home/index", {
      user: activeUser,
      posts: newData,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/newPost/:id", isAuthenticated, async (req, res) => {
  try {
    // console.log('New post values: ', req.body); // All input values
    // Multer changes image object from req.body to req.file
    const { title, description, username, userId } = req.body; // Extracting all input values
    // console.log(req.user) // 'user' object saved by Passport
    // *** NEXT UPDATE: Custom error page
    if ((title, description == "")) {
      res.json({ response: "Empty fields" });
    }
    if (req.file == undefined) {
      res.json({ response: "Empty image" });
    }
    const { originalname } = req.file;
    // Validate empty inputs
    let data = new Date();
    // This object will save into Database
    const imagePath = `/uploads/${originalname}`;
    // console.log(req.file);
    const date = Date.parse(data);
    const user = userId;
    const decodedUser = username;
    /* NOTE: NEXT UPDATE (USE ES6)
   const requestPost = {
      title: title, // ES5
      description, // ES6
      imagePath: `/uploads/${image}`,
      date: new Date(),
      user: userDecoded.id,
      decodedUser: userDecoded.username,
    }; */
    const newPost = new Post({
      title,
      description,
      imagePath,
      avatarCard: req.user.imagePath,
      date,
      decodedDate: "",
      user,
      decodedUser,
    });
    await newPost.save();
    console.log("New post uploaded!");
    res.redirect("/home/");
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
