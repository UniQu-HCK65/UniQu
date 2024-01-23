
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




const handleMidtransWebhook = async (data) => {
    // Implement your logic to update the database with the Midtrans webhook data
    console.log("Received Midtrans Webhook:", data);
  
    // Perform your database update logic here
  };
  



  