/**
 * Created by jordan on 23/01/15.
 */

/**
 * Requires the animationFrames to be passed in as an object, as well as the
 * starting state
 *
 * @param animationFrames
 * @param defaultState
 * @param animationSpeed
 * @constructor
 */
function AnimatedSprite(animationFrames, defaultState, animationSpeed) {


    this.animations = animationFrames;
    this.currentAnimation = 'idle';
    this.currentState = defaultState;
    this.speed = animationSpeed || 2;
    this.delay = this.speed;
    this.animationIndex = 0;

    var texture = PIXI.Texture.fromFrame(animationFrames[defaultState][this.currentAnimation][0]);
    PIXI.Sprite.call(this, texture, 30, 32);
}

AnimatedSprite.constructor = AnimatedSprite;
AnimatedSprite.prototype = Object.create(PIXI.Sprite.prototype);

AnimatedSprite.prototype.clearAnimation = function()
{
    this.switchAnimation('idle');
};

AnimatedSprite.prototype.switchState = function(state)
{

    if(this.currentState == state)
    {
        return;
    }

    if (!state in this.animations)
    {
        console.log("state "+state+" not found!");
        return;
    }

    this.currentState = state;
    this.animationIndex = 0;
    this.delay = 0;
};

AnimatedSprite.prototype.switchAnimation = function(name)
{
    if (!name in this.animations[this.currentState])
    {
        console.log("Animation "+name+" not found!");
        return;
    }

    if(this.currentAnimation == name)
    {
        return;
    }

    this.currentAnimation = name;
    this.animationIndex = 0;
    this.delay = 0;
};

AnimatedSprite.prototype.animate = function()
{
    if(this.delay > 0)
    {
        this.delay--;
        return;
    }

    this.delay = this.speed;

    this.animationIndex++;

    if(this.animations[this.currentState][this.currentAnimation].length == this.animationIndex)
    {
        this.animationIndex = 0;
    }

    var texture = PIXI.Texture.fromFrame(this.animations[this.currentState][this.currentAnimation][this.animationIndex]);
    this.setTexture(texture);
};

