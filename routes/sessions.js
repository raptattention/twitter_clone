var Bcrypt = require('bcrypt');
var Auth = require('./auth'); // var Auth = {};

exports.register = function(server, options, next){

  server.route([
    {
      method: 'POST',
      path: "/sessions",
      handler: function(request,reply){
        var db = request.server.plugins['hapi-mongodb'].db;

        var user = request.payload.user;

        db.collection('users').findOne({username: user.username}, function(err, userMongo){
          if (err) {return reply("Internal MongoDB error", err);}

          // 1. stop if user doesn't exist
          if (userMongo === null){
            return reply({userExists: false});
          }

          // 2. check password
          Bcrypt.compare(user.password, userMongo.password,function(err,same){
            if (!same){
              return reply({authorized: false});
            }

            // 3. create new session in the session collection
            var randomKeyGenerator = function() {
              return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
            };

            var session = {
              user_id: userMongo._id,
              session_id: randomKeyGenerator()
            };

            db.collection('sessions').insert(session, function(err, writeResult){
              if (err) {return reply("Internal MongoDB error", err);}

              // 4. Set the same session_id in the CLIENT's cookie
              request.session.set('twitter_clone_session', session);

              reply({authorized: true});
            });
          });

        });
      }
    },
    {
      method: 'DELETE',
      path: '/sessions',
      handler: function(request, reply) {
        var session = request.session.get('twitter_clone_session');
        var db = request.server.plugins['hapi-mongodb'].db;

        if (!session) { 
          return reply({ "message": "Already logged out" });
        }

        db.collection('sessions').remove({ "session_id": session.session_id }, function(err, writeResult) {
          if (err) { return reply('Internal MongoDB error', err); }

          reply(writeResult);
        });
      }
    },
    {
      method: 'GET',
      path: '/authenticated',
      handler: function(request, reply) {
        Auth.authenticated(request, function(result) {
          reply(result);
        });
      }
    }
  ]);

	next();
}

exports.register.attributes = {
  name: 'sessions-routes'
}