
var ENABLE_SMOOTH = false;

function lerpXY(a, b, t) {
    b = _.cloneDeep(b);
    for (var k in b) {
        if (typeof a[k] !== 'undefined' && a[k] !== null) {
            if(typeof b[k] === 'object') {
                b[k] = lerpXY(a[k], b[k], t);
            } else if(k === 'x' || k === 'y') {
                b[k] = a[k] + t*(b[k] - a[k]);
            }
        }
    }
    return b;
}

var _state0 = null;
var _state1 = null;
var _stateArriveTime = null;
var _rendar = function(){};

function _animFrameFunc () {
    if (_state0 && _state1) {
        var t = (window.performance.now() - _stateArriveTime) / 35;
        _rendar(lerpXY(_state0, _state1, t));
    }
    window.requestAnimationFrame(_animFrameFunc);
}



function runClient() {
    var socket;

    var scores = {};
    var scores_list = document.getElementById('scores-list');

    // Drawing ####################################################################

    var SCALE_FACTOR = 3;
    var VIEWPORT = { w: 1000, h: 600 };

    var SCALE = new PIXI.Point(SCALE_FACTOR, SCALE_FACTOR);
    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x66FF99);

    var __root_container = new PIXI.DisplayObjectContainer();
    stage.addChild(__root_container);

    var __bg_container = new PIXI.DisplayObjectContainer();
    __root_container.addChild(__bg_container);

    var root_container = new PIXI.DisplayObjectContainer();
    root_container.scale = SCALE;
    __root_container.addChild(root_container);

    var tile_container = null, bg_container = null;

    var object_container = new PIXI.DisplayObjectContainer();
    root_container.addChild(object_container);

    var crosshairs = new PIXI.Sprite(PIXI.Texture.fromImage('assets/crosshairs.png'));
    crosshairs.anchor.x = 0.5;
    crosshairs.anchor.y = 0.5;
    root_container.addChild(crosshairs);

    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(VIEWPORT.w, VIEWPORT.h);

    // add the renderer view element to the DOM
    document.getElementById('canvas-container').appendChild(renderer.view);

    var textures = {};
    var sprites = {};
    var playerUI = {}; // object to hold local UI data TODO is this used?
    var miniMapEl = document.getElementById('minimap');
    var miniMap = new MiniMap(50, 45, miniMapEl);
    var sm = null;

    // This array holds filepaths to all json files with sprite information
    var assetsToLoad = [
        'assets/particles.json',
        'assets/projectiles.json',
        'assets/tiles.json',
        'assets/ui.json',
        'assets/player.json'
    ];

    loader = new PIXI.AssetLoader(assetsToLoad);

    // The load is asynchronous, so wait for the go-ahead before starting
    loader.onComplete = ready.bind(this);
    loader.load();

    // Make sure the world is ready before opening the socket.
    function ready() {
        // Textures are loaded, so store them for later. This should become a larger set of maps
        textures = {
            player: 'tile_49',
            axe: 'axe',
            lazer: 'lazer'
        };

        // Perform socket setup to start the game
        initSocket();

        sm = soundManager.getInstance();
        if (window.location.hash !== '#no-music') {
            sm.playLoop('loop-main');
        }
    }

    // Jungle background stuff --------------------
    var curBackgroundFrame = 0;
    var backgroundUpdateInterval = -1;
    var backgroundFrames = (function () {
        var ret = [
            [],
            [],
            []
        ];
        var eraNames = ["Jungle", "Tundra", "City"];
        for (var j = 0; j < 3; ++j) {
            for (var i = 0; i < 8; ++i) {
                var x = new PIXI.Sprite(PIXI.Texture.fromImage('assets/' + eraNames[j] + '_000' + i + '.png'));
                x.scale = SCALE;
                ret[j].push(x);
            }
        }
        return ret;
    })();

    function updateBackground(era) {
        __bg_container.removeChildAt(0);
        curBackgroundFrame++;
        curBackgroundFrame %= 8;
        bg_container = backgroundFrames[era][curBackgroundFrame];
        __bg_container.addChildAt(bg_container, 0);
    }

    // --------------------------------------------

    // Creates the tile_container and adds it to the root_container.  Cleans up old one if it exists.
    function initMap(era, map) {
        if (tile_container) {
            root_container.removeChild(tile_container);
            __bg_container.removeChild(bg_container);
        }

        tile_container = new PIXI.DisplayObjectContainer();
        root_container.addChildAt(tile_container, 0);

        bg_container = backgroundFrames[era][curBackgroundFrame];
        __bg_container.addChildAt(bg_container, 0);

        clearInterval(backgroundUpdateInterval);
        backgroundUpdateInterval = setInterval(updateBackground.bind(null, era), 40);

        var tiles = map.tiles;
        for (var i = 0; i < tiles.length; i++) {
            for (var j = 0; j < tiles[i].length; j++) {
                if (!tiles[i][j]) continue;

                // create a new Sprite using the texture
                var tile = new PIXI.Sprite.fromFrame('tile_' + tiles[i][j]);

                // move the sprite into position
                tile.position.x = j * 16;
                tile.position.y = i * 16;

                tile_container.addChild(tile);
            }
        }

        miniMap.generateMap(map.tiles);
    }

    var isTimeWarp = false;
    var time_warp_sprites = [
        new PIXI.Sprite(new PIXI.Texture.fromImage('/assets/titles/header_time_warp.png')),
        new PIXI.Sprite(new PIXI.Texture.fromImage('/assets/titles/time_warp_1.png')),
        new PIXI.Sprite(new PIXI.Texture.fromImage('/assets/titles/time_warp_2.png')),
        new PIXI.Sprite(new PIXI.Texture.fromImage('/assets/titles/time_warp_3.png')),
        new PIXI.Sprite(new PIXI.Texture.fromImage('/assets/titles/time_warp_4.png')),
        new PIXI.Sprite(new PIXI.Texture.fromImage('/assets/titles/time_warp_5.png'))
    ];

    for (var i = 0; i < time_warp_sprites.length; i++) {
        var sprite = time_warp_sprites[i];
        sprite.anchor.x = sprite.anchor.y = 0.5;
        if (i == 0) {
            sprite.scale = SCALE;
            sprite.position.x = VIEWPORT.w / 2;
            sprite.position.y = VIEWPORT.h / 2;
        } else {
            sprite.position.x = VIEWPORT.w / 2;
            sprite.position.y = 64;
        }
    }

    var wrecked_sprite = new PIXI.Sprite(new PIXI.Texture.fromImage('/assets/titles/header_wrecked.png'));
    wrecked_sprite.anchor.x = wrecked_sprite.anchor.y = 0.5;
    wrecked_sprite.scale = SCALE;
    wrecked_sprite.position.x = VIEWPORT.w / 2;
    wrecked_sprite.position.y = VIEWPORT.h / 2;

    var rootColorMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    var bgColorMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    var rootFilter = new PIXI.ColorMatrixFilter();
    var bgFilter = new PIXI.ColorMatrixFilter();
    var count = 0;

    var plusOnes = [];
    var puffs = [];

    function renderState(state) {
        var liveIds = [];

        if (spectating) {
            var step = 20;
            var x = root_container.position.x;
            var y = root_container.position.y;
            //up
            if (_keys[87] || _keys[38]) {
                y += step;
            }
            //left
            if (_keys[65] || _keys[37]) {
                x += step;
            }
            //down
            if (_keys[83] || _keys[40]) {
                y -= step;
            }
            //right
            if (_keys[68] || _keys[39]) {
                x -= step;
            }

            var mapWidth = state.maps[state.era].tiles[0].length;
            var mapHeight = state.maps[state.era].tiles.length;
            var minx = -SCALE_FACTOR * mapWidth * gj_CONSTANTS.TILE_SIZE + VIEWPORT.w;
            var miny = -SCALE_FACTOR * mapHeight * gj_CONSTANTS.TILE_SIZE + VIEWPORT.h;

            root_container.position.x = Math.max(minx, Math.min(x, 0));
            root_container.position.y = Math.max(miny, Math.min(y, 0));
        }

        for (var i = 0; i < state.objects.length; i++) {
            var object = state.objects[i];

            // TODO: figure out why objects are null
            if (!object) continue;

            liveIds.push(object.id);

            if (object.type == 'particle_emitter') {
                updateParticleEmitter(object);
                continue;
            }

            var sprite = sprites[object.id];
            if (!sprite) {

                var child_sprite;
                if (object.type == 'player') {
                    child_sprite = new AnimatedSprite(playerAnimations, gj_CONSTANTS.eras.JUNGLE);
                } else {
                    child_sprite = new PIXI.Sprite.fromFrame(textures[object.type]);

                    switch (object.type) {
                        case 'lazer':
                            sm.playSound('sound-shoot');
                            break;
                        case 'axe':
                            sm.playSound('sound-throw');
                            break;
                    }
                }


                // center the sprites anchor point
                child_sprite.anchor.x = 0.5;
                child_sprite.anchor.y = 0.5;

                sprite = new PIXI.DisplayObjectContainer();
                sprite.addChild(child_sprite);
                child_sprite.y = -child_sprite.height / 2;

                if (object.type == 'player') {

                    var texture = (object.id === socket.id ? 'arrow_big_' : 'arrow_') + object.color;
                    var pointer_sprite = new PIXI.Sprite.fromFrame(texture);

                    pointer_sprite.anchor.x = 0.5;
                    pointer_sprite.anchor.y = 0.5;

                    pointer_sprite.offset = Math.random() * 10;
                    sprite.addChild(pointer_sprite);
                }

                sprites[object.id] = sprite;
                object_container.addChild(sprite);

            }

            sprite.position.y = object.y;
            sprite.position.x = object.x;
            sprite.getChildAt(0).rotation = object.angle;

            if (object.type == 'player') {

                if (object.spawnCountdown > 0) {
                    sprite.visible = false;
                } else if (object.invulnerableCountdown > 0) {
                    sprite.visible = !sprite.visible;
                } else {
                    sprite.visible = true;
                }

                --object.puffDelay;
                if (Math.abs(object.vx) > 2 && object.vy == 0) { // Math.abs(object.vy) < 1e-9) {
                    if (!(--object.puffDelay > 0)) {
                        object.puffDelay = (Math.random() + 10);
                        var puffCount = Math.ceil(Math.random() * 3);
                        var d = -(object.vx / Math.abs(object.vx));
                        for (var j = 0; j < puffCount; j++) {
                            var b = Math.round(Math.random());
                            var puff_sprite = new PIXI.Sprite.fromFrame(b ? 'smoke_large' : 'smoke_small');
                            puff_sprite.anchor.x = puff_sprite.anchor.y = 0.5;
                            puff_sprite.position.x = object.x;
                            puff_sprite.position.y = object.y;
                            root_container.addChild(puff_sprite);
                            puffs.push({
                                lifetime: 10,
                                sprite: puff_sprite,
                                vx: Math.random() * 3 * d
                            });
                        }
                    }
                }

                sprite.getChildAt(0).switchState(state.era);
                updateAnimation(object, sprite.getChildAt(0));

                var pointer = sprite.getChildAt(1);
                pointer.position.y = (-sprite.getChildAt(0).height * 1.3) + Math.sin(new Date().getTime() / 200 + pointer.offset);

                var ratio = object.kills - object.deaths;
                ratio = ratio > 0 ? '+' + ratio : ratio;
                var score = object.kills + ' / ' + object.deaths + ' ('+ratio+')';
                sprite.getChildAt(0).animate(); // TODO: CHINGALING

                var li = scores[object.id];
                if (!li) {
                    li = document.createElement('li');
                    li.className = object.color;
                    if (object.id == socket.id) li.className += ' player';
                    scores[object.id] = li;
                }

                if (score != li.score) {
                    li.innerHTML = '<span class="swatch"></span><span>' + score + '</span>';
                    li.score = score;
                    li.kills = object.kills;
                    li.deaths = object.deaths;
                }

                // Play player sounds
                if (object.id == socket.id) {
                    if (object.justDied) {
                        sm.playSound('sound-die');
                        setTimeout(function() {
                            sm.playSound('sound-rekt');
                        }, 100);
                    }
                    if (object.justKilled) sm.playSound('sound-die');
                    if (object.startedPound) sm.playSound('sound-dash');
                    if (object.jumped) sm.playSound('sound-jump');
                    if (state.era == 2) {
                        // TODO: jetpack
                    }
                    if (object.endedPound) sm.playSound('sound-slam');
                    if (object.justKilled) sm.playSound('sound-kill-point');
                }
                else {
                    if (object.justDied) sm.playSound('sound-hit');
                }
            }

            // Center the camera around this client's player object.
            if (object.id === socket.id) {

                if (object.dead) {
                    if (!wrecked_sprite.parent) stage.addChild(wrecked_sprite);
                } else {
                    if (wrecked_sprite.parent) wrecked_sprite.parent.removeChild(wrecked_sprite);
                }

                if (object.justKilled) {
                    var _sprite = new PIXI.Sprite.fromFrame('plus_one');
                    _sprite.anchor.x = _sprite.anchor.y = 0.5;
                    _sprite.position.x = object.x;
                    _sprite.position.y = object.y - sprite.getChildAt(0).height - 5;
                    root_container.addChild(_sprite);
                    plusOnes.push({
                        lifetime: 10,
                        sprite: _sprite
                    });
                }

                for (var j = plusOnes.length - 1; j >= 0; j--) {
                    var plusOne = plusOnes[j];
                    if (--plusOne.lifetime <= 0) {
                        plusOne.sprite.parent.removeChild(plusOne.sprite);
                        plusOnes.splice(j, 1);
                    } else {
                        plusOne.sprite.position.y -= 1;
                    }
                }

                centerCamera(object, state.maps[state.era].tiles[0].length, state.maps[state.era].tiles.length);
            }

            // Render and update the mini map
            miniMap.update();
            miniMap.draw(state, socket.id);
        }

        // Remove all the sprites which are tied to object IDs which are now missing.
        for (var k in sprites) {
            if (liveIds.indexOf(k) < 0) {
                object_container.removeChild(sprites[k]);
                delete sprites[k];
            }
        }

        // update particle emitters
        for (var i in particle_emitters) {
            var emitter = particle_emitters[i];
            var s = emitter.settings;
            if (--emitter.lifetime > 0) {

                for (var j = 0; j < emitter.particles.length; j++) {
                    var particle = emitter.particles[j];
                    particle.sprite.alpha -= s.alphaDecay;
                    particle.sprite.position.x += particle.vx;
                    particle.sprite.position.y += particle.vy;
                    particle.vy += s.gravity;
                }

            } else {

                for (var j = 0; i < emitter.particles.length; j++) {
                    var particle = emitter.particles[j];
                    particle.sprite.parent.removeChild(particle.sprite);
                }

                delete particle_emitters[emitter.id];

            }
        }

        // handle smoke puffs
        for (var i = 0; i < puffs.length; i++) {
            var puff = puffs[i];
            if (--puff.lifetime <= 0) {
                puff.sprite.parent.removeChild(puff.sprite);
                puffs.splice(i, 1);
            } else {
                puff.sprite.alpha -= 0.1;
                puff.sprite.position.x += puff.vx;
                puff.sprite.position.y -= 1;
            }
        }

        // Remove scores of players that have left
        for (var k in scores) {
            if (liveIds.indexOf(k) < 0) {
                scores_list.removeChild(scores[k]);
                delete scores[k];
            }
        }

        // sort the scores
        var _scores = [];
        var keys = Object.keys(scores);
        for (var i = 0; i < keys.length; i++) {
            _scores.push(scores[keys[i]]);
        }

        _scores.sort(function(a, b) {
            var d = (b.kills - b.deaths) - (a.kills - a.deaths);
            if (d == 0) d = b.kills - a.kills;
            return d;
        });

        for (var i = 0; i < _scores.length; i++) {
            scores_list.appendChild(_scores[i]);
        }

        // check if we're about to TIME WARP!!1!
        if (state.timeToTimeWarp < 3) {
            isTimeWarp = true;
            var seconds = Math.ceil(state.timeToTimeWarp);
            var sprite = time_warp_sprites[seconds];

            var prev_sprite = time_warp_sprites[seconds + 1] || {};
            if (prev_sprite.parent) prev_sprite.parent.removeChild(prev_sprite);

            if (!sprite.parent) {
                sm.playSound('sound-ping-deep');
                __root_container.addChild(sprite);
            }

            var scale = (SCALE_FACTOR * 2) - ((seconds - state.timeToTimeWarp) * 5);

            sprite.scale = { x: scale, y: scale };

        } else if (isTimeWarp) {

            isTimeWarp = false;

            var sprite = time_warp_sprites[1];
            sprite.parent.removeChild(sprite);
            sprite = time_warp_sprites[0];

            sm.playSound('sound-warp');

            __root_container.addChild(sprite);
            root_container.filters = [rootFilter];
            __bg_container.filters = [bgFilter];
            setTimeout(function () {
                sprite.parent.removeChild(sprite);
                root_container.filters = null;
                __bg_container.filters = null;
            }, 1000)

        }

        count++;
        updateColorMatrix(rootColorMatrix, count);
        rootFilter.matrix = rootColorMatrix;
        updateColorMatrix(bgColorMatrix, count + 5);
        bgFilter.matrix = bgColorMatrix;

        // render the stage
        renderer.render(stage);
    }

    function updateColorMatrix(matrix, count) {
        matrix[1] = Math.sin(count) * 3;
        matrix[2] = Math.cos(count);
        matrix[3] = Math.cos(count) * 1.5;
        matrix[4] = Math.sin(count / 3) * 2;
        matrix[5] = Math.sin(count / 2);
        matrix[6] = Math.sin(count / 4);
    }

    var mousePos = { x: 0, y: 0 };
    var worldPos = { x: 0, y: 0 };

    function centerCamera(point, mapWidth, mapHeight) {
        var cx = -point.x * SCALE_FACTOR + VIEWPORT.w / 2;
        var cy = -point.y * SCALE_FACTOR + VIEWPORT.h / 2;

        root_container.x += (cx - root_container.x) / 3;
        root_container.y += (cy - root_container.y) / 3;

        // Stop the camera at the boundaries
        if (root_container.x > 0) root_container.x = 0;
        if (root_container.y > 0) root_container.y = 0;
        var minx = -SCALE_FACTOR * mapWidth * gj_CONSTANTS.TILE_SIZE + VIEWPORT.w;
        var miny = -SCALE_FACTOR * mapHeight * gj_CONSTANTS.TILE_SIZE + VIEWPORT.h;
        if (root_container.x < minx) root_container.x = minx;
        if (root_container.y < miny) root_container.y = miny;

        var pos = screenPosToWorldCoordinates(mousePos);
        if (pos.x != worldPos.x || pos.y != worldPos.y) {
            worldPos = pos;
            onMouseMove(worldPos);
        }
    }

    function screenPosToWorldCoordinates(pos) {

        var x = (pos.x - root_container.x) / SCALE_FACTOR;
        var y = (pos.y - root_container.y) / SCALE_FACTOR;

        return { x: x, y: y };

    }

    function onMouseMove(pos) {
        crosshairs.x = pos.x;
        crosshairs.y = pos.y;
        if (!spectating) {
            socket.emit('msg input', { type: 'mousemove', x: pos.x, y: pos.y });
        }
    }

    function updateAnimation(object, sprite) {
        if (object.facex) {
            sprite.scale.x = object.facex > 0 ? -1 : 1;
        }

        if(object.droppingKick)
        {
            sprite.switchAnimation('stomp');
            return;
        }

        if(object.vy == 0) {
            if(Math.abs(object.vx) > 0.01) {
                sprite.switchAnimation('walk');
            }
            else {
                sprite.clearAnimation();
            }

            return;
        }

        if(object.jumping)
        {
            sprite.switchAnimation('jump');
        }
        else
        {
            sprite.switchAnimation('fall');
        }
    }

    var particle_emitters = {};
    var particle_container = new PIXI.DisplayObjectContainer();
    root_container.addChild(particle_container);
    function updateParticleEmitter(object) {

        var s = object.particleSettings;
        var emitter = particle_emitters[object.id];
        if (!emitter) {
            emitter = {
                id: object.id,
                lifetime: object.lifetime,
                settings: s,
                particles: []
            };

            var count = s.minCount + (s.maxCount - s.minCount) * Math.random();
            for (var i = 0; i < count; i++) {
                var v = s.minV + (Math.round(Math.random()) * 2 - 1) * (Math.random() * (s.maxV - s.minV));
                var a = s.minAngle + (Math.random() * (s.maxAngle - s.minAngle));
                var tIndex = Math.floor(Math.random() * s.textures.length);
                var particle = {
                    sprite: new PIXI.Sprite.fromFrame(s.textures[tIndex]),
                    vx: v * Math.cos(a) + s.initialVx,
                    vy: v * Math.sin(a) + s.initialVy
                };

                particle.sprite.anchor.x = 0.5;
                particle.sprite.anchor.y = 0.5;

                particle.sprite.position.x = object.x;
                particle.sprite.position.y = object.y;

                var scale = s.minScale + (Math.random() * (s.maxScale - s.minScale));
                particle.sprite.scale.x = scale;
                particle.sprite.scale.y = scale;

                particle_container.addChild(particle.sprite);
                emitter.particles.push(particle);
            }
            particle_emitters[object.id] = emitter;
        }

    }

    // Networking #################################################################


    var _keys = {};
    var spectating = false;

    function initSocket() {
        var latestState;
        socket = io(IO_URL);

        // Receiving state messages from the server -------------------

        socket.on('msg state', function (state) {
            latestState = state;

            var mapWidth = state.maps[state.era].tiles[0].length * SCALE_FACTOR * gj_CONSTANTS.TILE_SIZE;
            var mapHeight = state.maps[state.era].tiles.length * SCALE_FACTOR * gj_CONSTANTS.TILE_SIZE;
            centerCamera({ x: mapWidth / 2, y: mapHeight / 2}, state.maps[state.era].tiles[0].length, state.maps[state.era].tiles.length);

            initMap(latestState.era, latestState.maps[latestState.era]);
            renderState(latestState);

            if (ENABLE_SMOOTH) {
                window.requestAnimationFrame(_animFrameFunc);
            }
        });

        socket.on('msg diff', function (diff) {
            var newState = gj_JSON.applyDiff(latestState, diff);
            if (newState.era !== latestState.era) {
                initMap(newState.era, newState.maps[newState.era]);
            }
            latestState = newState;
            if (ENABLE_SMOOTH) {
                _rendar = renderState;
                _state0 = _state1;
                _state1 = latestState;
                _stateArriveTime = window.performance.now();
            } else {
                renderState(latestState);
            }
        });

        socket.on('msg full', function () {
            spectating = true;
            var spectating_sprite = new PIXI.Sprite(new PIXI.Texture.fromImage('/assets/titles/spectating.png'));
            spectating_sprite.anchor.x = spectating_sprite.anchor.y = 0.5;
            spectating_sprite.scale = SCALE;
            spectating_sprite.position.x = VIEWPORT.w / 2;
            spectating_sprite.position.y = VIEWPORT.h - 64;
            stage.addChild(spectating_sprite);
        });

        // Handling inputs and sending them to the server -------------

        var keys = [];
        for (var key in gj_CONSTANTS.keys) {
            keys.push(gj_CONSTANTS.keys[key]);
        }

        window.onkeyup = function (e) {
            if (spectating) {
                delete _keys[e.keyCode];
            } else if (keys.indexOf(e.keyCode) > -1) {
                socket.emit('msg input', { type: 'keyup', key: e.keyCode });
            }
        };

        window.onkeydown = function (e) {
            if (spectating) {
                _keys[e.keyCode] = true;
            } else if (keys.indexOf(e.keyCode) > -1) {
                socket.emit('msg input', { type: 'keydown', key: e.keyCode });
            }
        };

        renderer.view.onmousemove = function (e) {
            mousePos = { x: e.layerX, y: e.layerY };
            worldPos = screenPosToWorldCoordinates(mousePos);
            onMouseMove(worldPos);
        };

        renderer.view.onmousedown = function (e) {
            if (!spectating) {
                socket.emit('msg input', { type: 'mousedown' });
            }
        };

        renderer.view.onmouseup = function (e) {
            if (!spectating) {
                socket.emit('msg input', { type: 'mouseup' });
            }
        };

    }
}

var gameRunning = false;
function skipVideo() {
    if(!gameRunning) {
        gameRunning = true;
        var videoEl = document.getElementById('intro-cutscene');
        videoEl.pause();
        videoEl.parentNode.removeChild(videoEl);
        runClient();
        document.getElementById('scores-container').classList.add('in');
    }
}

window.onload = function() {
    var videoEl = document.getElementById('intro-cutscene');
    var timer;

    if(window.location.hash != '#no-video') {
        videoEl.addEventListener('ended', function() {
            if(!gameRunning) runClient();
            videoEl.classList.add('out');
            timer = setTimeout(function() {
                videoEl.parentNode.removeChild(videoEl);
            }, 301);
            document.getElementById('scores-container').classList.add('in');
        });
        videoEl.play();
    }
    else {
        skipVideo();
    }

    videoEl.addEventListener('click', function() {
        clearTimeout(timer);
        skipVideo();
    });
};
