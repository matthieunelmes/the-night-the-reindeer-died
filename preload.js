var preload = function(game){}

preload.prototype = {
	preload: function(){ 
this.game.stage.backgroundColor = '#fff';
this.game.load.image('loading', 'assets/preloader-bar.png');
var preloadBar = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loading'); 
preloadBar.anchor.setTo(0.5);
preloadBar.scale.setTo(3);
this.load.setPreloadSprite(preloadBar);
this.game.load.image('tileset', 'assets/sheet.png');
this.game.load.image('sky', 'assets/parallax-bg.png');
this.game.load.image('presents', 'assets/present.png');
this.game.load.image('bullet', 'assets/snowBall.png');
this.game.load.image('snowball', 'assets/snowBall.png');
this.game.load.image('snowflake', 'assets/snowflake.png');
this.game.load.spritesheet('santa', 'assets/santa.png', 32, 48);
this.game.load.spritesheet('snowman', 'assets/snowman.png', 64, 77);
this.game.load.spritesheet('explosion', 'assets/explosion.png', 192,195);
this.game.load.audio('the-house', ['assets/the-house.mp3', 'assets/the-house.ogg']);
this.game.load.tilemap('map', 'assets/tilemaps/santalevel1.json', null, Phaser.Tilemap.TILED_JSON);
var snowflakes;
var waveformX;
var waveformY;
var xl;
var yl;
var cx = 0;
var cy = 0;
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}