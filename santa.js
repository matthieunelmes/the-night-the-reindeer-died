var santaScroller = new Phaser.Game(746, 420, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });

function preload() {
 
    //load game assets
    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/sheet.png');

   

}

var player;
var platforms;
var cursors;
var bg;
var stars;
var score = 0;
var scoreText;

var snowflakes;
var waveformX;
var waveformY;
var xl;
var yl;
var cx = 0;
var cy = 0;


function create() {

this.map = this.add.tilemap('level1');
 this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');
 
    //create layers
 
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
 
    this.blockedLayer = this.map.createLayer('blockedLayer');
 
    //collision on blockedLayer
 
    this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');
 
    //resizes the game world to match the layer dimensions
 
    this.backgroundlayer.resizeWorld();
    //map.addTilesetImage('tiles_spritesheet', 'gameTiles'); // Preloaded tileset
 
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
 
    //santaScroller.map.addTilesetImage('tiles_spritesheet', 'gameTiles');
 
    //create layers
 
    //santaScroller.backgroundlayer = santaScroller.map.createLayer('backgroundLayer');
 
    //santaScroller.blockedLayer = santaScroller.map.createLayer('blockedLayer');
 
    //collision on blockedLayer
 
    //santaScroller.map.setCollisionBetween(1, 100000, true, 'blockedLayer');
 
    //resizes the game world to match the layer dimensions
 
    //santaScroller.backgroundlayer.resizeWorld();
 
    santaScroller.stage.backgroundColor = '#fff';
 
    //scaling options
 
    santaScroller.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
 
    //have the game centered horizontally
 
    santaScroller.scale.pageAlignHorizontally = true;
 
    santaScroller.scale.pageAlignVertically = true;
 
    //screen size will be set automatically
 
    santaScroller.scale.setScreenSize(true);
 
    //physics system






   

    
}

function render(){

     santaScroller.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier"); 
}

function update() {



}

function collectStar (player, star) {
    
  

}