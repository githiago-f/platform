import { Graphics } from 'pixi.js';
import { character_size, screen_size } from "../constants/sizes";

export const Ground = () => ({
    _width: 0, _height: 0, 
    _x: 0, _y: 0,

    /**
     * @type {Graphics}
     */
    _graphic: null,

    async init(height=1, width=1, x=0, y=0) {
        this._x = x; this._y = y;
        this._height = height * (character_size.height / 2);
        this._width = width * (character_size.width / 2);
        this._graphic = new Graphics();
        this._graphic.drawRect(x, y, width, height);
        this._graphic.beginFill('#fdfdfd');
        return this;
    },

    draw() {
        this.fall();

        this._graphic.x = this._x;
        this._graphic.y = this._y;
    },

    get element() {
        return this._element;
    },

    fall() {},

    get graphic() {
        return this._graphic;
    }
});
