// Fishy's Coin Collection Game
// Collect coins before time runs out!

namespace SpriteKind {
    export const Coin = SpriteKind.create()
}

// Game variables
let fishy: Sprite
let gameTimer: number
let coinsCollected: number = 0
let gameActive: boolean = true

// Create the game background (underwater tank)
scene.setBackgroundColor(9)  // Blue background for water

// Create Fishy sprite
fishy = sprites.create(img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . 1 1 1 1 . . . . . .
    . . . . . 1 1 1 1 1 1 . . . . .
    . . . . 1 1 1 1 1 1 1 1 . . . .
    . . . 1 1 1 1 f f 1 1 1 1 . . .
    . . . 1 1 1 1 f f 1 1 1 1 . . .
    . . . 1 1 1 1 1 1 1 1 1 1 . . .
    . . . . 1 1 1 1 1 1 1 1 . . . .
    . . . . . 1 1 1 1 1 1 . . . . .
    . . . . . . 1 1 1 1 . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`, SpriteKind.Player)

fishy.setPosition(80, 100)

// Set up game timer (60 seconds)
gameTimer = 60

// Display initial score
showScore()

// Setup coin spawner - removed assignment since game.onUpdateInterval returns void
game.onUpdateInterval(500, function() {
    if (gameActive) {
        spawnCoin()
    }
})

// Handle Fishy movement with arrow keys
controller.moveSprite(fishy, 100, 100)

// Keep Fishy in bounds
fishy.setFlag(SpriteFlag.StayInScreen, true)

// Handle coin collection
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function(sprite: Sprite, otherSprite: Sprite) {
    coinsCollected += 1
    otherSprite.destroy()
    music.powerUp.play()
    showScore()
})

// Spawn coins randomly
function spawnCoin() {
    let coin = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . f f f . . . . . .
        . . . . . . f f f f f . . . . .
        . . . . . f f f f f f f . . . .
        . . . . f f f f f f f f f . . .
        . . . f f f f f f f f f f f . .
        . . . f f f f f f f f f f f . .
        . . . . f f f f f f f f f . . .
        . . . . . f f f f f f f . . . .
        . . . . . . f f f f f . . . . .
        . . . . . . . f f f . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `, SpriteKind.Coin)
    
    let randomX = randint(10, 150)
    let randomY = randint(20, 50)
    coin.setPosition(randomX, randomY)
    coin.setVelocity(0, 50)  // Coins fall down
    
    // Destroy coin after 2 seconds if not collected
    control.runInParallel(function() {
        pause(2000)
        if (coin != null) {
            coin.destroy()
        }
    })
}

// Update timer and check if game is over
game.onUpdateInterval(1000, function() {
    if (gameActive) {
        gameTimer -= 1
        showScore()
        
        if (gameTimer <= 0) {
            endGame()
        }
    }
})

// Display score and timer
function showScore() {
    info.setScore(coinsCollected)
    info.setLife(gameTimer)
}

// End game
function endGame() {
    gameActive = false
    game.over(true)
}
