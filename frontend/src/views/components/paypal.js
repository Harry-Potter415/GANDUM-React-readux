import React, { Component } from "react";
import { PayPalButton } from "react-paypal-button-v2";

export default class PayPal extends Component {
  render() {
    return (
      <PayPalButton
        amount="0.01"
        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
        onSuccess={(details, data) => {
          alert("Transaction completed by " + details.payer.name.given_name);

          // OPTIONAL: Call your server to save the transaction
          return fetch("/paypal-transaction-complete", {
            method: "post",
            body: JSON.stringify({
              orderID: data.orderID
            })
          });
        }}
        options={{
          clientId: "Aa7tJgWKi-6yDNEfocy5zyI2Tn2wxvVOcnWBqSesgiL9QKEwDWTX4TXU96_P2z61a9jA-10hTGfa6t4W"
        }}
      />
    );
  }
}