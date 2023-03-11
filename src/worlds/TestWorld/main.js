let role = null
let pressSound = null

AFRAME.registerComponent('setup', {
    init() {
        console.log(CIRCLES.getCirclesRoom());
    }
});

// socket.on('setup', (data) => {
//     role = data;
//     console.log(role);
//     if (role == "control") {
//         document.getElementById("buttons").innerHTML = '<a-entity position="6.5 0.5 6.5" geometry="primitive:box; width:0.5; depth:0.5; height:1;" material="color:white;" shadow> <a-entity id="NE" class="button interactive" position="0 0.5 0" geometry="primitive:cylinder; radius:0.15; height:0.2;" material="color:#ED2E14" animation__mouseenter="property:material.color; type:color; to:#9F3728; startEvents:mouseenter; dur:200" animation__mouseleave="property:material.color; type:color; to:#ED2E14; startEvents:mouseleave; dur:200" animation__click="property:position.y; from:0.5; to:0.45; startEvents:click; dur:300" animation__unclick="property:position.y; from:0.45; to:0.5; startEvents:click; dur:300; delay:600" onclick="pressButton(this.id)" shadow></a-entity> </a-entity> <a-entity position="-6.5 0.5 -6.5" geometry="primitive:box; width:0.5; depth:0.5; height:1;" material="color:white;" shadow> <a-entity id="SW" class="button interactive" position="0 0.5 0" geometry="primitive:cylinder; radius:0.15; height:0.2;" material="color:#ED2E14" animation__mouseenter="property:material.color; type:color; to:#9F3728; startEvents:mouseenter; dur:200" animation__mouseleave="property:material.color; type:color; to:#ED2E14; startEvents:mouseleave; dur:200" animation__click="property:position.y; from:0.5; to:0.45; startEvents:click; dur:300" animation__unclick="property:position.y; from:0.45; to:0.5; startEvents:click; dur:300; delay:600" onclick="pressButton(this.id)" shadow></a-entity> </a-entity>';
//         document.getElementById("west").innerHTML = '<a-entity geometry="primitive:plane; width:1.61; height:2.2;" material="src:#codeArt1" position="-3 0 0.01" shadow="cast:false; receive:true;"></a-entity>';
//     }
//     else if (role == "cargo") {
//         document.getElementById("buttons").innerHTML = '<a-entity position="-6.5 0.5 6.5" geometry="primitive:box; width:0.5; depth:0.5; height:1;" material="color:white;" shadow> <a-entity id="SE" class="button interactive" position="0 0.5 0" geometry="primitive:cylinder; radius:0.15; height:0.2;" material="color:#ED2E14" animation__mouseenter="property:material.color; type:color; to:#9F3728; startEvents:mouseenter; dur:200" animation__mouseleave="property:material.color; type:color; to:#ED2E14; startEvents:mouseleave; dur:200" animation__click="property:position.y; from:0.5; to:0.45; startEvents:click; dur:300" animation__unclick="property:position.y; from:0.45; to:0.5; startEvents:click; dur:300; delay:600" onclick="pressButton(this.id)" shadow></a-entity> </a-entity> <a-entity position="6.5 0.5 -6.5" geometry="primitive:box; width:0.5; depth:0.5; height:1;" material="color:white;" shadow> <a-entity id="NW" class="button interactive" position="0 0.5 0" geometry="primitive:cylinder; radius:0.15; height:0.2;" material="color:#ED2E14" animation__mouseenter="property:material.color; type:color; to:#9F3728; startEvents:mouseenter; dur:200" animation__mouseleave="property:material.color; type:color; to:#ED2E14; startEvents:mouseleave; dur:200" animation__click="property:position.y; from:0.5; to:0.45; startEvents:click; dur:300" animation__unclick="property:position.y; from:0.45; to:0.5; startEvents:click; dur:300; delay:600" onclick="pressButton(this.id)" shadow></a-entity> </a-entity>';
//         document.getElementById("east").innerHTML = '<a-entity geometry="primitive:plane; width:1.61; height:2.2;" material="src:#codeArt2" position="3 0 0.01" shadow="cast:false; receive:true;"></a-entity>';
//     }
//     pressSound = document.getElementById("clickNoise");
// });

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
