/**
 * Created by zhouhui on 2017/7/12.
 */
var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gamecontainer', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.onFileComplete.add(filecomplete, this);
    game.load.onLoadComplete.add(loadcomplete, this);
    game.load.atlas('character', '/protecthomes/image/character/character.png', '/protecthomes/image/character/character.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlas('archer', '/protecthomes/image/archer.png', '/protecthomes/image/archer.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlas('building', '/protecthomes/image/building.png', '/protecthomes/image/building.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.tilemap('gamescene', '/protecthomes/image/tilemap/gamescene.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('scene', '/protecthomes/image/tilemap/scene.png', 64, 64);
    game.load.image('background', '/protecthomes/image/background.png');
    game.load.atlas('boss1', '/protecthomes/image/boss/boss1.png', '/protecthomes/image/boss/boss1.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlas('boss2', '/protecthomes/image/boss/boss2.png', '/protecthomes/image/boss/boss2.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlas('boom1', '/protecthomes/image/boom/boom1.png', '/protecthomes/image/boom/boom1.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlas('number', '/protecthomes/image/number/number.png', '/protecthomes/image/number/number.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
}
var gameWidth = 1024,
    gameHeight = 768;

var gamescene;
var startscene;
var status = 0

function create() {
    game.world.setBounds(0, 0, gameWidth, gameHeight);
    game.physics.startSystem(Phaser.ARCADE);
    game.stage.backgroundColor = "#c2f1ff";
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //gamescene = new mainScene(game);
    startscene = new startScene(game);
}

function update() {
    if(status == 1){
        gamescene.sceneUpdate();
        gamescene.scorecard();
    }
}

function render() {
    // game.debug.spriteBounds(archerPlayer.body);
    // game.debug.spriteInfo(myHome.body,20,32);
    // archerPlayer.weapon.debug();
    // game.debug.body(gamescene.mycliff.body);
    // game.debug.body(gamescene.myHome.body);
    // for(var i=0;i<gamescene.bossGroup.length;i++){
    //     game.debug.body(gamescene.bossGroup[i].body);
    // }
}

function filecomplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    document.getElementById("layer").getElementsByTagName("p")[0].innerHTML = "\u5df2\u52a0\u8f7d" + progress + "%";
}
function loadcomplete() {
    document.getElementById("layer").getElementsByTagName("p")[1].innerHTML = "\u8d44\u6e90\u52a0\u8f7d\u5b8c\u6210";
    document.getElementById("layer").style.display = "none";
}


(function (window) {
    var startScene = function (game) {
        this.game = game;

        this.title = null;

        this.background = null;

        this.button_start = null;
        this.button_rule = null;
        this.button_close = null;

        this.rulespan = null;
        this.ruleTitle = null;
        this.ruleMessage = null;

        this.emitter = null;

        this.init();
    }
    startScene.prototype = {
        init : function(){
            //add background image
            this.background = this.game.add.sprite(0, 0, 'background');

            //add emitter
            this.emitter = this.game.add.emitter(this.game.world.centerX,this.game.world._height+100,50);
            this.emitter.width = this.game.world._width;
            this.emitter.makeParticles('building',['balloon-1.png','balloon-2.png','balloon-3.png'],50,false,false);
            this.emitter.minParticleSpeed.setTo(-50, -100);
            this.emitter.maxParticleSpeed.setTo(50, -300);
            this.emitter.gravity = -2;
            this.emitter.setRotation(0,0);
            this.emitter.flow(4000, 500, 2, -1);

            //add title image
            this.title = this.game.add.sprite(this.game.world.centerX,50,'character','title.png');
            this.title.anchor.set(0.5,0);
            //add button
            this.button_start = this.game.add.button(this.game.world.centerX,350,'character',null,this,'start.png','start.png','start.png');
            this.button_start.anchor.set(0.5,0);
            this.button_start.onInputUp.add(this.startAction,this);
            this.button_rule = this.game.add.button(this.game.world.centerX,450,'character',null,this,'rule.png','rule.png','rule.png');
            this.button_rule.anchor.set(0.5,0);
            this.button_rule.onInputUp.add(this.showRuleAction,this);
            //init rulespan
            var graphics = this.game.add.graphics(100,100);
            graphics.beginFill(0x4da0f9, 1);
            graphics.lineStyle(10, 0xf95c4d, 1);
            graphics.drawRoundedRect(this.game.world.centerX, 350, 500, 600,20);
            graphics.endFill();
            this.rulespan = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,graphics.generateTexture());
            this.rulespan.anchor.set(0.5,0.5);
            this.rulespan.kill();
            graphics.destroy();
            //draw button of close
            var c_graphics = this.game.add.graphics(0,0);
            c_graphics.lineStyle(10, 0x605e57, 1);
            c_graphics.moveTo(0,0);
            c_graphics.lineTo(20, 20);
            c_graphics.moveTo(20,0);
            c_graphics.lineTo(0, 20);
            c_graphics.endFill();
            this.button_close = this.game.add.sprite(730,110,c_graphics.generateTexture());
            this.button_close.anchor.set(0.5,0.5);
            this.button_close.kill();
            c_graphics.destroy();
            //add rule tile
            this.ruleTitle = this.game.add.text(this.game.world.centerX,150,'\u64cd\u4f5c\u6309\u952e',
                {
                    font:'42px Arial',
                    fill:'#8f5004',
                    fontWeight:'bold',
                    stroke:'#bda88f',
                    strokeThickness:'8'
                });
            this.ruleTitle.anchor.set(0.5,0.5);
            this.ruleTitle.kill();

            this.ruleMessage = this.game.add.text(this.game.world.centerX,200,
                'W\u5411\u4e0a\u79fb\u52a8\n' +
                'S\u5411\u4e0b\u79fb\u52a8\n' +
                'J\u8fdb\u884c\u653b\u51fb\n\n' +
                '\u53ef\u901a\u8fc7\u51fb\u788e\u6c14\u7403\u6216\u8005\u76f4\u63a5\u653b\u51fb\n' +
                '\u654c\u4eba\u6d88\u706d\u4e0b\u843d\u7684\u654c\u4eba\uff0c\u963b\u6b62\u654c\n' +
                '\u4eba\u843d\u5730',
                {
                    font:'30px Arial',
                    fill:'#5c6665',
                    fontWeight:'bold',
                    stroke:'#bda88f',
                    strokeThickness:'2',
                    wordWrap:'true',
                    wordWrapWidth:200
                });
            this.ruleMessage.anchor.set(0.5,0);
            this.ruleMessage.kill();

        },
        startAction: function(){
            this.game.world.removeAll();
            gamescene = new mainScene(game);
            status = 1;
        },
        showRuleAction: function(){
            this.button_close.events.onInputUp.add(this.closeRuleAction,this);
            this.button_close.inputEnabled = true;
            this.button_close.input.useHandCursor = true;

            this.rulespan.revive(1);
            this.button_close.revive(1);

            this.button_rule.inputEnabled = false;
            this.button_start.inputEnabled = false;

            this.ruleTitle.revive(1);
            this.ruleMessage.revive(1);
        },
        closeRuleAction : function(){
            this.rulespan.kill();
            this.button_close.kill();

            this.button_rule.inputEnabled = true;
            this.button_rule.input.useHandCursor = true;

            this.button_start.inputEnabled = true;
            this.button_start.input.useHandCursor = true;

            this.ruleTitle.kill();
            this.ruleMessage.kill();
        }
    }

    window.startScene = startScene;


    var mainScene = function (game) {
        this.game = game;

        this.score = 0;
        this.prescore = 0;

        this.archerPlayer = null;
        this.archerUp = null;
        this, archerDown = null;

        this.gamescene = null;

        this.ground = null;

        this.platformPlayer = null;

        this.myHome = null;
        this.mycliff = null;

        this.bossGroup = new Array();
        this.createBoss = {pretime: null, interval: null};

        this.isgameover = false;

        this.numbergroup = null;
        this.numbertext = null;

        this.healthgroup = null;

        this.gameovertext = null;
        this.button_restart = null;

        this.init();
        this.addKeyBoard();
    }
    mainScene.prototype = {
        init: function () {
            //add background image
            this.game.add.sprite(0, 0, 'background');

            //add tiledmap of scene
            this.gamescene = this.game.add.tilemap('gamescene');
            this.gamescene.addTilesetImage('scene');
            this.ground = this.gamescene.createLayer('ground');
            this.gamescene.createLayer('groundtree2');
            this.gamescene.createLayer('groundtree1');
            this.gamescene.createLayer('groundgrass2');
            this.gamescene.createLayer('groundgrass1');
            this.gamescene.createLayer('clifftree2');
            this.gamescene.createLayer('clifftree1');
            this.gamescene.createLayer('cliffgrass1');
            this.gamescene.createLayer('cliffgrass2');
            this.ground.resizeWorld();
            this.gamescene.setCollisionBetween(57, 59);


            //add sprit of board
            new board(this.game, 760, 745, 'building');
            //add sprite of platform
            this.platformPlayer = new platform(this.game, 800, 120, 'building');
            //add sprite of archer
            this.archerPlayer = new archer(this.game, 'archer', 760, 135, 'building');
            //add sprite of cliff
            this.mycliff = new cliff(this.game, 0, 112, 'building');
            //add sprite of tower
            this.myHome = new tower(this.game, gameWidth, 20, 'building');

            this.bossGroup.push(new boss2(game, -20, 100));
            this.createBoss.pretime = new Date().getTime();
            this.createBoss.interval = Math.random() * 3000 + 500;

            this.numbergroup = this.game.add.group();
            for(var i=0;i<4;i++){
                var num = this.numbergroup.create(600+25*i,10,'number',0,true,i);
                num.scale.set(1.3);
            }
            this.numbertext = this.game.add.sprite(540,10,'character','font_score.png');
            this.numbertext.scale.set(0.9,0.9);
            //add health
            this.healthgroup = this.game.add.group();
            for(var i=0;i<3;i++){
                var HP = this.healthgroup.create(800+35*i,10,'character','heart2.png',true,i);
                HP.scale.set(0.8,0.8);
            }
            // add gameover text
            this.gameovertext = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'character','gameover.png');
            this.gameovertext.anchor.set(0.5,1);
            this.gameovertext.kill();
            //add button of restart
            this.button_restart = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY + 100,'character','restart.png');
            this.button_restart.anchor.set(0.5,1);
            this.button_restart.kill();
        },
        addKeyBoard: function () {
            //keybord
            var shoot = this.game.input.keyboard.addKey(Phaser.KeyCode.J);
            shoot.onDown.add(this.archerPlayer.shoot, this.archerPlayer);
            this.archerUp = this.game.input.keyboard.addKey(Phaser.KeyCode.W);
            this.archerDown = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
        },
        sceneUpdate: function () {
            var gameobj = this;
            this.archerPlayer.body.body.velocity.y = 0;
            this.platformPlayer.body.body.velocity.y = 0;
            //player move
            if (this.archerUp.isDown) {
                if (this.archerPlayer.body.world.y <= 130) {
                    this.archerPlayer.body.body.velocity.y = 0;
                    this.platformPlayer.body.body.velocity.y = 0;
                } else {
                    this.archerPlayer.body.body.velocity.y -= 300;
                    this.platformPlayer.body.body.velocity.y -= 300;
                }
            } else if (this.archerDown.isDown) {
                if (this.archerPlayer.body.world.y >= gameHeight - 240) {
                    this.archerPlayer.body.body.velocity.y = 0;
                    this.platformPlayer.body.body.velocity.y = 0;
                } else {
                    this.archerPlayer.body.body.velocity.y += 300;
                    this.platformPlayer.body.body.velocity.y += 300;
                }
            }
            //the platform move
            this.platformPlayer.rope.height = this.game.physics.game.physics.arcade.distanceToXY(this.platformPlayer.body, 763, 70, false);


            //the boss move
            for (var i = 0; i < this.bossGroup.length; i++) {
                var b = this.bossGroup[i];
                var obj = this;
                var intersects = this.game.physics.arcade.collide(this.mycliff.body, b.body, function (cliff, boss) {
                    boss.body.velocity.setTo(b.runspeed.x, b.runspeed.y);
                }, null, this.game);
                if (this.game.physics.arcade.distanceToXY(b.body, 300, b.body.position.y) < Math.random() * 20 && intersects) {
                    b.body.body.gravity.y = 200;
                    b.body.body.velocity.setTo(50 + Math.random() * 100, -200);
                    b.body.animations.currentAnim.stop();
                }
                if (this.game.physics.arcade.sortBottomTop(this.mycliff.body, b.body) > 0 && !b.isonGround) {
                    if (b.ishaveballoon) {
                        b.body.body.gravity.y = 0;
                        b.body.body.velocity.setTo(b.downspeed.x, b.downspeed.y);
                        b.body.animations.frameName = 'boss2-10.png';
                        if (b.BalloonGroup.children.length <= 0) {
                            b.balloonInit();
                        }
                    } else {
                        b.body.body.velocity.setTo(b.quickdown.x, b.quickdown.y);
                    }
                }
                this.game.physics.arcade.collide(b.body, this.ground, function (boss, layer) {
                    if (b.BalloonNum == 0) {
                        b.BalloonNum -= 1;
                        boss.body.setSize(117, 67, 0, 0);
                        boss.animations.play('dead', 7, false);

                        boss.animations.currentAnim.onComplete.add(function () {
                            obj.score += b.grade;//show score
                            boss.destroy();
                            obj.bossGroup.splice(i, 1);
                            return;
                        });
                    } else if (b.BalloonNum > 0) {
                        b.isonGround = true;
                        boss.animations.play('run', 7, true);
                        boss.body.velocity.setTo(b.runspeed.x, b.runspeed.y);
                        b.BalloonGroup.removeAll(true, false, false);
                        b.RopeGroup.removeAll(true, false, false);
                    }
                }, null, this.game);
                this.game.physics.arcade.collide(b.body, this.myHome.body, function (boss, layer) {
                    boss.destroy();
                    obj.bossGroup.splice(i, 1);
                    gameobj.myHome.health -= 1;
                    obj.healthgroup.getAt(gameobj.myHome.health).frameName = 'heart1.png';
                    if (gameobj.myHome.health == 0) {
                        gameobj.isgameover = true;
                        gameobj.gameover();
                    }
                    return;
                }, null, this.game);

                //check boss is overlap with weapon
                this.game.physics.arcade.overlap(b.body, this.archerPlayer.weapon.bullets, function (boss, bullet) {
                    b.health -= 1;
                    if (b.health == 0) {
                        bullet.kill();
                        boss.kill();
                        b.dead();
                        obj.score+=b.grade;//show score
                        b.BalloonGroup.removeAll(true, false, false);
                        b.RopeGroup.removeAll(true, false, false);
                        obj.bossGroup.splice(i, 1);
                        return;
                    } else if (b.health > 0) {
                        bullet.kill();
                        b.boom(bullet.position.x,bullet.position.y);
                    }
                }, null, this.game);
                this.game.physics.arcade.collide(b.BalloonGroup, this.archerPlayer.weapon.bullets, function (balloon, bullet) {
                    var a = -1;
                    for (var i = 0; i < b.BalloonGroup.children.length; i++) {
                        if (balloon == b.BalloonGroup.children[i]) {
                            a = i;
                        } else {
                            b.BalloonGroup.children[i].angle = 0;
                            b.BalloonGroup.children[i].position.setTo(b.body.x - 2, b.body.y - b.body.body.height - 5);
                            b.RopeGroup.children[i].angle = 0;
                            b.RopeGroup.children[i].position.setTo(b.body.x - 2, b.body.y - b.body.body.height + 13);
                        }
                    }
                    if (a > -1) {
                        b.RopeGroup.children[a].kill();
                    }
                    balloon.kill();
                    bullet.kill();
                    b.BalloonNum -= 1;
                    if (b.BalloonNum == 0) {
                        b.body.animations.frameName = 'boss2-3.png';
                        b.ishaveballoon = false;
                    }
                });
            }

            if (this.createBoss.pretime + this.createBoss.interval < new Date().getTime() && !this.isgameover) {
                this.bossGroup.push(new boss2(game, -20, 100));
                this.createBoss.pretime = new Date().getTime();
                this.createBoss.interval = Math.random() * 3000 + 500;
            }
        },
        gameover: function () {
            this.archerPlayer.body.kill();
            this.platformPlayer.body.kill();
            this.gameovertext.revive(1);
            this.button_restart.revive(1);
            this.button_restart.events.onInputUp.add(this.restart,this);
            this.button_restart.inputEnabled = true;
            this.button_restart.input.useHandCursor = true;
        },
        restart: function(){
            this.game.world.removeAll();
            gamescene = new mainScene(game);
        },
        scorecard : function(){
            if(this.prescore <= 9999){
                if(this.score  > this.prescore){
                    this.prescore += 1;
                    var str_number = splitnumber(this.prescore);
                    for(var i=0;i<str_number.length;i++){
                        this.numbergroup.getAt(i).frameName = "number"+str_number[i]+'.png';
                    }
                }
            }

            function splitnumber(number){
                var str = number + "";
                var newnumber = "";
                for(var i =0;i<4-str.length;i++){
                    newnumber += "0";
                }
                newnumber += str;
                var a_number=[];
                for(var i=0;i<4;i++){
                    a_number[i] = newnumber.substr(i,1);
                }
                return a_number;
            }
        }
    }
    window.mainScene = mainScene;

    var archer = function (game, resources, x, y, weapon) {
        this.game = game;
        this.resources = resources;
        this.weaponresource = weapon;
        this.body = null;
        this.anim = null;
        this.site = {x: x, y: y};
        this.health = 1;
        this.weapon = null;
        this.canShoot = true;
        this.init();
    }
    archer.prototype = {
        init: function () {
            var obj = this;
            this.body = this.game.add.sprite(this.site.x, this.site.y, this.resources);
            this.game.physics.arcade.enable(this.body);
            this.anim = this.body.animations.add('shoot', [2]);
            this.body.body.drag.set(10);
            this.body.body.collideWorldBounds = true;
            this.body.scale.setTo(0.5, 0.5);
            //packiing arrow
            var packing = this.body.animations.add('packing', [2, 3, 0, 1]);
            packing.onComplete.add(function (sprite, animation) {
                obj.canShoot = true;
            }, null);
            //add weapon for archer
            this.weapon = game.add.weapon(20, this.weaponresource);
            this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            for (var i = 0; i < this.weapon.bullets.children.length; i++) {
                this.weapon.bullets.children[i].frameName = 'arrow.png'
                this.weapon.bullets.children[i].scale.set(0.5);
                this.weapon.bullets.children[i].anchor.setTo(0, 0.5);
            }
            this.weapon.bulletAngleOffset = 180;
            this.weapon.fireAngle = 180;
            this.weapon.bulletSpeed = 400;
            this.weapon.fireRate = 60;
            this.weapon.bulletGravity.set(0, 100);
            this.weapon.trackSprite(this.body, 0, 49, false);
            this.anim.onComplete.add(function (sprite, animation) {
                obj.weapon.fire();
                obj.canShoot = false;
                obj.body.animations.play('packing', 7, false);
            }, null);
        },
        shoot: function () {
            if (this.canShoot) {
                this.body.animations.play('shoot', 7, false);
            }
        }
    }
    window.archer = archer;

    var tower = function (game, x, y, resources) {
        this.game = game;
        this.resources = resources;
        this.body = null;
        this.point = {x: x, y: y};
        this.health = 3;
        this.init();
    }
    tower.prototype = {
        init: function () {
            this.body = this.game.add.sprite(this.point.x, this.point.y, this.resources);
            this.body.frameName = 'tower.png';
            this.body.anchor.setTo(1, 0);
            this.body.scale.setTo(1.8, 1.8);
            this.game.physics.arcade.enable(this.body);
            this.body.body.immovable = true;
            this.body.body.setSize(20, 320, 50, 90);
        }
    }
    window.tower = tower;

    var cliff = function (game, x, y, resources) {
        this.game = game;
        this.resources = resources;
        this.body = null;
        this.point = {x: x, y: y};
        this.init();
    }
    cliff.prototype = {
        init: function () {
            this.body = this.game.add.sprite(this.point.x, this.point.y, this.resources);
            this.body.frameName = 'cliff.png';
            this.body.anchor.setTo(0, 0);
            this.body.scale.setTo(1.2, 1.2);
            this.game.physics.arcade.enable(this.body);
            this.body.body.immovable = true;
            this.body.body.setSize(350, 40, -80, 10);
        }
    }
    window.cliff = cliff;

    var board = function (game, x, y, resources) {
        this.game = game;
        this.resources = resources;
        this.point = {x: x, y: y};
        this.body = null;
        this.init();
    }
    board.prototype = {
        init: function () {
            this.body = this.game.add.sprite(this.point.x, this.point.y, this.resources);
            this.body.frameName = 'board.png';
            this.body.anchor.setTo(0.5, 1);
            this.body.scale.setTo(0.8, 0.8);
        }
    }
    window.board = board;

    var platform = function (game, x, y, resources) {
        this.game = game;
        this.resources = resources;
        this.point = {x: x, y: y};
        this.body = null;
        this.rope = null;
        this.init();
    }
    platform.prototype = {
        init: function () {
            //init the platform
            this.body = this.game.add.sprite(this.point.x, this.point.y, this.resources);
            this.body.frameName = 'platform.png';
            this.game.physics.arcade.enable(this.body);
            this.body.body.drag.set(10);
            this.body.anchor.setTo(0.5, 0);
            this.body.scale.setTo(0.6, 0.6);
            //add the rope
            this.rope = this.game.add.sprite(this.point.x + 2, this.point.y - 10, this.resources);
            this.rope.frameName = 'rope.png';
            this.game.physics.arcade.enable(this.rope);
            this.rope.body.allowGravity = false;
            this.rope.width = 2;
            this.rope.height = 1;
            this.rope.anchor.setTo(0.5, 0);
        }
    }
    window.platform = platform;

    var cloud = function (game, from, speed, delay) {
        this.game = game;
        this.body = null;
        this.from = from;
        this.speed = speed;
        this.delay = delay;
        this.init();
    }
    cloud.prototype = {
        init: function () {
            this.body = this.game.add.sprite(this.from.x, this.from.y, 'building');
            this.body.frameName = "cloud" + (parseInt(Math.random() * 4) + 1) + ".png";
            this.body.scale.set(game.rnd.realInRange(0.6, 1.3));
            this.game.add.tween(this.body).to({x: -100}, this.speed, Phaser.Easing.Linear.None, true, this.delay, -1, false);
        }
    }
    window.cloud = cloud;


    var boss2 = function (game, x, y) {
        this.game = game;
        this.site = {x: x, y: y};
        this.body = null;
        this.health = 2;
        this.isonGround = false;
        this.ishaveballoon = true;
        this.BalloonGroup = null;
        this.BalloonNum = 1;
        this.RopeGroup = null;
        this.runspeed = {x: 100, y: 100};
        this.downspeed = {x: 0, y: 90};
        this.quickdown = {x: 0, y: 300};
        this.grade = 3;
        this.init();
    }
    boss2.prototype = {
        init: function () {
            this.BalloonNum = parseInt(Math.random() * 2) + 1;
            this.body = this.game.add.sprite(this.site.x, this.site.y, 'boss2');
            this.body.scale.set(0.8);
            this.body.animations.add('run', [0, 4, 5, 6, 7, 8, 9, 10]);
            this.body.animations.add('jumpdown', [1]);
            this.body.animations.add('dead', [2, 3]);
            this.body.animations.play('run', 7, true);
            this.body.anchor.setTo(0.5, 1);
            this.game.physics.arcade.enable(this.body);
            this.body.body.velocity.setTo(this.downspeed.x, this.downspeed.y);
            this.RopeGroup = this.game.add.group();
            this.BalloonGroup = this.game.add.group();
        },
        balloonInit: function () {
            var obj = this;
            //if I set anchor to (0.,1) , the better I use ;
            var ball_rope = function (x, y, angle) {
                var rope = obj.game.add.sprite(x, y, 'building');
                rope.frameName = 'rope2.png';
                rope.width = 1;
                rope.height = 20;
                rope.anchor.setTo(0.5, 1);
                rope.angle = angle;
                obj.game.physics.arcade.enable(rope);
                rope.body.velocity.setTo(0, obj.body.body.velocity.y);
                obj.RopeGroup.add(rope);
                return rope;
            }
            var create_ballon = function (x, y, angle) {
                var balloon = obj.game.add.sprite(x, y, 'building');
                balloon.frameName = 'balloon-' + (parseInt(Math.random() * 3) + 1) + '.png';
                balloon.anchor.setTo(0.5, 1);
                balloon.scale.set(0.6);
                balloon.angle = angle;
                obj.game.physics.arcade.enable(balloon);
                balloon.body.velocity.setTo(0, obj.body.body.velocity.y);
                obj.BalloonGroup.add(balloon);
                return balloon;
            }

            if (this.BalloonNum == 1) {
                new create_ballon(this.body.x - 2, this.body.y - this.body.body.height - 5, 0);
                //create rope of balloon
                new ball_rope(this.body.x - 2, this.body.y - this.body.body.height + 13, 0);
            }
            if (this.BalloonNum == 2) {
                var balloon1 = new create_ballon(this.body.x - 2, this.body.y - this.body.body.height - 5, -parseInt(Math.random() * 10 + 10));
                var balloon2 = new create_ballon(this.body.x + 2, this.body.y - this.body.body.height - 5, parseInt(Math.random() * 10 + 10));
                //create rope of balloon
                new ball_rope(this.body.x - 2, this.body.y - this.body.body.height + 13, balloon1.angle);
                new ball_rope(this.body.x + 2, this.body.y - this.body.body.height + 13, balloon2.angle);
            }
        },
        boom : function(x,y){
            var boom = this.game.add.sprite(x,y,'boom1');
            boom.scale.set(1);
            boom.anchor.setTo(1, 1);
            boom.animations.add('boom',[0,1,2]);
            boom.animations.play('boom', 15, false,true);
        },
        dead : function(){
            var boom = this.game.add.sprite(this.body.position.x,this.body.position.y,'boom1');
            boom.scale.set(3);
            boom.anchor.setTo(0.5, 1);
            boom.animations.add('boom',[0,1,2,3,4]);
            boom.animations.play('boom', 15, false,true);
        }
    }
    window.boss2 = boss2;
})(window);