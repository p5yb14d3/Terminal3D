/**
 * Copyright 2018 p5yb14d3. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   1. Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 *   2. Redistributions in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in the
 *   documentation and/or other materials provided with the distribution.
 */

var mesh1;
var texture1;
var material1;
var command;
var animate_flag = true;

function commands(line) {
	T1commands(line);
	T3commands(line);
}

function T3commands(line) {
	var arg1;
	var args = line.split(' ');
	command = args[0];
	if (args.length > 1) arg1 = args[1]
	if (terminal.app == "") {
		switch(command) {
			case "help":
				print_buffer = "\t\nHELP:\n1)theme snowflakes\n2)theme starfield\n3)freeze\n4)unfreeze/resume\n5)sound on/off\n6)jot\n7)game";
				terminal.print();
				terminal.sound.beep([[660, 0.1], [660, 0.1], [660, 0.1], [510, 0.1], [660, 0.1], [770, 0.1], [1, 0.1], [380, 0.1]]);
				break;
			case "beep":
				terminal.sound.beep([[args[1], args[2]]]);
				break;
			case "theme":
				clearScene();
				loadScript('themes/'+arg1+'.js', themeLoaded);
				break;
			case "background":
				clearScene();
				loadScript('backgrounds/'+arg1+'.js', reinit);
				break;
			case "reinit":
				reinit();
				break;
			case "freeze":
				animate_flag = false;
				break;
			case "unfreeze":
			case "resume":
				animate_flag = true;
				break;
			case "":
				break;
			default:
				terminal.sound.beep([[500, 0.1]]);
		}
		
	}
}

function themeLoaded() {
	initTheme();
	loadBackground();
}

function loadBackground() {
	loadScript('backgrounds/'+terminal.settings["background"]+'.js', reinit);
}

function clearScene() {
    var to_remove = [];

    scene.traverse ( function( child ) {
        if (!child.userData.keepMe === true ) {
            to_remove.push( child );
         }
    } );

    for ( var i = 0; i < to_remove.length; i++ ) {
        scene.remove( to_remove[i] );
    }
}

function reinit() {
	clearScene();
	initT3();
	initTheme();
	initBackground();
}

function initT3() {
	T1_folder = "vendor/T1/"

	texture1 = new THREE.Texture(terminal.canvas);
	texture1.needsUpdate = true;
	terminal.settings["alphaMap"] = texture1;
	terminal.settings["map"] = texture1; 
	terminal.settings["side"] = THREE.DoubleSide;
	terminal.settings["transparent"] = false;
	
	material1 = new THREE.MeshPhongMaterial(terminal.settings);
	terminal.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(terminal.canvas.width, terminal.canvas.height), material1);
	terminal.mesh.position.set(0,0,-180);
	if (typeof terminal.settings["rotateX"] !== "undefined") {
		terminal.mesh.rotateX(terminal.settings["rotateX"]);
	}
	else {
		terminal.mesh.rotation.set(0,0,0);
		terminal.mesh.updateMatrix();
	}
	scene.add(terminal.mesh);
}

function animateT3() {
	if (terminal.flag_ready == true) {
		if (Object.keys(terminal.settings).length > 0) {
			texture1 = new THREE.Texture(terminal.canvas) ;
			texture1.needsUpdate = true;
			material1 = new THREE.MeshBasicMaterial({alphaMap:texture1, map:texture1, side:THREE.DoubleSide, transparent: terminal.settings["transparent"], opacity: 5});
			terminal.mesh.material = material1;
		}	
		terminal.flag_ready = false;
	}
}

