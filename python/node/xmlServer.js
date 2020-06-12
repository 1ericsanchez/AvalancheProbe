var express = require('express');
var CORS = require('cors');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var xml2js = require('xml2js');
var app = express();

app.set('port', 3380);
app.use(CORS());



app.get('/',function(req,res){
  var xml =  
  parseString(xml, function (err, result) {
  console.log(result);
  var parser = new xml2js.Parser();
  fs.readFile( '25069.xml', function(err, data){
  parser.parseString(data, function (err, result) {
    console.dir(result);
    console.log('Done');
    res.send(result);
  });
});
}); 
});

app.listen(app.get('port'), function(){
  console.log("Express started on flip3.engr.oregonstate.edu:" + app.get('port') + '; pres Ctrl-C to terminate.');
});
