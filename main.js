//song cycle//girl gets harrased on subway, boy takes her hand says do you need something from my sister? she cries. they meet in the park and he tells her he's gay. she's broken up and turns into a wolf and eats him. 


//soo... cycle every max lifespan. every other cycle should be just 

var tomes = [];
var keys;
var triad;
var pause = false;
var forceScalar = 0.1;
var metaMult = 0.3;
var rThresh = 5.5,
	rForce = -0.9 * forceScalar * metaMult;
	sThresh = 2.5,
  maxSize = 77,//77
  aThresh = 1;
  aForce = 0.1 * metaMult* forceScalar;
  pForce = 0.011 * metaMult* forceScalar,
  dForce = 0.0221* metaMult,
  distance = 2.1;
  rotate=true,
  lifespan = 300,
  somethingDied=false,
  loaded=false;
  forceMult = 1;
  split = true;
  ageing = true;
  wireframe = true;
  var bassoon;
  var notes = [];
  var geom;
  var stage = 0;
  var clock;
  var ballrolling = false;
  var targetCameraZ = 5;
  var cameraEasing = 0.005;
  var selected = [];

  var nodes = [];
  var anchors = [];

ac = new AudioContext();


var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
raycaster.linePrecision = 0.0;


var imagePrefix = "textures/forest-skyboxes/plants/";
  var directions  = ["posx", "negx", "posy", "negy", "posz", "negz"];
  var imageSuffix = ".jpg";
  var sides = 100;
  var skyGeometry = new THREE.BoxGeometry( sides, sides, sides ); 
  var loader = new THREE.TextureLoader();

  var materialArray = [];
  for (var i = 0; i < 6; i++)
    materialArray.push( new THREE.MeshBasicMaterial({
      map: loader.load( imagePrefix + directions[i] + imageSuffix ),
      side: THREE.BackSide
    }));
  var skyMaterial = new THREE.MultiMaterial( materialArray );
  // var skyMaterial = new THREE.MeshPhongMaterial( {color:'black'} );
  // skyMaterial.side = THREE.BackSide;
  var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );

function onMouseMove( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}





function onClick( event ){

  for(var i =0; i<selected.length;i++){
    if(selected[i].object.userData instanceof Node){
      selected[i].object.userData.die();
    }
  }
  console.log('clickyo')

}

window.addEventListener( 'mousemove', onMouseMove, false );
document.addEventListener( 'click', onClick);

document.onkeypress=function(e){
 var e=window.event || e
 //alert("CharCode value: "+e.charCode)
 if(e.charCode == 32){
  if(!pause){pause = true;
    }else{
    pause=false;
    render();
  }
 } else if (e.charCode == 72){
  var hull = makeHull();
 }  else if (e.charCode == 67){
  console.log('sup')
  var craZ = makeCraZ();
 }
}


function makeHull(){

    var hullMaterial = new THREE.MeshPhongMaterial( {
          //color: 0xffffff,
          opacity: 0.5,
          transparent: true
        } );

    var verts = [];
    for(var i=0;i<nodes.length;i++){
      verts.push(nodes[i].sphere.position);
    }
    var hullGeom = new THREE.ConvexGeometry(verts);
    var hullMesh = new THREE.Mesh( hullGeom, hullMaterial );
    //hullMesh.material.side = THREE.BackSide; // back faces
    //hullMesh.renderOrder = 0;
    tomes.push(hullMesh)
    scene.add( hullMesh );
    group.add(hullMesh)
    // mesh = new THREE.Mesh( meshGeometry, meshMaterial.clone() );
    // mesh.material.side = THREE.FrontSide; // front faces
    // mesh.renderOrder = 1;
    // group.add( mesh );

    return hullMesh;
}


function makeCraZ(){
  var geometry = new THREE.Geometry();
  var points = [];
    for(var i=0;i<nodes.length;i++){
      points.push(nodes[i].sphere.position);
    }

  for (var i = 0; i < points.length; i++) {
    if (points[i + 2]) { // make sure I am not out of array's range

      var v0 = new THREE.Vector3(
        points[i].x,
        points[i].y,
        points[i].z
      );
      var v1 = new THREE.Vector3(
        points[i + 1].x,
        points[i + 1].y,
        points[i + 1].z
      );
      var v2 = new THREE.Vector3(
        points[i + 2].x,
        points[i + 2].y,
        points[i + 2].z
      );

      var face = new THREE.Face3(
        geometry.vertices.push(v0) - 1,
        geometry.vertices.push(v1) - 1,
        geometry.vertices.push(v2) - 1 
      );
      geometry.faces.push(face);
    }
  }

  // console.log(geometry);
  var bufferGeometry = new THREE.BufferGeometry;
  bufferGeometry.fromGeometry(geometry);
  var object = new THREE.Mesh(bufferGeometry);
   object.material.side = THREE.BackSide;
   object.material.transparent = true;
   object.material.opacity = 0.9;
  scene.add(object);
  tomes.push(object);
  group.add(object);
  return object;
}



