var exec = require('child_process').exec
  , path = require('path')
  , events = require('events')
  , util =  require('util')
  , fs   = require("fs")
  , exists = fs.existsSync || path.existsSync
  , uuid = require('node-uuid')

util.inherits(Prince, events.EventEmitter)

module.exports = Prince
module.exports.PrinceOptions = PrinceOptions

/*
  On module start-up find in the path for prince binary

*/
var princeBinaryAutoDiscovered = autoDiscovery("prince")

/*
  Prince Constructor
*/

function Prince(options,  fn) {
  if (!(this instanceof Prince)) return new Prince(options, fn);
  events.EventEmitter.call(this);
  
  if( typeof options == 'function' ) {
    fn = options
    options = {}
  }
  
  if(options instanceof PrinceOptions) this.options = options
  else this.options = PrinceOptions(options)

  if( typeof fn === 'function' ) this.on('success', fn )
  process.nextTick(function(){ this.pdf() }.bind(this))  

}

Prince.prototype.pdf = function() {
  var emit = this.emit.bind(this)
    , that = this

  this._exec(function (error, stdout, stderr) {
    if ( error ) return emit( "error", error )
    emit("success",  that.options.output );
  })
}

Prince.prototype._exec = function(callback) {
  try {
    exec(this.options.cmd, { timeout: this.options.timeout }, callback)
  } catch(exception) {
    callback(exception)
  }
}

/*
 Prince Options Constructor
  {options}
*/

function PrinceOptions(options){
  if (!(this instanceof PrinceOptions)) return new PrinceOptions(options);
  options = options ||  {}
  this.attributes(options)
} 

/*
  Instance Options Properties
*/

PrinceOptions.prototype = {

  set output(file) { this._output = file  },
  get output() { 
    this._output = this._output ||  [ uuid.v4(), "pdf" ].join(".")
    return this._output
  },

  set input(path) { this._input =  Array.isArray(path) ? path.join(" ") : path },
  get input() { 
    if (!this._input ) throw new Error("Missing input files to be generated")
    return this._input
  },
  
  set timeout(ms) { this._timeout = ms || 10000 },
  get timeout() { return this._timeout },

  set baseurl(base_url) { this._baseurl = base_url },
  get baseurl() { return this._baseurl },

  set binary(bin) { this._bin = bin  },
  get binary() { 
    var bin = this._bin || princeBinaryAutoDiscovered 
    if( !bin ) throw new Error("Prince not find in your PATH")
    return bin
  },

  set stylesheets(css) { this._ss = css},
  get stylesheets() { return this._ss},

  get cmd() { return buildCmd(this).trim() }
}

function buildCmd(options) {
  var result = [ options.binary, options.input,
            [ "-s", options.styleSheets],
            [ "-o" , options.output],
            [ "--baseurl" , options.baseurl ],
            [ "-s" , options.stylesheets ],
            "--silent" 
          ].reduce(concat, "")

    function concat(acc, value) {
      if( Array.isArray(value) ) {
        var invalid = value.some( function(ele){ return ele === undefined || ele === "" || ele === null } )
        if (invalid) return acc
        else return [acc ,value.join(" ")].join(" ")
      }
      return [acc, value].join(" ")
    } 
  return result
}

/*
  Will try to find in the system path the prince binary
*/

function autoDiscovery(name) {
  var paths  = possiblePrincePaths(name)
  for (var i = 0, len = paths.length; i < len; ++i ) {
    if (exists(paths[i])) return paths[i];
  }
}

/*
  Generate possible prince paths
*/

function possiblePrincePaths(name){
  var systemPath = process.env.PATH.split(':');
  return systemPath.map( function(item) {  return path.join(item,name) } )
}

/*
  {options} Attributes
*/

PrinceOptions.prototype.attributes = function(opt) {
  for( var i in opt ) {
      this[i]=  opt[i]
  }
}