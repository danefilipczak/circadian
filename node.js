bigNotes = [];
addNote = function(nn, time){
	var luv = new CorAnglais(ac);
	luv.play(nn-12, 0, time);
	// luv.stop(time);
	bigNotes.push(luv);
}

function Node(vec){
	this.force = new THREE.Vector3( );
	this.geometry = new THREE.SphereGeometry( 1.1, 24, 16 );
	this.material = new THREE.MeshPhongMaterial( {color: 'blue'} );
	this.material.transparent=true;
	this.material.opacity=0.618;
	//this.material.color = #adb6f9
	this.sphere = new THREE.Mesh( this.geometry, this.material );
	this.sphere.userData = this;
	this.sphere.position.x = vec.x;
	this.sphere.position.y = vec.y;
	this.sphere.position.z = vec.z;
	scene.add( this.sphere );
	this.linkedTo = [];
	this.lines = [];
	group.add(this.sphere);
	this.lifespan = lifespan+(Math.random()*1000);
	this.deathClock = this.lifespan;


	this.note = notes[Math.floor(Math.random() * notes.length)];
	keys[this.note].push('x');
	// if(loaded){bassoon.play(this.note, ac.currentTime, {loop: true, gain:1/keys[this.note].length, attack:1, duration:this.lifespan/60})};
	
	// this.playNote();
	
	// console.log(this.note);
	if(this.note<CorAnglais.prototype.range.low){
		this.i = new Bassoon(ac);
	} else {
		this.i = new CorAnglais(ac);
	}
	
	this.i.play(this.note-12, 0, this.lifespan/60);
	// this.i.stop(this.lifespan/60);

	//this.lines=[];
	// addNote(this.note, this.lifespan/60);


	//var line = new THREE.Line(geometry, material);
	



	if(wireframe){this.sphere.scale.x = 0.1;
		this.sphere.scale.y = 0.1;
		this.sphere.scale.z = 0.1;

		this.material.transparent = false;
	}
	


	//this.growMidpoint = 
		

}

// Node.prototype.playNote = function(){
// 	this.i = new CorAnglais(ac);
// 	this.i.play(this.note);
// 	this.i.stop(this.lifespan/60);
// }

Node.prototype.age = function(){
	// this.i.gain(Math.random())
	// this.i.pan((Math.random()*2)-1)
	this.deathClock--;
	if(this.deathClock<0){
		this.die();
	}
	var c = (1/this.lifespan) * this.deathClock;
	this.material.color.r = c;
	this.material.color.g = c;
	this.material.color.b = c;
	this.material.transparent = true;
	this.material.opacity = 1-c;
	// console.log(c)
}


Node.prototype.die = function(){
	// self = this;
	// this.i.stop();
	//first pick the closest connected node;
	var shortestD = 100;
	var closest;
	for(var i=0;i<this.linkedTo.length;i++){
		var distance = this.sphere.position.distanceTo(this.linkedTo[i].sphere.position);
		if(distance<shortestD){
			closest = this.linkedTo[i];
			shortestD = distance;
		}
	}

	//console.log(closest);
	//then linked up all the neighbors with that node as long as they're not connected already
	for(var i=0;i<this.linkedTo.length;i++){
		//this.linkedTo[i].makeLink(closest);
		if(closest.linkedTo.indexOf(this.linkedTo[i])<0 && closest!==this.linkedTo[i]){ //if they ain't already hitched
			closest.makeLink(this.linkedTo[i]);
			this.linkedTo[i].makeLink(closest);
			
		}
	}


	 this.breakAll();
	group.remove(this.sphere);
	scene.remove(this.sphere);
	var deathIndex = nodes.indexOf(this);
	nodes.splice(deathIndex, 1);
	keys[this.note].splice(0,1);
	somethingDied=true;
	kill(this);
}

Node.prototype.makeLink = function(node1){
	this.linkedTo.push(node1);
	//node1.linkedTo.push(this);
	var geometry = new THREE.Geometry();
	geometry.vertices.push(this.sphere.position);
	geometry.vertices.push(node1.sphere.position);
	var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
	material.opacity = 0;
	material.transparent=false;
	if(!wireframe){material.transparent = true};
	var line = new THREE.Line(geometry, material);
	scene.add(line);
	this.lines.push(line);
	group.add(line);

}

