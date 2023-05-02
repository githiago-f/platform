export const State = {
    STOPPED: 0,
    PAUSED: 1,
    RUNNING: 2,
};

export const gameState = {
    _state: State.STOPPED,
    get state() {
        return this._state;
    },
    /**
     * @param {0 | 1 | 2} state 
     */
    changeState(state) {
        this._state = state;
    }
};
