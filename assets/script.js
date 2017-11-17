/* global firebase */
console.log("script.js connected");
var chatCounter = 0;
var playerName;
var db = firebase.database();
var playerRole;
var score = [
    [0, 0],
    [0, 0]
];

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
                game();
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
                game();
            }
            if (snapshot.val().slot0 === 1 && snapshot.val().slot1 == 1) {
                $("#0Title").text("I'm sorry, but all spots are busy right now. Try later, or you can just use a chat in order to pass the time.");
                $("#1Title").text("I'm sorry, but all spots are busy right now. Try later, or you can just use a chat in order to pass the time.");
            }

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
        $("#" + $(event.currentTarget).attr("data-player") + "Title").text("You choose: " + event.currentTarget.id);
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
                    $("#" + (playerRole ^ 1) + "Title").text(snapshot.val()[playerRole ^ 1].name + " answer: " + snapshot.val()[playerRole ^ 1].answer);
                    setTimeout(function() {
                        $("#" + playerRole + "Title").text("New round: make your choice");
                    }, 3000);
                    break;
                case 1:
                    console.log("Player 1 wins");
                    score[0][0]++;
                    score[1][1]++;
                    $("#" + playerRole + "Title").text(snapshot.val()[0].name + " wins");
                    $("#" + playerRole + "Pa").html("Score: " + snapshot.val()[0].name + " wins: " + score[0][0] + ", losses: " + score[0][1] + "<br>" + snapshot.val()[1].name + " wins: " + score[1][0] + ", losses: " + score[1][1]);
                    $("#" + (playerRole ^ 1) + "Title").text(snapshot.val()[playerRole ^ 1].name + " answer: " + snapshot.val()[playerRole ^ 1].answer);
                    break;
                case 2:
                    console.log("Player 2 wins");
                    score[1][0]++;
                    score[0][1]++;
                    $("#" + playerRole + "Pa").html("Score: " + snapshot.val()[0].name + " wins: " + score[0][0] + ", losses: " + score[0][1] + "<br>" + snapshot.val()[1].name + " wins: " + score[1][0] + ", losses: " + score[1][1]);
                    $("#" + playerRole + "Title").text(snapshot.val()[1].name + " wins");
                    $("#" + (playerRole ^ 1) + "Title").text(snapshot.val()[playerRole ^ 1].name + " answer: " + snapshot.val()[playerRole ^ 1].answer);
                    setTimeout(function() {
                        $("#" + playerRole + "Title").text("New round: make your choice");
                    }, 3000);
                    break;
            }
            firebase.database().ref("/players/" + 0).update({ answer: 0 });
            firebase.database().ref("/players/" + 1).update({ answer: 0 });
        }
    });

}
