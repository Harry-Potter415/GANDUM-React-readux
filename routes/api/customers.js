const express = require("express");
const router = express.Router();

const APP_KEYS = require("../../config/keys");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// customer model
const Customer = require("../../models/Customer");
const ProductCat = require("../../models/ProductCat");

const {
  isEmpty,
  putError,
  checkError,
  imageUpload,
  imageUnlink,
  checkToken,
} = require("../../config/helpers");
const validate = require("../../validations/customer");

router.post("/register", (req, res) => {
  Customer.findOne({ email: req.body.email }).then((customer) => {
    console.log("req.body--->", req.body);

    if (customer) {
      return res.status(400).json("Email already exists");
    } else {
      const newCustomer = new Customer({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        wishlist: []
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newCustomer.password, salt, (err, hash) => {
          console.log(newCustomer.password);
          if (err) throw err;
          newCustomer.password = hash;
          newCustomer
            .save()
            .then((customer) =>
              res.json({
                name: customer.name,
                email: customer.email,
              })
            )
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login Customer / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  console.log("inside /login", req.body);
  const email = req.body.email;
  const password = req.body.password;
  const errors = {};
  // Find customer by email
  Customer.findOne({ email }).then((customer) => {
    // Check for customer
    if (!customer) {
      return res.status(401).json("Invalid credentials");
    }
    // Check Password
    bcrypt.compare(password, customer.password).then((isMatch) => {
      console.log(password)
      if (isMatch) {
        // Customer Matched
        const payload = {
          id: customer.id,
          name: customer.first_name,
          email: customer.email,
          wishlist: customer.wishlist
        }; // Create JWT Payload
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
              company: customer.company,
              user_id: customer._id,
              name: customer.first_name,
              last_name: customer.last_name,
              email: customer.email,
              phone: customer.phone,
              wishlist: customer.wishlist,
              address: customer.address_book
            });
          }
        );
      } else {
        console.log("email password doesnt match");
        return res.status(400).json("Invalid credentials");
      }
    });
  });
});

router.post("/update", async (req, res) => {
  console.log("inside /update");
  const customer = await Customer.findById({ _id: req.body.user_id });

  const email = req.body.email;
  const password = req.body.password;
  const errors = {};
  // Find customer by email
  try {
    if (customer) {
      const errors = validate("updateUser", req.body);
      if (!isEmpty(req.body.password)) {
        customer.password = await bcrypt.hash(password, 10);
      }
      if (req.body.updatedImage) {
        let imgObject = await imageUpload(
          req.body.updatedImage,
          "/assets/images/customer/"
        );
        if (imgObject.success === false) {
          throw putError(imgObject.message);
        } else {
          imageUnlink(customer.image);
          customer.image = imgObject.data;
        }
      }
      console.log("inside try");

      customer.first_name = req.body.first_name;
      customer.last_name = req.body.last_name;
      customer.email = req.body.email;
      customer.phone = req.body.phone;
      customer.updated = Date.now();
      let metArra = {};

      for (let i in req.body.meta) {
        metArra[req.body.meta[i].key] = req.body.meta[i];
      }

      for (let i in customer.meta) {
        if (metArra[customer.meta[i].key]) {
          customer.meta[i].value = metArra[customer.meta[i].key].value;
          delete metArra[customer.meta[i].key];
        }
      }

      if (Object.keys(metArra).length) {
        for (let i in metArra) {
          customer.meta.unshift(metArra[i]);
        }
      }

      await customer.save();
      var tatti = await Customer.findById({ _id: req.body.user_id });
      console.log(tatti);
      return res.status(200).send(tatti);
      // await Customer.findById({ _id: req.body.user_id })
    } else {
      return res.status(400).json("Customer not exist");

      console.log("customer not exist");
      throw putError("Customer not exist");
    }
  } catch (error) {
    error = checkError(error);

    return res.status(400).json(error.custom_message);
  }
});

module.exports = router;