window.onload = function(){
  tuna = new Tuna(ac);

  delay = new tuna.Delay({
    feedback: 0.7,    //0 to 1+
    delayTime: 150,    //1 to 10000 milliseconds
    wetLevel: 1,    //0 to 1+
    dryLevel: 1,       //0 to 1+
    cutoff: 2000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
    bypass: 0
  });



  delay.connect(ac.destination);
  geom=Box(group);


   keys = new Array(128)
  

  for(var i=0;i<keys.length;i++){
    keys[i] = [];
  }
  console.log(keys);

  Soundfont.instrument(ac, 'bassoon').then(function (player) {
    bassoon = player;
    
    bassoon.connect(delay);
    loaded = true;
    
    // makeZygote();
  });
  // loaded = true;

  // //initialize notes
  // makeSpectrum(21);
  triad = new Triad();
  notes = triad.notes;

  var geometry = new THREE.BoxGeometry( 1, 3.5, 1 );
  var material = new THREE.MeshPhongMaterial( {color: 'white'} );
  var pedestal = new THREE.Mesh( geometry, material );
  pedestal.position.y-=4.5;
  scene.add( pedestal );

  var side = 30;
  var geometry = new THREE.BoxGeometry( side, 0.5,  side);
  var material = new THREE.MeshPhongMaterial( {color: '#464f1b'} );
  material.transparent = true;
  material.opacity = 0.7;
  var floor = new THREE.Mesh( geometry, material );
  var offset = 6.5;
  floor.position.y-=offset;
  scene.add( floor );

  var geometry = new THREE.BoxGeometry( 0.5, side/4,  side);
  var northwall = new THREE.Mesh( geometry, material );
  northwall.position.x=side/2;
  northwall.position.y+=offset/2;
  scene.add(northwall)

  var geometry = new THREE.BoxGeometry( 0.5, side/4,  side);
  var southwall = new THREE.Mesh( geometry, material );
  southwall.position.x=-side/2;
  southwall.position.y+=offset/2;
  scene.add(southwall)

  var geometry = new THREE.BoxGeometry( side, side/4,  0.5);
  var eastwall = new THREE.Mesh( geometry, material );
  eastwall.position.z=side/2;
  eastwall.position.y+=offset/2;
  scene.add(eastwall)


  var geometry = new THREE.BoxGeometry( side, side/4,  0.5);
  var westwall = new THREE.Mesh( geometry, material );
  westwall.position.z=-side/2;
  westwall.position.y+=offset/2;
  scene.add(westwall)


  scene.add( skyBox );


  makeZygote();
  orbit = new THREE.OrbitControls(camera);




 clock = setInterval(cycle, lifespan/60*1000)

 
}


var zygote = new THREE.IcosahedronGeometry( 1, 0 );


function cycle(){
  stage++;
  stage=stage%3;
  //console.log(stage)
  switch(stage){
    case 0:
      stage0();
      break;
    case 1:
      stage1();
      break;
    case 2:
      stage2();
      break;
    
  }
}

function stage0(){
  //restrict voiceing 
  notes = triad.notes;
  console.log(0);
}

function stage1(){
  //push triad
  triad.transform();
  notes = triad.notes;
  console.log(1);
}

function stage2(){
  //expand voicing
  notes = expandVoicing(triad.notes);
  console.log(2);
}


