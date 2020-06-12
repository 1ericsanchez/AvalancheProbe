let getXMLFile = function(path, callback){
  let request = new XMLHttpRequest();
  request.open("GET", path);
  request.setRequestHeader("Content-TYpe", "text/xml");
  request.onReadstatechange = function() {
    if(request.readyState === 4 && request.status === 200){
      callback(request.responseXML);
    }
  };
  request.send();
};

getXMLFile("http://www-db.deis.unibo.it/courses/TW/DOCS/w3schools/xml/note.xml", function(xml){

  console.log(xml);
});
