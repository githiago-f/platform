import * as PIXI from 'pixi.js';

import { screen_size } from "../constants/sizes";
import { events } from "../events/eventcenter";
import { GameEvent } from "../events/events";
import { Character } from "../objects/obj_character";
import { State, gameState } from "../states/game_state";

let gameLoop, objects = new Set();
async function bootstrap() {
    const app = new PIXI.Application({ ...screen_size, backgroundColor: '#110d0d' });
    
    await Character.init(app.renderer.width / 2, app.renderer.height / 2);
    
    app.stage.addChild(Character.sprite);
    document.body.appendChild(app.view);
    app.ticker.add(() => {
        // rerender all objects
        Character.draw();
    });
}

events.addEventListener('stop', () => {
    if(gameLoop) {
        clearInterval(gameLoop);
    }
    gameState.changeState(State.STOPPED);
    console.log('game loop stopped!');
});

events.addEventListener('start', () => {
    gameState.changeState(State.RUNNING);
});

const keyHandler = (e) => {
    const isKeyDown = e.type === 'keydown';
    if(gameState.state !== State.RUNNING) {
        events.dispatchEvent(GameEvent.START);
    }
    if(gameState.state === State.RUNNING) {
        switch(e.key) {
            case 'a': Character._going_left = isKeyDown; break;
            case 'w': Character.jump(); break;
            case 'd': Character._going_right = isKeyDown; break;
            default: void(0);
        };
    }
}

document.addEventListener('keyup', keyHandler);
document.addEventListener('keydown', keyHandler);

bootstrap();
