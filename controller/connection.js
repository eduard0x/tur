// let mongo = require('mongodb');
// let MongoClient = mongo.MongoClient;

// var url = "mongodb://localhost:27017/mydb";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
  
//   db.close();
// });

// var url2 = "mongodb://localhost:27017/";

// MongoClient.connect(url2, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
// //   dbo.createCollection("customers", function(err, res) {
// //     if (err) throw err;
// //     console.log("Collection created!");
// //     db.close();
// //   });

//   var myobj = { name: "Company Inc", address: "Highway 37" };
//   dbo.collection("customers").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
  
//   });

//   var myobj = [
//     { name: 'John', address: 'Highway 71'},
//     { name: 'Peter', address: 'Lowstreet 4'},
//     { name: 'Amy', address: 'Apple st 652'},
//     { name: 'Hannah', address: 'Mountain 21'},
//     { name: 'Michael', address: 'Valley 345'},
//     { name: 'Sandy', address: 'Ocean blvd 2'},
//     { name: 'Betty', address: 'Green Grass 1'},
//     { name: 'Richard', address: 'Sky st 331'},
//     { name: 'Susan', address: 'One way 98'},
//     { name: 'Vicky', address: 'Yellow Garden 2'},
//     { name: 'Ben', address: 'Park Lane 38'},
//     { name: 'William', address: 'Central st 954'},
//     { name: 'Chuck', address: 'Main Road 989'},
//     { name: 'Viola', address: 'Sideway 1633'}
//   ];
//   dbo.collection("customers").insertMany(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("Number of documents inserted: " + res.insertedCount);
    
//   });

//   dbo.collection("customers").findOne({}, function(err, result) {
//     if (err) throw err;
//     console.log(result.name);
    
//   });

//   var query = {};
//   dbo.collection("customers").find(query).toArray(function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });
// });