//Audio play
var sound = new Howl({
    src: ['./asset/audio/backmusic.mp3'],
    volume: 1.0,
    loop: true,
    onend: function () {
    }
    });
    sound.play();
var boxWidth = 600;
// Create the application helper and add its render target to the page
let app = new PIXI.Application({ width: 491 + boxWidth, height: 969, backgroundColor: 0Xb7ff7e, });
app.stage.sortableChildren = true;
document.body.appendChild(app.view);

// Static Variables
    var grassCount = 15;
    var reducedCount = 0, totalCount = 18;
    var gamePanelCount = 50;
    var panelTemplates = [];
    var boxInfo = {
        x       : app.screen.width - boxWidth + 100,
        y       : 100,
        xCount  : 7,
    }
    DoWork();

function DoWork(){
    var boardPanels = [];
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
        sprite.x            = sprite.width  + (Math.random() * 1000) % ((app.screen.width - boxWidth) - 2 * sprite.width);
        sprite.y            = sprite.height + (Math.random() * 1000) % (app.screen.height - 200);
        sprite.originHeight = sprite.height;
        sprite.anchor.set(0, 1);
        grassSprites.push(sprite);
        app.stage.addChild(sprite); 
    }
// Place Stashbar at bottom of screen
    // Create Sprite from Image(stashbar.png)
    var stashBarSprite      = PIXI.Sprite.from('./asset/stashbar.png');
    // Adjust stashbar scaling and geometry
    stashBarSprite.width    = app.screen.width - boxWidth;
    stashBarSprite.height   = 131;
    stashBarSprite.y = app.screen.height - stashBarSprite.height - 90;
    app.stage.addChild(stashBarSprite); 

//Draw Grid Lines
    let myGraph = new PIXI.Graphics();
    app.stage.addChild(myGraph);
    myGraph.position.set(0, 220);
    function drawGridLine(markingAxis = -1, gridCount = 0){
        // Draw the line (endPoint should be relative to myGraph's position)
        for(var i = 0 ; i < 8 ; i ++){
            myGraph.lineStyle(1.0, 0x777777).moveTo(0, i * 64).lineTo(app.screen.width - boxWidth, i * 64);
            myGraph.lineStyle(1.0, 0x777777).moveTo(i * 64, -50).lineTo(i* 64, app.screen.width - boxWidth);
        }
        if(markingAxis == -1) return;
        if(markingAxis == 0)    myGraph.lineStyle(1.0, 0xff7777).moveTo(0, gridCount * 64).lineTo(app.screen.width - boxWidth, gridCount * 64);
        if(markingAxis == 1)    myGraph.lineStyle(1.0, 0xff7777).moveTo(gridCount * 64, -50).lineTo(gridCount* 64, app.screen.width - boxWidth);
    }
    drawGridLine();
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
        panelTextures.push(baseTexture);
    }

// Simple Methods
    function isOnPlayGround(x, y){
        return x < app.screen.width - boxWidth && y < 220 + 7 * 64 && x > 0 && y > 150;
    }
    function isUnderPanel(panelUnder, panelAbove){
        return Math.abs(panelUnder.x - panelAbove.x) < panelUnder.width - 3 && Math.abs(panelUnder.y - panelAbove.y) < panelUnder.height - 7;
    }

