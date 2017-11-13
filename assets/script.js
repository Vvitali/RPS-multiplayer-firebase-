console.log("script.js connected");

var counter = 0;
var chatCounter =
    var playerName =


        function writeUserData1() {
            console.log("click")
            playerName = $("#player_name").val()

            database.ref('players/' + counter).set({
                name: playerName,
            });
        }

function readTheData() {
    var firstPlayerHandler = firebase.database().ref('players/' + "0");
    firstPlayerHandler.on('value', function(snapshot) {
        $("#player1Name").text(snapshot.val().name);
        console.log("The first players name: " + snapshot.val().name);
    });

    // var secondPlayerHandler = firebase.database().ref('players/' + "1");
    // secondPlayerHandler.on('value', function(snapshot) {
    //     $("#player2Name").text(snapshot.val().name);
    //     console.log("The first players name: " + snapshot.val().name);
    // });

    firstPlayerHandler.onDisconnect().remove(function(err) {
        if (err) {
            console.error('could not establish onDisconnect event', err);
        }
    });

}

function checkIfThe1stPlayerExists() {

    return firebase.database().ref('players/').once('value').then(function(snapshot) {

        if (snapshot.val()[0] != null) {
            console.log("The first player connected")
            counter = 1;
        }
        else {
            console.log("You are the first player")
        }


    });
}

$(document).ready(function() {
    console.log("Document ready");
    $("#start").on("click", writeUserData1);
    checkIfThe1stPlayerExists();
    readTheData();
    $("#sendToChat").click(function() {
        console.log("sendToChat button:" + chatCounter);
        database.ref('chat/' + chatCounter++).set({
            name: playerName,
            message: $("#message").val()
        });
        data.ref('chat/messageCounter').set(chatCounter);
    });

    var chatHolder = firebase.database().ref('chat/');
    chatHolder.on('value', function(snapshot) {

        var chatData = snapshot.val();
        chatCounter = chatData.messageCounter;
        $("#chat").text(chatData[0].name + ": " + chatData[0].message);
    });

});
