//var game = new Phaser.Game(746, 420, Phaser.AUTO, 'mapPhaser', { boot: boot, preload: preload, create: create, update: update, render: render });

var map;
var bgtile;
var layer;
var enemyLayer;
var player;
var cursors;
var spaceKey;
var shotTimer = 0;
var pathCounter = 0;
var enemyHP = 10;
var playerHP = 3;
var shotTimerEnemy = 0;
var partile;
var particles = [];
var prezzies;
gameState = true;
var grpSnowmen;




function create() {
  game.stage.backgroundColor = '#fff';
  music = game.add.audio('the-house');
  music.play();
  game.physics.startSystem(Phaser.Physics.ARCADE);
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
 
    //have the game centered horizontally
 
    this.scale.pageAlignHorizontally = true;
 
    this.scale.pageAlignVertically = true;
 
    //screen size will be set automatically
 
    this.scale.setScreenSize(true);
  this.map = this.add.tilemap('map');
  this.map.addTilesetImage('ice_spritesheet', 'tileset');
  this.map.addTilesetImage('background_spritesheet', 'sky');
  bgtile = this.map.createLayer('backgroundLayer');
  levelGroup=game.add.group();
  var sprite = { x: 0, y: -64 };
  var tween = game.add.tween(sprite).to( { x: 128 }, 4000, "Bounce.easeIn", true, 0, -1, true);
  var tween2 = game.add.tween(sprite).to( { y: 128 }, 4000, "Bounce.easeOut", true, 0, -1, false);
  waveformX = tween.generateData(60);
  waveformY = tween2.generateData(160);
  xl = waveformX.length - 1;
  yl = waveformY.length - 1;
  var sprites = game.add.spriteBatch();
  snowflakes = [];
  var xs = 228;
  var ys = 132;
  for (var y = 0; y < 18; y++)
  {
    for (var x = 0; x < 28; x++)
    {
      var snowflake = game.make.sprite((x * xs), (y * ys), 'snowflake');
      snowflake.ox = snowflake.x;
      snowflake.oy = snowflake.y;
      snowflake.cx = game.rnd.between(0, xl);
      snowflake.cy = game.rnd.between(0, yl);
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
  grpSnowmen = game.add.group();
  grpSnowmen.enableBody = true;
  player = game.add.sprite(100, 200, 'santa');
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 420;
  player.body.collideWorldBounds = true;
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);
  game.camera.follow(player);
  cursors = game.input.keyboard.createCursorKeys();
  spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  bullets = game.add.group();
  game.physics.enable(bullets, Phaser.Physics.ARCADE);
  snowballs = game.add.group();
  game.physics.enable(snowballs, Phaser.Physics.ARCADE);
  var shotTimer = 0;
  enemySnowman = spawnSnowman(800,200);
  enemySnowman2 = spawnSnowman(1600,0);
  createPrezzies(this.map);
}

//------------------------------
// UPDATE
//------------------------------

function update() {

//------
// SNOW
//------
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

//------
// COLLISIONS
//------

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(grpSnowmen, layer);
    game.physics.arcade.collide(player, grpSnowmen, playerEnemyCollide, null, this);
    game.physics.arcade.collide(bullets, enemySnowman, hitEnemy, null, this);
    game.physics.arcade.collide(bullets, enemySnowman2, hitEnemy, null, this);
    game.physics.arcade.collide(snowballs, player, hitPlayer, null ,this);
    game.physics.arcade.collide(enemySnowman2, enemyLayer);

    pathCounter += 1;
    if (pathCounter >= 650) {
      pathCounter = 0;
    }

//------
// SNOWMEN MOVEMENTS
//------

  grpSnowmen.forEach(function(snowman) {
    snowmanPath(snowman);
    enemyShoots(snowman);
  }, this);

//------
// PLAYER MOVEMENT
//------

  player.body.velocity.x = 0;
  if (cursors.left.isDown)
  {
    player.body.velocity.x = -150;
    player.animations.play('left');
    facing = 'left';
            //bgtile.position.set(game.camera.x, game.camera.y);
            //bgtile.tilePosition.x += 0.5;
          }
          else if (cursors.right.isDown)
          {
            player.body.velocity.x = 150;
            player.animations.play('right');
            facing = 'right';
            //bgtile.position.set(game.camera.x, game.camera.y);
            //bgtile.tilePosition.x -= 0.5;
          }
          else
          {
            player.animations.stop();
            player.frame = 4;
            facing = 'dormant';
          }
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.blocked.down)
        {
          player.body.velocity.y = -350;
        } 
        if (spaceKey.isDown) {
          shoot();
        }


        function snowmanPath(enemySnowman) {
          if (pathCounter < 325)  {
            enemySnowman.animations.play('walking_left');
            enemySnowman.body.velocity.x = -100;
            enemySnowman.facingEnemy = 'left';
          } else {
            enemySnowman.animations.play('walking_right');
            enemySnowman.body.velocity.x = 100;
            enemySnowman.facingEnemy = 'right';
          }
        }

        function updateEnemyHP() {
  //enemyText.destroy();
  //enemyText = game.add.text(enemy.body.x + 20, enemy.body.y + 129, enemyHP);
}
function hitEnemy(enemy,bullet) {
  boom = game.add.sprite(enemy.body.x - 50, enemy.body.y - 40, 'explosion');
  game.physics.enable(boom, Phaser.Physics.ARCADE);
  boom.animations.add('death', null, 25);
  boom.animations.play('death');
  enemy.kill();
  bullet.kill();
  setTimeout(function() {game.world.remove(boom);},1000);
}

function hitPlayer(player, snowball){
  snowball.kill();
  playerHP -=1;
}

function playerEnemyCollide(player, enemy){
  playerHP -=1;
}

function killSnowball(snowball,groundLayer){
  snowball.kill();
}


}

