class CleanRing {
	constructor() {
		this.material = new THREE.MeshBasicMaterial( {color:0xffffff} );
		this.geometry = new THREE.RingGeometry( 8, 8.3, 64,4 )

		this.mesh = new THREE.Mesh(this.geometry, this.material);

		return this.mesh
		
	}
}

export default CleanRing;