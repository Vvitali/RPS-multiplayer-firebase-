console.log("script.js connected");
//1 TODO
var counter = 0;
var chatCounter = 0;
var playerName;

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

function writeNewChatMessage(name, message) {
    var postData = {
        name: name,
        message: message
    };
    // Get a key for a new Post.
    var updates = {};
    updates['/chat/' + chatCounter] = postData;
    firebase.database().ref().update(updates)
    firebase.database().ref('chat/').update({
        messageCounter: ++chatCounter
    });
    return 1;
}

$(document).ready(function() {
    console.log("Document ready");
    counter;
    firebase.database().ref('chat/').on("value", function(snapshot) {
        $("#chat").html("");
        var chatData = snapshot.val();
        chatCounter = chatData.messageCounter;
        console.log("Ready: chatCounter: " + chatCounter);
        for (var i = 0; i < chatCounter; i++) $("#chat").append(chatData[i].name + ": " + chatData[i].message + "&#13;");
    });

    $("#start").on("click", writeUserData1);

    $("#sendToChat").click(function() {
        playerName = $("#player_name").val();
        writeNewChatMessage(playerName, $("#message").val());
        $("#message").val("");

    });


});
