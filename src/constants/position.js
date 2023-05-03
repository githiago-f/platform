export const positions = {
    _last_falling_elment: 0,

    get last_position() {
        return this._last_falling_elment;
    },
    set last_position(pos = 0) {
        this._last_falling_elment = pos;
    }
}