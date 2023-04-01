let role = null
let pressSound = null

document.addEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, function() {
    let player = document.querySelector("#Player1").querySelector(".avatar");
    document.querySelector("#Player1").setAttribute('movement-controls', {enabled:false});
    
    player.querySelector(".user_head").setAttribute("circles-shadow", {cast:false, receive:false});
    player.querySelector(".user_body").setAttribute("circles-shadow", {cast:false, receive:false});
    let cam = document.querySelector('[camera]');
    cam.setAttribute('look-controls', {enabled:false});
    let dpad = document.createElement('a-entity');
    dpad.setAttribute('position', '-0.045 -0.02 -0.05');
    let up = document.createElement('a-entity');
    up.setAttribute('geometry', 'primitive:plane; height:0.01; width:0.02');
    up.setAttribute('material', 'src:#dpad_dir; transparent:true');
    up.setAttribute('position', '0 0.012 0');
    up.setAttribute('shadow', 'cast:false; receive:false');
    up.classList.add('interactive');
    up.onmousedown = function() {
        player.setAttribute('dpad-move-forward', 'true');
        player.removeAttribute('dpad-move-back');
    }
    up.onmouseup = function() {
        player.removeAttribute('dpad-move-forward');
    }
    let left = document.createElement('a-entity');
    left.setAttribute('geometry', 'primitive:plane; height:0.01; width:0.02');
    left.setAttribute('material', 'src:#dpad_dir; transparent:true');
    left.setAttribute('position', '-0.012 0 0');
    left.setAttribute('rotation', '0 0 90');
    left.setAttribute('shadow', 'cast:false; receive:false');
    left.classList.add('interactive');
    left.onmousedown = function() {
        player.setAttribute('dpad-turn-left', 'true');
        player.removeAttribute('dpad-turn-right');
    }
    left.onmouseup = function() {
        player.removeAttribute('dpad-turn-left');
    }
    let down = document.createElement('a-entity');
    down.setAttribute('geometry', 'primitive:plane; height:0.01; width:0.02');
    down.setAttribute('material', 'src:#dpad_dir; transparent:true')
    down.setAttribute('position', '0 -0.012 0');
    down.setAttribute('rotation', '0 0 180');
    down.setAttribute('shadow', 'cast:false; receive:false');
    down.classList.add('interactive');
    down.onmousedown = function() {
        player.setAttribute('dpad-move-back', 'true');
        player.removeAttribute('dpad-move-forward');
    }
    down.onmouseup = function() {
        player.removeAttribute('dpad-move-back');
    }
    let right = document.createElement('a-entity');
    right.setAttribute('geometry', 'primitive:plane; height:0.01; width:0.02');
    right.setAttribute('material', 'src:#dpad_dir; transparent:true')
    right.setAttribute('position', '0.012 0 0');
    right.setAttribute('rotation', '0 0 -90');
    right.setAttribute('shadow', 'cast:false; receive:false');
    right.classList.add('interactive');
    right.onmousedown = function() {
        player.setAttribute('dpad-turn-right', 'true');
        player.removeAttribute('dpad-turn-left');
    }
    right.onmouseup = function() {
        player.removeAttribute('dpad-turn-right');
    }
    dpad.appendChild(up);
    dpad.appendChild(right);
    dpad.appendChild(down);
    dpad.appendChild(left);
    cam.appendChild(dpad);
});

