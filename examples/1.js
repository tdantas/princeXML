var Prince = require('../prince')
var opener = require('opener')
var path = require('path')


/*
  Generate PDF from fixtures/1.html 

  input: the html to be generated
  dir: the directory to save the pdf when finished
*/
Prince( { input:  path.join(__dirname , "fixtures/1.html" ), dir: path.join( __dirname, "fixtures/pdfs" }, function(pdf) {
	opener(pdf)
}).on("error", function(err) {
	console.log(err)
})

