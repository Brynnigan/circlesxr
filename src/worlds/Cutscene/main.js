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
            let buttons = setupRoom(CONTEXT_AF.room);

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
                console.log(button + " pressed");
                CONTEXT_AF.clickButton(button);
            });

            CONTEXT_AF.socket.on(CONTEXT_AF.testEventName, function(data) {
                console.log('emit');
            });
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
            console.log("success!");
            document.querySelector('#screen1').setAttribute('material', 'src:#screen1-img');
            document.querySelector('#screen1').setAttribute('circles-portal', 'link_url:/w/Wardrobe');
            if (CONTEXT_AF.room == "control") {
                console.log("something happens");
                //document.querySelector('#screen').setAttribute('screen-descend', 'true');
            }
        }
        console.log("sequence = " + CONTEXT_AF.sequence);
    }
});

function setupRoom(role) {
    console.log(role);
    pressSound = document.getElementById("clickNoise");

    if (role == "control") {
        document.querySelector("#buttons").innerHTML = '<a-entity position="6.5 0.5 6.5" geometry="primitive:box; width:0.5; depth:0.5; height:1;" material="color:white;" shadow> <a-entity id="SE" class="button interactive" position="0 0.5 0" geometry="primitive:cylinder; radius:0.15; height:0.2;" material="color:#ED2E14" animation__mouseenter="property:material.color; type:color; to:#9F3728; startEvents:mouseenter; dur:200" animation__mouseleave="property:material.color; type:color; to:#ED2E14; startEvents:mouseleave; dur:200" animation__click="property:position.y; from:0.5; to:0.45; startEvents:click; dur:300" animation__unclick="property:position.y; from:0.45; to:0.5; startEvents:click; dur:300; delay:600"  shadow></a-entity> </a-entity> <a-entity position="-6.5 0.5 -6.5" geometry="primitive:box; width:0.5; depth:0.5; height:1;" material="color:white;" shadow> <a-entity id="NW" class="button interactive" position="0 0.5 0" geometry="primitive:cylinder; radius:0.15; height:0.2;" material="color:#ED2E14" animation__mouseenter="property:material.color; type:color; to:#9F3728; startEvents:mouseenter; dur:200" animation__mouseleave="property:material.color; type:color; to:#ED2E14; startEvents:mouseleave; dur:200" animation__click="property:position.y; from:0.5; to:0.45; startEvents:click; dur:300" animation__unclick="property:position.y; from:0.45; to:0.5; startEvents:click; dur:300; delay:600"  shadow></a-entity> </a-entity>';
        document.querySelector('#newPoster').innerHTML = '<a-entity geometry="primitive:plane; width:4.34; height:5.6;" material="src:#poster2-img" position="12.2 5 0" rotation="0 -90 0"></a-entity>';
        return ["NW", "SE"];
    }
    else if (role == "cargo") {
        document.querySelector("#buttons").innerHTML = '<a-entity position="-6.5 0.5 6.5" geometry="primitive:box; width:0.5; depth:0.5; height:1;" material="color:white;" shadow> <a-entity id="SW" class="button interactive" position="0 0.5 0" geometry="primitive:cylinder; radius:0.15; height:0.2;" material="color:#ED2E14" animation__mouseenter="property:material.color; type:color; to:#9F3728; startEvents:mouseenter; dur:200" animation__mouseleave="property:material.color; type:color; to:#ED2E14; startEvents:mouseleave; dur:200" animation__click="property:position.y; from:0.5; to:0.45; startEvents:click; dur:300" animation__unclick="property:position.y; from:0.45; to:0.5; startEvents:click; dur:300; delay:600"  shadow></a-entity> </a-entity> <a-entity position="6.5 0.5 -6.5" geometry="primitive:box; width:0.5; depth:0.5; height:1;" material="color:white;" shadow> <a-entity id="NE" class="button interactive" position="0 0.5 0" geometry="primitive:cylinder; radius:0.15; height:0.2;" material="color:#ED2E14" animation__mouseenter="property:material.color; type:color; to:#9F3728; startEvents:mouseenter; dur:200" animation__mouseleave="property:material.color; type:color; to:#ED2E14; startEvents:mouseleave; dur:200" animation__click="property:position.y; from:0.5; to:0.45; startEvents:click; dur:300" animation__unclick="property:position.y; from:0.45; to:0.5; startEvents:click; dur:300; delay:600"  shadow></a-entity> </a-entity>';
        document.querySelector("#newPoster").innerHTML = '<a-entity geometry="primitive:plane; width:4.34; height:5.6;" material="src:#poster1-img" position="12.2 5 0" rotation="0 -90 0"></a-entity>';
        return ["NE", "SW"];
    }
};

// AFRAME.registerComponent('screen-descend', {
//     tick: (function () {
//         return function () {
//             let pos = this.el.getAttribute('position');

//             if (pos.y > 0.387) {
//                 this.el.setAttribute('position', '0 ' + (pos.y - 0.01) + ' 1');
//             }
//             else {
//                 this.el.removeAttribute('screen-descend');
//             }
//         };
//     })()
// });

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
        console.log(this.el.getAttribute('rotation').y);
    })
});

AFRAME.registerComponent("dpad-move-back", {
    tick: (function () {    
        movePlayer(this.el, (this.el.getAttribute('rotation').y + 180));
        console.log(this.el.getAttribute('rotation').y * -1);
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