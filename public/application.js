$(document).ready(function(){
  $('#signUpSubmit').click(function(){
    event.preventDefault();

    var email = $('#signUp > input[id="signUpEmail"]');
    var name = $('#signUp > input[id="signUpName"]');
    var username = $('#signUp > input[id="signUpUsername"]');
    var password = $('#signUp > input[id="signUpPassword"]');

    $.ajax({
      type: 'POST',
      url: '/users',
      data: {
        user: {
          email: email.val(),
          name: name.val(),
          username: username.val(),
          password: password.val()
        }
      },
      dataType: 'JSON',
      success: function(response){
        console.log(response);
      }
    });
  });

  $('#signInSubmit').click(function(){
    event.preventDefault();

    var username = $('#signIn > input[id="signInUsername"]');
    var password = $('#signIn > input[id="signInPassword"]');

    $.ajax({
      type: 'POST',
      url: '/sessions',
      data: {
        user: {
          username: username.val(),
          password: password.val()
        }
      },
      dataType: 'JSON',
      xhrFields: {
        withCredentials: true
      },
      success: function(response){
        if (response.authenticated) {
          window.location.href = "./posts.html";
        }
      }
    });

    $.ajax({
	  type: "GET",
	  url: "http://localhost:3000/authenticated",
	  xhrFields: {
	    withCredentials: true
	  },
	  success: function(response){
	    console.log("is it", response);
	  }
	});
  });
});