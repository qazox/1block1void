/*
    Code for basic blocks that don't require 
    any unique or fancy attributes. 
    
    Think dirt, stone, etc.
*/

mainTiles.loadSet(
    'Vanilla/Core',
    [
        new Tile('air','Air'),
        new Tile('stone','Stone').gravity(0.3,6),
        new Tile('cobbles','Cobblestone').gravity(0.2,4),
        new Tile('soil','Soil').gravity(0.4,8),
        new Tile('iron','Iron').gravity(0.5,8),
        new Tile('ice','Ice').gravity(0.1,2),
        new Tile('barrier','Barrier')
    ]
);
