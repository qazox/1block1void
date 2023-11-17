/*
    Code for chunks. 

    Chunks represent groups of blocks, 
    as part of a larger world grid.
*/

function Chunk() {
    this.blocks = new Uint16Array(Chunk.CHUNK_SIZE * Chunk.CHUNK_SIZE);
    this.meta = {}; // This does nothing yet, but in the future will hold metadata
}

Chunk.prototype.setBlock = function(x,y, block) {
    this.blocks[x * Chunk.CHUNK_SIZE + y] = block.number;
}

Chunk.CHUNK_SIZE = 16;
Chunk.CHUNK_AREA = 16;

Chunk.BLOCK_SIZE = 32;