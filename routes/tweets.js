var Joi = require('joi');
var Auth = require('./auth');

exports.register = function(server, options, next){
  
  server.route([
    // GET all tweets
    {
      method: 'GET',
      path: "/tweets",
      handler: function(request, reply){
        var db = request.server.plugins['hapi-mongodb'].db;

        db.collection('tweets').find().toArray(function(err,tweets){
          if (err) {return reply('Internal MongoDB error', err);}

          reply(tweets);
        })
      }
    },
    // GET one tweet
    {
      method: 'GET',
      path: "/tweets/{id}",
      handler: function(request, reply){
        var tweetID = encodeURIComponent(request.params.id);
        var db = request.server.plugins['hapi-mongodb'].db;
        var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

        db.collection('tweets').findOne({"_id": ObjectId(tweetID)}, function(err,tweet){
          if (err) {return reply('Internal MongoDB error', err);}

          reply(tweet);
        });
      }
    },
    // POST a tweet
    {
      method: 'POST',
      path: '/tweets',
      config: {
        handler: function(request, reply){
          Auth.authenticated(request, function(result){
            if (result.authenticated) {
              var db = request.server.plugins['hapi-mongodb'].db;

              var tweet = {
                "message": request.payload.tweet.message,
                // "date": new Date(), do when we have the frontend
                "user_id": result.user_id
              };

              db.collection('tweets').insert(tweet, function(err,writeResult){
                if (err) {return reply('Internal MongoDB error', err);}

                reply(writeResult);
              });

            } else {
              reply(result.message);
            }
          })
        },
        validate: {
          payload: {
            tweet: {
              message: Joi.string().min(1).max(140).required()
            }
          }
        }
      }
    }
  ]);

	next();
}

exports.register.attributes = {
  name: 'tweets-routes',
  version: '0.0.1'
}