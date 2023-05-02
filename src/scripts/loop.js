import * as PIXI from 'pixi.js';

import { screen_size } from "../constants/sizes";
import { events } from "../events/eventcenter";
import { GameEvent } from "../events/events";
import { Character } from "../objects/obj_character";
import { State, gameState } from "../states/game_state";
import { Ground } from '../objects/obj_ground';

let objects = new Set();
async function bootstrap() {
    const app = new PIXI.Application({ ...screen_size, backgroundColor: '#110d0d' });
    
    await Character.init(app.renderer.width / 2, app.renderer.height / 2);
    
    const groundElement = await Ground().init(1, 6);
    app.stage.addChild(groundElement.graphic);

    app.stage.addChild(Character.sprite);
    app.stop();
    document.body.appendChild(app.view);
    app.ticker.add(() => {
        // rerender all objects
        Character.draw();
    });
    
    events.addEventListener('start', () => {
        app.start();
        gameState.changeState(State.RUNNING);
    });
    events.addEventListener('pause', () => {
        app.stop();
        gameState.changeState(State.PAUSED);
    });

    events.addEventListener('gameover', () => {
        app.stop();
        gameState.changeState(State.STOPPED);
    });
}


const keyHandler = (e) => {
    const controls = ['a', 'w', 'd']
    const isKeyDown = e.type === 'keydown';
    if(gameState.state < State.RUNNING && controls.includes(e.key)) {
        events.dispatchEvent(GameEvent.START);
    }
    if(gameState.state === State.RUNNING) {
        switch(e.key) {
            case 'a': Character._going_left = isKeyDown; break;
            case 'w': Character.jump(); break;
            case 'd': Character._going_right = isKeyDown; break;
            case 'p': events.dispatchEvent(GameEvent.PAUSE); break;
            default: void(0);
        };
    }
}

document.addEventListener('keyup', keyHandler);
document.addEventListener('keydown', keyHandler);

bootstrap();
