
import { ctx } from "./Canvas.js";

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
    checkingCollisions(element) {

        const distance = Math.hypot(element.x - this.x, element.y - this.y);

        if (distance - this.radius - element.radius < 1) {
            return true;
        } else {
            return false;
        }
    }
}

export default Enemy;