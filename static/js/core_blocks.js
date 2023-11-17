/*
    Code for basic blocks that don't require 
    any unique or fancy attributes. 
    
    Think dirt, stone, etc.
*/

mainTiles.loadSet(
    'Vanilla/Core',
    [
        new Tile('air','Air'),
        new Tile('stone','Stone'),
        new Tile('cobbles','Cobblestone').gravity(1,10)
    ]
);
