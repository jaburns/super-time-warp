/**
 * Created by jordan on 23/01/15.
 */



var world_initialized = false;

function initializeCanvas()
{
    // You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer
    var renderer = new PIXI.WebGLRenderer(160, 160);

    document.body.appendChild(renderer.view);

    var stage = new PIXI.Stage;

    var playerTexture = PIXI.Texture.fromImage("bunny.png", new Rectangle(0, 0, 16, 16));
    var bunny = new PIXI.Sprite(playerTexture);

    bunny.position.x = 0;
    bunny.position.y = 0;

    bunny.scale.x = 2;
    bunny.scale.y = 2;

    stage.addChild(bunny);

    requestAnimationFrame(animate);

    function animate() {
        bunny.rotation += 0.01;

        renderer.render(stage);

        requestAnimationFrame(animate);
    }
}


function initializeWorld(worldState)
{


}