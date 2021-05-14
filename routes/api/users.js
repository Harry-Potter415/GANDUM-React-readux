const express = require("express");
const router = express.Router();

const APP_KEYS = require("../../config/keys");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// user model
const User = require("../../models/User");
const ProductCat = require("../../models/ProductCat");

const {
  isEmpty,
  putError,
  checkError,
  imageUpload,
  imageUnlink,
  checkToken,
} = require("../../config/helpers");
const validate = require("../../validations/user");

// router.get("/all", (req, res) => {
//   User.find({}).then((users) => {
//     return res.status(200).json(users);
//   });
// });

// @route   Post api/posts
// @desc    Registering user
// @access  public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    console.log("req.body--->", req.body);

    if (user) {
      return res.status(400).json("Email already exists");
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) =>
              res.json({
                name: user.name,
                email: user.email,
                role: user.role,
              })
            )
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", async (req, res) => {
  console.log("inside /login");
  const email = req.body.email;
  const password = req.body.password;
  const errors = {};

  let first_user_flag = await User.find();

  if(first_user_flag.length == 0) {
    let first_user = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "Manager",
    })

    await bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash("admin123", salt, async (err, hash) => {
          if (err) throw err;
          first_user.password = hash;
          await first_user.save()

          let first_payload = { id: first_user.id, name: first_user.name, email: first_user.email }; // Create JWT Payload
          // Sign Token
          jwt.sign(
            first_payload,
            APP_KEYS.jwtSecret,
            { expiresIn: 36000 },
            (err, token) => {
              console.log("first_user");

              return res.json({
                success: true,
                token: token,
                role: first_payload.role,
                user_id: first_payload.id,
                name: first_payload.name,
                image: first_payload.image,
              });
            }
          );
        });
      });
  }

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check for user
    if (!user) {
      return res.status(404).json("Invalid credentials");
    }
    // Check Password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, email: user.email }; // Create JWT Payload
        // Sign Token
        jwt.sign(
          payload,
          APP_KEYS.jwtSecret,
          { expiresIn: 36000 },
          (err, token) => {
            console.log("hello2");

            return res.json({
              success: true,
              token: token,
              role: user.role,
              user_id: user.id,
              name: user.name,
              image: user.image,
            });
          }
        );
      } else {
        return res.status(400).json("Invalid credentials");
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get("/current", auth, (req, res) => {
  //console.log(req.user);
  res.json({
    id: req.user.id,
    name: req.user.name,
    //email: req.user.email
  });
});

// @route   GET api/users
// @desc    Get all users
// @access  Private

router.get("/", auth, (req, res) => {
  const errors = {};

  User.find()
    .select("-password")
    .then((Users) => {
      if (!Users) {
        errors.noprofile = "There is no User";
        return res.status(404).json(errors);
      }
      res.json(Users);
    })
    .catch((err) => res.status(404).json(err));
});

// @route   GET api/users
// @desc    Get user by id
// @access  Private

router.get("/:userId", auth, (req, res) => {
  const errors = {};

  User.findOne({ _id: req.params.userId })
    .select("-password")
    .then((user) => {
      if (!user) {
        errors.noprofile = "There is no User";
        return res.status(404).json(errors);
      }
      res.json(user);
    })
    .catch((err) => res.status(404).json(err));
});

router.post("/cattree", async (req, res) => {
  try {
    const cats = await ProductCat.find({}).select("_id parentId name");
    var categories = [...cats];
    categories[0]["children"] = [({ name: "A" }, { name: "B" }, { name: "C" })];
    res.json(categories[0].children[0]);
    //res.json(unflatten(cats));
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

router.post("/update", async (req, res) => {
  console.log("inside /update");
  const user = await User.findById({ _id: req.body.user_id });

  const email = req.body.email;
  const password = req.body.password;
  const errors = {};
  // Find user by email
  try {
    if (user) {
      const errors = validate("updateUser", req.body);
      if (!isEmpty(req.body.password)) {
        user.password = await bcrypt.hash(password, 10);
      }
      if (req.body.updatedImage) {
        let imgObject = await imageUpload(
          req.body.updatedImage,
          "/assets/images/user/"
        );
        if (imgObject.success === false) {
          throw putError(imgObject.message);
        } else {
          imageUnlink(user.image);
          user.image = imgObject.data;
        }
      }
      console.log("inside try");

      user.name = req.body.name;
      user.email = req.body.email;
      user.role = req.body.role;
      user.updated = Date.now();
      let metArra = {};

      for (let i in req.body.meta) {
        metArra[req.body.meta[i].key] = req.body.meta[i];
      }

      for (let i in user.meta) {
        if (metArra[user.meta[i].key]) {
          user.meta[i].value = metArra[user.meta[i].key].value;
          delete metArra[user.meta[i].key];
        }
      }

      if (Object.keys(metArra).length) {
        for (let i in metArra) {
          user.meta.unshift(metArra[i]);
        }
      }

      await user.save();
      var tatti = await User.findById({ _id: req.body.user_id });
      console.log(tatti);
      return res.status(200).send(tatti);
      // await User.findById({ _id: req.body.user_id })
    } else {
      return res.status(400).json("User not exist");

      console.log("user not exist");
      throw putError("User not exist");
    }
  } catch (error) {
    error = checkError(error);

    return res.status(400).json(error.custom_message);
  }
});

module.exports = router;
