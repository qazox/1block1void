/*
    Code for handling player movement and interactions.
*/

function Player(manager) {
    this.x = 10;
    this.y = 10;
    this.keys = {};
    this.inv = [];
    this.canvas = manager;
    this.interactions = [function (event) {
        tick(event)
    }];

    addEventListener('keydown', (e) => this.key(e, true));
    addEventListener('keyup', (e) => this.key(e, false));
    document.addEventListener('click', (e) => this.click(e));
    document.addEventListener('contextmenu', (e) => this.rclick(e));
}

Player.prototype.rclick = function (e) {
    e.preventDefault();
    if (this.inv.length < 1) return;


    let x = e.pageX / Chunk.BLOCK_SIZE + this.x + this.canvas.x / Chunk.BLOCK_SIZE;
    let y = e.pageY / Chunk.BLOCK_SIZE + this.y + this.canvas.y / Chunk.BLOCK_SIZE;
    
    x = Math.floor(x);
    y = Math.floor(y);

    let blox = this.canvas.chunks.getBlock(x,y);

    if (blox.id != 'Air') return;

    this.canvas.chunks.setBlock(x,y,this.inv[0]);
    this.inv = this.inv.slice(1);

    /* TODO: rewrite */
    let inv = document.querySelector("#inv");
    inv.innerHTML = "";
    for (let i in this.inv) {
        let elem = new Image();
        elem.src = this.inv[i].asset.src;
        inv.appendChild(elem);
    }
}

Player.prototype.click = function (e) {
    let x = e.pageX / Chunk.BLOCK_SIZE + this.x + this.canvas.x / Chunk.BLOCK_SIZE;
    let y = e.pageY / Chunk.BLOCK_SIZE + this.y + this.canvas.y / Chunk.BLOCK_SIZE;
    
    x = Math.floor(x);
    y = Math.floor(y);

    let blox = this.canvas.chunks.getBlock(x,y);

    if (blox.id == 'Air' || blox.id == 'Barrier') return;

    this.inv.push(blox);

    this.canvas.chunks.setBlock(x,y,mainTiles.resolve('Vanilla/Core','Air'));

    /* TODO: rewrite */
    let inv = document.querySelector("#inv");
    inv.innerHTML = "";
    for (let i in this.inv) {
        let elem = new Image();
        elem.src = this.inv[i].asset.src;
        inv.appendChild(elem);
    }
}

Player.prototype.key = function (e, state) {
    this.keys[e.key] = state;
}

/* TODO: Rewrite this. */
let tick = function (event) {
    let off = calcGravity(event.target.x, event.target.y, 10, event.canvas.chunks);




    let xv = 0.1 * ((event.target.keys['d'] ? 1 : 0) - (event.target.keys['a'] ? 1 : 0));;
    let yv = 0.1 * ((event.target.keys['s'] ? 1 : 0) - (event.target.keys['w'] ? 1 : 0));

    event.target.x += off.force[0] * 0.15;
    event.target.x += xv;

    if (event.canvas.chunks.getBlock(event.target.x, event.target.y).id != 'Air') {
        event.target.x = (off.force[0] * 0.15 + xv ) > 0 ? Math.floor(event.target.x) : Math.ceil(event.target.x);
    }

    event.target.y += yv;
    event.target.y += off.force[1] * 0.15;

    if (event.canvas.chunks.getBlock(event.target.x, event.target.y).id != 'Air') {
        event.target.y = (off.force[1] * 0.15 + yv) > 0 ? Math.floor(event.target.y) : Math.ceil(event.target.y);
    }

    event.target.x = Math.min(event.target.x,event.canvas.chunks.radius-1);
    event.target.x = Math.max(event.target.x,-event.canvas.chunks.radius+1);

    event.target.y = Math.min(event.target.y,event.canvas.chunks.radius-1);
    event.target.y = Math.max(event.target.y,-event.canvas.chunks.radius+1);

    if (event.target.ticks > 3600) event.target.ticks = 0;
}