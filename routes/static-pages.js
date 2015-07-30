exports.register = function(server, options, next){
	server.route([
		{
      method: 'GET',
      path: '/',
      handler: function(request,reply){
        reply.view("index"); // going to look for templates/index.html
        // reply("hello world") inputs hello world on page /
      }		
		},
    {
      method: 'GET',
      path: '/public/{path*}',
      // /public/application.js
      // /public/custom.css
      handler: {
        directory: {
          path: 'public'
        }
      }
    }
	])

	next();
}

exports.register.attributes = {
	name: 'static-pages-routes',
	version: '0.0.1'
}