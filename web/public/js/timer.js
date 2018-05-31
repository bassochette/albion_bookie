(function(){
  setInterval(
    function() {
      var currentDate = moment()

      Array.from(document.getElementsByClassName('timer'))
        .forEach(
          function(element) {
            var startDate = moment(element.getAttribute('data-time').toString())

            element.innerHTML = currentDate.to(startDate)
          }
        )
    },
    900
  )
})()
