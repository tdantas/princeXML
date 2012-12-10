var should = require('should')
var Prince = require('..')

describe('Prince', function(){

	function execHijack(obj, arg) {
		obj["_exec"] = function(callback) {
			callback(arg.err, arg.stdout, arg.sdterr)
    };

    return obj
  }

  it('should emit error when there is no input', function(done) {
    Prince().on("error", function(err) {
     if(err) done()
       else should.fail("error must exist")	
     }).on("success", function(err){
       should.fail("invalid if reach here")
     })
 });

  it('should emit error when the pdf creating fail', function(done) {
    var options = {
     output: "output",
     input: "input.html"
   }

   var prince = Prince(options)
   execHijack(prince, { stdout: "oskapa" } )
   .on("success", function(output) {
    should.exist(output);
    done()
  })
   .on('error', function(err){
     should.fail('not expected be in error event !')
   })

 });

  it('should emit success event when pdf creation finish correctly', function(done) {
   var options = {
    output: "output",
    input: "./fixtures/test.html"
    }
    var prince = Prince(options)
    execHijack(prince, { stdout: "OUT" } )
    .on("success", function(err) {
      done()
    })
    .on('error', function(err){
      should.fail('not expected be in error event !')
    })
  });

});