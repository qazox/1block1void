/* 
    Code for global game ticks.
*/ 

const DECODER = new TextDecoder("utf-8");
const ENCODER = new TextEncoder("utf-8");

function TickHandler(canvas) {
    this.canvas = canvas;
    this.ticks = 0;

}

TickHandler.prototype.tick = async function() {
    let ch = this.canvas.chunks.chunks;
    this.canvas.chunks.meta.noTick = {};
    
    for (let cxy in ch) {
        let cxys = cxy.split(',');
        let compSize = Chunk.CHUNK_SIZE * Chunk.CHUNK_AREA
        if (
            Math.abs(this.canvas.player.x - cxys[0] * Chunk.CHUNK_SIZE) > compSize + 25 ||
            Math.abs(this.canvas.player.y - cxys[1] * Chunk.CHUNK_SIZE) > compSize + 25
        ) {
            await fetch(`/api/save/${this.canvas.save}/${cxys[0]}/${cxys[1]}`, {
                method: 'POST',
                body: DECODER.decode(ch[cxy].blocks)
            });
            delete ch[cxy];
            continue;
        }
        let blocks = ch[cxy].blocks;
        for (let xy in blocks) {

            let x = Math.floor(xy / Chunk.CHUNK_SIZE);
            let y = xy - (x * Chunk.CHUNK_SIZE);

            x += cxys[0] * Chunk.CHUNK_SIZE;
            y += cxys[1] * Chunk.CHUNK_SIZE;

            if ( this.canvas.chunks.meta.noTick[`${x},${y}`]) continue;

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
