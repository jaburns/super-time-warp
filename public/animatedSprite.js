/**
 * Created by jordan on 23/01/15.
 */



AnimatedSprite.prototype = Object.create( PIXI.Sprite.prototype );
AnimatedSprite.prototype.constructor = AnimatedSprite;

function AnimatedSprite(idleFrame, animationSpeed)
{
    this.idleFrame = idleFrame;
    this.currentAnimation = 'idle';
    this.playing = false;
    this.speed = animationSpeed || 10;
    this.delay = this.speed;
    this.animationIndex = 0;
}

AnimatedSprite.prototype.animations = {};

AnimatedSprite.prototype.setAnimation = function(name, frames)
{
    animations[name] = frames;
};

AnimatedSprite.prototype.clearAnimation = function()
{
    this.setTexture.fromFrame(this.idleFrame);
    this.currentAnimation = 'idle';
    this.playing = false;
    this.delay = this.speed;
};

AnimatedSprite.prototype.switchAnimation = function(name)
{
    if (!name in this.animations)
    {
        console.log("Animation "+name+" not found!");
        return;
    }

    if(this.currentAnimation == name)
    {
        return;
    }

    this.currentAnimation = name;
};

AnimatedSprite.prototype.animate = function()
{
    if(!this.playing)
    {
        return;
    }

    if(this.delay > 0)
    {
        this.delay--;
        return;
    }

    this.animationIndex++;

    if(this.animations[this.currentAnimation].length == this.animationIndex)
    {
        this.animationIndex = 0;
    }

    this.setTexture.fromFrame(this.animations[this.currentAnimation][this.animationIndex]);
};