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

    draw(elements) {
        if(this._going_left) {
            this._x_speed -= character_size.width * 0.015;
        }

        if(this._going_right) {
            this._x_speed += character_size.width * 0.015;
        }

        this._x += this._x_speed;

        // air friction
        this._x_speed *= 0.9;
        this.fall(elements);

        this._sprite.x = this._x;
        this._sprite.y = this._y;
    },
    jump() {
        if(!this._jumping) {
            this._y_speed -= character_size.height * .8;
            this._jumping = true;
        }
    },
    fall(elements) {
        this._y_speed += character_size.height * 0.015;
        this._y += this._y_speed;
        // add friction
        this._y_speed *= 0.9;
        const collided = elements.filter(this.collide_element.bind(this)).pop();
        const floor = this.collide_floor();
        console.log(collided);
        if(floor) {
            this._jumping = false;
            this._y = floor;
            this._y_speed = 0;
        }
    },
    collide_floor() {
        const the_floor = screen_size.height - character_size.height + 16;
        return this._y > the_floor ? the_floor : 0;
    },
    collide_element(brick) {
        return this._x > brick.position.x && 
            this._x < brick.position.x + brick.width && 
            this._y > brick.position.y && 
            this._y < brick.position.y + brick.height;
    },
    get sprite() { return this._sprite; }
}