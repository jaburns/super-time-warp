/**
 * Created by jordan on 23/01/15.
 */

function AnimatedSprite(idleFrame, animationSpeed) {
    console.log("new animated sprite");
    var texture = PIXI.Texture.fromFrame(idleFrame);
    PIXI.Sprite.call(this, texture, 34, 32);

    this.animations = {'idle': [idleFrame]};
    this.currentAnimation = 'idle';
    this.playing = false;
    this.speed = animationSpeed || 3;
    this.delay = this.speed;
    this.animationIndex = 0;
    this.invulnerable = false;
}

AnimatedSprite.constructor = AnimatedSprite;
AnimatedSprite.prototype = Object.create(PIXI.Sprite.prototype);

AnimatedSprite.prototype.setAnimation = function(name, frames)
{
    this.animations[name] = frames;
};

AnimatedSprite.prototype.clearAnimation = function()
{
    this.switchAnimation('idle');
    //var texture = PIXI.Texture.fromFrame(this.animations['idle']);
    //this.setTexture(texture);
    //this.currentAnimation = 'idle';
    //this.playing = false;
    //this.delay = this.speed;
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
    this.animationIndex = 0;
    this.delay = 0;
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

    if(this.animations[this.currentAnimation].length == this.animationIndex)
    {
        this.animationIndex = 0;
    }

    //this.visible = this.invulnerable ? !this.visible : true;

    var texture = PIXI.Texture.fromFrame(this.animations[this.currentAnimation][this.animationIndex]);
    this.setTexture(texture);
};

