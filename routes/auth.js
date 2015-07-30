module.exports = {};
// module.export === Auth

// Auth.authenticated = ...
module.exports.authenticated = function(request, callback) {
  // 1. retrieve session_id from cookie
  var session = request.session.get('twitter_clone_session');
  var db = request.server.plugins['hapi-mongodb'].db;

  if (!session) {
    return callback({authenticated: false, "message": "Unauthorized" });
  }

  // 2. look into the DB to find matching session)id
  db.collection('sessions').findOne({ "session_id": session.session_id }, function(err, session) {
    // 3. return true/false
    if (!session) {
      return callback({authenticated: false,});
    }
    callback({authenticated: true, user_id: session.user_id});
  });
};