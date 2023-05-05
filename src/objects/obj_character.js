import { Assets, Sprite } from 'pixi.js';
import { character_size, screen_size } from "../constants/sizes";

export const Character = {
    _jumping: false,
    _x: 0, _y: 0, 
    _x_speed: 0, _y_speed: 0,

    _going_left: false, _going_right: false,

    /**
     * @type {Sprite}
     */
    _sprite: null,

    _score: 0,
    
    async init(x = 0, y = 0) {
        this._x = x;
        this._y = y;
        const texture = await Assets.load('sprites/player.svg');
        
        this._sprite = new Sprite(texture);
        this._sprite.x = this._x;
        this._sprite.y = this._y;
        this.draw([]);
        return this;
    },

    draw(bricks) {
        if(this._going_left) {
            this._x_speed -= character_size.width * 0.015;
        }
        if(this._going_right) {
            this._x_speed += character_size.width * 0.015;
        }

        this._x += this._x_speed;

        // air friction
        this._x_speed *= 0.9;

        this.fall(bricks);

        this._sprite.x = this._x;
        this._sprite.y = this._y;
    },
    jump() {
        if(!this._jumping) {
            this._y_speed -= character_size.height * .8;
            this._jumping = true;
        }
    },
    fall(bricks) {
        this._y_speed += character_size.height * 0.015;
        this._y += this._y_speed;
        // add friction
        this._y_speed *= 0.9;
        this.collide_floor();
        bricks.forEach(brick => this.collide_brick(brick));
    },
    collide_floor() {
        const the_floor = screen_size.height - character_size.height + 16;
        if(this._y > the_floor) {
            this._jumping = false;
            this._y = the_floor;
            this._y_speed = 0;
            this._score = 0;
        }
    },
    collide_brick(brick) {
        const brick_x = brick.position.x - 40,
            brick_y = brick.position.y - 16;
        const collided = this._x > brick_x && 
            this._x < brick_x + brick.width &&
            this._y > brick_y && 
            this._y < brick_y + brick.height;
        if(collided) {
            this._jumping = false;
            this._y = brick_y;
            this._y_speed = 0;
            this._score += 1;
        }
    },
    get score() { return this._score; },
    get sprite() { return this._sprite; }
}