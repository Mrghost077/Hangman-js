let wordLists = {};

async function loadWordLists() {
    const response = await fetch('wordLists.json');
    wordLists = await response.json();
    startGame(); 
}

document.addEventListener('DOMContentLoaded', loadWordLists);;

let chosenWord = '';
let hiddenWord = '';
let maxAttempts = 6; 
let score = 0; 
let gameOver = false; 

const hangmanStages = [
    `
 ------
 |    |
 |
 |
 |
 |
 |
 =========
`,
    `
 ------
 |    |
 |    O
 |
 |
 |
 |
 =========
`,
    `
 ------
 |    |
 |    O
 |    |
 |
 |
 |
 =========
`,
    `
 ------
 |    |
 |    O
 |   /|
 |
 |
 |
 =========
`,
    `
 ------
 |    |
 |    O
 |   /|\\
 |
 |
 |
 =========
`,
    `
 ------
 |    |
 |    O
 |   /|\\
 |   /
 |
 |
 =========
`,
    `
 ------
 |    |
 |    O
 |   /|\\
 |   / \\
 |
 |
 =========
`
];

const guessedLetters = [];
let attempts = 0;

const hangmanElem = document.getElementById('hangman');
const hangmanContainerElem = document.getElementById('hangman-container');
const wordContainerElem = document.getElementById('word-container');
const keyboardContainerElem = document.getElementById('keyboard-container');
const messageElem = document.getElementById('message');
const scoreElem = document.getElementById('score');

const displayWord = (word) => {
    wordContainerElem.innerHTML = word.split('').join(' ');
};

const displayHangman = (stage) => {
    hangmanElem.innerHTML = hangmanStages[stage];
};

const displayScore = (score) => {
    scoreElem.innerText = score;
};

const createKeyboard = () => {
    keyboardContainerElem.innerHTML = ''; 
    const qwertyRows = [
        'q w e r t y u i o p',
        'a s d f g h j k l',
        'z x c v b n m'
    ];

    qwertyRows.forEach(row => {
        const rowElem = document.createElement('div');
        rowElem.classList.add('keyboard-row');
        row.split(' ').forEach(letter => {
            const button = document.createElement('button');
            button.classList.add('key');
            button.innerText = letter;
            button.addEventListener('click', () => guessLetter(letter));
            rowElem.appendChild(button);
        });
        keyboardContainerElem.appendChild(rowElem);
    });
};

const disableKey = (letter) => {
    const key = Array.from(keyboardContainerElem.querySelectorAll('.key')).find(key => key.innerText === letter);
    if (key) {
        key.classList.add('disabled');
        key.disabled = true;
    }
};

const guessLetter = (letter) => {
    if (gameOver || guessedLetters.includes(letter)) return; 

    if (chosenWord.includes(letter)) {
        hangmanContainerElem.style.backgroundColor = 'green';
        setTimeout(() => {
            hangmanContainerElem.style.backgroundColor = 'white';
        }, 500);
        for (let i = 0; i < chosenWord.length; i++) {
            if (chosenWord[i] === letter) {
                hiddenWord = hiddenWord.substring(0, i) + letter + hiddenWord.substring(i + 1);
            }
        }
        score += 10; 
    } else {
        hangmanContainerElem.style.backgroundColor = 'red';
        setTimeout(() => {
            hangmanContainerElem.style.backgroundColor = 'white';
        }, 500);
        attempts++;
        score -= 5; 
    }

    
    if (score < 0) {
        score = 0;
    }

    guessedLetters.push(letter);
    disableKey(letter);
    displayWord(hiddenWord);
    displayHangman(attempts);
    displayScore(score); 

    
    if (!hiddenWord.includes('_')) {
        gameOver = true;
        localStorage.setItem('endMessage', 'Congratulations! You guessed the word: ' + chosenWord);
        localStorage.setItem('endStatus', 'win');
        navigateToEndScreen();
    } else if (attempts >= maxAttempts) {
        gameOver = true;
        localStorage.setItem('endMessage', 'Sorry, you ran out of attempts. The word was: ' + chosenWord);
        localStorage.setItem('endStatus', 'lose');
        navigateToEndScreen();
    }
};

const disableAllKeys = () => {
    Array.from(keyboardContainerElem.querySelectorAll('.key')).forEach(key => {
        key.classList.add('disabled');
        key.disabled = true;
    });
};

const navigateToEndScreen = () => {
    disableAllKeys();
    localStorage.setItem('score', score); 
    window.location.href = 'end.html'; 
};

function startGame() {
    gameOver = false; 
    const difficulty = localStorage.getItem('difficulty'); 
    const wordList = wordLists[difficulty];
    chosenWord = wordList[Math.floor(Math.random() * wordList.length)];
    hiddenWord = Array(chosenWord.length).fill('_').join('');
    attempts = 0;
    guessedLetters.length = 0;

    createKeyboard();
    displayWord(hiddenWord);
    displayHangman(attempts);
    messageElem.innerText = '';
    hangmanContainerElem.style.backgroundColor = 'white';
    displayScore(score); 
}

document.addEventListener('DOMContentLoaded', startGame);
