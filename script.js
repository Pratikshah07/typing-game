const word = document.getElementById("word");
        const text = document.getElementById("text");
        const scoreElement = document.getElementById("score");
        const timeElement = document.getElementById("time");
        const endgameElement = document.getElementById("end-game-container");
        const settingsButton = document.getElementById("settings-btn");
        const settings = document.getElementById("settings");
        const settingsForm = document.getElementById("settings-form");
        const difficultySelect = document.getElementById("difficulty");
        const gameStatus = document.getElementById("game-status");
        const difficultyMessage = document.getElementById("difficulty-message");

        const words = [
            "sigh", "tense", "airplane", "ball", "pies", "juice", "warlike", "bad",
            "north", "dependent", "steer", "silver", "highfalutin", "superficial",
            "quince", "eight", "feeble", "admit", "drag", "loving"
        ];

        let randomWord;
        let score = 0;
        let time = 10;
        let difficulty = localStorage.getItem("difficulty") || "medium";
        let timeInterval;
        let gameStarted = false;

        function resetGame() {
            // Clear the interval
            if (timeInterval) {
                clearInterval(timeInterval);
            }
            
            // Reset variables
            score = 0;
            time = 10;
            gameStarted = false;
            
            // Reset DOM elements
            scoreElement.innerHTML = "0";
            timeElement.innerHTML = "10s";
            text.value = "";
            text.disabled = false;
            
            // Reset game status
            gameStatus.style.display = 'block';
            gameStatus.textContent = "Type in the input box to start the game!";
            
            // Clear end game container
            endgameElement.style.display = "none";
            
            // Add new word
            addWordToDom();
            
            // Remove any error classes
            text.classList.remove('incorrect');
            timeElement.parentElement.classList.remove('incorrect');
        }

        function showDifficultyMessage(newDifficulty) {
            difficultyMessage.textContent = `Difficulty changed to ${newDifficulty}. New game started!`;
            difficultyMessage.style.display = 'block';
            setTimeout(() => {
                difficultyMessage.style.display = 'none';
            }, 2000);
        }

        function getRandomWord() {
            return words[Math.floor(Math.random() * words.length)];
        }

        function addWordToDom() {
            randomWord = getRandomWord();
            word.innerHTML = randomWord;
            word.classList.add('fadeIn');
        }

        function updateScore() {
            score++;
            scoreElement.innerHTML = score;
            scoreElement.parentElement.classList.add('correct');
            setTimeout(() => {
                scoreElement.parentElement.classList.remove('correct');
            }, 300);
        }

        function updateTime() {
            time--;
            timeElement.innerHTML = time + "s";
            if (time === 0) {
                clearInterval(timeInterval);
                gameOver();
            }
            if (time <= 3) {
                timeElement.parentElement.classList.add('incorrect');
            }
        }

        function gameOver() {
            endgameElement.innerHTML = `
                <h1>Time's Up! 🎮</h1>
                <p>Your final score is ${score}</p>
                <button onclick="resetGame()">Play Again</button>
            `;
            endgameElement.style.display = "flex";
            text.disabled = true;
        }

        function startGame() {
            if (!gameStarted) {
                gameStarted = true;
                gameStatus.style.display = 'none';
                timeInterval = setInterval(updateTime, 1000);
            }
        }

        // Initialize word without starting timer
        addWordToDom();

        text.addEventListener("input", (e) => {
            if (!gameStarted) {
                startGame();
            }

            const insertedText = e.target.value;
            if (insertedText === randomWord) {
                e.target.value = "";
                addWordToDom();
                updateScore();
                
                // Add time based on difficulty
                if (difficulty === "hard") time += 2;
                else if (difficulty === "medium") time += 3;
                else time += 5;
                
                timeElement.parentElement.classList.remove('incorrect');
                updateTime();
            } else {
                if (randomWord.startsWith(insertedText)) {
                    text.classList.remove('incorrect');
                } else {
                    text.classList.add('incorrect');
                }
            }
        });

        settingsButton.addEventListener("click", () => {
            settings.classList.toggle("show");
        });

        settingsForm.addEventListener("change", (e) => {
            const newDifficulty = e.target.value;
            difficulty = newDifficulty;
            localStorage.setItem("difficulty", difficulty);
            
            // Reset and start new game
            resetGame();
            settings.classList.remove("show");
            showDifficultyMessage(newDifficulty);
        });

        // Initialize difficulty select
        difficultySelect.value = difficulty;