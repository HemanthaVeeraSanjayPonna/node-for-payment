var express = require("express");
var app = express();
const shortid=require("shortid");
var Razorpay=require("razorpay");
var bodyParser = require('body-parser');
require('dotenv').config();

let instance = new Razorpay({
    key_id: process.env.API_VALUES_KEY, // your `KEY_ID`
    key_secret: process.env.API_VALUES_KEY_SECRET // your `KEY_SECRET`
  })
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));


  app.get('/razorpayOrders',(req,res)=>{

    const payment_capture = 1
    const amount = req.query.amount;
    const foodOrTea=(amount=="1200"?true:false);
    const currency = "INR"
    const options={
      amount : (amount*100).toString(),
      currency,
      receipt : shortid.generate(),
      payment_capture
    }

    result={}
    instance.orders.create(options,(err,order)=>{
      if(err){
        result.status=false;
      }else{
        result.status=true;
        result.orderId=order.id;
        result.foodOrTea=foodOrTea;
      }
      res.send(JSON.stringify(result));
    })
  })


    app.post("/verifySignature",(req,res)=>{
      body=req.body.orderId + "|" + req.body.paymentId;
      //console.log(req.body);
      //console.log(req.body.orderId);
      var crypto = require("crypto");
      var expectedSignature = crypto.createHmac('sha256', instance.key_secret)
                                      .update(body.toString())
                                      .digest('hex');
       //console.log("sig"+req.body.signature);
       //console.log("sig"+expectedSignature);
      if(expectedSignature === req.body.signature) {
         res.send(true);
      }else{
        res.send(false);
       } 
          
      });
  
app.listen(process.env.PORT||"8000",()=>{
    console.log("server running on port 8000.")
  });