function expandVoicing(triadArray){
  //which inversion is it to be?
  var inversion = roulette(3);
  var expansion = triadArray;
  switch(inversion){
    case 1: //root position 
      expansion.splice(0, 0, triadArray[0]-24);
      expansion.splice(1, 0, triadArray[1]-12);
      expansion.splice(2, 0, triadArray[2]-12);

      expansion.push(triadArray[0]+48, triadArray[2]+48);
      break;
    case 2: //first inversion 
      expansion.splice(0, 0, triadArray[1]-24);
      expansion.splice(1, 0, triadArray[0]-12);
      expansion.splice(2, 0, triadArray[2]-12);
      expansion.push(triadArray[0]+48, triadArray[2]+48);
      break;
    case 3: //second inversion 
      expansion.splice(0, 0, triadArray[2]-24);

      expansion.splice(1, 0, triadArray[0]-12);
      expansion.splice(2, 0, triadArray[1]-12);
      expansion.push(triadArray[0]+48, triadArray[2]+48);
      break;
  }

  return expansion;
}

 
function makeSpectrum(root){
  for(var i=21; i<109; i+= 7){
    var note = i.toString();
    notes.push(note);
  }
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
//camera.position.z = 20




var group = new THREE.Group();

scene.add(group);





// var nodes= [];
// for(var i = 0; i<10; i++){
// 
// }



function makeZygote(){
  for(var i=0; i<zygote.vertices.length; i++){
  //console.log(zygote.vertices[i])
  var skew = 0;
  var iVec = new THREE.Vector3();
  iVec.copy(zygote.vertices[i]);  
  var vec = new THREE.Vector3((Math.random()-0.5)*skew, (Math.random()-0.5)*skew, (Math.random()-0.5)*skew);
  vec.add(iVec);
  nodes[i] = new Node(vec);
  //group.add(nodes[i].sphere);

}


var geomThresh = 1.5;

for (var i = 0; i < nodes.length; i++) {
      for (var j = 0; j < nodes.length; j++) {
        if(i!==j){
        var iVec = new THREE.Vector3();
        iVec.copy(nodes[i].sphere.position);
        var jVec = new THREE.Vector3();
        jVec.copy(nodes[j].sphere.position);
        if(jVec.distanceTo(iVec)<geomThresh){
          nodes[j].linkedTo.push(nodes[i]);
          //nodes[i].linkedTo.push(nodes[j]);
      }
      }
    }
 }

for(var i=0;i<nodes.length;i++){
    nodes[i].initializeLinks();
 }


 split = true;
 var life = 10000*(9*Math.random()); //how long with the organism live? 
 console.log(life);
 setTimeout(senescence, life);
}

function senescence(){
  split = false;
}


var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.618 );
light.position.z = 5;
light.position.x = 5*0.618;
scene.add( light );


// var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
// scene.add( directionalLight );
// var ambientLight = new THREE.AmbientLight( 0xffffff, 0.1 );
// scene.add( ambientLight );
scene.background = new THREE.Color( 'white' );



// geometry = new THREE.SphereGeometry( 1, 24, 16 );
// material = new THREE.MeshNormalMaterial( { } );
// sphere = new THREE.Mesh( geometry, material );
// scene.add( sphere );

// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshNormalMaterial( {  } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 5;


// function rejectAll(n, rForce, rThresh){
//    for (var i = 0; i < n.length; i++) {
//       for (var j = 0; j < n.length; j++) {
//         if (i !== j) {
//         if(n[j].sphere.position.distanceTo(n[i].sphere.position)<rThresh){
//            var force = n[i].sphere.position.sub(n[j].sphere.position);
//            //console.log(force.normalize());
//            force.normalize();

//            force.multiplyScalar(rForce);
//           n[i].addForce(force);
//         }
//       }
//     }
//   }
// }


function toggleBlob(){
  nodes.forEach(function(n){
    n.material.transparent=true;
    n.sphere.scale.x = 1;
    n.sphere.scale.y = 1;
    n.sphere.scale.z = 1;
    n.lines.forEach(function(l){
      l.material.transparent=true;
    })
    

  });
  //camera.position.z=10;
  wireframe=false;
}

function toggleWireframe(){
  nodes.forEach(function(n){
    n.material.transparent=false;
     n.sphere.scale.x = 0.1;
    n.sphere.scale.y = 0.1;
    n.sphere.scale.z = 0.1;
    n.lines.forEach(function(l){
      l.material.transparent=false;
    })
    
  })
  //camera.position.z=5;
  wireframe=true;
}


function kill(node){
  node = null;
}


function rejectAll(rThresh, rForce){
   for (var i = 0; i < nodes.length-1; i++) {
      for (var j = i+1; j < nodes.length; j++) {
      	if(i!==j){
      	var iVec = new THREE.Vector3();
      	iVec.copy(nodes[i].sphere.position);
      	var jVec = new THREE.Vector3();
      	jVec.copy(nodes[j].sphere.position);
        if(jVec.distanceTo(iVec)<rThresh){
        	var forceVector = jVec.sub(iVec);
          forceVector.normalize();
          forceVector.multiplyScalar(rForce/nodes.length);
          nodes[i].addForce(forceVector);
          nodes[j].addForce(forceVector.multiplyScalar(-1));
      	}
      }
    }
  }
}



