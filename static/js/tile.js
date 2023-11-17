/*
    Code for configuring and appending tiles.

    Every item and block in the game is
    represented in one unified Tile class.

    A prototype of an API is provided 
    for players who wish to modify the game,
    to prevent conflicts from manually setting
    sections of an array. 
*/

function Tile(asset, id) {
    this.asset = new Image(Chunk.BLOCK_WIDTH,Chunk.BLOCK_HEIGHT);
    this.asset.src = `/img/${asset}.png`;

    this.id = id;
    this.number = -1;
    this.interactions = [];
    this.attributes = {};

    /*
        Interactions are used for dynamic functions that
        depend on world state, while attributes are used
        for block attributes that are static, or modified
        by other interactions.

        I highly suggest you define certain modifiers
        as a prototype of Tile that returns
        itself. This allows for prototype chaining
        within tile definitions.
    */
}

function TileManager() {
    this.tiles = [];
}

TileManager.prototype.loadSet = function (namespace, tiles) {
    for (let tile of tiles) {
        tile.namespace = namespace;
        tile.number = this.tiles.length;
        this.tiles.push(tile);
    }
}

TileManager.prototype.resolveID = function (namespace, name) {
    let resolved = this.tiles
        .findIndex(tile =>
            tile.namespace == namespace &&
            tile.id == name
        );
    return resolved
}

TileManager.prototype.resolve = function (namespace, name) {
    let id = this.resolveID(namespace, name);
    return this.tiles[id];
}

var mainTiles = new TileManager();

/* 
    You can theoretically add more tile managers if desired, 
    but you probably shouldn't 
    if you don't know what you are doing.
*/