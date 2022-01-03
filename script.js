//GLOBAL VARIABLES ////////////////////////////

//Declare array for all possible equations
	let possibilities = [];
	let resultsTable = null;
	let difficultySetting = 2;
	let playerProductIndex = null;
	let playerWins = 5;
	let computerWins = -1;

	const validCards = /[Aa1-9]/;
	const cardDiv = document.getElementById("cards");
	const cards = Array.from(cardDiv.getElementsByTagName("input"));
//Check to see if an input on each card is valid
	cards.forEach(card => card.addEventListener('change', function() {
		if(!validCards.test(card.value)) {
			card.classList.add('invalid');
		}
		if(validCards.test(card.value)) {
			card.classList.remove('invalid');
		}
	}));
	//focus the cursor on the first card input
	cards[0].focus();

	const scoreboard = document.getElementById("scoreboard");
	const playerScoreboard = Array.from(scoreboard.querySelectorAll(".player-wins"));
	const computerScoreboard = Array.from(scoreboard.querySelectorAll(".computer-wins"));

//Add listener to DRAW button
	const drawButton = document.getElementById("draw");
	drawButton.addEventListener('click', drawCards);
	//Also target the heading text above the draw button so we can hide it later
	const drawText = document.getElementById("draw-text");

//Add listener to PLAY button
	const playButton = document.getElementById("play");
	playButton.addEventListener('click', getCards);

//Add listener to SUBMIT button
	const submitButton = document.getElementById("submit");
	submitButton.addEventListener('click', getScores);

//Add listener to DIFFICULTY buttons
	const difficultyDiv = document.getElementById("difficulty");
	const difficultyButtons = Array.from(difficultyDiv.getElementsByTagName("button"));
	let currentDifficulty = difficultyButtons[1];
	//console.log(difficultyButtons);
	//console.log(currentDifficulty);
	difficultyButtons.forEach(difficultyButton => difficultyButton.addEventListener('click', setDifficulty));

