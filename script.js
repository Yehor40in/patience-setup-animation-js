function createCards() {
	let suits = ['C', 'H', 'S', 'D'];
	let values = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
	let layersCount = 1;
	let offset = 15;
	//creating cards, so we have more cards (amount of cards in previous column + 1) in each further column
	for (let i = 0; i < values.length; i++) {
		for (let j = 0; j < suits.length; j++) {
			
			//creating a new canvas which will contain a card image
			let subLayer = document.createElement('canvas');
			let ctxSubLayer = subLayer.getContext('2d');
			subLayer.setAttribute('class', 'sub-layer-canvas');
			subLayer.setAttribute('id', 'sub-layer' + layersCount);
			subLayer.setAttribute('name', 'cards/' + values[i] + suits[j] + '.png');
			
			//lets make them move (drag'n'drop)
			subLayer.onmousedown = function () {
				
				let coords = subLayer.getBoundingClientRect();
				let shiftX = event.pageX - coords.left;
				let shiftY = event.pageY - coords.top;
				
				document.onmousemove = function (event) {
					subLayer.style.left = event.pageX - shiftX + 'px';
					subLayer.style.top = event.pageY - shiftY + 'px';
				}
				subLayer.onmouseup = function () {
					document.onmousemove = null;
					subLayer.onmousedup = null;
				}					
			}
			//flip the card
			subLayer.onclick = function () {
				
				subLayer.style.transition = '1s';
				subLayer.style.transform = 'rotateY(360deg)';
				let front = new Image();
				front.src = subLayer.getAttribute('name');
				
				front.onload = function () {
					setTimeout(function() {
						ctxSubLayer.drawImage(front, 0, 0, subLayer.width, subLayer.height);
						subLayer.style.transition = 'none';
					}, 235);
				}
			}
			subLayer.style.left = offset + 'px';
			document.body.appendChild(subLayer);
			//drawing card image on canvas
			let image = new Image();
			image.src = 'cards/back.png';
			
			image.onload = function () {
				ctxSubLayer.drawImage(image, 0, 0, subLayer.width, subLayer.height);
			}
			layersCount++;
			offset += 2;
		}
	}
}
//a function, that moves cards 
//takes as arguments a card that should be moved, and an offset on x and y axis
function moveCard(card, x, y) {
	
	let style = window.getComputedStyle(card);
	let left = parseInt(style.getPropertyValue('left'));
	let top = parseInt(style.getPropertyValue('top'));
	
	//we multiplicate these values because we calculate the position of a card
	//according to its indexes in cards array
	let finalX = y * 200 + 340;
	let finalY = x * 50 + 150;
	let timer = setInterval(move, 1/100);
	
	function move() {
		if (left > finalX) {
			clearInterval(timer);
		} else {
			if (top < finalY) {
				top++;
				card.style.top = top + 'px';
			}
			left += 2;
			card.style.left = left + 'px';
		}
	}
}
function flipHorizontally(layer){
	let ctx = layer.getContext('2d');
	layer.style.transition = '1s';
	layer.style.transform = 'rotateY(360deg)';
	let front = new Image();
	front.src = layer.getAttribute('name');
	
	front.onload = function () {
		setTimeout(function() {
			ctx.drawImage(front, 0, 0, layer.width, layer.height);
		}, 235);
	}
}
function action() {
	let cardsTable = [[],[],[],[],[],[],[]];
	let cardsCount = 1;
	let amount = 0;
	let canvasMain = document.getElementById('main-layer-canvas');
	let ctxMain = canvasMain.getContext('2d');
	createCards();
	let i, j;
	
	//set the cards in a triangle table ascendingly
	for (i = 0; i < 7; i++) {
		j = amount;
		while (j < 6) {
			cardsTable[i][j] = document.getElementById('sub-layer' + cardsCount);
			cardsCount++;
			j++;
		}
		amount++;
	}
	//moving cards to their start positions
	for (i = 0; i < 7; i++) {
		for (j = 0; j < 6; j++) {
			if (cardsTable[i][j] != undefined) {
				moveCard(cardsTable[i][j], i, j);
			}
		}
	}
	for (i = 0; i < 7; i++) {
		for (j = 0; j < 6; j++) {
			//if we are at least card from bottom
			if (cardsTable[i][j] != undefined && cardsTable[i][j - 1] === undefined) {
				//flip it
				flipHorizontally(cardsTable[i][j]);
			}
		}
	}
	//we should have some more additional cards for our game
	let temp = 1;
	for (i = 22; i < 30; i++) {
		let card = document.getElementById('sub-layer' + i);
		moveCard(card, temp, 0);
		flipHorizontally(card);
		temp++;
	}
}
