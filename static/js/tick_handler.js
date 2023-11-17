/* 
    Code for global game ticks.
*/ 

function TickHandler(canvas) {
    this.canvas = canvas;
    this.ticks = 0;

}

TickHandler.prototype.tick = function() {
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

    if (this.ticks % 100 == 99) {
        this.canvas.chunks.radius ++;
    }

    this.canvas.render();
    this.ticks++;

    if (this.ticks > 10000) this.ticks = 0;

    new GameEvent('tick', this.canvas.player, [], this.canvas);
}