AFRAME.registerComponent('setup', {
    schema: {},
    init() {
        const CONTEXT_AF = this;
        const scene      = document.querySelector('a-scene');
        
        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.buttonEventName = "pressButton";
        CONTEXT_AF.roverEventName = "roverMove";
        CONTEXT_AF.gateEventName = "openGate";

        CONTEXT_AF.sequence = "";

        CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function (data) {
            CONTEXT_AF.connected = true;
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            console.log(CONTEXT_AF.socket.id);
            CONTEXT_AF.room = CIRCLES.getCirclesRoom();
            CONTEXT_AF.otherRoom = null;
            if (CONTEXT_AF.room == "control") {
                CONTEXT_AF.otherRoom = "cargo";
            }
            else if (CONTEXT_AF.room == "cargo") {
                CONTEXT_AF.otherRoom = "control";
            }
            let buttons = setupPuzzle1(CONTEXT_AF.room);
            for (let i = 0; i < buttons.length; i++) {
                scene.querySelector("#" + buttons[i]).addEventListener("click", function () {
                    pressSound.play();
                    CONTEXT_AF.clickButton(this.id);
                    //console.log(this.id);
                    //console.log(CONTEXT_AF.otherRoom);
                    CONTEXT_AF.socket.emit(CONTEXT_AF.buttonEventName, {button:this.id, room:CONTEXT_AF.otherRoom, world:CIRCLES.getCirclesWorld()});
                });
            }

            CONTEXT_AF.socket.on(CONTEXT_AF.buttonEventName, function(data) {
                let button = data.button;
                //console.log(button + " pressed");
                CONTEXT_AF.clickButton(button);
            });

            setupPuzzle2(CONTEXT_AF.room);
            if (CONTEXT_AF.room == 'cargo') {
                scene.querySelector('#rover-topArrow').addEventListener("click", function () {
                    CONTEXT_AF.clickRoverButton('up');
                });
                scene.querySelector('#rover-leftArrow').addEventListener("click", function () {
                    CONTEXT_AF.clickRoverButton('left');
                });
                scene.querySelector('#rover-bottomArrow').addEventListener("click", function () {
                    CONTEXT_AF.clickRoverButton('down');
                });
                scene.querySelector('#rover-rightArrow').addEventListener("click", function () {
                    CONTEXT_AF.clickRoverButton('right');
                });
            }
            else {
                scene.querySelector('#rover-orangeButt').addEventListener("click", function () {
                    CONTEXT_AF.socket.emit(CONTEXT_AF.gateEventName, {colour:'red', room:CONTEXT_AF.otherRoom, world:CIRCLES.getCirclesWorld()});
                });
                scene.querySelector('#rover-blueButt').addEventListener("click", function () {
                    CONTEXT_AF.socket.emit(CONTEXT_AF.gateEventName, {colour:'blue', room:CONTEXT_AF.otherRoom, world:CIRCLES.getCirclesWorld()});
                });
                scene.querySelector('#rover-greenButt').addEventListener("click", function () {
                    CONTEXT_AF.socket.emit(CONTEXT_AF.gateEventName, {colour:'green', room:CONTEXT_AF.otherRoom, world:CIRCLES.getCirclesWorld()});
                });
            }

            CONTEXT_AF.socket.on(CONTEXT_AF.roverEventName, function(data) {
                let i = data.i;
                let j = data.j;
                moveRoverTo(CONTEXT_AF.room, i, j);
            });

            CONTEXT_AF.socket.on(CONTEXT_AF.gateEventName, function (data) {
                //console.log(data.colour);
                CONTEXT_AF.clickGateButton(data.colour);
            });

            CONTEXT_AF.gates = makeRoverPuzzle(CONTEXT_AF.room);
        });  
    },
    update() {},
    clickButton : function (button) {
        const CONTEXT_AF = this;
        const scene      = document.querySelector('a-scene');
        
        if (button == "SW") {
            CONTEXT_AF.sequence = "SW";
        }
        else {
            CONTEXT_AF.sequence += " ";
            CONTEXT_AF.sequence += button;
        }
        if (CONTEXT_AF.sequence == "SW SE NE NE SE NW") {
            //CONTEXT_AF.socket.emit('trigger', 'sequence');
            //console.log("success!");
            document.querySelector('#screen1').setAttribute('material', 'src:#screen1-img');
            document.querySelector('#screen1').setAttribute('circles-portal', 'link_url:/w/Cutscene/?group=' + CONTEXT_AF.room);
            if (CONTEXT_AF.room == "control") {
                //console.log("something happens");
                //document.querySelector('#screen').setAttribute('screen-descend', 'true');
            }
        }
        //console.log("sequence = " + CONTEXT_AF.sequence);
    },
    clickRoverButton : function (dir) {
        const CONTEXT_AF = this;

        //console.log(dir);
        let pos = moveRover(dir);
        CONTEXT_AF.socket.emit(CONTEXT_AF.roverEventName, {i:pos.i, j:pos.j, room:CONTEXT_AF.otherRoom, world:CIRCLES.getCirclesWorld()});
        moveRoverTo(CONTEXT_AF.room, pos.i, pos.j);
    },
    clickGateButton : function (colour) {
        const CONTEXT_AF = this;
        const scene      = document.querySelector('a-scene');

        for (k = 0; k < CONTEXT_AF.gates.length; k++) {
            if (CONTEXT_AF.gates[k].colour == colour) {
                roverMap[CONTEXT_AF.gates[k].j][CONTEXT_AF.gates[k].i].open = true;
                let gate = scene.querySelector('#rover_' + CONTEXT_AF.gates[k].i + '-' + CONTEXT_AF.gates[k].j);
                gate.setAttribute('material', {color: 'white'});
                gate.setAttribute('gate-timer', 'true');
                //console.log(colour);
                //console.log(roverMap[CONTEXT_AF.gates[k].j][CONTEXT_AF.gates[k].i]);
            }
        }
    }
});