//Add listener for PRODUCT FIELD so the Enter key will submit the product
	document.getElementById('product').addEventListener('keypress', function(e) {
		if(e.key === 'Enter') {
			e.preventDefault();
			console.log("Enter clicked");
			getScores();
		}
	});

	/*Target the scoreboard table: Got rid of this
	const scoresDiv = document.getElementById("scores-table");
	const playerProductCell = scoresDiv.querySelector(".player-product");
	const computerProductCell = scoresDiv.querySelector(".computer-product");
	const playerScoreCell = scoresDiv.querySelector(".player-score");
	const computerScoreCell = scoresDiv.querySelector(".computer-score");
	const playerWinsCell = scoresDiv.querySelector(".player-wins");
	const computerWinsCell = scoresDiv.querySelector(".computer-wins"); */

	//Target the game-result DIV
	const gameResultDiv = document.querySelector('.game-result');
	const gameResultH1 = gameResultDiv.querySelector('h1');

	//Target the choices DIV
	const choicesDiv = document.getElementById("choices-div");

	//Add listener to the PLAY AGAIN button
	const resetDiv = document.querySelector(".reset-div");
	const resetButtonCell = document.getElementById("reset-button");
	resetButtonCell.addEventListener('click', resetGame);

	//WHEN PLAYER CLICKS DIFFICULTY BUTTON: Figure out which button was clicked and update the difficulty setting
	function setDifficulty(e) {
		//console.log(this.innerHTML);
		currentDifficulty.classList.remove('active');
		this.classList.add('active');
		currentDifficulty = this;
		//console.log("Now, the currentDifficulty variable is " + currentDifficulty);
		if (this.innerHTML === "EASY") {
			difficultySetting = 1;
		} else if (this.innerHTML === "MEDIUM") {
			difficultySetting = 2;
		} else {
			difficultySetting = 3;
		}
		console.log(difficultySetting);
	}

	//WHEN PLAYER CLICKS "Draw some for me" BUTTON
	//Draw the cards for a player
	function drawCards() {
		cards[0].value = Math.floor((Math.random() * 9) + 1);
		cards[1].value = Math.floor((Math.random() * 9) + 1);
		cards[2].value = Math.floor((Math.random() * 9) + 1);
		cards[3].value = Math.floor((Math.random() * 9) + 1);
		drawButton.style.display = "none";
		drawText.style.display = "none";
	}

	//WHEN PLAYER CLICKS "Submit" BUTTON
	//Calculate and report the user's and computer's scores
	function getScores() {
		console.log("SUBMIT button clicked");
		let playerDiv = document.getElementById("player-score");
		let playerAnswer = playerDiv.getElementsByTagName("input"); //Player's product
		let playerProduct = parseInt(playerAnswer[0].value);
		if (verifyProduct(playerProduct)) {
			playerDifference = Math.abs(2500 - playerProduct); //Player's score
			var compChoice = getComputerDifference(difficultySetting); //Computer's score

			playerDiv.style.display = "none";
			
			/*OLD scoresTable code
			scoresDiv.style.display = "block";
			playerProductCell.innerHTML = playerProduct + "<br />" + "<br />" + "(" + possibilities[playerProductIndex].firstFactor + " x " + possibilities[playerProductIndex].secondFactor + ")";
			computerProductCell.innerHTML = resultsTable[compChoice].product + "<br />" + "<br />" + "(" + resultsTable[compChoice].firstFactor + " x " + resultsTable[compChoice].secondFactor + ")";
			playerScoreCell.innerHTML = playerDifference;
			computerScoreCell.innerHTML = resultsTable[compChoice].difference;*/
			
			//Print results to choicesDiv
			let choicesTable = document.createElement('table');
			//Make the choices table body with all of the choices listed
			let choicesTableBody = '<tbody>';
			for (var i=0; i<resultsTable.length; i++) {
				choicesTableBody = choicesTableBody += '<tr>';
				if(i===playerProductIndex){
					choicesTableBody += '<td style="background-color: green;">You</td>';
				} else {
					choicesTableBody += '<td></td>';
				}
				choicesTableBody += `
				<td>${resultsTable[i].firstFactor} x ${resultsTable[i].secondFactor} = ${resultsTable[i].product}</td>
				<td>${resultsTable[i].difference}</td>
				`
				if(i===compChoice){
					choicesTableBody += '<td style="background-color: green;">Computer</td>';
				} else {
					choicesTableBody += '<td></td>';
				}
				choicesTableBody += '</tr>';
			};
			choicesTableBody = choicesTableBody += '</tbody>';
			//Put the choicesTableBody inside the choicesTable
			choicesTable.innerHTML = `
			<tr>
				<th>Your Choice</th>
				<th>Equation</th>
				<th>Score</th>
				<th>Computer's Choice</th>
			</tr>
			${choicesTableBody}
			`;
			choicesDiv.appendChild(choicesTable);
			choicesDiv.style.display = "block";

			//Update scoreboard
			if (playerDifference === resultsTable[compChoice].difference) {
				/* For old scoresDiv
				playerWinsCell.innerHTML = "TIE!";
				playerWinsCell.style.backgroundColor = "green";
				computerWinsCell.innerHTML = "TIE!"
				computerWinsCell.style.backgroundColor = "green"; */
				gameResultDiv.style.display = "block";
				gameResultH1.innerHTML = "The game is a tie.";
				resetDiv.style.display = "block";
				scoreboard.scrollIntoView({behavior: "smooth"});
			} else if (playerDifference < resultsTable[compChoice].difference) {
				/* For old scoresDiv
				playerWinsCell.innerHTML = "WINNER!";
				playerWinsCell.style.backgroundColor = "green"; */
				playerWins--;
				updateScoreboard(playerScoreboard, playerWins);
				gameResultDiv.style.display = "block";
				gameResultH1.innerHTML = "You won this game!";
				resetDiv.style.display = "block";
				scoreboard.scrollIntoView({behavior: "smooth"});
			} else {
				/* For old scoresDiv
				computerWinsCell.innerHTML = "WINNER!"
				computerWinsCell.style.backgroundColor = "green"; */
				computerWins++;
				updateScoreboard(computerScoreboard, computerWins);
				gameResultDiv.style.display = "block";
				gameResultH1.innerHTML = "The computer won this game.";
				resetDiv.style.display = "block";
				scoreboard.scrollIntoView({behavior: "smooth"});
			}
		} else {
			alert("That product is not possible with the four numbers drawn! Check your math again.");
		}
	}

	//CALLED BY getScores
	//Ensure that the player's product is possible, given the four cards drawn
	function verifyProduct(p) {
		var productsTable = possibilities.map(function(possibility) {
  		return possibility.product;
		});
		console.log(productsTable);
		console.log(p);
		playerProductIndex = productsTable.indexOf(p);
		if (playerProductIndex != -1) {
			return true;
		} else {
			return false;
		}
	}

	//CALLED BY getScores
	//Use the user-selected difficulty to select the computer's chosen equation
	function getComputerDifference(difficulty) {
		switch(difficulty) {
		case 1:
			return Math.floor((Math.random() * 3) + 4);
		case 2:
			return Math.floor((Math.random() * 4) + 1);
		default:
			return Math.floor(Math.random() * 3);
		}
	}

	//CALLED WHEN USER CLICKS "Play" BUTTON
	//Grab the cards input by user and store them in an array
	function getCards() {

		//Check to ensure all cards contain acceptable values
		var cardError = false;
		for (var i=0; i<cards.length; i++) {
			if (!validCards.test(cards[i].value)) {
				alert("You have entered invalid cards. \nThis game only accepts these cards: \nA, 2, 3, 4, 5, 6, 7, 8, 9");
				cardError = true;
				break;
			}
		}
		if (!cardError) {
			//Hide the Play and Draw buttons and Show/Focus the product input field and Submit button
			document.getElementById("play-button").style.display = "none";
			drawButton.style.display = "none";
			drawText.style.display = "none";
			document.getElementById("player-score").style.display = "block";
			document.getElementById("product").focus();

			//Grab the card values from the cards fields and input them to the cardValues array
			var cardValues = [];
			for (var i=0; i<cards.length; i++) {
				if (cards[i].value === "A" || cards[i].value === "a") {
					cardValues.push(1);
				} else {
				cardValues.push(parseInt(cards[i].value));
				}
			}
			console.log(cardValues);
			//Disable the card inputs so you can no longer change them
			cards.forEach(card => card.disabled = true);
			//Pass the cardValues array to multiplyCards to create the arrays of possible equations
			resultsTable = multiplyCards(cardValues);
			}
		}

	//CALLED BY getCards
	//Populate (global) possibilities array with objects. Twelve unique possibilites exist.
	function multiplyCards(cardValues) {

		possibilities.push({
			firstFactor: parseInt("" + cardValues[0] + cardValues[1]),
			secondFactor: parseInt("" + cardValues[2] + cardValues[3]),
		});
		possibilities.push({
			firstFactor: parseInt("" + cardValues[0] + cardValues[1]),
			secondFactor: parseInt("" + cardValues[3] + cardValues[2])
		});
		possibilities.push({
			firstFactor: parseInt("" + cardValues[0] + cardValues[2]),
			secondFactor: parseInt("" + cardValues[1] + cardValues[3]),
		});
		possibilities.push({
			firstFactor: parseInt("" + cardValues[0] + cardValues[2]),
			secondFactor: parseInt("" + cardValues[3] + cardValues[1])
		});
		possibilities.push({
			firstFactor: parseInt("" + cardValues[0] + cardValues[3]),
			secondFactor: parseInt("" + cardValues[1] + cardValues[2]),
		});
		possibilities.push({
			firstFactor: parseInt("" + cardValues[0] + cardValues[3]),
			secondFactor: parseInt("" + cardValues[2] + cardValues[1])
		});

		possibilities.push({
			firstFactor: parseInt("" + cardValues[1] + cardValues[0]),
			secondFactor: parseInt("" + cardValues[2] + cardValues[3]),
		});
		possibilities.push({
			firstFactor: parseInt("" + cardValues[1] + cardValues[0]),
			secondFactor: parseInt("" + cardValues[3] + cardValues[2])
		});
		possibilities.push({
			firstFactor: parseInt("" + cardValues[1] + cardValues[2]),
			secondFactor: parseInt("" + cardValues[3] + cardValues[0])
		});
		possibilities.push({
			firstFactor: parseInt("" + cardValues[1] + cardValues[3]),
			secondFactor: parseInt("" + cardValues[2] + cardValues[0])
		});

		possibilities.push({
			firstFactor: parseInt("" + cardValues[2] + cardValues[0]),
			secondFactor: parseInt("" + cardValues[3] + cardValues[1])
		});
		possibilities.push({
			firstFactor: parseInt("" + cardValues[2] + cardValues[1]),
			secondFactor: parseInt("" + cardValues[3] + cardValues[0])
		});

		//Calculate products and differences. Store each in an object property
		for (var i=0; i<possibilities.length; i++) {
			possibilities[i].product = possibilities[i].firstFactor * possibilities[i].secondFactor;
			possibilities[i].difference = Math.abs(2500 - possibilities[i].product);
		}

		//console.table(possibilities);
		//Take the possibilities table and rearrange it from best to worst, based on difference to 2500
		var differencesOrdered = possibilities.sort(function(a, b) {
	  	if (a.difference > b.difference) {
	    	return 1;
	  	} else {
	    	return -1;
	  	}
		});

		//console.table(differencesOrdered);
		//Prune multiples out of differencesOrdered Table
		let prunedDifferences = differencesOrdered;
		for (var i=0; i<(prunedDifferences.length-1); i++) {
			if(prunedDifferences[i].difference === prunedDifferences[i+1].difference){
				prunedDifferences.splice(i, 1);
			}
		}
		console.table(prunedDifferences);
		return(prunedDifferences);

		/*
		A loop to iterate through all of the possible products and find the average (3032)
		var allTheProducts = [];
		var productTotal = 0;
		for (var f=11; f<100; f++) {
			for (var s=f; s<100; s++) {
				allTheProducts.push(f*s);
				productTotal += f*s;
			}
		}
		console.table(allTheProducts);
		console.log(productTotal);
		console.log(productTotal/allTheProducts.length);*/
	}
	//CALLED BY getScores
	//Updates scoreboard with a green box for the winner
	function updateScoreboard(winner, wins) {
		console.log(winner[wins]);
		winner[wins].style.backgroundColor = "green";
		//check for a match winner
		if (playerWins === 0 || computerWins === 4 ) {
			endMatch();
		}
	};

	//CALLED BY updateScorebord
	//Shows match end message
	function endMatch() {
		if (playerWins === 0) {
			document.getElementById("player-match-winner").style.display = "block";
			document.getElementById("input-cards").style.display = "none";
			document.getElementById("reset-button").style.display = "none";
		}
		if (computerWins === 4) {
			document.getElementById("computer-match-winner").style.display = "block";
			document.getElementById("input-cards").style.display = "none";
			document.getElementById("reset-button").style.display = "none";
		}

	};

	//CALLED WHEN USER CLICKS "Play Again" BUTTON
	function resetGame() {
		//reset global variables
		possibilities = [];
		resultsTable = null;
		playerProductIndex = null;
		//activate card input fields
		cards.forEach(card => card.disabled = false);
		//reset input fields
		document.getElementById("player").reset();
		document.getElementById("cards").reset();
		//show and hide divs respectively
		document.getElementById("play-button").style.display = "block";
		document.getElementById("player-score").style.display = "none";
		choicesDiv.innerHTML = "";
		choicesDiv.style.display = "none";
		resetDiv.style.display = "none";
		drawButton.style.display = "block";
		drawText.style.display = "block";
		//Reset game-result paragraph
		gameResultDiv.style.display = "none";
		gameResultH1.innerHTML = "";
		//focus cursor on the first card
		cards[0].focus();

	}
