let role = null
let pressSound = null

document.addEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, function() {
    console.log("called");
    console.log()
    document.querySelector("#Player1").querySelector(".avatar").querySelector(".user_head").setAttribute("circles-shadow", {cast:false, receive:false});
    document.querySelector("#Player1").querySelector(".avatar").querySelector(".user_body").setAttribute("circles-shadow", {cast:false, receive:false});
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
            if (CONTEXT_AF.room == "control") {
                console.log("something happens");
            }
        }
        console.log("sequence = " + CONTEXT_AF.sequence);
    }
});

function setupRoom(role) {
    console.log(role);
    pressSound = document.getElementById("clickNoise");

    if (role == "control") {
        document.getElementById("buttons").innerHTML = '<a-entity position="6.5 0.5 6.5" geometry="primitive:box; width:0.5; depth:0.5; height:1;" material="color:white;" shadow> <a-entity id="NE" class="button interactive" position="0 0.5 0" geometry="primitive:cylinder; radius:0.15; height:0.2;" material="color:#ED2E14" animation__mouseenter="property:material.color; type:color; to:#9F3728; startEvents:mouseenter; dur:200" animation__mouseleave="property:material.color; type:color; to:#ED2E14; startEvents:mouseleave; dur:200" animation__click="property:position.y; from:0.5; to:0.45; startEvents:click; dur:300" animation__unclick="property:position.y; from:0.45; to:0.5; startEvents:click; dur:300; delay:600"  shadow></a-entity> </a-entity> <a-entity position="-6.5 0.5 -6.5" geometry="primitive:box; width:0.5; depth:0.5; height:1;" material="color:white;" shadow> <a-entity id="SW" class="button interactive" position="0 0.5 0" geometry="primitive:cylinder; radius:0.15; height:0.2;" material="color:#ED2E14" animation__mouseenter="property:material.color; type:color; to:#9F3728; startEvents:mouseenter; dur:200" animation__mouseleave="property:material.color; type:color; to:#ED2E14; startEvents:mouseleave; dur:200" animation__click="property:position.y; from:0.5; to:0.45; startEvents:click; dur:300" animation__unclick="property:position.y; from:0.45; to:0.5; startEvents:click; dur:300; delay:600"  shadow></a-entity> </a-entity>';
        document.getElementById("west").innerHTML = '<a-entity geometry="primitive:plane; width:1.61; height:2.2;" material="src:#codeArt1" position="-3 0 0.01" shadow="cast:false; receive:true;"></a-entity>';
        return ["NE", "SW"];
    }
    else if (role == "cargo") {
        document.getElementById("buttons").innerHTML = '<a-entity position="-6.5 0.5 6.5" geometry="primitive:box; width:0.5; depth:0.5; height:1;" material="color:white;" shadow> <a-entity id="SE" class="button interactive" position="0 0.5 0" geometry="primitive:cylinder; radius:0.15; height:0.2;" material="color:#ED2E14" animation__mouseenter="property:material.color; type:color; to:#9F3728; startEvents:mouseenter; dur:200" animation__mouseleave="property:material.color; type:color; to:#ED2E14; startEvents:mouseleave; dur:200" animation__click="property:position.y; from:0.5; to:0.45; startEvents:click; dur:300" animation__unclick="property:position.y; from:0.45; to:0.5; startEvents:click; dur:300; delay:600"  shadow></a-entity> </a-entity> <a-entity position="6.5 0.5 -6.5" geometry="primitive:box; width:0.5; depth:0.5; height:1;" material="color:white;" shadow> <a-entity id="NW" class="button interactive" position="0 0.5 0" geometry="primitive:cylinder; radius:0.15; height:0.2;" material="color:#ED2E14" animation__mouseenter="property:material.color; type:color; to:#9F3728; startEvents:mouseenter; dur:200" animation__mouseleave="property:material.color; type:color; to:#ED2E14; startEvents:mouseleave; dur:200" animation__click="property:position.y; from:0.5; to:0.45; startEvents:click; dur:300" animation__unclick="property:position.y; from:0.45; to:0.5; startEvents:click; dur:300; delay:600"  shadow></a-entity> </a-entity>';
        document.getElementById("east").innerHTML = '<a-entity geometry="primitive:plane; width:1.61; height:2.2;" material="src:#codeArt2" position="3 0 0.01" shadow="cast:false; receive:true;"></a-entity>';
        return ["NW", "SE"];
    }
};

// function pressButton(button) {
//     pressSound.play();
//     socket.emit('pressButton', button);
// }

// socket.on('trigger', (target) => {
//     if (role == "control") {
        
//     }
//     else if (role == "cargo") {
        
//     }
//     if (target == "sequence") {
//         document.querySelector('#screen').setAttribute('screen-descend', 'true');
//     }
// });

AFRAME.registerComponent('screen-descend', {
    tick: (function () {
        return function () {
            let pos = this.el.getAttribute('position');

            if (pos.y > 0.387) {
                this.el.setAttribute('position', '0 ' + (pos.y - 0.01) + ' 1');
            }
            else {
                this.el.removeAttribute('screen-descend');
            }
        };
    })()
});

addEventListener('mousedown', (event) => {
    let music = document.getElementById("music");
    music.play();
    music.loop = true;
    music.volume = 0.4;

    removeEventListener('mousedown', this);
});
