const wordLists = {
    easy: ['cat', 'dog', 'fish', 'bird', 'tree'],
    medium: ['javascript', 'hangman', 'program', 'function', 'variable'],
    hard: ['transcendental', 'phenomenological', 'psychophysiological', 'thermodynamics']
};

let chosenWord = '';
let hiddenWord = '';
let maxAttempts = 6;
let score = 0; // Initialize score

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
const startButton = document.getElementById('start-button');
const difficultySelect = document.getElementById('difficulty');

startButton.addEventListener('click', startGame);

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
        'qwertyuiop',
        'asdfghjkl',
        'zxcvbnm'
    ];

    qwertyRows.forEach(row => {
        const rowElem = document.createElement('div');
        rowElem.classList.add('keyboard-row');
        row.split('').forEach(letter => {
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
    if (guessedLetters.includes(letter)) return;

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
    guessedLetters.push(letter);
    disableKey(letter);
    displayWord(hiddenWord);
    displayHangman(attempts);
    displayScore(score); // Update score display

    if (!hiddenWord.includes('_')) {
        messageElem.innerText = 'Congratulations! You guessed the word: ' + chosenWord;
        disableAllKeys();
    } else if (attempts >= maxAttempts) {
        messageElem.innerText = 'Sorry, you ran out of attempts. The word was: ' + chosenWord;
        disableAllKeys();
    }
};

const disableAllKeys = () => {
    Array.from(keyboardContainerElem.querySelectorAll('.key')).forEach(key => {
        key.classList.add('disabled');
        key.disabled = true;
    });
};

function startGame() {
    const difficulty = difficultySelect.value;
    const wordList = wordLists[difficulty];
    chosenWord = wordList[Math.floor(Math.random() * wordList.length)];
    hiddenWord = Array(chosenWord.length).fill('_').join('');
    attempts = 0;
    guessedLetters.length = 0;

    switch (difficulty) {
        case 'easy':
            maxAttempts = 8;
            break;
        case 'medium':
            maxAttempts = 6;
            break;
        case 'hard':
            maxAttempts = 4;
            break;
        default:
            maxAttempts = 6;
    }

    createKeyboard();
    displayWord(hiddenWord);
    displayHangman(attempts);
    messageElem.innerText = '';
    hangmanContainerElem.style.backgroundColor = 'white';
    displayScore(score); // Initialize score display
}

startGame();
