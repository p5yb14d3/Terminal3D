/**
 * AUTHOR: Graeme Fulton
 * CODEPEN: https://codepen.io/GraemeFulton/pen/BNyQMM
 */
var stars=[];
	 
function initBackground(){
	// The loop will move from z position of -1000 to z position 1000, adding a random particle at each position. 
	for ( var z= -1000; z < 1000; z+=20 ) {

		// Make a sphere (exactly the same as before). 
		var geometry = new THREE.SphereGeometry(0.5, 32, 32)
		var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
		var sphere = new THREE.Mesh(geometry, material);

		// This time we give the sphere random x and y positions between -500 and 500
		sphere.position.x = Math.random() * 1000 - 500;
		sphere.position.y = Math.random() * 1000 - 500;

		// Then set the z position to where it is in the loop (distance of camera)
		sphere.position.z = z;

		// scale it up a bit
		sphere.scale.x = sphere.scale.y = 2;

		//add the sphere to the scene
		scene.add( sphere );

		//finally push it to the stars array 
		stars.push(sphere); 
	}
}

function animateBackground() { 
			
	// loop through each star
	for(var i=0; i<stars.length; i++) {
		
		star = stars[i]; 
			
		// and move it forward dependent on the mouseY position. 
		star.position.z +=  i/10;
			
		// if the particle is too close move it to the back
		if(star.position.z>1000) star.position.z-=2000; 
		
	}

}
