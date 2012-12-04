var Prince = require('../prince')
var PrinceOptions = Prince.PrinceOptions
var opener = require('opener')
var path = require('path')


/*
  Generate the pdf from intener website
  input: the html to be generated
  dir: the directory to save the pdf when finished
  */

var options = PrinceOptions()
 options.input = "http://r42.in"
 options.dir =  path.join( __dirname, "fixtures/pdfs")
 options.baseurl = "http://r42.in"

var prince = Prince(options)

prince.on("success", function(pdf) {
   opener(pdf)
})

prince.on("error", function(err) {
   console.log(err)
})

