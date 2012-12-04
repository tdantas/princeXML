var Prince = require('../prince')
var PrinceOptions = Prince.PrinceOptions
var opener = require('opener')
var path = require('path')


/*
  Generate and Merge PDF from fixtures/1.html and fixtures/2.html 

  input: the html to be generated
  dir: the directory to save the pdf when finished
  */

var options = PrinceOptions()
options.input = [ path.join(__dirname , "fixtures/1.html" ), path.join(__dirname , "fixtures/2.html" ) ]
options.dir =  path.join( __dirname, "fixtures/pdfs")

var prince = Prince(options)

prince.on("success", function(pdf) {
  opener(pdf)
})

prince.on("error", function(err) {
  console.log(err)
})

