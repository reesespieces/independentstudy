//Checking to see if this project is being pushed to the correct repository

var express = require('express');
var stormpath = require('express-stormpath'); //REQUIRE STORMPATH
var router = express.Router();

var MongoClient = require('mongodb').MongoClient; //CLIENT CONNECTS TO THE DB AND MAKES REQUESTS
var assert = require('assert'); //CHECKS THE VALUE AND IF TRUE, CONTINUES IN THE PROGRAM, IF NOT, THE PROGRAM QUITS
var ObjectId = require('mongodb').ObjectID; //ID GENERATOR?
var url = 'mongodb://localhost:27017/gwcfinal'; //IDENTIFIES THE MONGO DB
var bodyParser = require('body-parser'); //PARSES THE BODY OF THE HTTP REQUEST OBJECT -- CONVERT TO JSON OBJECT

//NOW NEED TO ADD USER TO THE DADABASE RECORD. GET ROUTE TO GET THOSE
//finding route and submitting to database (just defining function here)
function insertDocument(db, record, callback) { //FUNCTION DEFINITION TAKES A DB, A RECORD, AND A CALLBACK FUNCTION
  //THE DB COLLECTION = ITINERARY
  //INSERT ANY TYPE OF RECORD THAT WE GIVE IT, EXCEPT WE ARE GIVING IT A FORM
   db.collection('itinerary').insertOne(record, //INSERTS THE RECORD
    //HARDCODING THE COLLECTION NAME AND TAKES TWO PARAMETERS
   //INSERTONE IS A FUNCTION THAT TAKES TWO PARAMETERS: RECORD AND AN ANONYMOUS FUNCTION
   function(err, result) { //TWO PARAMETERS: ERR AND RESULT. EITHER YOU'RE GOING TO GET AN ERROR OR YOU'RE GOING TO GET A RESULT
   //THE ERROR ASSESSES WHETHER THERE IS A SECURE CONNECTION TO THE DB, IF THE PARAMENTS MATCH UP, ETC.
    assert.equal(err, null); //ASSERTING THAT IF IF THE ERROR IS NOT NULL, THE PROGRAM STOPS. IF THE ERROR IS NULL THEN THE PROGRAM CONTINUES
    console.log("Inserted a document into the itinerary collection."); //IF THE ASSERT PASSES, THEN THE CONSOLE.LOG LOGS THIS STATEMENT
    callback(result); //THE FUNCTION WANTS TO KNOW IF IT SUCEEDS -- LIKE A SUCCESS MESSAGE
    //EXECUTES THE ANONYMOUS FUNCTION THAT CLOSES THE DB (IT'S WITHIN THE ROUTER.POST 'INTINERARY' BLOCK)
  });
};

//getting info from the database
router.get('/itinerary', stormpath.loginRequired, function(req, res) { //RETURN JSON OF INTINERARIES
   var db = req.dbgwc; //ADDS THIS DB TO ALL THE INCOMING REQUEST OBJECTS
   var collection = db.get('itinerary');
   collection.find({ "email": req.user.email }, {sort: {"date":1}},function(e,docs){ //GRABS THE COLLECTION
       res.json(docs);
       //THIS IS ROOM FOR POTENTIAL CODE LIKE SORTING BY DATE
   });
});

//posting info to the databse
router.post('/itinerary', function(req, res){
  //console.log(req.body);
  //res.send(req.body)
  //req.body['fullName'] = req.user.fullName;
  req.body['email'] = req.user.email; //INSERTING THE EMAIL INTO THE FIELDS THAT ARE COLLECTED
  req.body['username'] = req.user.username;
  console.log(req.body);
   MongoClient.connect(url, function(err, db) { //MONGO CLIENT IS CONNECTING TO THE URL -- TWO POSSIBLE OUTCOMES: ERROR OR THE DB
    assert.equal(null, err); //ERROR MUST BE NULL FOR THE PROGRAM TO CONTINUE
    insertDocument(db, req.body, function(result) { //CALLING ON THE INSERTDOCUMENT FUNCTION WE DEFINED BEFORE
      //RECORD IS CALLED REQ.BODY IN THE LINE ABOVE
        db.close(); //CLOSE CONNECTION WITH THE DB
        console.log("DB Result :", result); //LOGGING IT!
        //ALL THE CODE IN THIS ANNONYMOUS FUNCTION IS THE CALLBACK IN THE INSERTDOCUMENT FUNCTION
        res.send('');
    });
})
});

/*
//getting info from the database
router.get('/submit', function(req, res) { //RETURN JSON OF INTINERARIES
   var db = req.db; //ADDS THIS DB TO ALL THE INCOMING REQUEST OBJECTS
   var collection = db.get('collegelist');
});

router.post('/submit', function(req, res){
  var url = 'mongodb://localhost:27017/maptest'; //IDENTIFIES THE MONGO DB

  function insertDocument(db, record, callback) {
     db.collection('collegelist').insertOne(record,
     function(err, result) {

      assert.equal(err, null);
      console.log("Inserted a document into the itinerary collection.");
      callback(result);
    });
  };

});
*/
//****** Type curl -d '{"MyKey":"Me"}' -H "Content-Type: application/json" http://127.0.0.1:3000/itinerary into terminal. ****//

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express'}); //, givenName: req.user.givenName
});

