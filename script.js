let wordsList = [];
let currentWordId = 0;

let splitWord = [];
let wordAnswerLetters = [];
let wordAnswers = [];
let wordAnswerId = 0;

function openInWiktionary() {
	window.open(
	"https://pl.wiktionary.org/wiki/"+wordsList[currentWordId],
	"_blank");
}

function openInWSJP() {
	window.open(
	"https://wsjp.pl/szukaj/podstawowe/wyniki?szukaj="+wordsList[currentWordId],
	"_blank");
}

function openInCambridge() {
	window.open(
	"https://dictionary.cambridge.org/dictionary/polish-english/"+wordsList[currentWordId],
	"_blank");
}

function openInSeznam() {
	window.open(
	"https://slovnik.seznam.cz/preklad/polsky_cesky/"+wordsList[currentWordId],
	"_blank");
}

//get random word not equal to current
function wordNext() {
	splitWord = [];
	wordAnswerLetters = [];
	wordAnswers = [];
	wordAnswerId = 0;

	document.getElementById("aaa").style.setProperty("display", "none");
	document.getElementById("eee").style.setProperty("display", "none");
	document.getElementById("correct").replaceChildren([]);

	currentWordId = Math.trunc(Math.random()*wordsList.length);

	splitWord = wordsList[currentWordId].split(/(ą|ę)/);
	wordAnswerLetters = splitWord.filter((v) => { return v == 'ą' || v == 'ę'; });
	console.log(splitWord);

	let elem = document.getElementById("word");
	elem.replaceChildren();
	let addedFirstElem = false;
	splitWord.forEach((s, i, a) => {
		if(s === 'ą' || s === 'ę') {
			if(!addedFirstElem) {
				if(s == 'ą') document.getElementById("aaa").style.setProperty("display", "block");
				else if(s == 'ę') document.getElementById("eee").style.setProperty("display", "block");
				addedFirstElem = true;
			}

			let letterElem = document.createElement('span');
			letterElem.id = "wordLetter";
			letterElem.textContent = s;
			elem.appendChild(letterElem);

			//add correct category answer
			if(i == splitWord.length-1) {
				//at end: A
				wordAnswers.push('A');
			}
			else if(
				splitWord[i+1].startsWith('l') ||
				splitWord[i+1].startsWith('ł')
			) {
				wordAnswers.push('B')
			}
			
			else if(
				splitWord[i+1].startsWith('ć') ||
				splitWord[i+1].startsWith('ci') ||
				splitWord[i+1].startsWith('dż')
			) {
				wordAnswers.push('F')
			}
			else if(
				splitWord[i+1].startsWith('f') ||
				splitWord[i+1].startsWith('w') ||
				splitWord[i+1].startsWith('s') ||
				splitWord[i+1].startsWith('z') ||
				splitWord[i+1].startsWith('sz') ||
				splitWord[i+1].startsWith('ż') ||
				splitWord[i+1].startsWith('rz') ||
				splitWord[i+1].startsWith('ś') ||
				splitWord[i+1].startsWith('ź') ||
				splitWord[i+1].startsWith('ch')
			) {
				wordAnswers.push('C')
			}
			else if(
				splitWord[i+1].startsWith('b') ||
				splitWord[i+1].startsWith('p')
			) {
				wordAnswers.push('D')
			}
			else if(
				splitWord[i+1].startsWith('k') ||
				splitWord[i+1].startsWith('g') ||
				splitWord[i+1].startsWith('t') ||
				splitWord[i+1].startsWith('d') ||
				splitWord[i+1].startsWith('c') ||
				splitWord[i+1].startsWith('dz') ||
				splitWord[i+1].startsWith('cz')
			) {
				wordAnswers.push('E')
			}
		}
		else {
			elem.append(document.createTextNode(s));
		}
	});

	console.log(wordAnswers);
}

function wordCheck(category) {
	if(wordAnswers.length == 0) return;

	let elem = document.getElementById("correct");
	if(wordAnswers[wordAnswerId] == category) {
		elem.style.setProperty("color", "green");
		elem.textContent = "Tak! Dobrze! (Yes! Correct!)";
	}
	else {
		elem.style.setProperty("color", "red");
		elem.textContent = "Niestety ta odpowiedż jest błędna. (Sadly this answer is wrong.)\nCorrect: "+wordAnswers[wordAnswerId];
	}

	document.getElementById("aaa").style.setProperty("display", "none");
	document.getElementById("eee").style.setProperty("display", "none");

	wordAnswerId++;

	if(wordAnswerId >= wordAnswers.length) { 
		return;
	}

	if(wordAnswerLetters[wordAnswerId] == 'ą') 
		document.getElementById("aaa").style.setProperty("display", "block");
	else if(wordAnswerLetters[wordAnswerId] == 'ę')
		document.getElementById("eee").style.setProperty("display", "block");
		
}

function wordReset() {
	wordsList = [];
	currentWordId = 0;
	splitWord = [];
	wordAnswers = [];
	wordAnswerId = 0;
}

function wordMakeList(text) {
	wordsList = text.split(' ');
	wordsList.pop();
	console.log(wordsList);
	wordNext();
}

function wordInit() {
	wordReset();

	console.log("Loading...")
	let request = new XMLHttpRequest();
	request.addEventListener("loadend", (e) => {
		wordMakeList(e.target.responseText)
	});
	request.open("GET", "wordlist.txt");
	request.send();
}

function wordLoadAE() {
	wordReset();

	console.log("Loading AE...")
	let request = new XMLHttpRequest();
	request.addEventListener("loadend", (e) => {
		wordMakeList(e.target.responseText)
	});
	request.open("GET", "aande.txt");
	request.send();
}

function wordLoadCustom() {
	wordReset();

	let input = document.createElement("input");
	input.type = "file"; //single file

	input.addEventListener("change", (e) => {
		let fileread = new FileReader();
		let td = new TextDecoder("utf-8");
		fileread.addEventListener("loadend", (e) => {
			wordMakeList(td.decode(e.target.result));
		});
		fileread.readAsArrayBuffer(input.files[0]);
	});

	input.click();
}

window.addEventListener("keyup", (e) => {
	let k = e.key.toUpperCase();
	switch(k) {
		case('A'):
		case('B'):
		case('C'):
		case('D'):
		case('E'):
		case('F'):
			wordCheck(k);
			break;

		case('1'):
			wordCheck('A');
			break;
		case('2'):
			wordCheck('B');
			break;
		case('3'):
			wordCheck('C');
			break;
		case('4'):
			wordCheck('D');
			break;
		case('5'):
			wordCheck('E');
			break;
		case('6'):
			wordCheck('F');
			break;

		case(' '):
			wordNext();
			break;
	}
});

wordInit();

let buttons = document.getElementsByClassName("special");
for(let button of buttons) {
	button.removeAttribute("disabled");
}