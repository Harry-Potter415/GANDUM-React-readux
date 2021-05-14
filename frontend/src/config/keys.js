if (process.env.NODE_ENV === "production") {
  module.exports = {
    payPal_ID: "mongodb+srv://userMernEcommerce:passwordMernEcommerce@cluster0-nxt3c.mongodb.net/test?retryWrites=true&w=majority",
  };
} else {
  module.exports = {
    payPal_ID: "Aa7tJgWKi-6yDNEfocy5zyI2Tn2wxvVOcnWBqSesgiL9QKEwDWTX4TXU96_P2z61a9jA-10hTGfa6t4W",
  };
}