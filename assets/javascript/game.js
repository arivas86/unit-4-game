// Execute this code when the DOM has fully loaded.
$(document).ready(function() {

    // Creating an object to hold our characters.
    var characters = {
      "Obi-Wan Kenobi": {
        name: "Obi-Wan Kenobi",
        health: 115,
        attack: 10,
        imageUrl: "assets/images/obi1.jpeg",
        enemyAtk: 17
      },
      "Luke Skywalker": {
        name: "Luke Skywalker",
        health: 120,
        attack: 12,
        imageUrl: "assets/images/luke.jpeg",
        enemyAtk: 5
      },
      "Darth Maul": {
        name: "Darth Maul",
        health: 150,
        attack: 15,
        imageUrl: "assets/images/dMaul.jpeg",
        enemyAtk: 20
      },
      "Darth Vader": {
        name: "Darth Vader",
        health: 180,
        attack: 20,
        imageUrl: "assets/images/dVader.jpeg",
        enemyAtk: 25
      }
    };
  
    var fighters = [];
    var attacker;
    var oponent;
    var turnCounter = 1;
    var wins = 0;
  
    //create fighter cards
    var renderCharacter = function(character, renderArea) {
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='char-name'>").text(character.name);
        var charImage = $("<img alt='image' class='char-img'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='char-hp'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
    };
    //initialize game
    var startGame = function() {
        for (var key in characters) {
        renderCharacter(characters[key], "#fighterSec");
        }
    };

    startGame();
    
    //load up charachers to fight
    var updateCharacter = function(charObj, areaRender) {
        $(areaRender).empty();//empety area to load new object
        renderCharacter(charObj, areaRender);
    };

    var renderEnemies = function(enemyArr) {
        for (var i = 0; i < enemyArr.length; i++) {
        renderCharacter(enemyArr[i], "#enemySec");
        }
    };
    
    //on click event to chose fighter and oponent
    $("#fighterSec").on("click", ".character", function() {
        var name = $(this).attr("data-name");
  
        if (!attacker) {
            attacker = characters[name];
            for (var key in characters) {
                if (key !== name) {
                fighters.push(characters[key]);
                }
            }
            // Hide the character select div.
            $("#fighterSec").hide();
            updateCharacter(attacker, "#selected-character");
            renderEnemies(fighters);
        }
    });
  
    // Creates an on click event for each enemy.
    $("#enemySec").on("click", ".character", function() {
        var name = $(this).attr("data-name");
        if ($("#defender").children().length === 0) {
            oponent = characters[name];
            updateCharacter(oponent, "#defender");
  
        // remove element as it will now be a new defender
            $(this).remove();
            clearMessage();
        }
    });

        // Function for game messages.
        var renderMessage = function(message) {
        // append message to the page.
        var gameMessageSet = $("#game-message");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);
        };
    
      // restart game function
        var restartGame = function(resultMessage) {
            var reset = $("<button>Play Again</button>").click(function() {
            location.reload()
            });
    
            // Build div that will display the victory/defeat message.
            var gameState = $("#game-message").text(resultMessage);
    
            // Render the restart button and victory/defeat message to the page.
            $("body").append(gameState);
            $("body").append(reset);
        };
    
      // Function to clear the game message section
        var clearMessage = function() {
            var gameMessage = $("#game-message");
            gameMessage.text("");
        };

        $("#attack-button").on("click", function() {
            if ($("#defender").children().length !== 0) {
                var attackMessage = oponent.name + " received " + attacker.attack * turnCounter + " damage points.";
                var counterMessage = oponent.name + " inflicted " + oponent.enemyAtk + " damage points.";
                clearMessage();
  
                // Reduce defender's health by your attack value.
                oponent.health -= attacker.attack * turnCounter;
  
            // If the enemy still has health..
                if (oponent.health > 0) {
                    // Render the enemy's updated character card.
                    updateCharacter(oponent, "#defender");
    
                    // Render the combat messages.
                    renderMessage(attackMessage);
                    renderMessage(counterMessage);
            
                    // Reduce your health by the opponent's attack value.
                    attacker.health -= oponent.enemyAtk;
    
                    // Render the player's updated character card.
                    updateCharacter(attacker, "#selected-character");
    
                    // end game when HP drops to 0
                    if (attacker.health <= 0) {
                        clearMessage();
                        restartGame("The force is not with you...GAME OVER!!!");
                        $("#attack-button").off("click");
                    }
                }
            else {
                // clear oponent's card when defeated
                $("#defender").empty();
  
                var gameStateMessage = "You have defeated " + oponent.name + ". Chose your next oponent.";
                renderMessage(gameStateMessage);
        
                // Increment your kill count.
                wins++;
        
                // Call the restartGame function
                if (wins >= fighters.length) {
                    clearMessage();
                    $("#attack-button").off("click");
                    restartGame("THE FORCE IS STRONG WITH THIS ONE!!! GAME OVER");
                }
            }

        // Increment turn counter. This is used for determining how much damage the player does.
            turnCounter++;
            }
            else {
                clearMessage();
                renderMessage("You must choose an oponent!");
            }

        });

 });
  