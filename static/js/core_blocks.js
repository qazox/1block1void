/*
    Code for basic blocks that don't require 
    any unique or fancy attributes. 
    
    Think dirt, stone, etc.
*/

mainTiles.loadSet(
    'Vanilla/Core',
    [
        new Tile('air','Air'),
        new Tile('stone','Stone').gravity(3,6),
        new Tile('cobbles','Cobblestone').gravity(1,6),
        new Tile('soil','Soil').gravity(2,6),
        new Tile('iron','Iron').gravity(5,6),
        new Tile('ice','Ice').gravity(0.1,6)
    ]
);
