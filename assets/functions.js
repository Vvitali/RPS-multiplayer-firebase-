console.log("functions.js connected");
var counter = 1;
var tie = 0;
var computer = 0;
var user = 0;

function play(button) {
    document.getElementById("playerH1").innerHTML = "You chose: " + button;
    var computerresult = Math.floor(Math.random() * 3);
    var counter = 0;

    console.log("Computer pressed: " + computerresult);

    //Done
    switch (computerresult) {
        case 0:
            computerresult = "rock";
            break;
        case 1:
            computerresult = "paper";
            break;
        case 2:
            computerresult = "scissors";
            break;
        default:
            console.log("Error #1 (RandondPart)");
            break;
    }

    document.getElementById("computerH1").innerHTML = "Computer chose:" + computerresult
    var roundresult = logic(button, computerresult);
    if (roundresult == 1) {
        document.getElementById("roundH1").innerHTML = "Round result: Player wins";
        user++;
        counter = writeScore("Round result: Player wins");
    }
    if (roundresult == 2) {
        document.getElementById("roundH1").innerHTML = "Round result: Computer wins";
        computer++;
        counter = writeScore("Round result: Computer wins");
    }

    if (roundresult == 0) {
        document.getElementById("roundH1").innerHTML = "Round result: Tie";
        tie++;
        counter = writeScore("Round result: Tie");
    }

}

//Done
function namePlease() {
    var name = prompt("What is your name?");
    console.log(name);
    document.getElementById("playersName").innerHTML = "Hello, " + name;
    return name;
}

function logic(input1, input2) {
    console.log("Logic:" + input1 + " " + input2);
    if (input1 == "rock") {
        switch (input2) {
            case 'rock':
                return 0;
                break;
            case 'scissors':
                return 1;
                break;
            case 'paper':
                return 2;
                break;
            default:
                return -1;
        }
    }
    if (input1 == "paper") {
        switch (input2) {
            case 'rock':
                return 1;
                break;
            case 'scissors':
                return 2;
                break;
            case 'paper':
                return 0;
                break;
            default:
                return -1;
        }
    }
    if (input1 == "scissors") {
        switch (input2) {
            case 'rock':
                return 2;
                break;
            case 'scissors':
                return 0;
                break;
            case 'paper':
                return 1;
                break;
            default:
                return -1;
        }
    }
}

function writeScore(newResult) {
    var htmlStatisctic = document.getElementById("statisctic");

    htmlStatisctic.innerHTML = "<strong>" + "Tie: " + tie + ", Computer: " + computer + ", " + username + ": " + user + "</strong>";
    var htmlTable = document.getElementById("scoretable");
    htmlTable.innerHTML = htmlTable.innerHTML + "<li class='list-group-item'>" + counter++ + ") " + newResult + "</li>";
}
