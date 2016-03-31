var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//GET markerlist
router.get('/markerlist', function(req, res) { //route: /markerlist
    var db = req.db;
    var collection = db.get('collegelist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

module.exports = router;
