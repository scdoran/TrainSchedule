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
    nextTrain: $("#trainSchedule").children().eq(0).children('tr').children('td:nth-child(1)').eq(0)
  }

  // Used stupidtable.js to sort the trains in ascending order.
  var $table = $("#trainSchedule").stupidtable();
  var $th_to_sort = $table.find("thead th").eq(0);
  $th_to_sort.stupidsort('asc');

  // Displays the name of the next train to arrive.
  $("#nextTrain").text(trainInfo.nextTrain.text());
  console.log(trainInfo.nextTrain);

  database.ref().on("child_added", function(childSnapshot){

        // Setting the first train time is pushed back a year so it comes before the current time.
        firstTrainTime = (childSnapshot.val().firstTrainTime);
        var newFirstTrainTime = moment(firstTrainTime, "HH").subtract(1, "years");

        frequency = (parseInt(childSnapshot.val().frequency));

        // Setting the current time.
        var currentTime = moment();

        // Finding the time difference between the current time and the converted train time in minutes.
        var timeDifference = currentTime.diff(newFirstTrainTime, "minutes");

        // Finding the time remaining by dividing the time difference and the train frequency.
        var timeRemaining = timeDifference % frequency;

        // Setting the number of minutes away by subtracting the time remaining with the frequency.
        trainInfo.minutesAway = frequency - timeRemaining;

        // The next arrival time is set by adding the amount of minutes away to the current time.
        trainInfo.nextArrival = currentTime.add(trainInfo.minutesAway, "minutes").format("hh:mm");


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
        newCell4.attr("data-sort-value", trainInfo.nextArrival);
        newCell4.text(trainInfo.nextArrival);
        newRow.append(newCell4);

        var newCell5 = $("<td>");
        newCell5.attr("data-sort-value", trainInfo.minutesAway);
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
 
