const wordLists = {
    easy: ['cat', 'dog', 'fish', 'bird', 'tree'],
    medium: ['javascript', 'hangman', 'program', 'function', 'variable'],
    hard: ['transcendental', 'phenomenological', 'psychophysiological', 'thermodynamics']
};

let chosenWord = '';
let hiddenWord = '';
let maxAttempts = 6; // Set max attempts to 6 for all difficulty levels
let score = 0; // Initialize score
let gameOver = false; // Flag to indicate if the game is over

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
    keyboardContainerElem.innerHTML = ''; // Clear previous keyboard
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
    if (gameOver || guessedLetters.includes(letter)) return; // Prevent further input if the game is over or letter already guessed

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
        score += 10; // Increase score for correct guess
    } else {
        hangmanContainerElem.style.backgroundColor = 'red';
        setTimeout(() => {
            hangmanContainerElem.style.backgroundColor = 'white';
        }, 500);
        attempts++;
        score -= 5; // Decrease score for wrong guess
    }

    // Ensure the score doesn't go negative
    if (score < 0) {
        score = 0;
    }

    guessedLetters.push(letter);
    disableKey(letter);
    displayWord(hiddenWord);
    displayHangman(attempts);
    displayScore(score); // Update score display

    // Check if the game is won or lost
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
    localStorage.setItem('score', score); // Save score to local storage
    window.location.href = 'end.html'; // Navigate to end screen
};

function startGame() {
    gameOver = false; // Reset game over flag
    const difficulty = localStorage.getItem('difficulty'); // Get difficulty from local storage
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
    displayScore(score); // Initialize score display
}

document.addEventListener('DOMContentLoaded', startGame);
