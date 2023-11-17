/* 
    Code for global game ticks.
*/ 

function TickHandler(canvas) {
    this.canvas = canvas;
    this.ticks = 0;
}

TickHandler.prototype.tick = function() {

    if (Math.random() > 0.9999) {

        this.canvas.chunks.setBlock(
            Math.floor(Math.random() * 50),
            Math.floor(Math.random() * 50),
            mainTiles.resolve('Vanilla/Core','Cobblestone'),
            true
        );
    } 
    if (Math.random() > 0.999) {

        this.canvas.chunks.setBlock(
            Math.floor(Math.random() * 50),
            Math.floor(Math.random() * 50),
            mainTiles.resolve('Vanilla/Core','Ice'),
            true
        );
    } 

    let ch = this.canvas.chunks.chunks;
    for (let cxy in ch) {
        let blocks = ch[cxy].blocks;
        for (let xy in blocks) {
            let cxys = cxy.split(',');

            let x = Math.floor(xy / Chunk.CHUNK_SIZE);
            let y = xy - (x * Chunk.CHUNK_SIZE);

            x += cxys[0] * Chunk.CHUNK_SIZE;
            y += cxys[1] * Chunk.CHUNK_SIZE;

            new GameEvent('tick', mainTiles.tiles[blocks[xy]], [x,y, this.ticks], this.canvas);
        }
    }

    this.canvas.render();
    this.ticks++;

    let off = calcGravity(this.canvas.cx,this.canvas.cy,16, this.canvas.chunks);

    if (Math.abs(off.force[0]) > 0.05) off.force[0] = Math.sign(off.force[0])* .05;
    if (Math.abs(off.force[1]) > 0.05) off.force[1] = Math.sign(off.force[1]) * .05;

    this.canvas.cx += off.force[0] * 0.4;
    this.canvas.cy += off.force[1] * 0.4;

    let xv = 0.04 * (( this.canvas.keys['d'] ? 1 : 0) - ( this.canvas.keys['a'] ? 1 : 0));;
    let yv = 0.04 * (( this.canvas.keys['s'] ? 1 : 0) - ( this.canvas.keys['w'] ? 1 : 0));

    this.canvas.cx += xv;
    this.canvas.cy += yv;

    if (this.canvas.chunks.getBlock(this.canvas.cx,this.canvas.cy).id != 'Air') {
        this.canvas.cx -= off.force[0] * 1.1;
        this.canvas.cy -= off.force[1] * 1.1;

        this.canvas.cx -= xv * 1.1;
        this.canvas.cy -= yv * 1.1;
    }

    if (this.ticks > 3600) this.ticks = 0;
}
