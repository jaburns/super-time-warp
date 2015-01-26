var MiniMap = (function() {
    var TileMap = {
        1: 'solid',
        2: 'solid',
        3: 'solid',
        4: 'no_collision',
        5: 'no_collision',
        6: 'no_collision',
        7: 'one_way',
        8: 'no_collision',
        9: 'solid',
        10: 'solid',
        11: 'solid',
        12: 'no_collision',
        13: 'no_collision',
        14: 'no_collision',
        15: 'one_way',
        16: 'one_way',

        17: 'solid',
        18: 'solid',
        19: 'solid',
        20: 'no_collision',
        21: 'no_collision',
        22: 'one_way',
        23: 'one_way',
        24: 'one_way',
        25: 'solid',
        26: 'solid',
        27: 'solid',
        28: 'no_collision',
        29: 'no_collision',
        30: 'no_collision',
        31: 'no_collision',
        32: 'one_way',

        33: 'no_collision',
        34: 'no_collision',
        35: 'no_collision',
        36: 'no_collision',
        37: 'no_collision',
        38: 'one_way',
        39: 'no_collision',
        40: 'no_collision',
        41: 'no_collision',
        42: 'no_collision',
        43: 'no_collision',
        44: 'no_collision',
        45: 'no_collision',
        46: 'one_way',
        47: 'solid',
        48: 'solid',

        49: 'no_collision',
        50: 'fatal',
        51: 'fatal',
        57: 'no_collision',
        58: 'fatal',
        59: 'fatal',

        65: 'solid',
        66: 'solid',
        67: 'solid',
        68: 'one_way',
        69: 'one_way',
        70: 'no_collision',
        71: 'no_collision',
        72: 'no_collision',
        73: 'solid',

        81: 'solid',
        82: 'solid',
        83: 'solid',
        84: 'no_collision',
        85: 'no_collision',
        86: 'no_collision',
        87: 'no_collision',
        88: 'no_collision',

        97: 'no_collision',
        98: 'no_collision',
        99: 'no_collision',
        100: 'no_collision',
        101: 'no_collision',
        102: 'one_way',
        103: 'solid',
        104: 'solid',

        113: 'solid',
        114: 'fatal',
        115: 'fatal'
    };
    
    function getTileColor(tile) {
        var tileType = TileMap[tile];
        switch(tileType) {
            case 'solid': return '#3f3d76';
            case 'one_way': return '#3f3d76';
            case 'no_collision': return '#45273c';
            case 'fatal': return '#905638';
        }

        return 'transparent';
    }

    function getPlayerColor(color) {
        switch(color) {
            case 'red': return '#ae312e';
            case 'orange': return '#e17113';
            case 'yellow': return '#fcf403';
            case 'green': return '#67c01f';
            case 'cyan': return '#59cde6';
            case 'blue': return '#6098ff';
            case 'purple': return '#aa3fac';
            case 'pink': return '#d979bb';
        }
    }

    function MiniMap(w, h, canvas) {
        this.w = w;
        this.h = h;

        this.x = 50;
        this.y = 50;

        this.scale = 3;

        this.canvas = canvas;
        this.canvas.width = this.w*this.scale;
        this.canvas.height = this.h*this.scale;
        this.canvas.style.width = this.canvas.width + 'px';
        this.context = this.canvas.getContext('2d');
        this.image = document.createElement('canvas');

        this.focus = null;
        this.focusPos = { x: 0, y: 0 };
        this.flashTimer = 0;
        this.flash = false;
    }

    MiniMap.prototype = {
        generateMap: function (tiles) {

            // Generate the map data
            var miniMap = [];
            var row = [];
            var tile = null;
            var solid = 0;

            for (var y = 0; y < tiles.length; y++) {
                row = [];
                for (var x = 0; x < tiles[y].length; x++) {
                    row.push(tiles[y][x]);
                }

                miniMap.push(row);
            }

            // Create the image
            var data = document.createElement('canvas');
            data.mozImageSmoothingEnabled = false;
            data.webkitImageSmoothingEnabled = false;
            data.msImageSmoothingEnabled = false;
            data.imageSmoothingEnabled = false;

            data.width = miniMap[0].length;
            data.height = miniMap.length;
            var context = data.getContext('2d');

            // Draw each pixel
            for (var y = 0; y < miniMap.length; y++) {
                for (var x = 0; x < miniMap[y].length; x++) {
                    this.drawPixel(context, x, y, getTileColor(miniMap[y][x]));
                }
            }

            var imgData = context.getImageData(0,0,context.canvas.width,context.canvas.height).data;
            var scaledCvs = document.createElement('canvas');
            var scaledCtx = scaledCvs.getContext('2d');
            // Scale up the image
            var scale = 3;
            for (var x=0;x < context.canvas.width;++x){
                for (var y=0;y<context.canvas.height;++y){
                    // Find the starting index in the one-dimensional image data
                    var i = (y*context.canvas.width + x)*4;
                    var r = imgData[i  ];
                    var g = imgData[i+1];
                    var b = imgData[i+2];
                    var a = imgData[i+3];
                    scaledCtx.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
                    scaledCtx.fillRect(x*this.scale,y*this.scale,this.scale,this.scale);
                }
            }

            this.image = scaledCtx.canvas;
            //this.image = context.canvas;

        },


        drawPixel: function (context, x, y, color) {
            context.save();

            context.fillStyle = color;
            context.fillRect(x, y, 1, 1);

            context.restore();
        },

        update: function () {

            // What to look at
            this.focus = { x: 0, y: 0, w: 2, h: 2 };
            if (this.focus) {
                this.focusPos.x = this.focus.x + this.focus.w * 0.5;
                this.focusPos.y = this.focus.y + this.focus.h * 0.5;
            }
        },

        draw: function (state, playerId) {
            var context = this.context;
            var x, y, fx, fy, entity, color;

            this.canvas.width = this.w*this.scale;
            this.canvas.height = this.h*this.scale;

            var focus = {};
            for(var i = 0; i < state.objects.length; i++) {
                if(state.objects[i] && state.objects[i].id == playerId) {
                    focus = state.objects[i];
                    break;
                }
            }

            this.focusPos = { x: focus.x, y: focus.y };

            x = (this.focusPos && this.focusPos.x) || 0;
            y = (this.focusPos && this.focusPos.y) || 0;
            x = x / 16;
            y = y / 16;
            x = x << 0;
            y = y << 0;

            context.save();
            context.drawImage(this.image, 0, 0);

            // blinking
            if(this.flashTimer > 40) {
                this.flashTimer = 0;
                this.flash = !this.flash;
            }
            this.flashTimer++;

            // draw game objects
            var object, color, isInvulnerable;
            for (var i = 0; i < state.objects.length; i++) {
                object = state.objects[i];
                if(object && object.alive === true && object.type === 'player') {
                    isInvulnerable = object.invulnerableCountdown > 0;

                    x = object.x / 16;
                    y = object.y / 16;
                    x = x << 0;
                    y = y << 0;

                    object = state.objects[i];
                    color = isInvulnerable ? '#595652' : getPlayerColor(object.color);
                    context.fillStyle = this.flash && object.id === playerId ? '#cadafd' : color;
                    context.fillRect(x*this.scale, (y-1)*this.scale, this.scale, this.scale);
                }
            }

            context.restore();
        }
    };
    
    return MiniMap;

})();