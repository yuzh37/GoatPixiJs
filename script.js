//Audio Play
var sound = new Howl({
    src: ['./asset/audio/backmusic.mp3'],
    volume: 1.0,
    loop: true,
    onend: function () {
    }
    });
    sound.play();
// Create the application helper and add its render target to the page
let app = new PIXI.Application({ width: 491, height: 969, backgroundColor: 0Xb7ff7e, });
app.stage.sortableChildren = true;
document.body.appendChild(app.view);

// Static Variables
    var grassCount = 15;
    var gamePanelState;
    var totalCount = 18;
    var gamePanelCount = 50;
    var level = 1;
    $.get("./level" + level + ".json", function(data, status){
        if (status == "success") {
            gamePanelState = data.data;
            totalCount = data.count;
            DoWork();
        }
    });
// Creating panels
    var panelBackTexture, panelDisabledTexture, panelTextures = [];
    var baseTexture = new PIXI.BaseTexture('./asset/panel_image.png');
    //Load panel Background Textures
    panelBackTexture        = new PIXI.Texture(baseTexture, new PIXI.Rectangle(5, 5, 92, 102));
    panelDisabledTexture    = new PIXI.Texture(baseTexture, new PIXI.Rectangle(5, 112, 92, 92));
    //Load panel Images
    for(var i = 1 ; i <= gamePanelCount ; i ++){
        var fName = ("000" + i).slice(-3);
        var baseTexture = new PIXI.BaseTexture('./asset/png/' + fName + '.png');
        // baseTexture.width = 78;
        // baseTexture.height = 78;
        panelTextures.push(baseTexture);
    }
function DoWork(){
//Initialize
    var reducedCount = 0;
    var isAnimating = false;
// Stashbar Statement
    var stashbarState = {
        stashbarList: [],
        nextPosX: 56,
        nextPosY: 790,
        count:0,
        maxCount: 7,
    };
// Star Animation
    let alienImages = ["./asset/star0.png", "./asset/star1.png", "./asset/star2.png", "./asset/star3.png", "./asset/star4.png", "./asset/star5.png", "./asset/star6.png", "./asset/star7.png", ];
    let textureArray = [];
    for (let i=0; i < 8; i++){
        let texture = PIXI.Texture.from(alienImages[i]);
        textureArray.push(texture);
    }
    let star1 = new PIXI.AnimatedSprite(textureArray);
    let star2 = new PIXI.AnimatedSprite(textureArray);
    let star3 = new PIXI.AnimatedSprite(textureArray);
    app.stage.addChild(star1);
    app.stage.addChild(star2);
    app.stage.addChild(star3);
    star1.loop = star2.loop = star3.loop = false;
    star1.animationSpeed = star2.animationSpeed = star3.animationSpeed = 0.3;
    star1.width = star1.height = 61;
    star2.width = star2.height = 61;
    star3.width = star3.height = 61;
    star1.anchor.set(0.5, 0.5);
    star2.anchor.set(0.5, 0.5);
    star3.anchor.set(0.5, 0.5);
// Create the sprite from grasees(back_grass.png)
    // Variables
    var grassTextures = [], grassSprites = [];
    // Big grasses
    for(var i = 0 ; i < 3 ; i ++){
        var baseTexture = new PIXI.BaseTexture('./asset/back_grass.png');
        var texture     = new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, Math.min(i * 56, 162), 74, Math.min(56, 162 - Math.min(i * 56, 162))));
        grassTextures.push(texture);
    }
    // Small grasses
    for(var i = 0 ; i < 3 ; i ++){
        var baseTexture = new PIXI.BaseTexture('./asset/back_grass.png');
        var texture     = new PIXI.Texture(baseTexture, new PIXI.Rectangle(74, Math.min(i * 46, 162), 44, 46));
        grassTextures.push(texture);
    }
    // Add Grasses to Stage
    for(var i = 0 ; i < grassCount ; i ++){
        var sprite      = PIXI.Sprite.from(grassTextures[i % 6]);
        sprite.width   /= 1.6;
        if(i % 2 == 1)      sprite.height /= 2;
        else                sprite.height /= 1.5;
        sprite.x            = sprite.width  + (Math.random() * 1000) % (app.screen.width - 2 * sprite.width);
        sprite.y            = sprite.height + (Math.random() * 1000) % (app.screen.height - 200);
        sprite.originHeight = sprite.height;
        sprite.anchor.set(0, 1);
        grassSprites.push(sprite);
        app.stage.addChild(sprite); 
    }
    // Grass Animation
    let elapsed = 0, actionSpeed = 1;
    app.ticker.add((delta) => {
        elapsed += delta;
        for(var i = 0 ; i < grassCount ; i ++){
            grassSprites[i].height = Math.min(Math.max(grassSprites[i].height += actionSpeed, sprite.originHeight), sprite.originHeight + 6);
        }
        if(elapsed >= 9 && actionSpeed > 0){
            actionSpeed = -3;
            elapsed = 0;
        }
        if(elapsed >= 3 && actionSpeed < 0){
            actionSpeed = 0;
            elapsed = 0;
        }
        if(elapsed >= 40 && actionSpeed == 0){
            actionSpeed = 1;
            elapsed = 0;
        }
    });

