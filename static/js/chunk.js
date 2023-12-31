/*
    Code for chunks and chunk managers. 

    Chunks represent groups of blocks, 
    as part of a larger world grid.
*/

function Chunk(noInit, save, x, y) {
    this.blocks = new Uint16Array(Chunk.CHUNK_SIZE * Chunk.CHUNK_SIZE);
    this.meta = {};

    fetch(`/api/save/${save}/${x}/${y}`, {
        method: 'GET',
    }).then(function(x) {
        x.text().then(function(text) {
            if (text == 'fail' || text.length != 512) return;
            this.blocks = new Uint16Array(ENCODER.encode(text).buffer)
        })
    })

    if (Math.random() > 0.50) {
        this.setBlock(5,5,mainTiles.resolve('Vanilla/Core', 'Stellar Core'))
    }
}

Chunk.prototype.setBlock = function(x,y, block) {
    this.blocks[x * Chunk.CHUNK_SIZE + y] = block.number;
}

Chunk.prototype.getBlock = function(x,y) {
    return mainTiles.tiles[this.blocks[x * Chunk.CHUNK_SIZE + y] || 0];
}

Chunk.CHUNK_SIZE = 16;
Chunk.CHUNK_AREA = 2;

Chunk.BLOCK_SIZE = 64;


function ChunkManager(save) {
    this.chunks = {};
    this.radius = 2;
    this.meta = {noTick: {}};
    this.save = save;
}

ChunkManager.prototype.getCoords = function (x,y) {
    x = Math.round(x);
    y = Math.round(y);

    x2 = Math.floor(x / Chunk.CHUNK_SIZE);
    y2 = Math.floor(y / Chunk.CHUNK_SIZE)

    return [
        `${x2},${y2}`,
        (x - x2 * Chunk.CHUNK_SIZE),
        (y - y2 * Chunk.CHUNK_SIZE)
    ]
}

ChunkManager.prototype.getBlock = function (x,y) {
    let coords = this.getCoords(x,y);

    if (Math.max(Math.abs(x),Math.abs(y)) > this.radius) return mainTiles.resolve('Vanilla/Core','Air');
    if (!this.chunks[coords[0]]) this.chunks[coords[0]] = new Chunk(false, this.save, x, y);
    if (Math.max(Math.abs(x),Math.abs(y)) == this.radius) return mainTiles.resolve('Vanilla/Core','Barrier')

    return this.chunks[coords[0]].getBlock(coords[1],coords[2]);
}

ChunkManager.prototype.setBlock = function (x, y, block, onlyAir) {
    let coords = this.getCoords(x,y);

    let blockGet = this.getBlock(x,y);
    if (onlyAir && blockGet.id != 'Air') return;
    if (this.chunks[coords[0]]) this.chunks[coords[0]].setBlock(coords[1],coords[2],block);
}