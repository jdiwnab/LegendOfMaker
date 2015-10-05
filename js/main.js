var canvas;
var ctx;
var playerSpeed = 200;
var gameTime = 0;
window.onload =  function() {
    canvas = document.createElement("canvas")
    ctx = canvas.getContext("2d")
    canvas.width=512;
    canvas.height = 480;
    document.body.appendChild(canvas);
    resources.load(['img/rpg-autumn.png']);
    resources.onReady(init);
}



//main game loop
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime)/1000.0;
    
    update(dt);
    render();
    
    lastTime = now;
    
    requestAnimFrame(main);
}


function init() {
    reset();
    lastTime = Date.now();
    main();
}



var player = {
    pos:[0,0],
    sprite: new Sprite('img/rpg-autumn.png', [160,16], [16,16], 16, [0,1,2,3], 'horizontal', false)
};

function update(dt) {
    gameTime += dt;
    handleInput(dt);
    updateEntities(dt);
    
    checkCollisions();
    
}

function handleInput(dt) {
    if(input.isDown('down') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
    }
    if(input.isDown('up') || input.isDown('w')) {
        player.pos[1] -= playerSpeed * dt;
    }
    if(input.isDown('left') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
    }
    if(input.isDown('right') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
    }
}

function updateEntities(dt) {
    player.sprite.update(dt);
}

function collides(x,y,r,b,x2, y2, r2, b2) {
    return !(r<=x2 || x>r2 ||
             b<=y2 || y>b2);
}
function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0]+size[0], pos[1]+size[1],
                    pos2[0], pos2[0],
                    pos2[0]+size2[0], pos2[1]+size2[1]);
}
function checkCollisions() {
    checkPlayerBounds();
    //boxCollides();
}
function checkPlayerBounds() {
    if(player.pos[0] < 0 ){
        player.pos[0] = 0;
    } else if(player.pos[0]>canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }
    
    if(player.pos[1] < 0 ){
        player.pos[1] = 0;
    } else if(player.pos[1]> canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
    
}

function render() {
    ctx.fillColor = 'blue';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    renderEntity(player);
}
function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}
function reset() {
    player.pos = [canvas.width/2, canvas.height/2];
    gameTime = 0;
}