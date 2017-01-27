// Heroku Link: https://vast-oasis-26237.herokuapp.com/

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
  }

  // Used stupidtable.js to sort the trains in ascending order.
  $("table").stupidtable();

// When a new "child" is added to the database...
  var newData = database.ref().on("child_added", function(childSnapshot){

        // Setting the first train time is pushed back a year so it comes before the current time.
        firstTrainTime = (childSnapshot.val().firstTrainTime);
        var newFirstTrainTime = moment(firstTrainTime, "HH").subtract(1, "years");

        frequency = parseInt(childSnapshot.val().frequency);

        // Setting the current time.
        var currentTime = moment();

        // Finding the time difference between the current time and the converted train time in minutes.
        var timeDifference = currentTime.diff(newFirstTrainTime, "minutes");

        // Finding the time remaining by dividing the time difference and the train frequency.
        var timeRemaining = parseInt(timeDifference % frequency);

        // Setting the number of minutes away by subtracting the time remaining with the frequency.
        trainInfo.minutesAway = parseInt(frequency - timeRemaining);

        // The next arrival time is set by adding the amount of minutes away to the current time.
        trainInfo.nextArrival = currentTime.add(trainInfo.minutesAway, "minutes").format("hh:mm");

        // We create a new row.
        var newRow = $("<tr class='newRow'>");

        // We also create 5 cells. Each contain the train information, along with some data-attributes 
        // for the table sorting tool.
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
        newCell4.attr("data-sort-value", moment(trainInfo.nextArrival, "hh:mm").format("X"));
        newCell4.attr("data-time", trainInfo.nextArrival);
        newCell4.attr("class", "nextArrival");
        newCell4.text(trainInfo.nextArrival);
        newRow.append(newCell4);

        var newCell5 = $("<td>");
        newCell5.attr("data-sort-value", trainInfo.minutesAway);
        newCell5.attr("data-minutes", trainInfo.minutesAway);
        newCell5.attr("class", "minutesAway");
        newCell5.text(trainInfo.minutesAway);
        newRow.append(newCell5);
      
      // Append the new cells to the table body.
        $("tbody").append(newRow);

        // If there is an error with the data, the console will log a fail with the code that was not successful.
      }, function(errorObject) {
        console.log("Failed: " + errorObject.code);
  });

  // When someone submits information...
  $("#submit").on("click", function(){
    event.preventDefault();
    // We will pick up the text values from all of the text input fields.
    trainInfo.trainName = $("#trainName").val().trim();
    trainInfo.destination = $("#destination").val().trim();
    trainInfo.firstTrainTime = $("#time").val().trim();
    trainInfo.frequency = parseInt($("#frequency").val().trim());

    // The train name, destination, frequency and first train time will be pushed to the database.
    var trainData = database.ref().push({
      trainName: trainInfo.trainName,
      destination: trainInfo.destination,
      frequency: trainInfo.frequency,
      firstTrainTime: trainInfo.firstTrainTime,
    });
    
    // The text values will be reset.
    $("#trainName").val("");
    $("#frequency").val("");
    $("#destination").val("");
    $("#time").val("");

  });

});
 
