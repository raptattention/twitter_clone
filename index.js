// Hapi is class
var Hapi = require('hapi');
var Path = require('path');

// Instantiate
var server = new Hapi.Server();

// Configure server connections / host
server.connection({
	host: '0.0.0.0',
	port: process.env.PORT || 3000,
	routes: {
		cors: {
			headers: ["Access-Control-Allow-Credentials"],
			credentials: true
		}
	}
});

server.views({
  engines: {
    html: require('handlebars')
  },
  path: Path.join(__dirname, "templates") // Users/lilialaw/GA/twitter_clone/templates
})

var plugins = [
  { register: require('./routes/static-pages.js')},
	{ register: require('./routes/users.js')},
  { register: require('./routes/sessions.js')},
  { register: require('./routes/tweets.js')},
  {
    register: require('yar'),
    options: {
      cookieOptions: {
        password: 'asdfasdfasdg',
        isSecure: false // we are not going to https, yet, for development
      }
    }
  },
	// Require MongoDB
	{
		register: require('hapi-mongodb'),
		options:{
			url: process.env.MONGOLAB_URI || "mongodb://127.0.0.1:27017/twitter_clone",
			settings: {
				db: {
					native_parser: false
				}
			}
		}
	}
];

// Start server
server.register(plugins, function(err){
	// check error
	if (err){
		throw err;
	}

	// start server
	server.start(function(){
		console.log("info", "Server running at: "+server.info.uri);
	})
});