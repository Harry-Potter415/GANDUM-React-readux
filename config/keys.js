/*if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.SECRET_APP_KEY
  };
} else {*/
/* module.exports = {
  //mongoURI: "mongodb+srv://ravendel-local:ravendelpassword@ravendel-local.gcmvx.gcp.mongodb.net/ravendel-local?retryWrites=true&w=majority",
  mongoURI: "mongodb+srv://userMernEcommerce:passwordMernEcommerce@cluster0-nxt3c.mongodb.net/test?retryWrites=true&w=majority",
  jwtSecret: "Theziner"
}; */
/*}*/
// mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority
if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: "mongodb+srv://userMernEcommerce:passwordMernEcommerce@cluster0-nxt3c.mongodb.net/test?retryWrites=true&w=majority",
    jwtSecret: "Theziner",
  };
} else {
  module.exports = {
    mongoURI: "mongodb://localhost:27017/gandum",
    // mongoURI: "mongodb+srv://gandom:gandom123@cluster0.xqylb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",

    jwtSecret: "Theziner",
  };
}
