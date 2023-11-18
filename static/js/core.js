/*
    Code for rendering and startup, and the game world.

    This also contains the player code for now.
*/

function Canvas() {
    /* TODO: separate player code */
    this.width = 0;
    this.height = 0;
    this.x = 25;
    this.y = 25;
    this.save = Array(16+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, 16);

    this.elem = document.querySelector('canvas');
    this.ctx = this.elem.getContext('2d');
    this.chunks = new ChunkManager(this.save);

    this.player = new Player(this);

    addEventListener('resize', () => this.resize());
    this.resize();
}

Canvas.prototype.renderBlock = function (xy, cxy) {
    let x = Math.floor(xy / Chunk.CHUNK_SIZE);
    let y = xy % Chunk.CHUNK_SIZE;

    cxy = cxy.split(',');
    let cx = cxy[0] * 1;
    let cy = cxy[1] * 1;

    x += cx * Chunk.CHUNK_SIZE;
    y += cy * Chunk.CHUNK_SIZE;

    let block = this.chunks.getBlock(x,y);

    let img = block.asset;

    this.ctx.drawImage(
        img, 
        x * Chunk.BLOCK_SIZE - this.x - this.player.x * Chunk.BLOCK_SIZE, 
        y * Chunk.BLOCK_SIZE - this.y - this.player.y * Chunk.BLOCK_SIZE,
        Chunk.BLOCK_SIZE,
        Chunk.BLOCK_SIZE
    );
}

Canvas.prototype.render = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.imageSmoothingEnabled = false;

    let compSize = Chunk.CHUNK_SIZE * Chunk.CHUNK_AREA

    for (let x = Math.floor(this.player.x - compSize); x < this.player.x + compSize; x += Chunk.CHUNK_SIZE) {
        for (let y = Math.floor(this.player.y - compSize); y < this.player.y + compSize; y += Chunk.CHUNK_SIZE) {
            this.chunks.getBlock(x,y);
            let cxy = this.chunks.getCoords(x,y)[0];
            if (!(cxy in this.chunks.chunks)) continue;
            for (let xy in this.chunks.chunks[cxy].blocks) {
                this.renderBlock(xy, cxy)
            }
        }
    }

    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(-this.x, -this.y, Chunk.BLOCK_SIZE, Chunk.BLOCK_SIZE);
}

Canvas.prototype.resize = function () {
    this.width = this.elem.width = document.body.offsetWidth;
    this.height = this.elem.height = document.body.offsetHeight;

    this.x = -this.width / 2;
    this.y = -this.height / 2;

    this.render();
}

var canvas = new Canvas();
var handler = new TickHandler(canvas);

this.canvas.chunks.setBlock(0, 0, mainTiles.resolve('Vanilla/Core', 'Stellar Core'));

(async function() {
    while (true) {
        await handler.tick();
        await new Promise(resolve => setTimeout(resolve, 1000 / 60));
    }
})();