
var config = {
    apiKey: "AIzaSyDFXo1lW3vz1ACG6IXGRr2ZAZr0fhrxNro",
    authDomain: "what-the-hell-is-firebase.firebaseapp.com",
    databaseURL: "https://what-the-hell-is-firebase.firebaseio.com",
    projectId: "what-the-hell-is-firebase",
    storageBucket: "what-the-hell-is-firebase.appspot.com",
    messagingSenderId: "883280496874"
  };
  
firebase.initializeApp(config);

var database = firebase.database();

var trainName = "";
var destination = "";
var initialTrain = "";
var frequency = "";
var minutesAway = "";

function calculateTrain() {

$("#submit").on("click", function(event) {
    event.preventDefault();

    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    initialTrain = $("#time").val().trim();
    frequency = $("#frequency").val().trim();

    database.ref().push({
        trainName: trainName,
        destination: destination,
        initialTrain: initialTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});


database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
//   database.ref().on("child_added", function(snapshot) {

    // storing the snapshot.val() in a variable for convenience
    var info = snapshot.val();

    // Console.logging the last user's data
    console.log(info.trainName);
    console.log(info.destination);
    console.log(info.initialTrain);
    console.log(info.frequency);

//SHOULD I BE CONVERTING TO UNIX?
//IF TRAIN TIME ENTERED IS LATER THAN CURRENT TIME, HOW TO JUST DISPLAY TIME ENTERED?


    // Current Time
    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    var nextTrain;
    var minutesAway;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(initialTrain, "HH:mm")
    // console.log(firstTimeConverted);

   
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    if( diffTime < 0) {
         nextTrain = moment(initialTrain, "HH:mm").format("hh:mm A");
         minutesAway = moment().subtract(moment(initialTrain), "minutes");
         console.log(minutesAway); 

    } else {

            // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log("Remaining time:" + tRemainder);

        // Minute Until Train
         minutesAway = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + minutesAway);


        // Next Train
         nextTrain = moment().add(minutesAway, "minutes").format("hh:mm A")
        console.log("ARRIVAL TIME: " + nextTrain);


    }

    

    var tableRow = $("<tr>");
    $("#tbody").append(tableRow);

    var trainNameRecord = $("<td>").text(info.trainName);
    var destinationRecord = $("<td>").text(info.destination);
    var frequencyRecord = $("<td>").text(info.frequency);
    var arrivalRecord = $("<td>").text(nextTrain)
    var minutesRecord = $("<td>").text(minutesAway)
        
    tableRow.append(trainNameRecord);
    tableRow.append(destinationRecord);
    tableRow.append(frequencyRecord);
    tableRow.append(arrivalRecord);
    tableRow.append(minutesRecord);

    }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
    });
}

calculateTrain();