// Dragging Events
    var onDragStart = (event) => {
        this.container = event.target;
        if(!this.container.clickable) return;
        this.dragging = true;
        this.data = event.data;
        // container.pivot.x = container.width  / 2;
        // container.pivot.y = container.height / 2;
    }
    // Important!
    var onDragEnd = (event) => {
        if(container.clickable    == false)     return;
        app.ticker.remove(fc);
        container.zIndex = 0;
        container.width = 64;
        container.height = 69;
        gridX = Math.round(this.container.x / 64) * 64 - 10;
        gridY = 210 + Math.round((this.container.y - 220) / 64) * 64;
        dx = Math.abs(container.x - gridX);
        dy = Math.abs(container.y - gridY);
        dx > dy ? this.container.y = gridY : this.container.x = gridX;
        this.dragging = false;
        this.dragEnd = true;
        if(isOnPlayGround(this.container.originalX, this.container.originalY)){
            var newContainer = this.container;
            newContainer.layer = 0;
            for(var i = 0 ; i < boardPanels.length ; i++){
                if(boardPanels[i] == newContainer) continue;
                if(boardPanels[i].aboveMe != undefined){
                    for(var j = 0 ; j < boardPanels[i].aboveMe.length ; j++){
                        if(boardPanels[i].aboveMe[j] == newContainer){
                            boardPanels[i].aboveMe.splice(j, 1);
                            j--;
                        }
                    }
                    if(boardPanels[i].aboveMe.length == 0){
                        boardPanels[i].clickable = true;
                        boardPanels[i].children[2].visible = false;
                    }
                }
                if(isUnderPanel(boardPanels[i], newContainer)){
                    boardPanels[i].clickable = false;
                    boardPanels[i].children[2].visible = true;
                    boardPanels[i].aboveMe == undefined ? boardPanels[i].aboveMe = [newContainer] 
                                                        : boardPanels[i].aboveMe.push(newContainer);
                    newContainer.layer = Math.max(newContainer.layer, boardPanels[i].layer + 1);
                }
            }
            return;
        }
        if(isOnPlayGround(this.container.x, this.container.y)){
            let newContainer = new PIXI.Container();
            newContainer = makeContainer(this.container.character, this.container.x, this.container.y);
            app.stage.addChild(newContainer);
            newContainer.layer = 0;
            for(var i = 0 ; i < boardPanels.length ; i++){
                if(isUnderPanel(boardPanels[i], newContainer)){
                    boardPanels[i].clickable = false;
                    boardPanels[i].children[2].visible = true;
                    boardPanels[i].aboveMe == undefined ? boardPanels[i].aboveMe = [newContainer] 
                                                        : boardPanels[i].aboveMe.push(newContainer);
                    newContainer.layer = Math.max(newContainer.layer, boardPanels[i].layer + 1);
                }
            }
            boardPanels.push(newContainer);
        }
        this.container.x = this.container.originalX;
        this.container.y = this.container.originalY;
    }
    var onPointerOut = (event) => {
        if(_container == undefined) return;
        if(_container.clickable == false)     return;
        app.ticker.remove(fc);
        _container.zIndex = 0;
        _container.width = 64;
        _container.height = 69;
    }
    var onDragMove = (event) => {
        if (this.dragging) {
            const newPosition = this.data.getLocalPosition(app.stage);
            container.x = newPosition.x;
            container.y = newPosition.y;
            // Marking Expected Grid line as Red  -- :( Cancelling because redrawing speed problem :(
            // if(this.container.x > app.screen.width - boxWidth - 20 || this.container.y < 200)    return;
            // gridCol = Math.round(this.container.x / 64);
            // gridRow = Math.round((this.container.y - 220) / 64);
            
            // gridX = Math.round(this.container.x / 64) * 64 - 10;
            // gridY = 210 + Math.round((this.container.y - 220) / 64) * 64;
            // dx = Math.abs(container.x - gridX);
            // dy = Math.abs(container.y - gridY);
            // dx > dy ? drawGridLine(0, gridRow)
            //         : drawGridLine(1, gridCol);
        }
    }
    var onMouseOver = (event) => {
        if(event.target.clickable  == false)     return;
        if(this.dragging) return;
        this._container = event.target;
        event.target.zIndex = 1;
        //Ticker Function - Size Growing
        var func = (delta) =>{
            if(event.target.width > 64 + 20){
                app.ticker.remove(func);
                return;
            }
            event.target.width  += 3;
            event.target.height += 3;
        };
        fc = func;
        // app.ticker.add(func);
    }

