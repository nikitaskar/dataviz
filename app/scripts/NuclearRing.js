class NuclearRing {
	constructor() {
		this.material = new THREE.ShaderMaterial( {color:0xffffff} );
		this.geometry = new THREE.RingGeometry( 10., 10.3, 64,4 )

		this.mesh = new THREE.Mesh(this.geometry, this.material);

		return this.mesh
	}
}

export default NuclearRing