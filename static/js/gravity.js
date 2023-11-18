/*
    Code for gravity.

    Gravity somewhat follows the inverse square law
    with taxicab distance.
*/

function calcGravity(cx, cy, distance, chunks) {
    let force = [0, 0];
    let totalForce = 0;

    for (let x = -distance; x < distance + 1; x++) {
        for (let y = -distance; y < distance + 1; y++) {
            let block = chunks.getBlock(Math.floor(cx + x), Math.floor(cy + y));
            let mass2 = block.attributes.mass || 0;

            let dist = Math.abs(Math.floor(cx + x) - cx) + Math.abs(Math.floor(cy + y) - cy)

            dist += 1;

            force[0] += x * mass2 / dist / dist;
            force[1] += y * mass2 / dist / dist;
            totalForce += Math.abs(x * mass2 / dist / dist) + Math.abs(y * mass2 / dist / dist)
        }
    }

    if (cx < 0) {
        force[0] -= 0.3;
    } else {
        force[0] += 0.3
    }

    if (cy < 0) {
        force[1] -= 0.3;
    } else {
        force[1] += 0.3;
    }

    return { force, totalForce };
}

function gravity(event, mass, distance) {
    if (event.type != 'tick') return;
    let ticks = event.data[2];
    if (ticks % 10 != 0) return;
    ticks /= 10;

    let chunks = event.canvas.chunks;

    let cx = event.data[0];
    let cy = event.data[1];

    let { force } = calcGravity(cx, cy, distance, chunks);

    if (ticks % (1 / Math.max(force[0], force[1])) >= 1 || (force[0] == 0 && force[1] == 0)) return;

    let dir = [0, 0];

    if (Math.abs(force[0]) > Math.abs(force[1])) {
        dir = [Math.sign(force[0]), 0]
    } else {
        dir = [0, Math.sign(force[1])];
    }

    let currBlock = chunks.getBlock(cx, cy);

    let offBlock2;
    if (currBlock.id == 'Stellar Core') {
        offBlock2 = chunks.getBlock(cx + dir[0]*2, cy + dir[1]*2);
    }
    let offBlock = chunks.getBlock(cx + dir[0], cy + dir[1]);
    
    /* TODO: This should be cleaned up at some point. */

    if (currBlock.id == 'Stellar Core' && offBlock2.id == 'Air' && Math.random() > 0.99) {
        chunks.setBlock(cx + dir[0]*2, cy + dir[1]*2, mainTiles.resolve('Vanilla/Core', 'Ice'));
        chunks.setBlock(cx, cy, mainTiles.resolve('Vanilla/Core', 'Stellar Core'));
        chunks.meta.noTick[`${cx + dir[0]*2},${[cy + dir[1]*2]}`] = true;
        chunks.meta.noTick[`${cx},${cy}`] = true;
        return;
    }

    if (currBlock.id == 'Stellar Core' && offBlock2.id == 'Air' && Math.random() > 0.9) {
        chunks.setBlock(cx + dir[0]*2, cy + dir[1]*2, mainTiles.resolve('Vanilla/Core', 'Cobblestone'));
        chunks.setBlock(cx, cy, mainTiles.resolve('Vanilla/Core', 'Stellar Core'));
        chunks.meta.noTick[`${cx + dir[0]*2},${[cy + dir[1]*2]}`] = true;
        chunks.meta.noTick[`${cx},${cy}`] = true;
        return;
    }

    if (offBlock.id == 'Air') {
        chunks.setBlock(cx + dir[0], cy + dir[1], currBlock);
        chunks.setBlock(cx, cy, mainTiles.resolve('Vanilla/Core', 'Air'));
        chunks.meta.noTick[`${cx + dir[0]},${[cy + dir[1]]}`] = true;
        chunks.meta.noTick[`${cx},${cy}`] = true;
        return;
    }

    if (offBlock.id == 'Cobblestone' && currBlock.id == 'Cobblestone') {
        let block = (Math.random() < 0.98) ? 'Soil' : 'Iron';
        chunks.setBlock(cx + dir[0], cy + dir[1], mainTiles.resolve('Vanilla/Core', block));
        chunks.setBlock(cx, cy, mainTiles.resolve('Vanilla/Core', 'Air'));
        chunks.meta.noTick[`${cx + dir[0]},${[cy + dir[1]]}`] = true;
        chunks.meta.noTick[`${cx},${cy}`] = true;
        return;
    }

}

Tile.prototype.gravity = function (mass, distance) {
    this.interactions.push(function (event) {
        gravity(event, mass, distance)
    });
    this.attributes.mass = mass;
    return this;
}