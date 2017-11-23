class NuclearRing {
	constructor() {
		this.material = new THREE.MeshBasicMaterial( {color:0xffffff, transparent:true, opacity:1} );
		this.geometry = new THREE.RingGeometry( 8., 8.25, 64,4 )
		this.geometry.verticesNeedUpdate = true;
		this.mesh = new THREE.Mesh(this.geometry, this.material);

		return this.mesh
	}
}

export default NuclearRing