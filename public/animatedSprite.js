/**
 * Created by jordan on 23/01/15.
 */

function AnimatedSprite(idleFrame, animationSpeed) {
    var texture = PIXI.Texture.fromFrame(idleFrame);
    PIXI.Sprite.call(this, texture, 16, 16);

    this.animations = {'idle': [idleFrame]};
    this.currentAnimation = 'idle';
    this.playing = false;
    this.speed = animationSpeed || 10;
    this.delay = this.speed;
    this.animationIndex = 0;
}

AnimatedSprite.constructor = AnimatedSprite;
AnimatedSprite.prototype = Object.create(PIXI.Sprite.prototype);

AnimatedSprite.prototype.setAnimation = function(name, frames)
{
    this.animations[name] = frames;
};

AnimatedSprite.prototype.clearAnimation = function()
{
    this.setTexture.fromFrame(this.animations['idle']);
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
    this.playing = true;
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

    this.delay = this.speed;

    this.animationIndex++;

    console.log("changing animation to "+this.animationIndex);
    if(this.animations[this.currentAnimation].length == this.animationIndex)
    {
        this.animationIndex = 0;
    }

    var texture = PIXI.Texture.fromFrame(this.animations[this.currentAnimation][this.animationIndex]);
    this.setTexture(texture);
};

