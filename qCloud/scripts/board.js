//$(document).ready(onReady());

function onReady() {
    var canvasNode = document.getElementById('Canvas');

    // create an new instance of a pixi stage
    var renderer = PIXI.autoDetectRenderer(640, 480, canvasNode, true, false);

    var stage = new PIXI.Stage(0xdfdfdf, true);
    stage.setInteractive(true);

    var cells = [];
    var rot = 0;

    $(canvasNode).resize(resize);
    window.onorientationchange = resize;
    renderer.view.oncontextmenu = function() {
        return false;
    };
    
    return function() {
        // add event listeners
        renderer.view.touchstart = function(event) {
            var mouseX = event.pageX - $(canvasNode).offset().left;
            var mouseY = event.pageY - $(canvasNode).offset().top;

            var cell = getCell();
            cell.position.x = Math.ceil(mouseX / 40 - 0.5) * 40;
            cell.position.y = Math.ceil(mouseY / 40 - 0.5) * 40;
            if (event.button === 2) {
                cell.rotation = Math.PI / 4;
                cell.scale.x = cell.scale.y = Math.sqrt(2);
            }
            cells.push(cell);

            stage.addChild(cell);
        };

        $(renderer.view).mousedown(renderer.view.touchstart);

        // lets create moving shape
        requestAnimFrame(animate);
    };

    function resize() {
        var width = $(canvasNode).width();
        var height = $(canvasNode).height();
        renderer.resize(width, height);
    }


    function animate() {
        resize();
        rot += 0.1;
        for (var i = 0; i < cells.length; i++)
            cells[i].rotation = rot;

        renderer.render(stage);
        requestAnimFrame(animate);
    }
    
    function getCell() {
        var cell = new PIXI.Graphics();
        cell.lineStyle(1, 0xFF0000, 1);
        cell.beginFill(0xFFFF00, 0.8);
        cell.moveTo(-10, -10);
        cell.lineTo(10, -10);
        cell.lineTo(10, 10);
        cell.lineTo(-10, 10);
        cell.lineTo(-10, -10);
        cell.lineStyle(1, 0x0000FF, 1);
        cell.beginFill(0x0000FF, 1);
        cell.drawCircle(-5, -5, 2);
        cell.drawCircle(5, 5, 2);
        cell.endFill();
        cell.drawCircle(-5, 5, 2);
        cell.drawCircle(5, -5, 2);
        cell.scale.x = 2;
        cell.scale.y = 2;
        return cell;
    }
}



