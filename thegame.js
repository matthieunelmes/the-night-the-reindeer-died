var theGame = function(game){
  var map;
  var bgtile;
  var layer;
  var enemyLayer;
  var player;
  var cursors;
  var spaceKey;
  var shotTimer;
  var hitTimer;
  var pathCounter;
  var enemyHP ;
  var playerHP;
  var scoreText;
  var prezzieCount;
  var collisionDamageTimer;
  var shotTimerEnemy;
  var partile;
  var lives;
  var particles = [];
  var prezzies;
  gameState = true;
  var grpSnowmen;
}



theGame.prototype = {
  create: function(){
    this.shotTimer = 0;
    this.hitTimer = 0;
    this.pathCounter = 0;
    this.enemyHP = 10;
    this.playerHP = 3;
    this.prezzieCount = 0;
    this.collisionDamageTimer = 0;
    this.shotTimerEnemy = 0;
    this.game.stage.backgroundColor = '#fff';
    music = this.game.add.audio('the-house');
    music.play();
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.setScreenSize(true);
    this.map = this.add.tilemap('map');
    this.map.addTilesetImage('ice_spritesheet', 'tileset');
    this.map.addTilesetImage('background_spritesheet', 'sky');
    bgtile = this.map.createLayer('backgroundLayer');
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

    layer = this.map.createLayer('blockedLayer');
    enemyLayer = this.map.createLayer('enemyLayer');
    enemyLayer.alpha = 0;
    layer.resizeWorld(); 
    this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');
    this.map.setCollisionBetween(1, 100000, true, 'enemyLayer');
    grpSnowmen = this.game.add.group();
    grpSnowmen.enableBody = true;
    this.player = this.game.add.sprite(100, 200, 'santa');
    this.game.physics.arcade.enable(this.player);
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 420;
    this.player.body.collideWorldBounds = true;
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);
    this.game.camera.follow(this.player);
    cursors = this.game.input.keyboard.createCursorKeys();
    spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    bullets = this.game.add.group();
    this.game.physics.enable(bullets, Phaser.Physics.ARCADE);
    snowballs = this.game.add.group();
    this.game.physics.enable(snowballs, Phaser.Physics.ARCADE);
    var shotTimer = 0;
    snowman1 = this.spawnSnowman(800,200, 'snowman1');
    snowman2 = this.spawnSnowman(1600,0, 'snowman2');
    snowman3 = this.spawnSnowman(2200,0, 'snowman3');
    snowman4 = this.spawnSnowman(3700,0, 'snowman4');
    snowman5 = this.spawnSnowman(5400,190, 'snowman5');
    this.lives = this.game.add.text(this.game.camera.x, this.game.camera.y, "Lives:"  + this.playerHP,{
      font: "24px Arial",
      fill: "#ffffff",
      align: "center"
    });
    this.scoreText = this.game.add.text(this.game.camera.x, this.game.camera.y, "Presents:",{
      font: "24px Arial",
      fill: "#ffffff",
      align: "center"
    });
    this.createPrezzies(this.map);
  },


  update: function() {
    this.lives.x = this.game.camera.x;
    this.lives.y = this.game.camera.y;
    this.scoreText.x = this.game.camera.x;
    this.scoreText.y = this.game.camera.y + 20;
    bgtile.scrollFactorX = 0.5;

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
    this.game.physics.arcade.collide(this.player, layer);
    this.game.physics.arcade.collide(grpSnowmen, layer);
    this.game.physics.arcade.collide(this.player, grpSnowmen, this.playerEnemyCollide, null, this);
    this.game.physics.arcade.collide(bullets, grpSnowmen, this.hitEnemy, null, this);
    this.game.physics.arcade.collide(snowballs, this.player, this.hitPlayer, null ,this);
    this.game.physics.arcade.collide(grpSnowmen, enemyLayer);
    this.game.physics.arcade.overlap(this.player, this.prezzies, this.collect, null, this);

    this.pathCounter += 1;
    if (this.pathCounter >= 650) {
      this.pathCounter = 0;
    }

    grpSnowmen.forEach(function(snowman) {
      if(snowman.isAlive){
      this.snowmanPath(snowman);
      this.enemyShoots(snowman);
    }
    }, this);

//this.snowmanPath(snowman1);
//this.snowmanPath(snowman2);
//this.snowmanPath(snowman3);
//this.snowmanPath(snowman4);
//this.snowmanPath(snowman5);
//this.enemyShoots(snowman1);
//this.enemyShoots(snowman2);
//this.enemyShoots(snowman3);



    this.player.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
this.playerLeft();
    }
    else if (cursors.right.isDown)
    {
this.playerRight();
    }
    else
    {
      this.player.animations.stop();
      this.player.frame = 4;
      facing = 'dormant';
    }
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && this.player.body.blocked.down)
        {
          this.playerJump();
          
        } 
        if (spaceKey.isDown) {
          this.shoot();
        }
      },
      snowmanPath: function(enemySnowman) {
        if (this.pathCounter < 325)  {
          enemySnowman.animations.play('walking_right');
          enemySnowman.body.velocity.x = 100;
          enemySnowman.facingEnemy = 'right';
        } else {
          enemySnowman.animations.play('walking_left');
          enemySnowman.body.velocity.x = -100;
          enemySnowman.facingEnemy = 'left';
        }
      },

      updateEnemyHP: function() {
      },

      hitEnemy: function(enemy,bullet) {
  boom = this.game.add.sprite(enemy.body.x - 50, enemy.body.y - 40, 'explosion');
  this.game.physics.enable(boom, Phaser.Physics.ARCADE);
  boom.animations.add('death', null, 25);
  boom.animations.play('death');
  enemy.isAlive = false;
  enemy.kill();
  bullet.kill();
  setTimeout(function() {game.world.remove(boom);},1000);
},

      hitPlayer: function(player, snowball){
        if (this.hitTimer < this.game.time.now) {
          this.hitTimer = this.game.time.now + 2000;
          this.snowball.kill();
          if(this.playerHP < 1)
          {
            this.game.time.events.add(1500, this.gameOver, this);
          }else{
          this.playerHP -=1;
          this.lives.setText("Lives:" + this.playerHP);
        }
        }
      },

      playerEnemyCollide: function(player, enemy){
        if (this.collisionDamageTimer < this.game.time.now) {
          this.collisionDamageTimer = this.game.time.now + 3000;
          this.playerHP -=1;
          if(this.playerHP < 1)
          {
            this.game.time.events.add(1500, this.gameOver, this);
          }else{
            this.lives.setText("Lives:" + this.playerHP);
          }
        }
      },

      killSnowball:function(snowball,groundLayer){
        snowball.kill();
      },

      enemyShoots: function(thisSnowMan) {
        obj = thisSnowMan;
        if (this.shotTimerEnemy < this.game.time.now && thisSnowMan.isAlive == true) {
          this.shotTimerEnemy = this.game.time.now + 3000;

          if (thisSnowMan.facingEnemy == 'right') {
            this.snowball = snowballs.create(thisSnowMan.body.x + thisSnowMan.body.width / 2 + 45, thisSnowMan.body.y + thisSnowMan.body.height / 2 + 5, 'snowball');
          } else {
            this.snowball = snowballs.create(thisSnowMan.body.x + thisSnowMan.body.width / 2 - 40, thisSnowMan.body.y + thisSnowMan.body.height / 2 + 5, 'snowball');
          }
          this.game.physics.enable(this.snowball, Phaser.Physics.ARCADE);
          this.snowball.body.gravity.y = 300;
          this.snowball.body.bounce.y = 10;
          this.snowball.outOfBoundsKill = true;
          this.snowball.anchor.setTo(0.5, 0.5);
          this.snowball.body.velocity.y = -160;
          if (thisSnowMan.facingEnemy == 'right') {
            this.snowball.body.velocity.x = 400;
          } else {
            this.snowball.body.velocity.x = -400;
          }
        }
      },

      shoot: function() {
        if (this.shotTimer < this.game.time.now) {
          this.shotTimer = this.game.time.now + 275;
          var bullet;
          if (facing == 'left') {
            bullet = bullets.create(this.player.body.x + this.player.body.width / 2 - 20, this.player.body.y + this.player.body.height / 2 - 4, 'bullet');
          } else {
            bullet = bullets.create(this.player.body.x + this.player.body.width / 2 + 20, this.player.body.y + this.player.body.height / 2 - 4, 'bullet');
          }
          this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
          bullet.outOfBoundsKill = true;
          bullet.anchor.setTo(0.5, 0.5);
          bullet.body.velocity.y = 0;
          if (facing == 'left') {
            bullet.body.velocity.x = -400;
          } else {
            bullet.body.velocity.x = 400;
          }
        }
      },
      spawnSnowball: function(){

      },

      spawnSnowman: function(x,y,name){
        var snowman = this.game.add.sprite(x,y, 'snowman');
        this.game.physics.arcade.enable(snowman);
        snowman.name = name;
        snowman.isAlive = true;
        snowman.health = 1;
        snowman.pathcount = 1;
        snowman.enableBody = true;
        snowman.body.gravity.y = 500;
        snowman.body.collideWorldBounds = true;
        snowman.animations.add('walking_left', [0,2], 6, true);
        snowman.animations.add('walking_right', [1,3], 6, true);
        grpSnowmen.add(snowman);
        return snowman;
      },

      createPrezzies: function(map) {
        this.prezzies = this.game.add.group();
        this.prezzies.enableBody = true;
        var result = this.findObjectsByType('present', map, 'presentLayer');
        result.forEach(function(element){
          this.createFromTiledObject(element, this.prezzies);
        }, this);
      },
      collect: function(player, collectable) {
    //play audio
    this.prezzieCount += 1;
    this.scoreText.setText("Presents:" + this.prezzieCount);
    //remove sprite
    collectable.destroy();
  },

  findObjectsByType: function(type, map, layerName) {
    var result = new Array();
    map.objects[layerName].forEach(function(element){
      if(element.properties.type === type) {
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
  },

  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
    },
  gameOver: function() {
    this.game.state.start("TheGame");
  },
  playerJump: function(){
  this.player.body.velocity.y = -350;
},
  playerLeft: function(){
 this.player.body.velocity.x = -150;
      this.player.animations.play('left');
      this.facing = 'left';
},
  playerRight: function(){
      this.player.body.velocity.x = 150;
      this.player.animations.play('right');
      this.facing = 'right';
},
  render: function(){
    //this.game.debug.body(player);
    //this.game.debug.bodyInfo(player, 16, 24);
  }
  }