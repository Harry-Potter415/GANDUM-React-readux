const Newsletter = require("../models/Newsletter");
const {
  isEmpty,
  putError,
  checkError,
} = require("../config/helpers");

module.exports = {
  Query: {
    newsletters: async (root, args) => {
      try {
        const newsletter = await Newsletter.find({});
        console.log(newsletter)
        return newsletter || [];
      } catch (error) {
        throw new Error("Something went wrong.");
      }
    },
  },
  Mutation: {
    addNewsletter: async (root, args) => {
        console.log(args.email)
      try {

        const news = await Newsletter.findOne({ email: args.email });
        if (news) {
          throw putError(
            "This email already exists."
          );
        }

        const newNewsletter = new Newsletter({
          email: args.email,
          status: "approved"
        });
        await newNewsletter.save();
        return await Newsletter.find({});
      } catch (error) {
        error = checkError(error);
        console.log(error)
        throw new Error(error.custom_message);
      }
    }
  },
};