function enemyShoots(enemySnowman) {
  if (shotTimerEnemy < game.time.now) {
    shotTimerEnemy = game.time.now + 3000;
    var snowball;
    if (enemySnowman.facingEnemy == 'right') {
      snowball = snowballs.create(enemySnowman.body.x + enemySnowman.body.width / 2 + 45, enemySnowman.body.y + enemySnowman.body.height / 2 + 5, 'snowball');
    } else {
      snowball = snowballs.create(enemySnowman.body.x + enemySnowman.body.width / 2 - 40, enemySnowman.body.y + enemySnowman.body.height / 2 + 5, 'snowball');
    }
    game.physics.enable(snowball, Phaser.Physics.ARCADE);
    snowball.body.gravity.y = 300;
    snowball.body.bounce.y = 10;
    snowball.outOfBoundsKill = true;
    snowball.anchor.setTo(0.5, 0.5);
    snowball.body.velocity.y = -160;
    if (enemySnowman.facingEnemy == 'right') {
      snowball.body.velocity.x = 400;
    } else {
      snowball.body.velocity.x = -400;
    }
  }
}

function shoot() {
  if (shotTimer < game.time.now && facing != 'dormant') {
    shotTimer = game.time.now + 275;
    var bullet;
    if (facing == 'right') {
      bullet = bullets.create(player.body.x + player.body.width / 2 + 20, player.body.y + player.body.height / 2 - 4, 'bullet');
    } else {
      bullet = bullets.create(player.body.x + player.body.width / 2 - 20, player.body.y + player.body.height / 2 - 4, 'bullet');
    }
    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullet.outOfBoundsKill = true;
    bullet.anchor.setTo(0.5, 0.5);
    bullet.body.velocity.y = 0;
    if (facing == 'right') {
      bullet.body.velocity.x = 400;
    } else {
      bullet.body.velocity.x = -400;
    }
  }
}

function spawnSnowman(x,y){
  var snowman = game.add.sprite(x,y, 'snowman');
  game.physics.arcade.enable(snowman);
  snowman.health = 3;
  snowman.pathcount = 1;
  snowman.enableBody = true;
  snowman.body.gravity.y = 500;
  snowman.body.collideWorldBounds = true;
  snowman.animations.add('walking_left', [0,2], 6, true);
  snowman.animations.add('walking_right', [1,3], 6, true);
  grpSnowmen.add(snowman);
  return snowman;
}

function spawnEnemy(x, y) {
  enemy = game.add.sprite(x,y,'snowman');
  game.physics.enable(enemy, Phaser.Physics.ARCADE);
  enemy.body.gravity.y = 500;
  enemy.body.collideWorldBounds = true;
  enemy.body.fixedRotation = true;
  enemy.frame = 1;
  enemy.animations.add('walking_left', [0,2], 6, true);
  enemy.animations.add('walking_right', [1,3], 6, true);
  enemyText = game.add.text(enemy.body.x, enemy.body.y - 30, enemyHP);
}  

function createPrezzies(map) {
  this.prezzies = this.game.add.group();
  this.prezzies.enableBody = true;
  var result = this.findObjectsByType('present', map, 'presentLayer');
  result.forEach(function(element){
    this.createFromTiledObject(element, this.prezzies);
  }, this);
}

function findObjectsByType(type, map, layerName) {
  var result = new Array();
  map.objects[layerName].forEach(function(element){
    if(element.properties.type === type) {
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
  return result;
}

function createFromTiledObject(element, group) {
  var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
    }

    function render () {
    //game.debug.body(enemy);
    //game.debug.bodyInfo(player, 16, 24);
  }