function attractNeighbors(aThresh, aForce){
   for (var i = 0; i < nodes.length; i++) {
      for (var j = 0; j < nodes[i].linkedTo.length; j++) {
        var iVec = new THREE.Vector3();
        iVec.copy(nodes[i].sphere.position);
        var jVec = new THREE.Vector3();
        jVec.copy(nodes[i].linkedTo[j].sphere.position);
        if(jVec.distanceTo(iVec)>aThresh){
          var forceVector = jVec.sub(iVec);
          forceVector.normalize();
          forceVector.multiplyScalar(aForce);
          nodes[i].addForce(forceVector);
          //nodes[j].addForce(forceVector.multiplyScalar(-1));
        }
    }
  }
}



function maintainDistance(dForce, distance){
   for (var i = 0; i < nodes.length; i++) {
      for (var j = 0; j < nodes[i].linkedTo.length; j++) {
        var iVec = new THREE.Vector3();
        iVec.copy(nodes[i].sphere.position);
        var jVec = new THREE.Vector3();
        jVec.copy(nodes[i].linkedTo[j].sphere.position);
        var forceVector = jVec.sub(iVec);
        forceVector.normalize();
        if(iVec.distanceTo(jVec)>distance){
          
          forceVector.multiplyScalar(dForce);
        } else if (iVec.distanceTo(jVec)<distance){
          forceVector.multiplyScalar(dForce*-1);
        }
        //var forceVector = jVec.sub(iVec);
        
        nodes[i].addForce(forceVector);
          //nodes[j].addForce(forceVector.multiplyScalar(-1));
        
    }
  }
}


function localAverage(pForce){
   for (var i = 0; i < nodes.length; i++) {
      var iVec = new THREE.Vector3();
      iVec.copy(nodes[i].sphere.position);
      var total = new THREE.Vector3();
      total.add(iVec);
      //total.normalize();
      for (var j = 0; j < nodes[i].linkedTo.length; j++) {
        var jVec = new THREE.Vector3();
        jVec.copy(nodes[i].linkedTo[j].sphere.position);
        //jVec.normalize();
        total.add(jVec);
        
        //nodes[j].addForce(forceVector.multiplyScalar(-1));
        
      
      }
      //total.normalize();
      total.multiplyScalar(1/(nodes[i].linkedTo.length+1));
      var forceVector = jVec.sub(iVec);
      forceVector.normalize();
      forceVector.multiplyScalar(pForce);
      nodes[i].addForce(forceVector);
      // for(var j = 0; j<nodes[i].linkedTo.length;j++){
      //   nodes[i].linkedTo[j].addForce(total);
      // }
  }
}





function findCommonNodes(node1, node2){
	for(var i = 0; i<node1.linkedTo.length; i++){

	}
}


function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    })
    .filter(function (e, i, c) { // extra step to remove duplicates
        return c.indexOf(e) === i;
    });
}

function edgeSplit(sThresh){
	for(var i=0; i<nodes.length;i++){
		for(var j=0; j<nodes[i].linkedTo.length;j++){
			if(nodes[i].sphere.position.distanceTo(nodes[i].linkedTo[j].sphere.position)>sThresh){
				
				nodes[i].growMidpoint(nodes[i].linkedTo[j]);


			}
		}
	}
}





// for(var i=0;i<nodes.length;i++){
// 		nodes[i].linkedTo.push(nodes[1]);
// }

function Box(object3D) { //this will give you total geometry of the organism if passed group
    var box = null;
    object3D.traverse(function (obj3D) {
        var geometry = obj3D.geometry;
        if (geometry === undefined) return;
        geometry.computeBoundingBox();
        if (box === null) {
            box = geometry.boundingBox;
        } else {
            box.union(geometry.boundingBox);
        }
    });
    return box;
}
function calculateGeom(){
  geom=Box(group);

 objectSize = geom.max.z-geom.min.z;


  // Convert camera fov degrees to radians
  var fov = camera.fov * ( Math.PI / 180 ); 

// Calculate the camera distance
  var distance = Math.abs( objectSize / Math.sin( fov / 2 ) );
  //console.log(distance);
  //camera.position.z = distance*0.5;
  targetCameraZ = distance * 0.5;
}

var geomCycle = setInterval(calculateGeom, 5000);


//console.log(getCompoundBoundingBox(group))
