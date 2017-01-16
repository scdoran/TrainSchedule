// moment().format();

var trainInfo = {
    trainName: "",
    destination: "",
    firstTrainTime: "",
    frequency: "",
    arrival: "",
    nextArrival: "",
    minutesAway: "",
    addRow: function(){
        console.log("Choo Choo!")
        var newRow = $("#trainSchedule").children().eq(1).children("tr").eq(0).children("td");
        newRow.eq(0).text($("#trainName").val().trim());
        newRow.eq(1).text($("#destination").val().trim());
        newRow.eq(2).text(parseInt($("#frequency").val().trim()));
        // arrival.text(moment arrival calc.);
        // minutesAway.text(moment minutes away calc.);
   }

}

$(document).ready(function() {
 // Initialize Firebase
  // var config = {
  //   apiKey: "AIzaSyC--41JiUjnQnGRNfkEgPKK3N4niLiu3eo",
  //   authDomain: "train-schedule-cd917.firebaseapp.com",
  //   databaseURL: "https://train-schedule-cd917.firebaseio.com",
  //   storageBucket: "train-schedule-cd917.appspot.com",
  //   messagingSenderId: "493701823077"
  // };
  // firebase.initializeApp(config);

  $("#submit").on("click", function(){
    event.preventDefault();
    console.log("All Aboard!")
    trainInfo.addRow();
  });

});
 
