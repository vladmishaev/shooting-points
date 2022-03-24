import { ctx, canvas } from "./Canvas.js";
import Player from './Player.js';
import Enemy from './Enemy.js';
import Particle from './Particle.js';
import Projectile from './Projectile.js';

class Game {

    constructor(settings) {

        this.player = null;
        this.animationId = null;
        this.settings = settings;
        this.enemies = [];
        this.particles = [];
        this.projectiles = [];
    }


    getVelocity(angle, speed) {

        return {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
    }

    getСoordinatesEnemy(radius) {

        let x, y;

        if (Math.random() < 0.5) {

            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;

        } else {

            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;

        }

        return { x, y };

    }

    createEnemy() {

        const { speedEnemy, minHealthEnemy, maxHealthEnemy } = this.settings;

        const radius = Math.random() * (maxHealthEnemy - minHealthEnemy) + minHealthEnemy;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

        const { x, y } = this.getСoordinatesEnemy(radius);

        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        );

        const velocity = this.getVelocity(angle, speedEnemy);

        return new Enemy(x, y, radius, color, velocity);
    }

    spamEnemies() {

        const { spawnTimeEnemies } = this.settings;

        setInterval(() => {
            const enemy = this.createEnemy();
            this.enemies.push(enemy);
        }, spawnTimeEnemies);

    }

    createProjectile(event) {

        const { speedProjectile } = this.settings;

        const angle = Math.atan2(
            event.clientY - canvas.height / 2,
            event.clientX - canvas.width / 2
        );

        const velocity = this.getVelocity(angle, speedProjectile);

        return new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity);
    }


    addEventListenerShot() {

        window.addEventListener('click', event => {

            const projectile = this.createProjectile(event);
            this.projectiles.push(projectile);

        })
    }

    createPlayer() {
        const xPlayer = canvas.width / 2;
        const yPlayer = canvas.height / 2;

        this.player = new Player(xPlayer, yPlayer, 20, "white");
        this.player.draw();

        this.addEventListenerShot();

    }

    clearFrame() {

        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.player.draw();

    }

    particlesFrame() {

        this.particles.forEach((particle, indexPart) => {
            //check if the particles are dissolved
            if (particle.alpha <= 0) {
                //remove particle
                this.particles.splice(indexPart, 1);
            } else {
                particle.update();
            }
        });

    }

    clearParticle(enemy, projectile) {

        for (let i = 0; i < enemy.radius * 2; i++) {

            const x = (Math.random() - 0.5) * (Math.random() * 8);
            const y = (Math.random() - 0.5) * (Math.random() * 8);

            const particle = new Particle(projectile.x, projectile.y, Math.random() * 3, enemy.color, { x, y });

            this.particles.push(particle);
        }

    }

    projectilesFrame() {

        this.projectiles.forEach((projectile, projectileIndex) => {
            projectile.update();

            //Checking the projectile left the map
            if (projectile.x < 0 || projectile.x > canvas.width ||
                projectile.y < 0 || projectile.y > canvas.height) {

                //remove the projectile   
                this.projectiles.splice(projectileIndex, 1);

            }
        });
    }

    enemyClashProjectiles(enemy, enIndex) {

        const { playerDamage,minHealthEnemy } = this.settings;

        this.projectiles.forEach((projectile, projIndex) => {

            const collisionProjectile = enemy.checkingCollisions(projectile);

            //when projectiles touch enemy 
            if (collisionProjectile) {

                this.clearParticle(enemy, projectile);

                if (enemy.radius - minHealthEnemy > minHealthEnemy) {

                    gsap.to(enemy, {
                        radius: enemy.radius - playerDamage
                    });

                    this.projectiles.splice(projIndex, 1);

                } else {

                    this.enemies.splice(enIndex, 1);
                    this.projectiles.splice(projIndex, 1);

                }

            }
        });
    }

    enemiesFrame() {
        this.enemies.forEach((enemy, index) => {

            enemy.update();

            const collisionPlayer = enemy.checkingCollisions(this.player);
            if (collisionPlayer) {
                this.endGame();
            }

            this.enemyClashProjectiles(enemy, index);

        });

    }

    frames() {

        this.animationId = requestAnimationFrame(() => {
            this.frames()
        });

        this.clearFrame();
        this.particlesFrame();
        this.projectilesFrame();
        this.enemiesFrame();

    }

    endGame() {

        cancelAnimationFrame(this.animationId);
    }

    StartGame() {

        this.createPlayer();
        this.frames();
        this.spamEnemies();
    }
}

export default Game;