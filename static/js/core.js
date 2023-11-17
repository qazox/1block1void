/*
    Code for rendering and startup.
*/

function Canvas() {
    this.width = 0;
    this.height = 0;

    this.elem = document.querySelector('canvas');
    this.ctx = this.elem.getContext('2d');
    this.chunks = new Chunk();

    addEventListener('resize', () => this.resize());
    this.resize();
}

Canvas.prototype.render = function () {
    this.ctx.clearRect(0,0,this.width,this.height);
    this.ctx.imageSmoothingEnabled = false;

    for (let xy in this.chunks.blocks) {
        let x = Math.floor(xy / Chunk.CHUNK_SIZE);
        let y = xy % Chunk.CHUNK_SIZE;

        let block = this.chunks.blocks[xy];

        let img = mainTiles.tiles[block].asset;
        
        this.ctx.drawImage(img,x * Chunk.BLOCK_SIZE,y * Chunk.BLOCK_SIZE);
    }
}

Canvas.prototype.resize = function () {
    this.width = this.elem.width = document.body.offsetWidth;
    this.height = this.elem.height = document.body.offsetHeight;
    this.render();
}

var canvas = new Canvas();
canvas.chunks.setBlock(0,1,mainTiles.resolve('Vanilla/Core','Cobblestone'));
canvas.render();