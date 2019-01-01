var gameTitle = function(game){
	  var particles = [];
}

gameTitle.prototype = {
	preload: function(){
		this.game.load.image('startscreen', 'assets/start-screen.png');
		this.game.load.image('play', 'assets/start.png');
		this.game.load.image('title', 'assets/title.png');
	},
  	create: function(){
  	startscreen = this.game.add.tileSprite(0, 0, 800, 600, 'startscreen');
  	levelGroup=this.game.add.group();
    var sprite = { x: 0, y: -64 };
    var tween = this.game.add.tween(sprite).to( { x: 128 }, 4000, "Bounce.easeIn", true, 0, -1, true);
    var tween2 = this.game.add.tween(sprite).to( { y: 128 }, 4000, "Bounce.easeOut", true, 0, -1, false);
    waveformX = tween.generateData(60);
    waveformY = tween2.generateData(160);
    xl = waveformX.length - 1;
    yl = waveformY.length - 1;
    var sprites = this.game.add.spriteBatch();
    snowflakes = [];
    var xs = 228;
    var ys = 132;
    for (var y = 0; y < 18; y++)
    {
      for (var x = 0; x < 28; x++)
      {
        var snowflake = this.game.make.sprite((x * xs), (y * ys), 'snowflake');
        snowflake.ox = snowflake.x;
        snowflake.oy = snowflake.y;
        snowflake.cx = this.game.rnd.between(0, xl);
        snowflake.cy = this.game.rnd.between(0, yl);
        snowflake.alpa = (Math.random() * (1.00 - 0.00) + 0.00);
        snowflake.anchor.set(0.5);
        sprites.addChild(snowflake);
        snowflakes.push(snowflake);
      }
    }
    levelGroup.add(snowflake);
  		  this.game.stage.backgroundColor = '#000';
  		    	this.game.add.sprite(90,120,'title');
		var playButton = this.game.add.button(370,320,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
	},
	playTheGame: function(){
		this.game.state.start("TheGame");
	},
	update: function(){
		startscreen.tilePosition.y -= 1;
		    for (var i = 0, len = snowflakes.length; i < len; i++)
    {
      snowflakes[i].x = snowflakes[i].ox + waveformX[snowflakes[i].cx].x;
      snowflakes[i].y = snowflakes[i].oy + waveformY[snowflakes[i].cy].y;
      snowflakes[i].cx++;
      if (snowflakes[i].cx > xl)
      {
        snowflakes[i].cx = 0;
      }
      snowflakes[i].cy++;
      if (snowflakes[i].cy > yl)
      {
        snowflakes[i].cy = 0;
      }
    }
	}
}