function setupPuzzle1(role) {
    //console.log(role);
    pressSound = document.getElementById("clickNoise");

    if (role == "control") {
        document.querySelector("#buttons").innerHTML = '<a-entity id="button-NW-group" position="-12.5 4 -10.5" scale="1 1 1" rotation="90 90 0"><a-entity id="button-plat-NW"  gltf-model="#button-platform-model" circles-sphere-env-map="src:#space-texture"></a-entity><a-entity id="NW" class="interactive" gltf-model="#button-model" circles-sphere-env-map="src:#space-texture"animation__click="property:position.y; from:0; to:-0.05; startEvents:click; dur:200" shadow></a-entity>></a-entity></a-entity><a-entity id="button-SE-group" position="12.5 4 10.2" scale="1 1 1" rotation="0 0 90"><a-entity id="button-plat-SE"  gltf-model="#button-platform-model" circles-sphere-env-map="src:#space-texture"></a-entity><a-entity id="SE" class="interactive" gltf-model="#button-model" circles-sphere-env-map="src:#space-texture"animation__click="property:position.y; from:0; to:-0.05; startEvents:click; dur:200" shadow></a-entity>></a-entity></a-entity>';
        document.querySelector('#newPoster').innerHTML = '<a-entity geometry="primitive:plane; width:4.34; height:5.6;" material="src:#poster2-img" position="-12.2 5 8.95"rotation="0 90 0"></a-entity>';
        return ["NW", "SE"];
    }
    else if (role == "cargo") {
        document.querySelector("#buttons").innerHTML = '<a-entity id="button-NE-group" position="10 4 -12.5" scale="1 1 1" rotation="90 0 0"><a-entity id="button-plat-NE"  gltf-model="#button-platform-model" circles-sphere-env-map="src:#space-texture"></a-entity><a-entity id="NE" class="interactive" gltf-model="#button-model" circles-sphere-env-map="src:#space-texture"animation__click="property:position.y; from:0; to:-0.05; startEvents:click; dur:200" shadow></a-entity>></a-entity></a-entity><a-entity id="button-SW-group" position="-10 4 12.5" scale="1 1 1" rotation="-90 0 0"><a-entity id="button-plat-SW"  gltf-model="#button-platform-model" circles-sphere-env-map="src:#space-texture"></a-entity><a-entity id="SW" class="interactive" gltf-model="#button-model" circles-sphere-env-map="src:#space-texture"animation__click="property:position.y; from:0; to:-0.05; startEvents:click; dur:200" shadow></a-entity>></a-entity></a-entity>';
        document.querySelector('#newPoster').innerHTML = '<a-entity geometry="primitive:plane; width:4.34; height:5.6;" material="src:#poster1-img" position="-12.2 5 8.95"rotation="0 90 0"></a-entity>';
        return ["NE", "SW"];
    }
};

