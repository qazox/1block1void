/*
    Code for handling player movement and interactions.
*/

function Player() {
    this.x = 10;
    this.y = 10;
    this.keys = {};
    this.interactions = [function (event) {
        tick(event)
    }];

    addEventListener('keydown', (e) => this.key(e, true));
    addEventListener('keyup', (e) => this.key(e, false));
}

Player.prototype.key = function (e, state) {
    this.keys[e.key] = state;
}

/* TODO: Rewrite this. */
let tick = function (event) {
    let off = calcGravity(event.target.x, event.target.y, 10, event.canvas.chunks);

    event.target.x += off.force[0] * 0.15;
    event.target.y += off.force[1] * 0.15;

    let xv = 0.1 * ((event.target.keys['d'] ? 1 : 0) - (event.target.keys['a'] ? 1 : 0));;
    let yv = 0.1 * ((event.target.keys['s'] ? 1 : 0) - (event.target.keys['w'] ? 1 : 0));

    event.target.x += xv;
    event.target.y += yv;

    if (event.canvas.chunks.getBlock(event.target.x, event.target.y).id != 'Air') {
        event.target.x -= off.force[0] * 1.1;
        event.target.y -= off.force[1] * 1.1;

        event.target.x -= xv * 1.1;
        event.target.y -= yv * 1.1;
    }

    event.target.x = Math.min(event.target.x,event.canvas.chunks.radius-1);
    event.target.x = Math.max(event.target.x,-event.canvas.chunks.radius-1);

    event.target.y = Math.min(event.target.y,event.canvas.chunks.radius-1);
    event.target.y = Math.max(event.target.y,-event.canvas.chunks.radius-1);

    if (event.target.ticks > 3600) event.target.ticks = 0;
}