$(document).ready(function(){
  var getAllTweets = function(){
    $.ajax({
      type: 'GET',
      url: '/tweets',
      success: function(response){
        var html = '';

        response.reverse().forEach(function (tweet) {
          html += '<div class="list-group">';
          html +=   '<a href="#" class="list-group-item">';
          html +=     '<h3 class="list-group-item-heading">';
          html +=       tweet.message;
          html +=     '</h3>';
          html +=     '<p class="list-group-item-text"> by '
          html +=       tweet.user_id;
          html +=     '</p>';
          html +=   '</a>';
          html += '</div>';
        });

        $('#tweets').html(html);
      },
      error: function(xhr, status, error){
        console.log(xhr.responseText);
      }
    });
  };

  getAllTweets();

  $('#submitTweet').click(function(){
    event.preventDefault();

    $.ajax({
      type: 'POST',
      url: '/tweets',
      data: {
        tweet: {
          message: $('#tweet input[name="message"]').val()
        }
      },
      dataType: 'JSON',
      xhrFields: {
        withCredentials: true
      },
      success: function(response){
        console.log(response);
        getAllTweets();
      },
      error: function(xhr, status, error){
        console.log(xhr.responseText);
      }
    })
  });
});