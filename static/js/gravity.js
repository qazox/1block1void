/*
    Code for gravity.

    Gravity somewhat follows the inverse square law
    with taxicab distance.
*/

function gravity(event, mass, distance) {
    if (event.type != 'tick') return;
    let ticks = event.data[2];
    if (ticks % 16 != 0) return;
    ticks /= 16;

    let chunks = event.canvas.chunks;

    let force = [0, 0];
    let totalForce = 0;

    let cx = event.data[0];
    let cy = event.data[1];

    for (let x = -distance; x < distance + 1; x++) {
        for (let y = -distance; y < distance + 1; y++) {
            let block = chunks.getBlock(cx + x, cy + y);
            let mass2 = block.attributes.mass || 0;

            let dist = Math.abs(x) + Math.abs(y)

            if (dist == 0) continue;

            force[0] += x * mass2 / dist / dist;
            force[1] += y * mass2 / dist / dist;
            totalForce += Math.abs(x * mass2 / dist / dist) + Math.abs(y * mass2 / dist / dist)
        }
    }

    if (ticks % Math.max(force[0], force[1]) >= 1 || (force[0] == 0 && force[1] == 0)) return;

    let dir = [0, 0];

    if (Math.abs(force[0]) > Math.abs(force[1])) {
        dir = [Math.sign(force[0]), 0]
    } else {
        dir = [0, Math.sign(force[1])];
    }

    let currBlock = chunks.getBlock(cx, cy);
    let offBlock = chunks.getBlock(cx + dir[0], cy + dir[1]);

    /* TODO: This should be cleaned up at some point. */

    if (offBlock.id == 'Air') {
        chunks.setBlock(cx + dir[0], cy + dir[1], currBlock);
        chunks.setBlock(cx, cy, mainTiles.resolve('Vanilla/Core', 'Air'));
    }

    if (offBlock.id == 'Cobblestone' && currBlock.id == 'Cobblestone') {
        let block = (Math.random() < 0.98) ? 'Soil' : 'Iron';
        chunks.setBlock(cx + dir[0], cy + dir[1], mainTiles.resolve('Vanilla/Core', block));
        chunks.setBlock(cx, cy, mainTiles.resolve('Vanilla/Core', 'Air'));
    }

}

Tile.prototype.gravity = function (mass, distance) {
    this.interactions.push(function (event) {
        gravity(event, mass, distance)
    });
    this.attributes.mass = mass;
    return this;
}