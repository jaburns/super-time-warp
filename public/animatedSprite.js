/**
 * Created by jordan on 23/01/15.
 */

// Requires the idle animation to be passed in to instantiate the sprite, but speed is optional
function AnimatedSprite(idleAnimation, animationSpeed) {
    console.log("new animated sprite");
    var texture = PIXI.Texture.fromFrame(idleAnimation[0]);
    PIXI.Sprite.call(this, texture, 34, 32);

    this.animations = {'idle': idleAnimation};
    this.currentAnimation = 'idle';
    this.speed = animationSpeed || 2;
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

    if(this.animations[this.currentAnimation].length == this.animationIndex)
    {
        this.animationIndex = 0;
    }

    //this.visible = this.invulnerable ? !this.visible : true;

    var texture = PIXI.Texture.fromFrame(this.animations[this.currentAnimation][this.animationIndex]);
    this.setTexture(texture);
};

