/*
    Code for rendering and startup, and the game world.
*/

function Canvas() {
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;

    this.elem = document.querySelector('canvas');
    this.ctx = this.elem.getContext('2d');
    this.chunks = new ChunkManager();

    addEventListener('resize', () => this.resize());
    this.resize();
}

Canvas.prototype.renderBlock = function(xy, cxy) {
    let x = Math.floor(xy / Chunk.CHUNK_SIZE);
    let y = xy % Chunk.CHUNK_SIZE;
    
    cxy = cxy.split(',');
    let cx = cxy[0] * 1;
    let cy = cxy[1] * 1;

    x += cx * Chunk.CHUNK_SIZE;
    y += cy * Chunk.CHUNK_SIZE;

    let block = this.chunks.chunks[cxy].blocks[xy];

    let img = mainTiles.tiles[block].asset;

    this.ctx.drawImage(img,x * Chunk.BLOCK_SIZE - this.x,y * Chunk.BLOCK_SIZE - this.y);
}

Canvas.prototype.render = function () {
    this.ctx.clearRect(0,0,this.width,this.height);
    this.ctx.imageSmoothingEnabled = false;

    for (let cxy in this.chunks.chunks) {
        for (let xy in this.chunks.chunks[cxy].blocks) {
            this.renderBlock(xy,cxy)
        }
    }
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

this.canvas.chunks.setBlock(0,0,mainTiles.resolve('Vanilla/Core','Stone'));
setInterval(function() { handler.tick() },1000/60);