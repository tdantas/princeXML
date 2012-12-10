var should = require('should')
var PrinceOptions = require('..').PrinceOptions

describe('Prince Options', function() {
	it('should create a PrinceOptions with all arguments', function() {
		
		var expected = {
			output: "/file/output",
			input: ["/tmp/pdf/input"],
			timeout: 1000,
			baseurl: "http://someurl.com",
			binary: "/usr/local/bin/prince",
      stylesheets: "http://domain/css/abc.css"
		}

		var opt = PrinceOptions(expected)

		should.strictEqual( opt.output, expected.output )
		should.strictEqual( opt.stylesheets, expected.stylesheets )
		should.strictEqual( opt.input, expected.input.join(" ") )
		should.strictEqual( opt.timeout, expected.timeout )
		should.strictEqual( opt.baseurl, expected.baseurl )
		should.strictEqual( opt.binary, expected.binary )
	})

	it('should create a PrinceOptions with generated arguments to output ', function() {
		var opt = PrinceOptions()
		should.exist(opt.output)
	})

	it('should create a PrinceOptions with generated cmd', function() {
		var opt = PrinceOptions()
		opt.output = "output"
		opt.input = "input.html"
		opt.binary = "prince"

		should.strictEqual(opt.cmd, "prince input.html -o output --silent" )

	})

	it('should create a PrinceOptions with generated cmd but outputing to /PDF', function() {
		var opt = PrinceOptions()
		opt.output = "output"
		opt.input = "input.html"
		opt.binary = "prince"

		should.strictEqual(opt.cmd, "prince input.html -o output --silent" )

	})

	it('should create a PrinceOptions with generated cmd but outputing to /tmp', function() {
		var opt = PrinceOptions()
		opt.output = "output"
		opt.binary = "prince"
		opt.input = "input.html"

		should.strictEqual(opt.cmd, "prince input.html -o output --silent" )

	})

	it('Should parse the input array with two arguments as two files to be merged in the same pdf', function() {
		var opt = PrinceOptions()
		opt.output = "output"
		opt.binary = "prince"
		opt.input = [ "input1.html", "input2.html" ]

		should.strictEqual(opt.cmd, "prince input1.html input2.html -o output --silent" )
	})

  it('shoudl have the same output (auto generated) name after and before cmd generation called', function() {
    var opt = PrinceOptions()
    opt.input = ["input1.html"]
    var output = opt.output
    opt.cmd
    should.strictEqual(output, opt.output)
 })

  it('should generate cmd with stylesheets option ', function() {
    var opt = PrinceOptions()
    opt.output = "output"
    opt.input = "input.html"
    opt.binary = "prince"
    opt.stylesheets = "http://style/css/abc.css"

    should.strictEqual(opt.cmd, "prince input.html -o output -s http://style/css/abc.css --silent" )

  })


})
