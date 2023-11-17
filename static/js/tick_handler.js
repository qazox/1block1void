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

    new GameEvent('tick', this.canvas.player, [], this.canvas);
}
