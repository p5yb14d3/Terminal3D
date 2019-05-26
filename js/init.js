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

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var isFirstTime = 0;

var camera, scene, renderer, stats;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

initBasics();	
initT3(scene);
initBackground();
render();


function render() {

	requestAnimationFrame( render );
	if (animate_flag) animateBackground();
	animateT3();
	controls.update();
	renderer.render( scene, camera );
	
	// DUCK TAPE
	if (isFirstTime == 10) {
		reinit();
		isFirstTime = -1;
	}
	else if (isFirstTime >= 0) {
		isFirstTime += 1;
	}
}

function initBasics() {
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 120;

	// INIT SCENE
	scene = new THREE.Scene();

	// INIT RENDERER
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.id = "container";
	document.body.appendChild( renderer.domElement );

	// INIT LISTENERS
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	window.addEventListener( 'resize', onWindowResize, false );

	// CONTROLS
	controls = new THREE.TrackballControls( camera, renderer.domElement );
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {

}

function onDocumentTouchStart( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
	}
}