// Add Title Logo
    var titleLogo = PIXI.Sprite.from('./asset/gametitle.png');
    titleLogo.x = 100;
    titleLogo.height /= 1.1;
    app.stage.addChild(titleLogo);
//Function to move panel to stashbar
var goToStashBar = function(panel){
    // Moving Action to move panel to stashbar
    if(stashbarState.count == stashbarState.maxCount)
        return;
    // Check If there's a same card on stashbar
    var isPlugged = false;
    var targetPosX, targetPosY;
    for(var i = stashbarState.count - 1 ; i >= 0 ; i--){
        if(stashbarState.stashbarList[i].character == panel.character){
            if(     i == stashbarState.count - 1) break;
            targetPosX = stashbarState.stashbarList[i + 1].x;
            targetPosY = stashbarState.stashbarList[i + 1].y;
            stashbarState.stashbarList.splice(i + 1, 0, panel);
            for(var j = i + 2 ; j < stashbarState.count + 1 ; j ++){
                stashbarState.stashbarList[j].x += 61;
            }
            isPlugged = true;
            break;
        }
    }
    if(!isPlugged){
        targetPosX = stashbarState.nextPosX;
        targetPosY = stashbarState.nextPosY;
    }
    var dx      = (targetPosX - panel.x) / 10;
    var dy      = (targetPosY - panel.y) / 10;
    var dw      = (panel.width - 61) / 10;
    var dh      = (panel.height - 63) / 10;
    var count   = 0;
    var func    = (delta) => {
        isAnimating = true;
        if(++count == 10){
            app.ticker.remove(func);
            isAnimating = false;
        }
        panel.x += dx;
        panel.y += dy;
        panel.width -= dw;
        panel.height -= dh;
    }
    app.ticker.add(func);
    !isPlugged ? stashbarState.stashbarList.push(panel) : 0;
    stashbarState.count++;
    stashbarState.nextPosX = stashbarState.nextPosX + 61;
    panel.isOnStashBar = true;

    // Update gamePanelState
    for(var i = 0 ; i < gamePanelState.length ; i++){
        for(var j = 0 ; j < gamePanelState[i].length ; j++){
            if(gamePanelState[i][j].aboveMe.length == 0) continue;
            for(var k = 0 ; k < gamePanelState[i][j].aboveMe.length ; k ++){
                aboveInfo = gamePanelState[i][j].aboveMe[k];
                if(aboveInfo.layer == panel.stateLayer && aboveInfo.index == panel.stateIndex){
                    gamePanelState[i][j].aboveMe.splice(k, 1);
                }
            }
            if(gamePanelState[i][j].aboveMe.length == 0){
                gamePanelState[i][j].obj.clickable = true;
                gamePanelState[i][j].obj.children.splice(2, 1);
            }
        }
    }

    //Check 3 matching
    var matched = 0;
    stashList = stashbarState.stashbarList;
    for(var i = 0 ; i < stashbarState.count - 1 ; i++){
        stashList[i].character == stashList[i + 1].character ? ++matched : matched = 0;
        if(matched == 2){
            var GSCount = 0, MLCount = 0;
            var removed = stashList.splice(i-1, 3);
            stashbarState.count     -= 3;
            stashbarState.nextPosX  -= 61 * 3;
            var gettingSmaller  = (delta) => {
                isAnimating = true;
                for(var j = 0 ; j <= 2 ; j++){
                    removed[j].width  -= GSCount * 5;
                    removed[j].height -= GSCount * 5;
                }
                if(++GSCount == 5){
                    isAnimating = false;
                    app.ticker.remove(gettingSmaller);
                    removed[0].visible = false;
                    removed[1].visible = false;
                    removed[2].visible = false;
                    //Star shine
                    star1.x = removed[0].x;             star1.y = removed[0].y + 10;       star1.zIndex = 1;
                    star2.x = removed[1].x;             star2.y = removed[1].y + 10;       star2.zIndex = 1;
                    star3.x = removed[1].x + 61;        star3.y = removed[0].y + 10;       star3.zIndex = 1;
                    star1.gotoAndPlay(0);
                    star2.gotoAndPlay(0);
                    star3.gotoAndPlay(0);//Audio Play
                    var sound = new Howl({
                        src: ['./asset/audio/matched.wav'],
                        volume: 1.0,
                        onend: function () {
                        }
                      });
                      sound.play();
                    //Add monvingLeft animate
                    app.ticker.add(movingLeft);
                    GSCount = 0;
                    reducedCount += 3;
                }
            }
            var movingLeft      = (delta) => {
                isAnimating = true;
                for(var j = i - 1 ; j < stashbarState.count ; j++){
                    stashList[j].x -= 61 * 3 / 10;
                }
                if(++MLCount == 10){
                    isAnimating = false;
                    app.ticker.remove(movingLeft);
                    MLCount = 0;
                    if(reducedCount == totalCount){
                        alert("Congratulation, you won! Next level!");
                        $.get("./level" + ++level + ".json", function(data, status){
                            if (status == "success") {
                                gamePanelState = data.data;
                                totalCount = data.count;
                                DoWork();
                            }
                        });
                    }
                }
            }
            app.ticker.add(gettingSmaller);
            
            break;
        }
    }
    if(matched != 2 && i == stashbarState.count - 1 && stashbarState.count == stashbarState.maxCount)
    {
        alert("Sorry, Failed!");
    }

}