/* GET about us page. */
router.get('/aboutUs', function(req, res, next) {
  res.render('aboutUs', { title: 'Express'}); //, givenName: req.user.givenName
});

//ROUTE TO THE SEARCH JADE
router.get('/search', stormpath.loginRequired, function(req, res) { //MUST BE LOGGED IN TO SEARCH
 res.render('search', { username: req.user.givenName });
});

router.get('/home2', stormpath.loginRequired, function(req, res) { //MUST BE LOGGED IN TO GO TO HOME2
 res.render('home2', { username: req.user.givenName });
});

router.get('/profile', stormpath.loginRequired, function(req, res) { //MUST BE LOGGED IN TO VIEW THE PROFILE
 res.render('profile', { username: req.user.email });
});

module.exports = router;






//MY ATTEMPT AT INSERTING STUFF INTO THE DATABASE BASED ON THE FUNCTIONS ABOVE...
//getting info from the database
/*router.get('/submit', function(req, res) { //RETURN JSON OF INTINERARIES
   var datab = req.db; //ADDS THIS DB TO ALL THE INCOMING REQUEST OBJECTS
   var collection = datab.get('collegelist');
});


router.post('/submit', function(req, res) {
    req.body['name'] = req.body.name;
    console.log("Submit req.body: " + req.body);
    MongoClient.connect(url, function(err, db) { //MONGO CLIENT IS CONNECTING TO THE URL -- TWO POSSIBLE OUTCOMES: ERROR OR THE DB
     assert.equal(null, err); //ERROR MUST BE NULL FOR THE PROGRAM TO CONTINUE
     insertDocument(db, req.body, function(result) { //CALLING ON THE INSERTDOCUMENT FUNCTION WE DEFINED BEFORE
       //RECORD IS CALLED REQ.BODY IN THE LINE ABOVE
         db.close(); //CLOSE CONNECTION WITH THE DB
         console.log("DB Result :", result); //LOGGING IT!
         //ALL THE CODE IN THIS ANNONYMOUS FUNCTION IS THE CALLBACK IN THE INSERTDOCUMENT FUNCTION
         res.send('');
     });
   })
});
*/

//EXAMPLE OF INSERTING A DOCUMENT INTO A MONGODB LOCALLY (ANSWER FROM MY Q ON STACKOVERFLOW)
/*
var router = express.Router();
MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server;

var mongoclient = new MongoClient(new Server("localhost", 27017));
var db = mongoclient.db('db');

 router.post('/submit', function(req, res){
   //Retrieve data sent by the client in the post request
   var name = req.body.name;
   // Insert document in collection
   db.collection('collegelist').insert({ name: name}, function(err, doc) {

    if(err) throw err;
    //Doc saved
   });
 });
*/

//MONGODB EXAMPLE FOR INSERTING A DOCUMENT INTO A MONGO DB:
/*
 var MongoClient = require('mongodb').MongoClient;
 var assert = require('assert');
 var ObjectId = require('mongodb').ObjectID;
 var url = 'mongodb://localhost:27017/test';

 var insertDocument = function(db, callback) {
   db.collection('restaurants').insertOne( {
      "address" : {
         "street" : "2 Avenue",
         "zipcode" : "10075",
         "building" : "1480",
         "coord" : [ -73.9557413, 40.7720266 ]
      },
      "borough" : "Manhattan",
      "cuisine" : "Italian",
      "grades" : [
         {
            "date" : new Date("2014-10-01T00:00:00Z"),
            "grade" : "A",
            "score" : 11
         },
         {
            "date" : new Date("2014-01-16T00:00:00Z"),
            "grade" : "B",
            "score" : 17
         }
      ],
      "name" : "Vella",
      "restaurant_id" : "41704620"
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback();
  });
};





router.post('/submit', function(req, res){
  /*var MongoClient = require('mongodb').MongoClient;
  var assert = require('assert');
  var ObjectId = require('mongodb').ObjectID;
  var url = 'mongodb://localhost:27017/maptest'; //'mongodb://dbuser2:sillydoo@ds059195.mlab.com:59195/heroku_vmz14q76';
*/
  //var insertDocument = function(db, callback) {
/*  var db = req.db;
  console.log("Attempting to insert");
  console.log("Testing 1...");
  console.log(db);
  console.log("Testing2 ...");
  console.log(db.get('collegelist'));
    db.get('collegelist').insertOne( {
       "name" : req.body.name,
       "latitude": req.body.latitude,
       "longitude": -req.body.longitude,
       "description": req.body.description,
       "dates" : {
         "date": req.body.date,
            "times": [
              req.body.times
            ]
        },
        "url": req.body.url,
        "availableSpots": req.body.availableSpots
  }, function(err, result) {
    console.log(err);
     assert.equal(err, null);
     console.log("Inserted a document into the restaurants collection.");
     res.redirect('/');
   });
   console.log("Insertion attempt underway");
  //};
});
*/
