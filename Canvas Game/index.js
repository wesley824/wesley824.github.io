/* CANVAS SETUP */
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

/* SCORE */
const scoreElement = document.querySelector('#scoreElement')
const endScore = document.querySelector('#endScore')

/* START BUTTON */
const startButton = document.querySelector('#startButton')

/* START MENU */
const start = document.querySelector('#start')

/* INITIALIZER */
init = () => {
    player = new Player(x, y, 20, 'white')
    projectiles = []
    enemies = []
    particles = []
    score = 0
    scoreElement.innerHTML = score
    endScore.innerHTML = score
}


/* PLAYER SETUP */
class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
};


/* PLAYER POSITION */
const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 20, 'white');


/* PLAYER PROJECTILE */
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

let projectiles = []


/* ENEMY */
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}
let enemies = []


/* PARTICLES */
const friction = 0.99
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}
let particles = []



/* SPAWN ENEMIES */
function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4
        
        let x
        let y

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : 
                canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : 
            canvas.height + radius
        }
        
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        
        enemies.push(new Enemy(x, y, radius, color, velocity))
        console.log('spawn enemy');
    }, 1100)
}


/* PROJECTILE LOCATION */
const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', {
    x: 1,
    y: 1
})

const projectile2 = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'green', {
    x: -1,
    y: -1
})


/* ANIMATION */
let animationId 
let score = 0
function animate() {
    animationId = requestAnimationFrame(animate)
    
    /* SETS BACKGROUND TO HAVE TRACER FX*/
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update()
        }

    })
    projectiles.forEach((projectile, index) => {
        projectile.update()

        /* REMOVES PROJECTILES WHEN OFF SCREEN */
        if (projectile.x + projectile.radius < 0 || 
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(projectileIndex, 1)
            }, 0)
        }
    })
    
    enemies.forEach((enemy, index) => {
        enemy.update()
        
        /* STOPS GAMES WHEN ENEMY & PLAYER COLLIDE */
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            start.style.display = 'flex'
            endScore.innerHTML = score
        }
        
        /* REMOVES ENEMY WHEN PROJECTILE & ENEMY COLLIDE */
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            
            if (dist - enemy.radius - projectile.radius < 1) {

                /* PARTICLE CREATION */
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, 
                        {x: (Math.random() - 0.5) * (Math.random() * 4), 
                            y: (Math.random() - 0.5) * (Math.random() * 4)
                        }))
                }

                /* ENEMIES */
                if (enemy.radius - 10 > 5) {
                    
                    /* INCREASE SCORE */
                    score += 100
                    scoreElement.innerHTML = score
                    
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                } else {
                    score += 250
                    scoreElement.innerHTML = score
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }
            }
        });
    })
    
    console.log('animation')
};



/* PROJECTILE LOCATION ON CLICK*/
addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'cyan', velocity))
    console.log('shot fired')
});

startButton.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    start.style.display = 'none'
})