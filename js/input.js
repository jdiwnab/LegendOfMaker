(function() {
    var pressedKeys = {};
    
    function setKey(event, status) {
        var code = event.keyCode;
        var key;
        
        switch(code) {
            case 32:
                key = 'space'; break;
            case 37:
                key = 'left'; break;
            case 38:
                key = 'up'; break;
            case 39:
                key = 'right'; break;
            case 40:
                key = 'down'; break;
            default:
                key = String.fromCharCode(code);
        }
        pressedKeys[key] = status;
    }
    
    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });
    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });
    window.addEventListener('blur', function(e) {
        pressedKeys = {};
    });
    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toLowerCase()];
        }
    };
})();