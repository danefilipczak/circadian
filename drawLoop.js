//she was very fragile and small. she smiled a lot but her body was soft and squishy, and had fat around her belly. her brain came back - - - it just recovered and regrew


function draw() {

  if (nodes.length > 1) {
    if (nodes.length < maxSize) {
      ballrolling = true;



      if (split) {
        edgeSplit(sThresh);
      }
      forceMult = 1;



      localAverage(pForce * forceMult);
      rejectAll(rThresh, rForce * forceMult);
      maintainDistance(dForce * forceMult, distance);


      //
      somethingDied = false;
    } else {

      //if(forceMult>0){forceMult-=0.01}
      if (forceMult > 0) {
        forceMult -= 0.005
      }
      if (forceMult < 0) {
        forceMult = 0
      }
      attractNeighbors(aThresh, aForce * 0.5);
      rejectAll(rThresh, rForce * 0.5 * 0.5);
    }

  } else if (ballrolling) { //new orgamisn 
    var anchor = new Anchor(nodes[0].sphere.position);
    anchors.push(anchor);
    tomes.push(anchor.sphere);
    nodes[0].die();
    makeZygote();
  }



  //localAverage(pForce*forceMult);



  for (var i = 0; i < nodes.length; i++) {
    nodes[i].applyForce();
    nodes[i].updateLinks();
    if (ageing) {
      nodes[i].age()
    };
  }


  //camera math

  // var dcz = targetCameraZ - camera.position.z;
  // camera.position.z += dcz * cameraEasing;


  //camera.position.z = 5;


  tomes.forEach(function(t){
    // t.scale.multiplyScalar(1.1);
    t.position.y+=0.0075;
  })


  if (rotate) {
    group.rotation.y += 0.003
  };


  // update the picking ray with the camera and mouse position
  // raycaster.setFromCamera( mouse, camera );

  // calculate objects intersecting the picking ray
  // selected = raycaster.intersectObjects( scene.children, true );
  // //console.log(intersects[0].userData);

  // for ( var i = 0; i < selected.length; i++ ) {
  //   console.log(selected[i].object.userData);
  //   if(selected[i].object.userData instanceof Node){
  //     selected[ i ].object.material.color.set( "yellow" );
  //     //console.log(intersects[i].object.userData);
  //   }

  // }

  //group.position.y = 0;
}