function setupPuzzle2(role) {
    if (role == "control") {
        document.querySelector('#rover-controls').innerHTML = '<a-entity id="buttBase1" gltf-model="#buttBase-model" circles-sphere-env-map="src:#space-texture"></a-entity><a-entity id="buttBase2" gltf-model="#buttBase-model" position="-1.3 0 0" circles-sphere-env-map="src:#space-texture"></a-entity><a-entity id="buttBase3" gltf-model="#buttBase-model" position="1.3 0 0" circles-sphere-env-map="src:#space-texture"></a-entity><a-entity id="rover-orangeButt" class="interactive" gltf-model="#orangeButt-model" circles-sphere-env-map="src:#space-texture"></a-entity><a-entity id="rover-greenButt" class="interactive" gltf-model="#greenButt-model" position="-1.3 0 0" circles-sphere-env-map="src:#space-texture"></a-entity><a-entity id="rover-blueButt" class="interactive" gltf-model="#blueButt-model"  position="1.3 0 0" circles-sphere-env-map="src:#space-texture"></a-entity>';
    }
    else if (role == "cargo") {
        let controls = document.querySelector('#rover-controls');
        controls.innerHTML = '<a-entity id="rover-topArrow" gltf-model="#rover-arrow-model" class="interactive" circles-sphere-env-map="src:#space-texture" position="0 0 -0.05"></a-entity><a-entity id="rover-rightArrow" class="interactive" gltf-model="#rover-arrow-model" circles-sphere-env-map="src:#space-texture" rotation="0 -90 0" position="0.05 0 0"></a-entity><a-entity id="rover-bottomArrow" class="interactive" gltf-model="#rover-arrow-model" circles-sphere-env-map="src:#space-texture" rotation="0 180 0" position="0 0 0.05"></a-entity><a-entity id="rover-leftArrow" class="interactive" gltf-model="#rover-arrow-model" circles-sphere-env-map="src:#space-texture" rotation="0 90 0" position="-0.05 0 0"></a-entity>';
        controls.setAttribute('position', '0 2.2 0.535');
        controls.setAttribute('rotation', '12.5 0 0');
    }
}

addEventListener('mousedown', (event) => {
    let music = document.getElementById("music");
    music.play();
    music.loop = true;
    music.volume = 0.4;

    removeEventListener('mousedown', this);
});

AFRAME.registerComponent("dpad-move-forward", {
    tick: (function () {    
        movePlayer(this.el, this.el.getAttribute('rotation').y);
        //console.log(this.el.getAttribute('rotation').y);
    })
});

AFRAME.registerComponent("dpad-move-back", {
    tick: (function () {    
        movePlayer(this.el, (this.el.getAttribute('rotation').y + 180));
        //console.log(this.el.getAttribute('rotation').y * -1);
    })
});

function movePlayer(player, dir) {
    let val = 0.001 / Math.sin(degToRad(90));
    let moveZ = radToDeg(Math.sin(degToRad(90 - dir)) * val);
    let moveX = radToDeg(Math.sin(degToRad(dir)) * val);
    let pos = player.getAttribute('position');
    player.setAttribute('position', (pos.x - moveX) + ' ' + pos.y + ' ' + (pos.z - moveZ));
    //console.log(camera.getAttribute('position'));
}

