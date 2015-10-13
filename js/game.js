var game = new Phaser.Game(800, 608, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player, cursors, stars, walls, floor, doors, spacekey;
var score = 0;
var scoreText;
function preload() {
	game.load.image('star', 'assets/star.png');
	game.load.spritesheet('floor', 'assets/floor.png', 32,32);
	game.load.spritesheet('walls', 'assets/walls.png', 32,32);
	game.load.spritesheet('doors', 'assets/doors.png', 96,96);
	game.load.spritesheet('character', 'assets/character2.png', 64,64);
}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	walls = game.add.physicsGroup();
	walls.enableBody = true;
	createWallBorder(walls);
	floor = game.add.group();
	createFloor(floor);
	doors = game.add.group();
	createDoors(doors);
	player=game.add.sprite(game.world.width/2,game.world.height/2, 'character');
	createPlayer(player);
	

	cursors = game.input.keyboard.createCursorKeys();
	spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	stars = game.add.group();
	createStars(stars);

	scoreText = game.add.text(16,16, 'score: 0', {fontSize:'32px', fill: '#000'});

}

function createStars(stars) {
	stars.enableBody = true;
	for(var i = 1; i<11; i++) {
		var x = Math.random() * (game.world.width - 128);
		var y = Math.random() * (game.world.height -128);
		var star = stars.create(x,y,'star');
		//star.body.gravity.y = 200;
		//star.body.bounce.y = 0.9 + Math.random() * 0.2;
	}
}

function createPlayer(player) {
	game.physics.arcade.enable(player);
	player.body.collideWorldBounds = true;

	player.animations.add('walk_up', [0,1,2,3,4,5,6,7,8], 10, true);
	player.animations.add('walk_left', [9,10,11,12,13,14,15,16,17], 10, true);
	player.animations.add('walk_down', [18,19,20,21,22,23,24,25,26], 10, true);
	player.animations.add('walk_right', [27,28,29,30,31,32,33,34,35], 10, true);
	player.animations.add('swing_up', [36,37,38,39,40,41], 20, true);
	player.animations.add('swing_left', [45,46,47,48,49,50], 20, true);
	player.animations.add('swing_down', [54,55,56,57,58,59], 20, true);
	player.animations.add('swing_right', [63,64,65,66,67,68], 20, true);
	player.body.friction = new Phaser.Point(0,0);
}
function createWallBorder(walls) {
	var wall;
	for(var i=32; i<=game.world.width-64; i+=32) {
		wall = walls.create(i, game.world.height-32, 'walls', Math.floor(Math.random()*5)+8);
		wall = walls.create(i, game.world.height-64, 'walls', Math.floor(Math.random()*6)+8);
		wall = walls.create(i, 0, 'walls', Math.floor(Math.random()*5));
		wall = walls.create(i, 32, 'walls', Math.floor(Math.random()*6));
	}
	for(var i=32; i<=game.world.height-64; i+=32) {
		wall = walls.create(0, i, 'walls', Math.floor(Math.random()*5)+24);
		wall = walls.create(32, i, 'walls', Math.floor(Math.random()*6)+24);
		wall = walls.create(game.world.width-32, i, 'walls', Math.floor(Math.random()*5)+16);
		wall = walls.create(game.world.width-64, i, 'walls', Math.floor(Math.random()*6)+16);
	}
	wall = walls.create(0,0, 'walls', 6);
	wall = walls.create(32,32, 'walls', 6);
	wall = walls.create(game.world.width-32,0, 'walls', 6+16);
	wall = walls.create(game.world.width-64,32, 'walls', 6+16);
	wall = walls.create(0,game.world.height-32, 'walls', 6+8);
	wall = walls.create(32,game.world.height-64, 'walls', 6+8);
	wall = walls.create(game.world.width-32,game.world.height-32, 'walls', 6+24);
	wall = walls.create(game.world.width-64,game.world.height-64, 'walls', 6+24);
	walls.setAll('body.immovable', true);
	walls.setAll('body.friction', new Phaser.Point(0,0));
}
function createFloor(floor) {
	for(var x=64; x<game.world.width-64; x+=32) {
		for(var y=64; y<game.world.height-64; y+=32) {
			if(y==64) {
				//top row
				if(x==64) {
					floor.create(x,y,'floor', 12);
				} else if(x==game.world.width-96) {
					floor.create(x,y,'floor', 13);
				} else {
					floor.create(x,y,'floor', 4);
				}
			} else if(y==game.world.height-96) {
				//bottom row
				if(x==64) {
					floor.create(x,y,'floor', 18);
				} else if(x==game.world.width-96) {
					floor.create(x,y,'floor', 19);
				} else {
					floor.create(x,y,'floor', 16);
				}
			} else {
				if(x==64) {
					floor.create(x,y,'floor', 10);
				} else if(x==game.world.width-96) {
					floor.create(x,y,'floor', 22);
				} else {
					floor.create(x,y,'floor', 2);
				}
			}
		}
	}
}
function createDoors(doors) {
	doors.create(game.world.width/2-96/2, -29, 'doors', 0);
	doors.create(game.world.width/2-96/2, game.world.height-67, 'doors', 1);
	doors.create(-29, game.world.height/2-96/2, 'doors', 3);
	doors.create(game.world.width-67, game.world.height/2-96/2, 'doors' ,2);
}
function update() {
	setCollisions();
	playerMovement();
}
function playerMovement() {
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	if(cursors.left.isDown) {
		player.body.velocity.x = -250;
	} else if(cursors.right.isDown) {
		player.body.velocity.x = 250;
	}

	if (cursors.up.isDown) {
		player.body.velocity.y = -250;
	} else if(cursors.down.isDown) {
		player.body.velocity.y = 250;
	}

	if(player.body.velocity.x !=0 && player.body.velocity.y !=0) {
		player.body.velocity.x /= Math.sqrt(2);
		player.body.velocity.y /= Math.sqrt(2);
	}

	if(spacekey.isDown) {
		if(player.body.facing == 1) {
			player.animations.play('swing_left');
		} else if(player.body.facing == 2) {
			player.animations.play('swing_right');
		} else if(player.body.facing == 3) {
			player.animations.play('swing_up');
		} else if(player.body.facing == 4) {
			player.animations.play('swing_down');
		}
	} else {
		if(cursors.up.isDown) {
			player.animations.play('walk_up');
		} else if (cursors.down.isDown) {
			player.animations.play('walk_down');
		} else if (cursors.left.isDown) {
			player.animations.play('walk_left');
		} else if (cursors.right.isDown) {
			player.animations.play('walk_right');
		} else {
			player.animations.stop();
		}
	}
}
function setCollisions() {
	game.physics.arcade.collide(player, walls);
	game.physics.arcade.collide(stars, walls);
	game.physics.arcade.overlap(player, stars, collectStar, null, this);
}
function collectStar(player, star) {
	star.kill();
	score += 10;
	scoreText.text = 'Score: '+score;
}