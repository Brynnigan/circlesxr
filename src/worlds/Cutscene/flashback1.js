'use strict'

AFRAME.registerComponent('start-game', {
    init: function() {
        console.log('SCENE LOADED');
        // document.querySelector('#user-gesture-button').style.display = 'block';
        var time_testing = document.querySelector('#testing-time');

        //black screen
        //var black_screen = document.querySelector('#black-screen');
        var black_screen2 = document.querySelector('#black-screen-2');
        black_screen2.style.display = 'none';
        var black_screen3 = document.querySelector('#black-screen-3');
        black_screen3.style.display = 'none';


        time_testing.style.display = 'block';
        // setTimeout(function() {
        //   black_screen.style.display = 'none';
        // }, 4900);
    
        //timer
        var fiveMinutes = 60 * 5;
        var display = document.querySelector('#time');
        startTimer(fiveMinutes, display);

        document.querySelector('[camera]').innerHTML = '<a-entity raycaster cursor="rayOrigin:mouse" body="type: static; shape: sphere; sphereRadius: 0.001;" super-hands="colliderEvent: raycaster-intersection; colliderEventProperty: els; colliderEndEvent:raycaster-intersection-cleared; colliderEndEventProperty: clearedEls;"></a-entity>';
    }
});

// const startExperience = function() {
//     document.querySelector('#user-gesture-overlay').style.display = 'none';

    
//     const ambientSounds = document.querySelectorAll('.ambient-music'); 
//     ambientSounds.forEach(function(soundEntity) {
//         soundEntity.components.sound.playSound();
//     });
// };


function startTimer(duration, display) {
  var start = Date.now(),
      diff,
      minutes,
      seconds;
  function timer() {
      // get the number of seconds that have elapsed since 
      // startTimer() was called
      diff = duration - (((Date.now() - start) / 1000) | 0);

      // does the same job as parseInt truncates the float
      minutes = (diff / 60) | 0;
      seconds = (diff % 60) | 0;

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds; 

      if (diff <= 0) {
          // add one second so that the count down starts at the full duration
          // example 05:00 not 04:59
          start = Date.now() + 1000;
      }
  };
  // we don't want to wait a full second before the timer starts
  timer();
  setInterval(timer, 1000);
  
}

AFRAME.registerComponent('sphere-crash', {
    init: function () {
      this.el.emit('triggerfirst');
      setTimeout(() => {
        this.el.emit('triggersecond');
      }, 300);
    }
  });
  
  AFRAME.registerComponent('meteor', {
    init: function () {
      var fullMeteor = document.querySelector('#meteor-full');
      fullMeteor.setAttribute('animation', {enabled: true});
      // var barrels = document.querySelector('#meteor-inside_' + [i]);

      // setTimeout(function () {
      //   for (let i=0; i<14; i++){
      //     //check if y-index is less than -3.9?
      //   fullMeteor.removeChild(document.querySelector('#meteor-inside_' + [i]));
      //   document.querySelector('#meteor-inside_' + [i]).destroy();
      //   }
      // }, 5000);

      // let countX = 15;
      // let meteors = [];

      // for (let i=1; i<countX; i++){
      //   // let x = Math.random() * (0.5 - (-2)) + (-2);

      //     meteors[i] = document.createElement('a-entity'); // create the entity
      //     meteors[i].setAttribute('id', 'meteor-inside_'+i.toString());
      //     meteors[i].setAttribute('scale', {x: 0.2, y: 0.2, z: 0.2});
      //     meteors[i].setAttribute('geometry', 'primitive: sphere');
      //     // meteors[i].setAttribute('meteor', '');
      //     // meteors[i].setAttribute('gltf-model', '#oil_barrel');
      //     // meteors[i].setAttribute('rotation', {x: 90, y: 0, z: 0});

      //     // var timeRandomizer = (Math.random() * (50000 - 1000) + 1000);

        
          
      //     // meteors[i].setAttribute('animation', {property:'position', from: {x:x, y:y, z:-8}, to: {x:x, y:y, z:2}, loop:false, dur:9000, easing:'linear', enabled:true, delay: timeRandomizer});


      //     fullMeteor.appendChild(meteors[i]);// Append the element to the scene, so it becomes part of the DOM
      // }
      // let z = Math.random() * (-0.5 - (-5)) + (-5);


      // meteors[1].setAttribute('position', {x:2, y:0.2, z:z});    
      // meteors[2].setAttribute('position', {x:-2, y:-1, z:z});        
      // meteors[3].setAttribute('position', {x:-1, y:-0.8, z:0});
      // meteors[4].setAttribute('position', {x:2, y:-1, z:0.5});   
      // meteors[5].setAttribute('position', {x:1, y:-0.5, z:z});        
      // meteors[6].setAttribute('position', {x:4, y:-1, z:0});
      // meteors[7].setAttribute('position', {x:2, y:1, z:0.5});      
      // meteors[8].setAttribute('position', {x:2, y:-0.3, z:0.5});     
      // meteors[9].setAttribute('position', {x:3, y:1.02, z:0.5});  
      // meteors[10].setAttribute('position', {x:0.2, y:0, z:z}); 
      // meteors[11].setAttribute('position', {x:-0.1, y:1, z:z});     
      // meteors[12].setAttribute('position', {x:-0.5, y:1.1, z:0.5});     
      // meteors[13].setAttribute('position', {x:-1, y:0.1, z:z});     
      // meteors[14].setAttribute('position', {x:-2.3, y:1, z:0.5});      
          
  
      
      


      

    },

    tick: function () {
      var black_screen2 = document.querySelector('#black-screen-2');


      this.el.addEventListener('click', function() {
        console.log('test');
        // this.setAttribute('shape', 'none');
        // fullMeteor.setAttribute('animation', {enabled: false});
        this.setAttribute('animation', {property: 'position', to: {x:0, y:-4, z:-2}, dur: 2000, easing: 'linear', loop: 'false', enabled: 'true'});
      });

    //   setTimeout(function() {
    //     this.setAttribute('animation', {property: 'position', to: {x:0, y:-4, z:-2}, dur: 2000, easing: 'linear', loop: 'false', enabled: 'true'});
    // }, 5000);

    //   setTimeout(function() {
    //     black_screen2.style.display = 'block';
    // }, 20000);

  //   setTimeout(function() {
  //     black_screen2.style.display = 'none';
  // }, 24900);






    }  
  });

//   <a-entity animation__1="startEvents: triggerfirst" animation__2="startEvents: triggersecond" trigger>


// AFRAME.registerComponent('babyearth', {
//   init: function() {
//   }
// });
