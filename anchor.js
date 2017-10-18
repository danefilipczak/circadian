function Anchor(vec){
	this.force = new THREE.Vector3( );
	this.geometry = new THREE.SphereGeometry( 1.1, 24, 16 );
	this.material = new THREE.MeshPhongMaterial( {color: 'blue'} );
	this.material.transparent=true;
	this.material.opacity=0.312;
	//this.material.color = #adb6f9
	this.sphere = new THREE.Mesh( this.geometry, this.material );
	this.sphere.userData = this;
	this.sphere.position.x = vec.x;
	this.sphere.position.y = vec.y;
	this.sphere.position.z = vec.z;
	scene.add( this.sphere );
	// this.linkedTo = [];
	// this.lines = [];
	// group.add(this.sphere);
	// this.lifespan = lifespan+(Math.random()*1000);
	// this.deathClock = this.lifespan;


	// this.note = notes[Math.floor(Math.random() * notes.length)];
	// keys[this.note].push('x');
	// if(loaded){bassoon.play(this.note, ac.currentTime, {loop: true, gain:1/keys[this.note].length, attack:1, duration:this.lifespan/60})};


	//this.lines=[];


	//var line = new THREE.Line(geometry, material);
	



	// if(wireframe){this.sphere.scale.x = 0.1;
	// 	this.sphere.scale.y = 0.1;
	// 	this.sphere.scale.z = 0.1;

	// 	this.material.transparent = false;
	// }
	


	//this.growMidpoint = 
		

}