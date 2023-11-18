/*
    Code for chunks and chunk managers. 

    Chunks represent groups of blocks, 
    as part of a larger world grid.
*/

function Chunk(noInit) {
    this.blocks = new Uint16Array(Chunk.CHUNK_SIZE * Chunk.CHUNK_SIZE);
    this.meta = {}; // This does nothing yet, but in the future will hold metadata
}

Chunk.prototype.setBlock = function(x,y, block) {
    this.blocks[x * Chunk.CHUNK_SIZE + y] = block.number;
}

Chunk.prototype.getBlock = function(x,y) {
    return mainTiles.tiles[this.blocks[x * Chunk.CHUNK_SIZE + y] || 0];
}

Chunk.CHUNK_SIZE = 16;
Chunk.CHUNK_AREA = 1;

Chunk.BLOCK_SIZE = 64;


function ChunkManager() {
    this.chunks = {};
    this.radius = 2;
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
    if (Math.max(Math.abs(x),Math.abs(y)) == this.radius) return mainTiles.resolve('Vanilla/Core','Barrier')
    if (Math.max(Math.abs(x),Math.abs(y)) > this.radius) return mainTiles.resolve('Vanilla/Core','Air');

    let coords = this.getCoords(x,y);

    if (!this.chunks[coords[0]]) this.chunks[coords[0]] = new Chunk();

    return this.chunks[coords[0]].getBlock(coords[1],coords[2]);
}

ChunkManager.prototype.setBlock = function (x, y, block, onlyAir) {
    let coords = this.getCoords(x,y);

    let blockGet = this.getBlock(x,y);
    if (onlyAir && blockGet.id != 'Air') return;
    if (this.chunks[coords[0]]) this.chunks[coords[0]].setBlock(coords[1],coords[2],block);
}