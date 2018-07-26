$(document).ready(function () {
  //your code here

	//http://stackoverflow.com/questions/23687635/how-to-stop-audio-in-an-iframe-using-web-audio-api-after-hiding-its-container-di
	(function(){
		var log = console.log.bind(console), keyData = document.getElementById('key_data'),
				deviceInfoInputs = document.getElementById('inputs'), deviceInfoOutputs = document.getElementById('outputs'), midi;
		//var AudioContext = AudioContext || webkitAudioContext; // for ios/safari
		var context = new AudioContext();
		var activeNotes = [];
		var btnBox = document.getElementById('content'), btn = document.getElementsByClassName('button');
		var data, cmd, channel, type, note, velocity;

		// request MIDI access
		if(navigator.requestMIDIAccess){
			navigator.requestMIDIAccess({sysex: false}).then(onMIDISuccess, onMIDIFailure);
		}
		else {
			alert("No MIDI support in your browser.");
		}

		// add event listeners
		document.addEventListener('keydown', keyController);
		document.addEventListener('keyup', keyController);
		for(var i = 0; i < btn.length; i++){
			btn[i].addEventListener('mousedown', clickPlayOn);
			btn[i].addEventListener('mouseup', clickPlayOff);
		}
		// prepare audio files
		for(var i = 0; i < btn.length; i++){
			addAudioProperties(btn[i]);
		}

		var sampleMap = {
			key60: 1,
			key61: 2,
			key62: 3,
			key63: 4,
			key64: 5
		};
		// user interaction
		function clickPlayOn(e){
			e.target.classList.add('active');
			e.target.play();

			console.log(e.target.getAttribute("data-key"));
			switch (e.target.getAttribute("data-key")) {
				case 'q':
					$("#model").load("./models/steple-maker/index.html");
					break;
				case 'w':
					$("#model").load("./models/strategy/drift.html");
					break;
				case 'e':
					$("#model").load("./models/strategy/hazards.html");
					break;
				case 'r':
					$("#model").load("./models/strategy/ghoshal.html");
					break;
				case 't':
					$("#model").load("./models/strategy/qfd.html");
					break;
			}
		}

		function clickPlayOff(e){
			e.target.classList.remove('active');
		}

		function keyController(e){
			if(e.type == "keydown"){
				switch(e.keyCode){
					case 61:
						btn[0].classList.add('active');
						btn[0].play();
						break;
					case 87:
						btn[1].classList.add('active');
						btn[1].play();
						break;
					case 69:
						btn[2].classList.add('active');
						btn[2].play();
						break;
					case 82:
						btn[3].classList.add('active');
						btn[3].play();
						break;
					case 84:
						btn[4].classList.add('active');
						btn[4].play();
						break;
					default:
						//console.log(e);
				}
			}
			else if(e.type == "keyup"){
				switch(e.keyCode){
					case 81:
						btn[0].classList.remove('active');
						break;
					case 87:
						btn[1].classList.remove('active');
						break;
					case 69:
						btn[2].classList.remove('active');
						break;
					case 82:
						btn[3].classList.remove('active');
						break;
					case 84:
						btn[4].classList.remove('active');
						break;
					default:
						//console.log(e.keyCode);
				}
			}
		}

		// midi functions
		function onMIDISuccess(midiAccess){
			midi = midiAccess;
			var inputs = midi.inputs.values();
			// loop through all inputs
			for(var input = inputs.next(); input && !input.done; input = inputs.next()){
				// listen for midi messages
				input.value.onmidimessage = onMIDIMessage;

				listInputs(input);
			}
			// listen for connect/disconnect message
			midi.onstatechange = onStateChange;

			showMIDIPorts(midi);
		}

		function onMIDIMessage(event){
			data = event.data,
			cmd = data[0] >> 4,
			channel = data[0] & 0xf,
			type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
			note = data[1],
			velocity = data[2];
			// with pressure and tilt off
			// note off: 128, cmd: 8
			// note on: 144, cmd: 9
			// pressure / tilt on
			// pressure: 176, cmd 11:
			// bend: 224, cmd: 14
			// log('MIDI data', data);
			switch(type){
				case 144: // noteOn message
					noteOn(note, velocity);
					break;
				case 128: // noteOff message
					noteOff(note, velocity);
					break;
				case 176: // turn a dial on the APC
					changeADSR(note, velocity);
					break;
			}

			//log('data', data, 'cmd', cmd, 'channel', channel);
			logger(keyData, 'key data', data);
		}
		
		function changeADSR(note, velocity) {
			switch (note) {
				case 48:
					x2 = map(velocity, 0, 127, 0, width/4);
					break;
				case 49:
					x3 = map(velocity, 0, 127, 0, width/2);
					break;
				case 50:
					y4 = map(velocity, 127, 0, 0, 200);
					break;
				case 51:
					let cust_val = map(velocity, 0, 127, 0, 190);
					box_cust.update(x5 + 10 + cust_val);
					break;
				case 52:
					let strat_val = map(velocity, 0, 127, 0, 190);
					box_strat.update(x5 + 10 + strat_val);
					break;
				case 53:
					let ops_val = map(velocity, 0, 127, 0, 190);
					box_ops.update(x5 + 10 + ops_val);
					break;
				case 54:
					let team_val = map(velocity, 0, 127, 0, 190);
					box_team.update(x5 + 10 + team_val);
					break;
				case 55:
					let self_val = map(velocity, 0, 127, 0, 190);
					box_person.update(x5 + 10 + self_val);
					break;
			}
		}

		function onStateChange(event){
			showMIDIPorts(midi);
			var port = event.port, state = port.state, name = port.name, type = port.type;
			if(type == "input")
				log("name", name, "port", port, "state", state);

		}

		function listInputs(inputs){
			var input = inputs.value;
				log("Input port : [ type:'" + input.type + "' id: '" + input.id +
						"' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
						"' version: '" + input.version + "']");
		}

		function noteOn(midiNote, velocity){
			player(midiNote, velocity);
			///
			switch(midiNote) {
				case 36:
					$("#model").load("./models/steple-maker/index.html");
					break;
				case 37:
					$("#model").load("./models/strategy/drift.html");
					break;	
				case 38:
					$("#model").load("./models/strategy/hazards.html");
					break;
				case 39:
					$("#model").load("./models/strategy/creative.html");
					break;
				case 40:
					$("#model").load("./models/strategy/culture.html");
					break;	
				case 41:
					$("#model").load("./models/strategy/rational.html");
					break;
				case 42:
					$("#model").load("./models/strategy/plan.html");
					break;
				case 43:
					$("#model").load("./models/strategy/structure.html");
					break;	
				case 44:
					$("#model").load("./models/strategy/control.html");
					break;
				case 45:
					$("#model").load("./models/strategy/absorb.html");
					break;
				case 46:
					$("#model").load("./models/strategy/impact.html");
					break;	
				case 47:
					$("#model").load("./models/strategy/refelct.html");
					break;
				
				
				
				
					case 61:
					$("#model").load("./models/strategy/drift.html");
					break;
				case 62:
					$("#model").load("./models/strategy/hazards.html");
					break;
				case 63:
					$("#model").load("./models/strategy/ghoshal.html");
					break;
				case 64:
					$("#model").load("./models/strategy/qfd.html");
					break;
				}
				///
		}

		function noteOff(midiNote, velocity){
			player(midiNote, velocity);
		}

		function player(note, velocity){
			var sample = sampleMap['key'+note];
			if(sample){
				if(type == (0x80 & 0xf0) || velocity == 0){ //needs to be fixed for QuNexus, which always returns 144
					// btn[sample - 1].classList.remove('active');
					return;
				}
				// btn[sample - 1].classList.add('active');
				btn[sample - 1].play(velocity);
			}
		}

		function onMIDIFailure(e){
			log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
		}

		// MIDI utility functions
		function showMIDIPorts(midiAccess){
			var inputs = midiAccess.inputs,
					outputs = midiAccess.outputs,
					html;
			html = '<h4>MIDI Inputs:</h4><div class="info">';
			inputs.forEach(function(port){
				html += '<p>' + port.name + '<p>';
				html += '<p class="small">connection: ' + port.connection + '</p>';
				html += '<p class="small">state: ' + port.state + '</p>';
				html += '<p class="small">manufacturer: ' + port.manufacturer + '</p>';
				if(port.version){
					html += '<p class="small">version: ' + port.version + '</p>';
				}
			});
			// deviceInfoInputs.innerHTML = html + '</div>';

			html = '<h4>MIDI Outputs:</h4><div class="info">';
			outputs.forEach(function(port){
				html += '<p>' + port.name + '<br>';
				html += '<p class="small">manufacturer: ' + port.manufacturer + '</p>';
				if(port.version){
					html += '<p class="small">version: ' + port.version + '</p>';
				}
			});
			// deviceInfoOutputs.innerHTML = html + '</div>';
		}

		// audio functions
		function loadAudio(object, url){
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			request.onload = function(){
				context.decodeAudioData(request.response, function(buffer){
					object.buffer = buffer;
				});
			}
			request.send();
		}

		function addAudioProperties(object){
			object.name = object.id;
			object.source = object.dataset.sound;
			loadAudio(object, object.source);
			object.play = function(volume){
				var s = context.createBufferSource();
				var g = context.createGain();
				var v;
				s.buffer = object.buffer;
				s.playbackRate.value = randomRange(0.5, 2);
				if(volume){
					v = rangeMap(volume, 1, 127, 0.2, 2);
					s.connect(g);
					g.gain.value = v * v;
					g.connect(context.destination);
				}
				else{
					s.connect(context.destination);
				}

				// s.start();
				object.s = s;
			}
		}

		// utility functions
		function randomRange(min, max){
			return Math.random() * (max + min) + min;
		}

		function rangeMap(x, a1, a2, b1, b2){
			return ((x - a1)/(a2-a1)) * (b2 - b1) + b1;
		}

		function frequencyFromNoteNumber( note ) {
			return 440 * Math.pow(2,(note-69)/12);
		}

		function logger(container, label, data){
			messages = label + " [channel: " + (data[0] & 0xf) + ", cmd: " + (data[0] >> 4) + ", type: " + (data[0] & 0xf0) + " , note: " + data[1] + " , velocity: " + data[2] + "]";
			// .textContent = messages;
		}

	})();
	});

	$(document).ready(function() {
		 $("#shapeTable").dataTable();
		 $(".payments").msDropdown({visibleRows:4});
 });
 
 $("#tabs").tabs();   

 $(".payments").on('change', function(e) {
	 console.log(this.value);
	 $(".test").text(this.value);
	 //console.log(this.value);
	});

	$("#the-file-input").change(function() {
		 // will log a FileList object, view gifs below
		 console.log(this.files);
 });
 
 // render the image in our view
function renderImage(file) {

 // generate a new FileReader object
 var reader = new FileReader();

 // inject an image with the src url
 reader.onload = function(event) {
	 the_url = event.target.result
	 $('#some_container_div').html("<img src='" + the_url + "' />")
 }

 // when the file is read it triggers the onload event above.
 reader.readAsDataURL(file);
}

// handle input changes
$("#the-file-input").change(function() {
	 console.log(this.files)
	 
	 // grab the first image in the FileList object and pass it to the function
	 renderImage(this.files[0])
});

$("#btnInfo").click(function() {
 toggleInfo = !toggleInfo;
 if (toggleInfo) {
	 $("#info").show();
 } else {
	 $("#info").hide();
 }
});

$( function() {
	 
 } );

