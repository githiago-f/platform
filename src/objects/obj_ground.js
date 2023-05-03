import { Graphics } from 'pixi.js';
import { block_size, screen_size } from "../constants/sizes";
import { positions } from '../constants/position';

export const Ground = (height=1, width=1, x=0, y=0) => ({
    _width: width * block_size.width, 
    _height: height * block_size.height, 
    _x: x, _y: y - height,
    _y_speed: 0,
    _color: null,

    _rect: new Graphics(),

    init(color = 'red') {
        this._color = color;
        this._rect.beginFill(this._color);
        this._rect.lineStyle(5, 0xFF0000);
        this._rect.drawRect(x, y, this._width, this._height);
        return this;
    },

    draw() {
        this.fall();

        this._rect.x = this._x;
        this._rect.y = this._y;
    },
    fall() {
        this._y_speed += this._height * 0.005;
        this._y += this._y_speed;
        this._y_speed *= 0.9;
        this.colide();
    },
    colide() {
        const the_floor = screen_size.height;
        if(this.position.y > the_floor) {
            this._y = positions.last_position;
            this.random_x();
        }
    },
    random_x() {
        this._x = Math.floor(Math.random() * (screen_size.width - this._width));
    },

    get position() {
        return Object.freeze({ x: this._x, y: this._y + y });
    },

    get width() {
        return this._width;
    },
    get heigth() {
        return this._height;
    },

    get rect() {
        return this._rect;
    }
});
