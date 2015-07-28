// Hpai is class
var Hapi = require('hapi');

// Instantiate
var server = new Hapi.Server();

// Configure server connections / host
server.connection({
	host: '0.0.0.0',
	port: 3000,
	routes: {
		cors: {
			headers: ["Access-Control-Allow-Credentials"],
			credentials: true
		}
	}
});

var plugins = [
	// Require MongoDB
	{
		register: require('hapi-mongodb'),
		options:{
			url: "mongodb://127.0.0.1:27017/twitter_clone",
			settings: {
				db: {
					native_parser: false
				}
			}
		}
	}
];

// Print "hello world!" on /hello
// server.route({
// 	method: 'GET',
// 	path: '/hello',
// 	handler: function(request, reply){
// 		reply('hello world!');
// 	}
// });

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