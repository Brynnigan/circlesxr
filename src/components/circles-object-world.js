'use strict';

AFRAME.registerComponent('circles-object-world', {
schema: {
    object_world:      {type: 'string',    default:'rgb(255,255,255)'},
    pickedup:          {type: 'bool',    default:'false'}
    },
  init: function() {
    const Context_AF    = this;
    const object_world  = this.data.object_world; //refers to world the object originates from

    Context_AF.el.addEventListener(CIRCLES.EVENTS.INSPECT_THIS_OBJECT, function (evt) {
        console.log("Event: CIRCLES.EVENTS.INSPECT_THIS_OBJECT");
        Context_AF.el.setAttribute('circles-object-world', {pickedup:true}); //want visible in all worlds so we can "share" what we are lookinhg at
    });

    Context_AF.el.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, function (evt) {
        console.log("Event: CIRCLES.EVENTS.RELEASE_THIS_OBJECT");
        Context_AF.el.setAttribute('circles-object-world', {pickedup:false});
    });
  },
  update: function(oldData) {
    const Context_AF    = this;
    const data          = this.data;
    const object_world  = data.object_world; //refers to world the object originates from
    const pickedUp      = data.pickedup; //refers to world the object originates from

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    //model change
    if ( (oldData.pickedup !== data.pickedup) && (data.pickedup !== '') ) {
        if ( pickedUp ) {
            if ( window.circles_curr_world !== object_world ) {
                Context_AF.el.setAttribute('visible', true);
            }
        }
        else {
            if ( window.circles_curr_world !== object_world ) {
                Context_AF.el.setAttribute('visible', false);
            }
        }
    }
  }
});