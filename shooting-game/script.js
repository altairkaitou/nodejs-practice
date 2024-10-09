

document.addEventListener("DOMContentLoaded", function() {
    const gameArea = document.getElementById('game-area');
    const player = document.getElementById('player');

    const lifeDisplay = document.getElementById('life-display');



    let playerPosX = window.innerWidth / 2 - 25;
    let playerPosY = window.innerHeight - 70;
    let playerLives = 3;

    let bullets = [];
    let enemies = [];

    //function display Life

    function LifeDisplay() {
        lifeDisplay.textContent = `Lives: ${playerLives}`;
    }

    LifeDisplay();

    document.addEventListener('keydown', (e) => {
        if (e.key == "a" || e.key == 'A') {
            if (playerPosX > 0) {
                playerPosX -= 20;
                player.style.left = `${playerPosX}px`;
            }
        } else if (e.key == 'd' || e.key == 'D') {
            if (playerPosX < window.innerWidth - 50) {
                playerPosX += 20;
                player.style.left = `${playerPosX}px` ;
            }
        } else if (e.key === ' ') {
            shootBullet();
        }
    })

    gameArea.addEventListener('click', shootBullet);

    function shootBullet() {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        bullet.style.left = `${playerPosX + (30 / 2) - (10/2)}px`;
        bullet.style.top = `${playerPosY}px`;
        gameArea.appendChild(bullet);
        bullets.push(bullet);

        let bulletInterval = setInterval(() => {
            const bulletTop = parseInt(bullet.style.top);
            if (bulletTop <= 0) {
                clearInterval(bulletInterval);
                bullet.remove();
                bullets = bullets.filter(b => b !== bullet);
            } else {
                bullet.style.top = `${bulletTop - 10}px`;
            }
            
            // Check va chạm giữa đạn và kẻ địch
            enemies.forEach(enemy => {
                if(checkCollision(bullet, enemy)) {
                    clearInterval(bulletInterval);
                    bullet.remove();
                    enemy.remove();

                    bullets = bullets.filter(b => b !== bullet);
                    enemies = enemies.filter(e => e !== enemy);
                    
                }

            })
        }, 30)
    }

    function createEnemy() {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.left = `${Math.random() * (window.innerWidth - 50)}px`
        enemy.style.top = '0px' ;
        gameArea.appendChild(enemy);
        enemies.push(enemy);

        let enemyInterval = setInterval(() => {
            const enemyTop = parseInt(enemy.style.top);
            if (enemyTop >= window.innerHeight - 50) {
                clearInterval(enemyInterval);
                enemy.remove();
                enemies = enemies.filter(e => e !== enemy);
                checkPlayerCollision(enemy);
            } else {
                enemy.style.top = `${enemyTop + 5}px`;
                checkPlayerCollision(enemy);
            }

        }, 30);
    }

    setInterval(createEnemy, 2000);

    function checkCollision(bullet, enemy) {
        const bulletRect = bullet.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();

        return !(
            bulletRect.top > enemyRect.bottom ||
            bulletRect.bottom < enemyRect.top ||
            bulletRect.right < enemyRect.left ||
            bulletRect.left > enemyRect.right
        )

    }

    function checkPlayerCollision(enemy) {
        const playerRect = player.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();

        //Check if enemy touches the player
        if (!(
            playerRect.top > enemyRect.bottom ||
            playerRect.bottom < enemyRect.top ||
            playerRect.right < enemyRect.left ||
            playerRect.left > enemyRect.right
        )) {
            loseLife();
            enemy.remove();
            enemies = enemies.filter(e => e !== enemy);
        }
    }

    function loseLife() {
        playerLives--;
        LifeDisplay();

        if (playerLives <= 0) {
            endGame();
        }
    }



    function endGame() {
        alert("Game Over!");
        window.location.reload();
    }


})


var xhr = new XMLHttpRequest();