// Place Stashbar at bottom of screen
    // Create Sprite from Image(stashbar.png)
    var stashBarSprite      = PIXI.Sprite.from('./asset/stashbar.png');
    // Adjust stashbar scaling and geometry
    stashBarSprite.width    = app.screen.width - 24;
    stashBarSprite.height   = 131;
    stashBarSprite.x = 12;
    stashBarSprite.y = app.screen.height - stashBarSprite.height - 90;
    app.stage.addChild(stashBarSprite); 

//Function Sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Placing panels folling to gamePanelState variable
    // Variables(panel Sprites)
    var panels = [];
    for(var i = 0 ; i < gamePanelState.length ; i++){
        for(var j = 0 ; j < gamePanelState[i].length ; j++){
            // gamePanelState[i][j].character = parseInt(Math.random() * 1000) % 3;
            var state = gamePanelState[i][j];
            var spriteBack      =   PIXI.Sprite.from(panelBackTexture);                                         //Background
            var spriteDisabled  =   PIXI.Sprite.from(panelDisabledTexture);                                     //Disabled Mask
            var spritePanel     =   PIXI.Sprite.from(panelTextures[state.character % panelTextures.length]);    //Panel Image
            sleep(2000);
            // Use Container cause we use several images
            let container = new PIXI.Container();
            spritePanel.x = 10;
            spritePanel.y = 10;
            spritePanel.width = 78;
            spritePanel.height = 78;
            container.addChild(spriteBack);
            container.addChild(spritePanel);
            if(!state.clickable)    container.addChild(spriteDisabled);
            //Setting container attributes
            container.x = state.x;
            container.y = state.y;
            container.stateLayer = i;
            container.stateIndex = j;
            container.isOnStashBar = false;
            container.width = 64;
            container.height = 69;
            container.clickable = state.clickable;
            container.character = state.character;
            // Add Event Handler
            container.interactive = true;
            container.pivot.x = container.width  / 2;
            container.pivot.y = container.height / 2;
            var fc;
            container.on('pointerdown', (event) => {
                if(container.isOnStashBar == true)      return;
                if(container.clickable    == false)     return;
                container.zIndex = 1;
                //Ticker Function - Size Growing
                var func = (delta) =>{
                    if(container.width > 64 + 20){
                        app.ticker.remove(func);
                        return;
                    }
                    container.width  += 3;
                    container.height += 3;
                };
                fc = func;
                app.ticker.add(func);
            });
            container.on('pointerout', (event) => {
                if(container.isOnStashBar)  return;
                app.ticker.remove(fc);
                container.zIndex = 0;
                container.width = 64;
                container.height = 69;
            });
            container.on('pointerup', (event) => {
                if(container.isOnStashBar == true)      return;
                if(container.clickable    == false)     return;
                if(isAnimating)                         return;
                app.ticker.remove(fc);
                container.zIndex = 0;
                goToStashBar(container);
            });
            // Add it to stage
            panels.push(container);
            app.stage.addChild(container);
            gamePanelState[i][j].obj = container;
        }
    }
}