
function setupLayout() {
    var board;
    var style = 'border: 1px solid #dfdfdf; padding: 5px;';
    $("#layout").w2layout(getLayout(style));
    w2ui.layout.content('top', $().w2toolbar(getToolbar(style)));
    w2ui.layout.content('left', $().w2sidebar(getSidebar(style)));
    w2ui.toolbar.on('click', toolbarOnClick);

    return {
        board: function() {
            if (arguments.length > 0) {
                board = arguments[0];
            }
            return board;
        }
    };
        
    function toolbarOnClick(event) {
        switch (event.target) {
            case 'autosave':
                break;
            case 'scaleone':
                board.gridSize(40);
                break;
            case 'scalehalf':
                board.gridSize(20);
                break;
            case 'clear':
                board.clearBoard();
                break;
            case 'clock1':
                board.activeClock(0);
                break;
            case 'clock2':
                board.activeClock(1);
                break;
            case 'clock3':
                board.activeClock(2);
                break;
            case 'clock4':
                board.activeClock(3);
                break;
            case '':
                break;
            default:
        }
    }
    
    function getLayout(pstyle) {
        return {
            name: 'layout',
            padding: 2,
            panels: [
                { type: 'top', size: 38, resizable: false },
                { type: 'left', size: 150, resizable: true, style: pstyle },
                { type: 'main', style: pstyle, content: '<canvas id="mainPanel" style="width: 100%; height: 100%; padding: 0; margin: 0;"></canvas>' },
                { type: 'right', size: 200, resizable: true, style: pstyle, content: '<div id="rightPanel"></div>' },
                { type: 'bottom', size: 80, resizable: true, style: pstyle, content: '<div id="bottomPanel"></div>' }
            ]
        };
    }
    
    function getSidebar(pstyle) {
        return {
            name: 'sidebar',
            style: pstyle + ' background-color: #D5D6D7;',
            nodes: [
                {
                    id: 'general',
                    text: 'General',
                    group: true,
                    expanded: true,
                    nodes: [
                        { id: 'select', text: 'Select', img: 'icon-page', selected: true },
                        { id: 'pan', text: 'Pan', img: 'icon-page' },
                        { id: 'delete', text: 'Delete', img: 'icon-page' }
                    ]
                },
                {
                    id: 'cells',
                    text: 'Cells',
                    group: true,
                    expanded: true,
                    nodes: [
                        { id: 'normal', text: 'Normal', img: 'icon-page'},
                        { id: 'rotated', text: 'Rotated', img: 'icon-page' },
                        { id: 'fixed', text: 'Fixed', img: 'icon-page' },
                        { id: 'input', text: 'Input', img: 'icon-page' },
                        { id: 'output', text: 'Output', img: 'icon-page' }
                    ]
                }
            ],
        };
    }
    
    function getToolbar(pstyle) {
        return {
            name: 'toolbar',
            style: pstyle + ' background-color: #E5E6E7;',
            items: [
                {
                    type: 'menu',
                    id: 'menu',
                    caption: 'Menu',
                    img: 'icon-columns',
                    items: [
                        { text: 'Item 1', icon: 'icon-page' },
                        { text: 'Item 2', icon: 'icon-page' },
                        { text: 'Item 3', value: 'Item Three', icon: 'icon-page' }
                    ]
                },
                { type: 'spacer' },
                { type: 'check', id: 'autosave', caption: 'Auto Save', img: 'icon-save', hint: 'Automatic Save', checked: false },
                { type: 'break', id: 'break0' },
                { type: 'radio', id: 'scaleone', group: '1', caption: 'One Cell', img: 'icon-edit', hint: 'Grid Scale One Cell', checked: true },
                { type: 'radio', id: 'scalehalf', group: '1', caption: 'Half Cell', img: 'icon-edit', hint: 'Grid Scale Half Cell' },
                { type: 'break', id: 'break1' },
                { type: 'radio', id: 'clock1', group: '2', caption: 'Clock 1', img: 'icon-add', hint: 'Clock 1', checked: true },
                { type: 'radio', id: 'clock2', group: '2', caption: 'Clock 2', img: 'icon-add', hint: 'Clock 2' },
                { type: 'radio', id: 'clock3', group: '2', caption: 'Clock 3', img: 'icon-add', hint: 'Clock 3' },
                { type: 'radio', id: 'clock4', group: '2', caption: 'Clock 4', img: 'icon-add', hint: 'Clock 4' },
                { type: 'break', id: 'break1' },
                { type: 'button', id: 'clear', caption: 'Clear Board', img: 'icon-delete', hint: 'Clear Board' }
            ],
        };
    }
}
