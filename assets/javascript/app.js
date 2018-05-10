$(document).ready(function () {

    console.log("Lettt's get started!");
    //Initialize Firebase
    var config = {
        apiKey: "AIzaSyCzyP2ENq9exmg1L_AXbKggtfyt8u5M8SU",
        authDomain: "demop-dc83b.firebaseapp.com",
        databaseURL: "https://demop-dc83b.firebaseio.com",
        projectId: "demop-dc83b",
        storageBucket: "demop-dc83b.appspot.com",
        messagingSenderId: "943692479281"
    };
    firebase.initializeApp(config);
    //a path to the database, it stores all the input data
    var database = firebase.database()

    //take all the form data and push it to firebase database(button for adding train info)
    $("#myform").submit(function (event) {
        event.preventDefault();
        //console.log("works");
        //the value of user inputs
        var trainName = $("#train-name").val().trim()
        var destination = $("#destination").val().trim()
        var firstTrainTime = $("#first-train-time").val().trim()
        var frequency = $("#frequency").val().trim()
        //console.log(trainName)
        //holding the train info/data in local object
        //push(upload) our data to firebase every time the form gets submited with unique key
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        })
    })
    //take the data back from firabase and loop through it
    //console.log(moment().format("hh:mm a"));
    //chilsanapshot,snaphot of database: monitors and gives u access to the data of the database
    //create firebase event for adding train to the database and a row in html when a user adds an entry
    database.ref().on("child_added", function (childSnapshot) {
        //console.log(childSnapshot.val());
        var trainNameData = childSnapshot.val().trainName
        //console.log(trainNameData);
        var destinationData = childSnapshot.val().destination
        console.log(destinationData);
        var firstTrainTimeData = childSnapshot.val().firstTrainTime
        var frequencyData = childSnapshot.val().frequency
        //console.log(firstTrainTimeData);
        //take the first train time and split it to make it an array(hour and minute)
        var timeArray = firstTrainTimeData.split(":")
        //console.log(timeArray);
        //use the array to make an actual moment() and store in traintime
        var trainTime = moment().hours(timeArray[0]).minutes(timeArray[1]).seconds("00")
        //console.log(trainTime)
        //max moment is equal to either the current time of the day or the first train time. 
        //whichever is further out
        var maxMoment = moment.max(moment(), trainTime)
        if (maxMoment === trainTime) {
            var trainArrival = trainTime.format("hh:mm A")
            //minuteaway=diffrence between the traintime and current time of the day
            var minutesAway = trainTime.diff(moment(), "minutes")
        } else {
            //differencetime = difference in minutes of how much time has passed from the first train of the day
            var differenceTime = moment().diff(trainTime, "minutes")
            var timeRemainder = differenceTime % frequencyData
            var minutesAway = frequencyData - timeRemainder
            var trainArrival = moment().add(minutesAway, "m").format("hh:mm A")
        }
        //add each train's data into the table
        var newRow = "<tr><td>" + trainNameData + "</td><td>" + destinationData + "</td><td>" + trainTime.format("hh:mm A") + "</td><td>" + frequencyData + "</td><td>" + trainArrival + "</td><td>" + minutesAway + "</td></tr>"
        $(".table").append(newRow);
    })
});
