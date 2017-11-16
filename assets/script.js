/* global firebase */
console.log("script.js connected");
var chatCounter = 0;
var playerName;
var db = firebase.database();
var playerRole;
/*
0)+ Get a role from database
1)+ Get username and write it to database
2) Show username on the left tab
3) wait for second player
4) get second username and write it to database
5) Show RPS-buttons on both tabs
6) Write player's chooses into players-hive
7) compare results, and display who wins
8) do it again
chat: completed

*/
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

    $("#start").click(function() {
        console.log("Start!");
        $(event.currentTarget).addClass("disabled");
        //Get player's name
        playerName = $("#player_name").val();
        //Get player's role
        db.ref().once("value").then(function(snapshot) {
            //playerRole = snapshot.val().pCounter;
            var online = firebase.database().ref();
            //actions for the first spot
            if (snapshot.val().slot0 === 0 && (snapshot.val().slot1 == 1 || snapshot.val().slot1 == 0)) {
                console.log("slot0 selected");
                playerRole = 0;
                $("#actionBar2").hide();
                db.ref().update({ slot0: 1, });
                db.ref('/players/' + "0").update({
                    name: playerName,
                    role: 0,
                    wins: 0,
                    losses: 0
                });
                $("#player1Name").text(playerName);
                // Do it when this client loses connection
                online.onDisconnect().update({
                    slot0: 0
                });
                firebase.database().ref("/players/" + 0).onDisconnect().update({
                    wins: 0,
                    losses: 0,
                    name: "Waiting for opponent",
                    answer: 0
                });
            }
            //actions for the second spot
            if (snapshot.val().slot0 === 1 && snapshot.val().slot1 == 0) {
                console.log("slot1 selected");
                playerRole = 1;
                $("#actionBar1").hide();
                db.ref().update({
                    slot1: 1,
                });
                db.ref('/players/' + 1).update({
                    name: playerName,
                    role: 1,
                    wins: 0,
                    losses: 0,

                });
                $("#player2Name").text(playerName);
                $("#player1Name").text(snapshot.val().players[0].name);
                // Do it when this client loses connection
                online.onDisconnect().update({
                    slot1: 0,
                });
                firebase.database().ref("/players/" + 1).onDisconnect().update({
                    wins: 0,
                    losses: 0,
                    name: "Waiting for opponent",
                    answer: 0
                });

            }
            game();
        });
    });
    db.ref("/players/").once("value").then(function(snapshot) {
        firebase.database().ref('chat/').on("value", function(snapshot) {
            $("#chat").html("");
            var chatData = snapshot.val();
            chatCounter = chatData.messageCounter;
            console.log("Chat updated: message counter: " + chatCounter);
            for (var i = 0; i < chatCounter; i++) $("#chat").append(chatData[i].name + ": " + chatData[i].message + "&#13;");
        });

        $("#sendToChat").click(function() {
            playerName = $("#player_name").val();
            writeNewChatMessage(playerName, $("#message").val());
            $("#message").val("");
        });
    });
});

function game() {
    console.log("Game: start");
    $(".pButtons").click(function(event) {
        console.log(event.currentTarget.id + " " + $(event.currentTarget).attr("data-player"));
        $("#" + $(event.currentTarget).attr("data-player") + "Title").text(event.currentTarget.id);
        db.ref("/players/" + $(event.currentTarget).attr("data-player")).update({
            answer: event.currentTarget.id
        });
    });
    var PlayerHandler = db.ref("/players/");
    PlayerHandler.on('value', function(snapshot) {
        $("#player1Name").text(snapshot.val()[0].name);
        $("#player2Name").text(snapshot.val()[1].name);
    });
    var mainHandler = db.ref("/players/");
    mainHandler.on('value', function(snapshot) {
        if ((snapshot.val()[0].answer != 0) && (snapshot.val()[1].answer != 0)) {
            console.log("1: " + snapshot.val()[0].answer + " 2: " + snapshot.val()[1].answer);
            var result = firebase.database().ref("/players/" + 1);
            switch (logic(snapshot.val()[0].answer, snapshot.val()[1].answer)) {
                case 0:
                    console.log("tie");
                    $("#" + playerRole + "Title").text("Tie");
                    $("#" + (playerRole % 1) + "Title").text(snapshot.val()[playerRole % 1].answer);
                    result.once("value", function() {

                    });
                    break;
                case 1:
                    console.log("Player 1 wins");
                    $("#" + playerRole + "Title").text("Player 1 wins");
                    firebase.database().ref("/players/" + 1).update({ wins: 0 });
                    $("#" + (playerRole % 1) + "Title").text(snapshot.val()[playerRole % 1].answer);
                    break;
                case 2:
                    console.log("Player 2 wins");
                    $("#" + playerRole + "Title").text("Player 2 wins");
                    $("#" + (playerRole % 1) + "Title").text(snapshot.val()[playerRole % 1].answer);
                    break;
            }
            firebase.database().ref("/players/" + 1).update({ answer: 0 });
            firebase.database().ref("/players/" + 0).update({ answer: 0 });
        }
    });

}
