// moment().format();

$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC--41JiUjnQnGRNfkEgPKK3N4niLiu3eo",
    authDomain: "train-schedule-cd917.firebaseapp.com",
    databaseURL: "https://train-schedule-cd917.firebaseio.com",
    storageBucket: "train-schedule-cd917.appspot.com",
    messagingSenderId: "493701823077"
  };

  firebase.initializeApp(config);

  database = firebase.database();

  var trainInfo = {
    trainName: "",
    destination: "",
    firstTrainTime: "",
    frequency: "",
    nextArrival: "",
    minutesAway: "",
    addRow: function(){

      trainInfo.trainName = $("#trainName").val().trim();
      trainInfo.destination = $("#destination").val().trim();
      trainInfo.firstTrainTime = $("#time").val().trim();
      trainInfo.frequency = parseInt($("#frequency").val().trim());

      database.ref().set({
      trainName: trainInfo.trainName,
      destination: trainInfo.destination,
      frequency: trainInfo.frequency,
      firstTrainTime: trainInfo.firstTrainTime,
      // nextArrival: moment().format(trainInfo.firstTrainTime + trainInfo.frequency),
      // minutesAway: moment().format(current time - (trainInfo.firstTrainTime + trainInfo.frequency))
      });

      database.ref().on("value", function(snapshot){
        console.log(snapshot.val().trainName);
        console.log(snapshot.val().destination);
        console.log(snapshot.val().frequency);
        console.log(snapshot.val().firstTrainTime);

      var newRow = $("<tr class='newRow'>");

      var newCell1 = $("<td>");
      newCell1.text(snapshot.val().trainName);
      newRow.append(newCell1);

      var newCell2 = $("<td>");
      newCell2.text(snapshot.val().destination)
      newRow.append(newCell2);

      var newCell3 = $("<td>");
      newCell3.text(snapshot.val().firstTrainTime);
      newRow.append(newCell3);

      var newCell4 = $("<td>");
      newCell4.text(snapshot.val().frequency);
      newRow.append(newCell4);

      // var newCell5 = $("<td>");
      // newCell5.text(moment().format(firstTrainTime + frequency));
      // newRow.append(newCell5);
      
      $("#trainSchedule").children().eq(0).append(newRow);

      }, function(errorObject) {
        console.log("Failed: " + errorObject.code);
      });

    }
  }

  $("#submit").on("click", function(){
    event.preventDefault();
    trainInfo.addRow();
  });

});
 
