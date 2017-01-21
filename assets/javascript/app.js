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
    minutesAway: ""
  }

  database.ref().on("child_added", function(childSnapshot){
        
        console.log(childSnapshot.val().trainName);
        console.log(childSnapshot.val().destination);
        console.log(childSnapshot.val().frequency);
        console.log(childSnapshot.val().firstTrainTime);

        firstTrainTime = (childSnapshot.val().firstTrainTime);

        var arrivalTime = moment(firstTrainTime, "H HH").format("X");
        var currentTime = moment();

        var timeDifference = moment().diff(moment(arrivalTime), "minutes");
        var timeRemaining = timeDifference % frequency;

        trainInfo.minutesAway = frequency - timeRemaining;
        trainInfo.nextArrival = moment().add(trainInfo.minutesAway, "minutes");

        var newRow = $("<tr class='newRow'>");

        var newCell1 = $("<td>");
        newCell1.text(childSnapshot.val().trainName);
        newRow.append(newCell1);

        var newCell2 = $("<td>");
        newCell2.text(childSnapshot.val().destination)
        newRow.append(newCell2);

        var newCell3 = $("<td>");
        newCell3.text(childSnapshot.val().frequency);
        newRow.append(newCell3);

        var newCell4 = $("<td>");
        newCell4.text(trainInfo.nextArrival);
        newRow.append(newCell4);

        var newCell5 = $("<td>");
        newCell5.text(trainInfo.minutesAway);
        newRow.append(newCell5);
      
        $("#trainSchedule").children().eq(0).append(newRow);

      }, function(errorObject) {
        console.log("Failed: " + errorObject.code);
  });

  $("#submit").on("click", function(){
    event.preventDefault();
    
    trainInfo.trainName = $("#trainName").val().trim();
    trainInfo.destination = $("#destination").val().trim();
    trainInfo.firstTrainTime = $("#time").val().trim();
    trainInfo.frequency = parseInt($("#frequency").val().trim());

    database.ref().push({
      trainName: trainInfo.trainName,
      destination: trainInfo.destination,
      frequency: trainInfo.frequency,
      firstTrainTime: trainInfo.firstTrainTime,
    });
    
    $("#trainName").val("");
    $("#frequency").val("");
    $("#destination").val("");
    $("#time").val("");

  });

});
 
