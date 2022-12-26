const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
var path = require("path");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  var location = __dirname + "/signup.html";
  res.sendFile(path.join(location));
})
app.post("/failure", function(req, res){
  res.redirect("/");
})
app.post("/", function(req, res){
  const firstName = req.body.Fname;
  const lastName = req.body.Lname;
  const email = req.body.email;

  const  data = {
    members : [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME : firstName,
          LNAME : lastName
        }
      }
    ]

  }

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/b67328dd2a" ;

  const options = {
    method: "POST",
    auth : "roshan1:a064cbe8119845381b14a3a2bee3f2c8-us21"
  }
  const request = https.request(url, options, function(response){
    response.on("data", function(data){
      var error = JSON.parse(data).errors;
      if(error.length === 0){
        res.sendFile(__dirname+"/success.html");
      }else{
        res.sendFile(__dirname+"/failure.html");
      }
    })
  })
  request.write(jsonData);
  request.end();


})


app.listen(process.env.PORT || 3000, function(req, res){
  console.log("Server is running at port 3000");
})

// API KEY
// a064cbe8119845381b14a3a2bee3f2c8-us21

// List ID
//b67328dd2a
