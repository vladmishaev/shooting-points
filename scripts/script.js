"use strict"

const canvas = document.querySelector("[data-playing-field]");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth - 20;
canvas.height = innerHeight;

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;

    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

    }
}


const xPlayer = canvas.width / 2;
const yPlayer = canvas.height / 2;

const player = new Player(xPlayer, yPlayer, 20, "white");
player.draw();


class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

    }
}

const enemies = [];


function spamEnemies() {

    setInterval(() => {
        let x;
        let y;
        const radius = Math.random() * (30 - 10) + 10;
        if (Math.random() < 0.5) {

            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;

        } else {

            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;

        }

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

        const speedEnemy = 1;

        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        );

        const velocity = {
            x: Math.cos(angle) * speedEnemy,
            y: Math.sin(angle) * speedEnemy
        };

        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1500)

}


const friction = 0.99;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();

    }
    update() {
        this.draw();

        this.velocity.x *= friction;
        this.velocity.y *= friction;

        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

        this.alpha -= 0.01;

    }
}

const particles = [];



class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;

    }

    draw() {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

    }
}

const projectiles = [];

let animationId;

function animation() {
    animationId = requestAnimationFrame(animation);
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

    particles.forEach((particle, indexPart) => {

        if (particle.alpha <= 0) {
            particles.splice(indexPart, 1);
        } else {
            particle.update();
        }
    });

    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update();

        if (projectile.x < 0 || projectile.x > canvas.width ||
            projectile.y < 0 || projectile.y > canvas.height) {

            projectiles.splice(projectileIndex, 1);

        }
    });


    enemies.forEach((enemy, index) => {

        enemy.update();

        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        //end game 
        if (distance - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);
        }

        projectiles.forEach((projectile, projIndex) => {
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            //when projectiles touch enemy 
            if (distance - enemy.radius - projectile.radius < 1) {

                for (let i = 0; i < enemy.radius * 2; i++) {

                    const x = (Math.random() - 0.5) * (Math.random() * 8);
                    const y = (Math.random() - 0.5) * (Math.random() * 8);

                    particles.push(
                        new Particle(projectile.x,
                            projectile.y, Math.random() * 3, enemy.color, { x, y })
                    );

                }

                if (enemy.radius - 10 > 10) {

                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    });

                    projectiles.splice(projIndex, 1);

                } else {

                    enemies.splice(index, 1);
                    projectiles.splice(projIndex, 1);

                }


            }
        });
    });

}

window.addEventListener('click', event => {

    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    );

    const speedProj = 5;

    const velocity = {
        x: Math.cos(angle) * speedProj,
        y: Math.sin(angle) * speedProj
    };


    projectiles.push(
        new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
    );



})

animation();
spamEnemies();