/* 
    Code for global game ticks.
*/ 

function TickHandler(canvas) {
    this.canvas = canvas;
    this.ticks = 0;
}

TickHandler.prototype.tick = function() {
    this.canvas.chunks.setBlock(
        Math.floor(Math.random() * 25),
        Math.floor(Math.random() * 25),
        mainTiles.resolve('Vanilla/Core','Cobblestone')
    );
    this.canvas.render();
    this.ticks++;
}
