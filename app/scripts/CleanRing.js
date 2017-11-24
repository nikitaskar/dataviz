class CleanRing {
	constructor() {
		this.material = new THREE.MeshBasicMaterial( {color:0xf6f6f6} );
		this.geometry = new THREE.RingGeometry( 10, 10.1, 64,4 )

		this.mesh = new THREE.Mesh(this.geometry, this.material);

		return this.mesh
		
	}
}

export default CleanRing;