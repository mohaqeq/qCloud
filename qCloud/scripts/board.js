
function setupBoard() {
    var canvas = document.getElementById('mainPanel');
    var cells = new Object();
    var selectedCells = new Object();
    var gridSize = 40;
    var cellSize = 36;
    var width = 640;
    var height = 480;
    var touchX = 0;
    var touchY = 0;
    var mousedown = false;
    var selectSp;
    var selectionTint = 0xFFBBBB;
    var clocks = [0x78FA83, 0x78FAFA, 0xFAC0F8, 0xFAFA02];
    var activeClock = 0;
    
    // create an new instance of a pixi stage
    var renderer = PIXI.autoDetectRenderer(width, height, canvas, true, true);
    var stage = new PIXI.Stage(0xdfdfdf, true);
    stage.setInteractive(true);

    // add event listeners
    renderer.view.touchstart = touchstart;
    $(renderer.view).mousedown(touchstart);
    renderer.view.touchmove = touchmove;
    $(renderer.view).mousemove(touchmove);
    renderer.view.touchend = touchend;
    $(renderer.view).mouseup(touchend);
    renderer.view.touchendoutside = touchend;
    $(renderer.view).mouseout(touchend);

    canvas.addEventListener('contextmenu', function (event) { event.preventDefault(); });

    // lets create moving shape
    requestAnimFrame(animate);

    return {
        cells: cells,
        clearBoard: clearBoard,
        gridSize: function () {
            if (arguments.length > 0) {
                gridSize = arguments[0];
            }
            return gridSize;
        },
        cellSize: function () {
            if (arguments.length > 0) {
                cellSize = arguments[0];
            }
            return cellSize;
        },
        activeClock: function() {
            if (arguments.length > 0) {
                activeClock = arguments[0];
                changeSelectionClock(activeClock);
            }
            return activeClock;
        }
    };


    function touchstart(event) {
        var x = event.pageX - $(canvas).offset().left;
        var y = event.pageY - $(canvas).offset().top;
        switch (w2ui.sidebar.selected) {
            case 'select':
                touchX = x;
                touchY = y;
                if (typeof selectSp != 'undefined') {
                    stage.removeChild(selectSp);
                    selectSp = undefined;
                }
                selectSp = new PIXI.Graphics();
                stage.addChild(selectSp);
                break;
            default:
        }
        mousedown = true;
    }

    function touchmove(event) {
        if (!mousedown) return;
        var x = event.pageX - $(canvas).offset().left;
        var y = event.pageY - $(canvas).offset().top;
        switch (w2ui.sidebar.selected) {
            case 'select':
                if (typeof selectSp != 'undefined') {
                    selectSp.clear();
                    selectSp.lineStyle(cellSize / 40, 0x333333, 0.5);
                    selectSp.moveTo(touchX, touchY);
                    selectSp.lineTo(touchX, y);
                    selectSp.lineTo(x, y);
                    selectSp.lineTo(x, touchY);
                    selectSp.lineTo(touchX, touchY);
                }
                break;
            default:
        }
    }

    function touchend(event) {
        if (!mousedown) return;
        var x = event.pageX - $(canvas).offset().left;
        var y = event.pageY - $(canvas).offset().top;
        var cellX = Math.ceil(x / gridSize - 0.5) * gridSize;
        var cellY = Math.ceil(y / gridSize - 0.5) * gridSize;
        switch (w2ui.sidebar.selected) {
            case 'select':
                if (typeof selectSp != 'undefined') {
                    stage.removeChild(selectSp);
                    selectSp = undefined;
                    for (var selcell in selectedCells) {
                        if (selectedCells.hasOwnProperty(selcell)) {
                            selectedCells[selcell].tint = 0xFFFFFF;
                            delete selectedCells[selcell];
                        }
                    }
                    for (var cell in cells) {
                        if (cells.hasOwnProperty(cell)) {
                            var pos = cells[cell].position;
                            if (pos.x + gridSize / 2 >= Math.min(x, touchX) && pos.x - gridSize / 2 <= Math.max(x, touchX)
                                && pos.y + gridSize / 2 >= Math.min(y, touchY) && pos.y - gridSize / 2 <= Math.max(y, touchY)) {
                                cells[cell].tint = selectionTint;
                                selectedCells[cell] = cells[cell];
                            }
                        }
                    }
                }
                break;
            case 'delete':
                delCell(cellX, cellY);
                break;
            case 'normal':
                addCell(cellX, cellY, activeClock);
                break;
            case 'rotated':
                addCell(cellX, cellY, activeClock, true);
                break;
            case 'fixed':
                break;
            case 'input':
                break;
            case 'output':
                break;
            default:
        }
        mousedown = false;
    }

    function clearBoard() {
        for (var cell in cells) {
            if (cells.hasOwnProperty(cell)) {
                stage.removeChild(cells[cell]);
                delete cells[cell];
                delete selectedCells[cell];
            }
        }
    }

    function changeSelectionClock(clock) {
        for (var selcell in selectedCells) {
            if (selectedCells.hasOwnProperty(selcell)) {
                stage.removeChild(selectedCells[selcell]);
                var cell = selectedCells[selcell].kind === 'R' ? getRCell(clock) : getNCell(clock);
                cell.position.x = selectedCells[selcell].position.x;
                cell.position.y = selectedCells[selcell].position.y;
                cell.tint = selectionTint;
                delete cells[selcell];
                delete selectedCells[selcell];
                cells[selcell] = cell;
                selectedCells[selcell] = cell;
                stage.addChild(cell);
            }
        }
    }
    
    function addCell(x, y, clock, rotated) {
        var pos = JSON.stringify({ x: x, y: y });
        if (typeof cells[pos] == "undefined") {
            var cell = rotated ? getRCell(clock) : getNCell(clock);
            cell.position.x = x;
            cell.position.y = y;
            cells[pos] = cell;
            stage.addChild(cell);
        }
    }

    function delCell(x, y) {
        var pos = JSON.stringify({ x: x, y: y });
        if (typeof cells[pos] != "undefined") {
            stage.removeChild(cells[pos]);
            delete cells[pos];
        }
    }

    function resize() {
        var newwidth = $(canvas).width();
        var newheight = $(canvas).height();
        if (newheight === height && newwidth === width) return;
        width = newwidth;
        height = newheight;
        renderer.resize(width, height);
    }

    function animate() {
        resize();
        renderer.render(stage);
        requestAnimFrame(animate);
    }

    function getCell(clock) {
        var p = cellSize / 2;
        var cell = new PIXI.Graphics();
        cell.lineStyle(cellSize / 20, 0xFF0000, 1);
        cell.beginFill(clocks[clock], 0.8);
        cell.moveTo(-p, -p);
        cell.lineTo(p, -p);
        cell.lineTo(p, p);
        cell.lineTo(-p, p);
        cell.lineTo(-p, -p);
        cell.clock = clock;
        return cell;
    }

    function getNCell(clock) {
        var p = cellSize / 4;
        var pd = cellSize / 10;
        var cell = getCell(clock);
        cell.lineStyle(pd / 2, 0x0000FF, 1);
        cell.beginFill(0x0000FF, 1);
        cell.drawCircle(-p, -p, pd);
        cell.drawCircle(p, p, pd);
        cell.endFill();
        cell.drawCircle(-p, p, pd);
        cell.drawCircle(p, -p, pd);
        cell.kind = 'N';
        return cell;
    }

    function getRCell(clock) {
        var p = cellSize / 3;
        var pd = cellSize / 10;
        var cell = getCell(clock);
        cell.lineStyle(pd / 2, 0x0000FF, 1);
        cell.beginFill(0x0000FF, 1);
        cell.drawCircle(-p, 0, pd);
        cell.drawCircle(p, 0, pd);
        cell.endFill();
        cell.drawCircle(0, p, pd);
        cell.drawCircle(0, -p, pd);
        cell.kind = 'R';
        return cell;
    }
}



