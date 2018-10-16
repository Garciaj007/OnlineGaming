class Input {
    var pressedKeys = {};

    constructor() {
        setKey(event, status) {
            let key;
            switch (event.code) {
                case "KeyA":
                    key = 'LEFT';
                    break;
                case "KeyD":
                    key = 'RIGHT';
                    break;
                case "Space":
                    key = 'JUMP';
                    break;
                case "KeyE":
                    key = 'TECH';
                    break;
                default:
                    key = String.fromCharCode(event.code);
            }

            pressedKeys[key] = status;
            console.log(pressedKeys);
        }

        document.addEventListener('keydown', function (e) {
            setKey(e, true);
        });

        document.addEventListener('keyup', function (e) {
            setKey(e, false);
        });

        window.addEventListener('blur', function () {
            pressedKeys = {};
        });
    }

    static isDown(key){
        return pressedKeys[key.toUpperCase()];
    }


}