function radToDeg(rad) {
    return rad * 180 / Math.PI;
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

AFRAME.registerComponent("dpad-turn-left", {
    tick: (function () {    
        turnPlayer(this.el, 1);
    })
});

AFRAME.registerComponent("dpad-turn-right", {
    tick: (function () {    
        turnPlayer(this.el, -1);
    })
});

function turnPlayer(player, dir) {
    let rot = player.getAttribute('rotation');
    player.setAttribute('rotation', rot.x + ' ' + (rot.y + (0.5 * dir)) + ' ' + rot.z);
    //console.log(rot);
    //console.log(player.getAttribute('rotation'));
}

function makeRoverPuzzle(role) {
    let buildBoard = "";
    let colour = null;
    let gates = [];
    for (let i = 0; i < 14; i++) {
        for (let j = 0; j < 10; j++) {
            colour = getRoverColour(role, i, j);
            buildBoard += '<a-entity id="rover_' + i + '-' + j + '" position="' + (-1.4 + (0.2 * i)) + ' ' + (1 - (0.2 * j)) + ' 0" geometry="primitive:plane; width:0.2; height:0.2" material="color:' + colour + ';" shadow="receive:true; cast:false"></a-entity>';
            
            if (roverMap[j][i].type == 'gate') {
                gates.push({i:i, j:j, colour:roverMap[j][i].color});
            }
        }
    }

    document.querySelector("#board").innerHTML = buildBoard;
    //console.log(role);

    moveRoverTo(null, 1, 9);

    return gates;
}

function getRoverColour(role, i, j) {
    if (roverMap[j][i].type == 'wall' || (role == 'cargo')) {
        if (role == 'control') {
            return 'black';
        }
        else {
            return 'white';
        }
    }
    else if (roverMap[j][i].type == 'path' || roverMap[j][i].type == 'gate') {
        return 'white';
    }
    else {
        return 'yellow';
    }
}

function moveRover(dir) {
    let rover = document.querySelector('#rover');
    let newi = Number(rover.dataset.i);
    let newj = Number(rover.dataset.j);

    if (dir == 'up') {
        newj -= 1;
    }
    else if (dir == 'down') {
        newj += 1;
    }
    else if (dir == 'left') {
        newi -=1;
    }
    else {
        newi += 1;
    }

    if (roverMap[newj][newi].type == 'path' || (roverMap[newj][newi].type == 'gate' && roverMap[newj][newi].open)) {
        return {i: newi, j:newj};
    }
    else if (roverMap[newj][newi].type == 'goal') {
        console.log('okay yay win time');
        return {i: newi, j:newj};
    }
    else {
        //console.log(dir);
        //console.log(roverMap[newj][newi]);
        return {i: rover.dataset.i, j:rover.dataset.j};
    }
}

function moveRoverTo(role, i, j) {
    let rover = document.querySelector("#rover");
    rover.setAttribute('position', (-1.4 + (0.2 * i)) + ' ' + (1 - (0.2 * j)));
    rover.dataset.i = i;
    rover.dataset.j = j;

    if (role == 'cargo') {
        proximityDetector();
    }
}

AFRAME.registerComponent("gate-timer", {
    init: (function () {    
        this.el.dataset.timer = 0;
    }),
    tick: (function () {
        this.el.dataset.timer = Number(this.el.dataset.timer) + 1;
        //console.log(this.el.dataset.timer);
        if (Number(this.el.dataset.timer) > 250) {
            let rover = document.querySelector("#rover");
            let name = this.el.id;
            //console.log(name);
            //console.log(rover.dataset.i + ' ' + rover.dataset.j);
            name = name.replace('rover_', '');
            let coords = name.split('-');
            let i = coords[0];
            let j = coords[1];
            if (!(rover.dataset.i == i && rover.dataset.j == j)) {
                this.el.removeAttribute('gate-timer');
                roverMap[j][i].open = false;
                this.el.dataset.timer = 0;
                if (Math.abs(i - rover.dataset.i) <= 1 && Math.abs(j - rover.dataset.j) <= 1) {
                    this.el.setAttribute('material', {color: roverMap[j][i].color});
                }
            }
        }
    })
});

function proximityDetector() {
    let rover = document.querySelector('#rover');
    let i = Number(rover.dataset.i);
    let j = Number(rover.dataset.j);

    for (let x = 0; x < 14; x++) {
        for (let y = 0; y < 10; y++) {
            if (!(x == i && y == j)) {
                if (roverMap[y][x].type == 'gate') {
                    if (!roverMap[y][x].open) {
                        if (Math.abs(i - x) <= 1 && Math.abs(j - y) <= 1) {
                            document.querySelector('#rover_' + x + '-' + y).setAttribute('material', {color: roverMap[y][x].color});
                        }
                        else {
                            document.querySelector('#rover_' + x + '-' + y).setAttribute('material', {color: 'white'});
                        }
                    }
                }
            }
        }
    }
}

let roverMap = [ [{type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}],
                 [{type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}, {type: 'gate', color: 'blue', open: false}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}],
                 [{type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}, {type: 'gate', color: 'green', open: false}, {type: 'path'}, {type: 'path'}, {type: 'wall'}],
                 [{type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'gate', color: 'green', open: false}, {type: 'wall'}, {type: 'goal'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}, {type: 'wall'}],
                 [{type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'gate', color: 'red', open: false}, {type: 'wall'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'gate', color: 'red', open: false}, {type: 'wall'}],
                 [{type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'wall'}],
                 [{type: 'wall'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'gate', color: 'green', open: false}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}],
                 [{type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'gate', color: 'red', open: false}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}],
                 [{type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'path'}, {type: 'path'}, {type: 'path'}, {type: 'gate', color: 'blue', open: false}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}],
                 [{type: 'wall'}, {type: 'path'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}, {type: 'wall'}]];