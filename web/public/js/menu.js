(function($) {
  $('.past').hide();
  $("#past")
    .on(
      'click',
      function(e) {
        $('.past').show();
        $('.future').hide();
      }
    )
    $("#future")
      .on(
        'click',
        function(e) {
          $('.past').hide();
          $('.future').show();
        }
      )
})($)