Node.prototype.breakLink = function(node){
	// for(var i = 0; i<this.linkedTo.length; i++){
	// 	if(this.linkedTo[i] === node){
	// 		this.linkedTo.splice(i, 1);
	// 		group.remove(this.lines[i])
	// 		scene.remove(this.lines[i]);
	// 		this.lines.splice(i, 1);
	// 	}
	// }
	var index = this.linkedTo.indexOf(node);
	this.linkedTo.splice(index, 1);
	group.remove(this.lines[index])
	scene.remove(this.lines[index]);
	this.lines.splice(index, 1);

}


Node.prototype.breakAll = function(){

	for(var i=0;i<this.linkedTo.length;i++){
		var node = this.linkedTo[i];
		node.breakLink(this);
		this.breakLink(node);
		i--;
	}
	
	for(i=0;i<this.lines.length;i++){
		group.remove(this.lines[i]);
		scene.remove(this.lines[i]);
		this.lines[i]=null;
	}
	this.lines = [];
	//this.linkedTo = [];

}




Node.prototype.addForce = function(forceVector) {
    this.force = this.force.add(forceVector);
}


Node.prototype.applyForce = function(){ 
	//this.force.normalize();
	//this.force.divideScalar(300);
    this.sphere.position.add(this.force);
    this.force = new THREE.Vector3( );
}


// line.geometry.vertices[ 0 ].x = circle.position.x;
//    line.geometry.verticesNeedUpdate = true;

Node.prototype.initializeLinks = function(){
	for(var i = 0; i<this.linkedTo.length;i++){
		var geometry = new THREE.Geometry();
		geometry.vertices.push(this.sphere.position);
		geometry.vertices.push(this.linkedTo[i].sphere.position);
		var material = new THREE.LineBasicMaterial({ color: '0x0000ff' });
		material.opacity = 0;
		material.transparent=false;
		if(!wireframe){material.transparent = true};
		var line = new THREE.Line(geometry, material);
		scene.add(line);
		this.lines.push(line);
		group.add(line);
		//this.makeLink(this.linkedTo[i]);


	}
}


Node.prototype.updateLinks = function(){
	for(var i=0;i<this.lines.length;i++){
		this.lines[i].geometry.vertices[0] = this.sphere.position;
		this.lines[i].geometry.vertices[1] = this.linkedTo[i].sphere.position;
		this.lines[i].geometry.verticesNeedUpdate = true;
		this.lines[i].material.color.set( 'white' );

	}
	

}

Node.prototype.growMidpoint = function(neighbor){
	if(nodes.length<maxSize){
		var iVec = new THREE.Vector3();
		iVec.copy(this.sphere.position);
		var jVec = new THREE.Vector3();
		jVec.copy(neighbor.sphere.position);


		

		// var jNode = nodes[i].linkedTo[j];
		// var iNode = nodes[i];
		this.breakLink(neighbor);
		neighbor.breakLink(this);

		var halfway = iVec.lerp(jVec, 0.5);
		var bud = new Node(halfway);

		
		var overlap = intersect(this.linkedTo, neighbor.linkedTo);
		for(var k = 0;k<overlap.length; k++){
			bud.makeLink(overlap[k]);
			overlap[k].makeLink(bud);
		}
		bud.makeLink(neighbor);
		bud.makeLink(this)
		neighbor.makeLink(bud);
		this.makeLink(bud);

		nodes.push(bud);
		
		// nodes.push(bud);
	}
}

//do you hear the horses//stamping on their semen in the dirt//sick and alert//
//do you taste the gases// drifting off the war machine at dawn// my friend, walk on


//they live in the sidewalk// they are like the flowers in the road// that never get old 
//never making differece// never meet an orchid or wasp///never feel lost// 
//always secure// always feeling sure they know the inside of their bodies from an other's skin. 
//don't let them in// nocturne begin// on black violins




