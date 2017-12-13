//Declare array for all possible equations
	let possibilities = [];
	let resultsTable = null;
	let difficultySetting = 1;
	let playerProductIndex = null;
	let playerWins = 5;
	let computerWins = -1;

	const validCards = /[Aa1-9]/;
	const cardDiv = document.getElementById("cards");
	const cards = Array.from(cardDiv.getElementsByTagName("input"));
	console.log(cards);

	cards.forEach(card => card.addEventListener('change', function() {
		console.log("On Change Fired");
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
	console.log(scoreboard);

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
	var currentDifficulty = difficultyButtons[1];
	//console.log(difficultyButtons);
	//console.log(currentDifficulty);
	difficultyButtons.forEach(difficultyButton => difficultyButton.addEventListener('click', setDifficulty));

//Add listener for PRODUCT FIELD so the Enter key will submit the product
	document.getElementById('product').addEventListener('keypress', function(e) {
		if(e.keyCode === 13) {
			e.preventDefault();
			//console.log("Enter clicked");
			getScores();
		}
	});

	//Target the scores table
	const scoresDiv = document.getElementById("scores-table");
	const playerProductCell = scoresDiv.querySelector(".player-product");
	const computerProductCell = scoresDiv.querySelector(".computer-product");
	const playerScoreCell = scoresDiv.querySelector(".player-score");
	const computerScoreCell = scoresDiv.querySelector(".computer-score");
	const playerWinsCell = scoresDiv.querySelector(".player-wins");
	const computerWinsCell = scoresDiv.querySelector(".computer-wins");
	const possibilitiesTableDisplay = document.getElementById("possibilities-table");

	//Add listener to the PLAY AGAIN button
	const resetButtonCell = document.getElementById("reset-button");
	resetButtonCell.addEventListener('click', resetGame);

	//Figure out which button was clicked and update the difficulty setting
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

	//Draw the cards if a player chooses
	function drawCards() {
		cards[0].value = Math.floor((Math.random() * 9) + 1);
		cards[1].value = Math.floor((Math.random() * 9) + 1);
		cards[2].value = Math.floor((Math.random() * 9) + 1);
		cards[3].value = Math.floor((Math.random() * 9) + 1);
		drawButton.style.display = "none";
		drawText.style.display = "none";
	}

	//calculate and report the user's and computer's scores
	function getScores() {
		console.log("SUBMIT button clicked");
		var playerDiv = document.getElementById("player-score");
		var playerAnswer = playerDiv.getElementsByTagName("input");
		var playerProduct = parseInt(playerAnswer[0].value);
		if (verifyProduct(playerProduct)) {
			playerDifference = Math.abs(2500 - playerProduct);
			var compChoice = getComputerDifference(difficultySetting);


			playerDiv.style.display = "none";
			scoresDiv.style.display = "block";

			playerProductCell.innerHTML = playerProduct + "<br />" + "<br />" + "(" + possibilities[playerProductIndex].firstFactor + " x " + possibilities[playerProductIndex].secondFactor + ")";
			computerProductCell.innerHTML = resultsTable[compChoice].product + "<br />" + "<br />" + "(" + resultsTable[compChoice].firstFactor + " x " + resultsTable[compChoice].secondFactor + ")";
			playerScoreCell.innerHTML = playerDifference;
			computerScoreCell.innerHTML = resultsTable[compChoice].difference;
			if (playerDifference === resultsTable[compChoice].difference) {
				playerWinsCell.innerHTML = "TIE!";
				playerWinsCell.style.backgroundColor = "green";
				computerWinsCell.innerHTML = "TIE!"
				computerWinsCell.style.backgroundColor = "green";
			} else if (playerDifference < resultsTable[compChoice].difference) {
				playerWinsCell.innerHTML = "WINNER!";
				playerWinsCell.style.backgroundColor = "green";
				playerWins--;
				updateScoreboard(playerScoreboard, playerWins);
			} else {
				computerWinsCell.innerHTML = "WINNER!"
				computerWinsCell.style.backgroundColor = "green";
				computerWins++;
				updateScoreboard(computerScoreboard, computerWins);
			}
		} else {
			alert("That product is not possible with the four numbers drawn! Check your math again.");
		}
	}

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

	//Use the user-selected difficulty to select the computer's chosen equation
	function getComputerDifference(difficulty) {
		switch(difficulty) {
		case 1:
			return Math.floor((Math.random() * 3) + 4);
			break;
		case 2:
			return Math.floor((Math.random() * 4) + 1);
			break;
		default:
			return Math.floor(Math.random() * 3);
			break;
		}
	}

	//Grab the cards input by user and store them in an array
	function getCards() {
		console.log("PLAY button clicked");

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

		console.table(differencesOrdered);
		return(differencesOrdered);

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

	function updateScoreboard(winner, wins) {
		console.log(winner[wins]);
		winner[wins].style.backgroundColor = "green";
		//check for a match winner
		if (playerWins === 0 || computerWins === 4 ) {
			endMatch();
		}
	};

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

	function resetGame() {
		//reset global variables
		possibilities = [];
		resultsTable = null;
		difficultySetting = 1;
		playerProductIndex = null;
		//activate card input fields
		cards.forEach(card => card.disabled = false);
		//reset input fields
		document.getElementById("player").reset();
		document.getElementById("cards").reset();
		//show and hide divs respectively
		document.getElementById("play-button").style.display = "block";
		document.getElementById("player-score").style.display = "none";
		document.getElementById("scores-table").style.display = "none";
		drawButton.style.display = "block";
		drawText.style.display = "block";
		//Reset Scores Table
		playerWinsCell.innerHTML = "";
		playerWinsCell.style.backgroundColor = "white";
		computerWinsCell.innerHTML = ""
		computerWinsCell.style.backgroundColor = "white";
		//focus cursor on the first card
		cards[0].focus();

	}
