import * as PIXI from 'pixi.js';

import { block_size, screen_size } from "../constants/sizes";
import { events } from "../events/eventcenter";
import { GameEvent } from "../events/events";
import { Character } from "../objects/obj_character";
import { State, gameState } from "../states/game_state";
import { Ground } from '../objects/obj_ground';
import { positions } from '../constants/position';

const elements = [];
async function bootstrap() {
    const app = new PIXI.Application({ 
        ...screen_size, 
        backgroundColor: '#110d0d' 
    });
    
    await Character.init(app.renderer.width / 2, app.renderer.height / 2);

    const colors = [
        0xff0000, 
        0x0000ff, 
        0x00ff00,
        0xe8cd00,
        0x00e8d9,
        0x020ee6,
        0xa103fc,
        0xdb09b1,
        0x9e0012
    ];
    
    let initial_y = 0;
    const four_blocks = block_size.height * 4;
    for(let i = 0; i < 10; i++) {
        const color = colors[i];
        initial_y = -(i * four_blocks);
        const groundElement = Ground(1, 6, 0, initial_y).init(color);
        groundElement.random_x();
        elements.push(groundElement);
        app.stage.addChild(groundElement.rect);
    }

    positions.last_position = initial_y - screen_size.height;

    app.stage.addChild(Character.sprite);
    document.body.appendChild(app.view);
    app.stop();

    app.ticker.add(() => {
        // rerender all objects
        Character.draw(elements);
        elements.forEach(i => i.draw());
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
