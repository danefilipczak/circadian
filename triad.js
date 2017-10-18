function Triad(){
	this.notes = [];
	this.quality = 'm';
	//tones are defined by their position in the array: 0 = root 1 = third 2 = fifth
	this.tones = [{pitch:60, degree:1}, {pitch:63, degree:3}, {pitch:67, degree:5}];

	for(var i = 0; i<this.tones.length; i ++){
		this.notes.push(this.tones[i].pitch);
	}

	this.invert = function(degree){
		//degree is which step must now become the root, aka [0] in the array
		var temp;
		if(degree == 5){
			//store the fifth
			temp = this.tones[2];
			//remove the fifth
			this.tones.splice(2, 1);
			//put the fifth on the front(it's now the root)
			this.tones.splice(0, 0, temp);
		} else if (degree == 3){
			//store the root
			temp = this.tones[0];
			//remove the root
			this.tones.splice(0, 1);
			//put the root on the end(it's now the fifth and the third's the root)
			this.tones.push(temp);
		}
	}



	this.transform = function(){
		var swerve;
		switch(this.quality){
			case 'M':
				//lowerH(this.tones[0]);
				swerve = roulette(7);
				switch(swerve){
					case 1:
						raiseH(this.tones[0]);
						this.quality = 'd';
						break;
					case 2:
						raiseH(this.tones[1]);
						this.quality = 'sus4';
						break;
					case 3:
						raiseH(this.tones[2]);
						this.quality = 'A';
						break;
					case 4:
						raiseW(this.tones[2]); 
						this.invert(5);
						this.quality = 'm';
						break;
					case 5:
						lowerH(this.tones[0]);
						this.invert(3);
						this.quality = 'm'; 
						break;
					case 6:
						lowerW(this.tones[0]);
						this.invert(3);
						this.quality = 'd';
						break;
					case 7:
						lowerH(this.tones[2]);
						this.quality = 'Mb5'
						break;

				}

				break;
			case 'm':
				swerve = roulette(6);
				switch(swerve){
					case 1:
						raiseW(this.tones[1]);
						this.quality = 'sus4';
						break;
					case 2:
						raiseH(this.tones[2]);
						this.invert(5);
						this.quality = 'M';
						break;
					case 3:
						raiseW(this.tones[2]);
						this.invert(5);
						this.quality = 'd';
						break;
					case 4:
						lowerH(this.tones[0]);
						this.quality = 'A';
						break;
					case 5:
						lowerW(this.tones[0]);
						this.invert(3)
						this.quality = 'M';
						break;
					case 6:
						lowerH(this.tones[2]);
						this.quality = 'd';
						break;
				}
				break;
			case 'd':
				swerve = roulette(4);
				switch(swerve){
					case 1:
						raiseH(this.tones[2]);
						this.quality = 'm';
						break;
					case 2:
						raiseW(this.tones[2]);
						this.invert(5);
						this.quality = 'M';
						break;
					case 3:
						lowerH(this.tones[0]);
						this.quality = 'M';
						break;
					case 4:
						lowerW(this.tones[0]);
						this.invert(3);
						this.quality = 'm';
						break;
				}
				break;
			case 'A':
				swerve = roulette(6);
				switch(swerve){
					case 1:
						raiseH(this.tones[0]);
						this.quality = 'm';
						break;
					case 2:
						raiseH(this.tones[1]);
						this.invert(3);
						this.quality = 'm';
						break;
					case 3:
						raiseH(this.tones[2]);
						this.invert(5);
						this.quality = 'm';
						break;
					case 4:
						lowerH(this.tones[0]);
						this.invert(3);
						this.quality = 'M';
						break;
					case 5:
						lowerH(this.tones[1]);
						this.invert(5);
						this.quality = 'M';
						break;
					case 6:
						lowerH(this.tones[2]);
						this.quality = 'M';
						break;
				}
				break;
			case 'Mb5':
				swerve = roulette(3);
				switch(swerve){
					case 1:
						raiseH(this.tones[2]);
						this.quality = 'M';
						break;
					case 2:
						raiseW(this.tones[2]);
						this.quality = 'A';
						break;
					case 3:
						lowerH(this.tones[0]);
						this.quality = 'sus4';
						break;
				}
				break;
			case 'sus4':
				swerve = roulette(5);
				switch(swerve){
					case 1:
						raiseH(this.tones[0]);
						this.quality = 'Mb5';
						break;
					case 2:
						raiseH(this.tones[2]);
						this.invert(3);
						this.quality = 'm';
						break;
					case 3:
						raiseW(this.tones[2]);
						this.invert(3);
						this.quality = 'M';
						break;
					case 4:
						lowerH(this.tones[1]);
						this.quality = 'M';
						break;
					case 5:
						lowerW(this.tones[1]);
						this.quality = 'm';
						break;
				}
				break;

		}


		this.notes=[];
		for(var i = 0; i<this.tones.length; i ++){
			this.notes.push(this.tones[i].pitch);
		}
	}



}

function lowerH(tone){
	tone.pitch --;
	tone.pitch = normalize(tone.pitch);
}

function lowerW(tone){
	tone.pitch -= 2;
	tone.pitch = normalize(tone.pitch);
}

function raiseH(tone){
	tone.pitch ++;
	tone.pitch = normalize(tone.pitch);
}

function raiseW(tone){
	tone.pitch += 2;
	tone.pitch = normalize(tone.pitch);
}


function normalize(pitch){
	//put everything within the central octave
	var newPitch;
	if(pitch<60){
		newPitch = pitch+12;
	} else if(pitch>72){
		newPitch = pitch-12;
	} else {
		newPitch = pitch;
	}
	return newPitch;
}

function roulette(range){
	var select = Math.ceil(Math.random()*range);
	return select;
}