// Method to create a container (panel)
    function makeContainer(character, x, y){
        var spriteBack      =   PIXI.Sprite.from(panelBackTexture);                                                 //Background
        var spriteDisabled  =   PIXI.Sprite.from(panelDisabledTexture);                                             //Disabled Mask
        var spritePanel     =   PIXI.Sprite.from(panelTextures[character]);                                         //Panel Image
        // Use Container cause we use several images
        let container = new PIXI.Container();
        spritePanel.x = 10;
        spritePanel.y = 10;
        spritePanel.width = 78;
        spritePanel.height = 78;
        spriteDisabled.visible = false;
        container.addChild(spriteBack);
        container.addChild(spritePanel);
        container.addChild(spriteDisabled);
        //Setting container attributes
        container.clickable = true;
        container.originalX = container.x = x;
        container.originalY = container.y = y;
        container.width = 64;
        container.height = 69;
        container.character = character;
        // Add Event Handler
        container.interactive = true;
        container.buttonMode = true;
        container.on('pointerdown', onDragStart);
        container.on('pointerover', onMouseOver);
        container.on('pointermove', onDragMove);
        container.on('pointerout', onPointerOut);
        container.on('pointerup', onDragEnd);
        container.pivot.x = container.width  / 2;
        container.pivot.y = container.height / 2;
        return container;
    }

// Placing all panels to box
    for(var i = 0 ; i < gamePanelCount ; i++){
        this.container = makeContainer(i, boxInfo.x + (i % boxInfo.xCount) * 65, boxInfo.y + parseInt(i / boxInfo.xCount) * 70);
        panelTemplates.push(container);
        app.stage.addChild(container);
    }
// Add Button
    // Create Sprite from Image(stashbar.png)
    var buttonSprite      = PIXI.Sprite.from('./asset/download.png');
    // Adjust stashbar scaling and geometry
    buttonSprite.width = 200;  buttonSprite.height = 100 / 1.618033988;
    buttonSprite.y = app.screen.height - buttonSprite.height - 190;
    buttonSprite.x = app.screen.width - boxWidth + 300;
    buttonSprite.anchor.set(0.5);
    buttonSprite.interactive = true;
    buttonSprite.buttonMode = true;
    buttonSprite.on('pointerup', (event) => {
        this.container.width = 200;
        var gamePanelConfig = [];
        var maxLayer = 0;
        for(var i = 0 ; i < boardPanels.length ; i++)   maxLayer < boardPanels[i].layer ? maxLayer = boardPanels[i].layer : 0;
        for(var i = 0 ; i <= maxLayer ; i ++){
            gamePanelConfig.push([]);
            for(var j = 0 ; j < boardPanels.length ; j ++){
                if(boardPanels[j].layer == i){
                    gamePanelConfig[i].push({
                        x           : boardPanels[j].x,
                        y           : boardPanels[j].y,
                        character   : boardPanels[j].character,
                        aboveMe     : j,
                        clickable   : boardPanels[j].clickable,
                    });
                    boardPanels[j].index = gamePanelConfig[i].length - 1;
                }
            }
        }
        for(var i = 0 ; i <= maxLayer ; i ++){
            for(var j = 0 ; j < gamePanelConfig[i].length ; j ++){
                var k = gamePanelConfig[i][j].aboveMe;
                gamePanelConfig[i][j].aboveMe = [];
                if(boardPanels[k].aboveMe == undefined)
                continue;
                boardPanels[k].aboveMe.map((obj) => {
                    gamePanelConfig[i][j].aboveMe.push({
                        layer: obj.layer,
                        index: obj.index
                    });
                });
            }
        }
        var filename = prompt("Define your file name.");
        if (filename) {
            var gamePanelString = JSON.stringify({data: gamePanelConfig, count: boardPanels.length});
            var blob = new Blob([gamePanelString], {type: "text/plain;charset=utf-8"});
            saveAs(blob, filename + ".json");
        } else {
            alert("Save canceled!");
        }
    });
    buttonSprite.on('pointerdown', (event) => {this.container.width = 190});
    buttonSprite.on('pointerover', (event) => {this.container = event.target; this.container.width = 210});
    buttonSprite.on('pointerout', (event) => {this.container.width = 200});
    app.stage.addChild(buttonSprite); 

}