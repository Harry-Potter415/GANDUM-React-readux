const Customer = require("../models/Customer");
const {
  isEmpty,
  putError,
  checkError,
  imageUpload,
  imageUnlink,
  checkToken,
} = require("../config/helpers");
const validate = require("../validations/customer");
const bcrypt = require("bcryptjs");

module.exports = {
  Query: {
    customers: async (root, args) => {
      console.log("inside customer query");
      try {
        const customers = await Customer.find({});
        return customers || [];
      } catch (error) {
        throw new Error("Something went wrong.");
      }
    },
    customer: async (root, args) => {
      try {
        const customer = await Customer.findById(args.id);
        if (!customer) {
          throw putError("User not found");
        }
        return customer;
      } catch (error) {
        error = checkError(error);
        throw new Error(error.custom_message);
      }
    },
  },
  Mutation: {
    addCustomer: async (root, args, { id }) => {
      checkToken(id);
      try {
        // Check Validation
        const errors = validate("addCustomer", args);
        if (!isEmpty(errors)) {
          throw putError(errors);
        }

        const customer = await Customer.findOne({ email: args.email });

        if (customer) {
          throw putError("Email already exist.");
        } else {
          const newCustomer = new Customer({
            first_name: args.first_name,
            last_name: args.last_name,
            email: args.email,
            company: args.company || "",
            phone: args.phone || "",
          });

          newCustomer.password = await bcrypt.hash(args.password, 10);
          const user = await newCustomer.save();
          //return user;
          return await Customer.find({});
        }
      } catch (error) {
        error = checkError(error);
        throw new Error(error.custom_message);
      }
    },
    updateCustomer: async (root, args, { id }) => {
      checkToken(id);
      try {
        const customer = await Customer.findById({ _id: args.id });
        if (customer) {
          // Check Validation
          const errors = validate("updateCustomer", args);
          if (!isEmpty(errors)) {
            throw putError(errors);
          }

          if (!isEmpty(args.password)) {
            customer.password = await bcrypt.hash(args.password, 10);
          }

          customer.first_name = args.first_name;
          customer.last_name = args.last_name;
          customer.email = args.email;
          customer.company = args.company;
          customer.phone = args.phone;
          //customer.address_book = args.address_book;
          customer.updated = Date.now();

          await customer.save();
          return await Customer.find({});
        } else {
          throw putError("Customer not exist");
        }
      } catch (error) {
        error = checkError(error);
        throw new Error(error.custom_message);
      }
    },
    deleteCustomer: async (root, args, { id }) => {
      checkToken(id);
      try {
        const customer = await Customer.findByIdAndRemove(args.id);
        if (customer) {
          const customers = await Customer.find({});
          return customers || [];
        }
        throw putError("customer not exist");
      } catch (error) {
        error = checkError(error);
        throw new Error(error.custom_message);
      }
    },
    addAddressBook: async (root, args, { id }) => {
      // checkToken(id);
      try {
        // Check Validation
        const errors = validate("addAddressBook", args);
        if (!isEmpty(errors)) {
          throw putError(errors);
        }

        const customer = await Customer.findById({ _id: args.id });

        if (!customer) {
          throw putError("Something went wrong.");
        }

        if (args.default_address) {
          for (let i in customer.address_book) {
            if (customer.address_book[i].default_address) {
              customer.address_book[i].default_address = false;
            }
          }
        }

        delete args.id;
        customer.address_book.push(args);
        customer.updated = Date.now();

        await customer.save();
        return await Customer.find({});
      } catch (error) {
        error = checkError(error);
        throw new Error(error.custom_message);
      }
    },
    updateAddressBook: async (root, args, { id }) => {
      console.log("inside updateAddressBook");
      try {
        // Check Validation
        const errors = validate("updateAddressBook", args);
        if (!isEmpty(errors)) {
          throw putError(errors);
        }

        const customer = await Customer.findById({ _id: args.id });

        if (!customer) {
          throw putError("Something went wrong.");
        }
        console.log("here comes", args.default_address);
        delete args.id;
        customer.address_book = customer.address_book.map((address) => {
          if (args.default_address) {
            address.default_address = false;
          }

          if (address._id == args._id) {
            address = args;
          }
          return address;
        });

        customer.updated = Date.now();
        await customer.save();
        return await Customer.find({});
      } catch (error) {
        error = checkError(error);
        throw new Error(error.custom_message);
      }
    },
    deleteAddressBook: async (root, args, { id }) => {
      checkToken(id);
      try {
        const customer = await Customer.findById({ _id: args.id });

        if (!customer) {
          throw putError("Something went wrong.");
        }

        var customer_address_book = customer.address_book;

        for (let i in customer_address_book) {
          if (customer_address_book[i]._id == args._id) {
            customer.address_book = [];
            delete customer_address_book[i];
            customer.address_book = customer_address_book;
            break;
          }
        }

        await customer.save();
        return await Customer.find({});
      } catch (error) {
        error = checkError(error);
        throw new Error(error.custom_message);
      }
    },
    changeWishlist: async (root, args, { id }) => {
      // console.log("inside changeWishlist");
      checkToken(args.id);
      try {
        const customer = await Customer.findById({ _id: args.id });
        if (customer) {
          // Check Validation
          let wishlist = customer.wishlist;
          let index = 0;

          for (index = wishlist.length - 1; index >= 0; index--) {
            if(wishlist[index] === args.wishlist) break;
          }

          if(index < 0){
            wishlist.push(args.wishlist);
          } else {
            wishlist.splice(index, 1);
          }
          customer.wishlist = wishlist;

          customer.updated = Date.now();

          await customer.save();
          return customer;
        } else {
          throw putError("Customer not exist");
        }
      } catch (error) {
        error = checkError(error);
        throw new Error(error.custom_message);
      }
    },
  },
};
