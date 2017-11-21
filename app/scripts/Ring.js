class RingFossil {
	constructor(args) {
		this.shaders = args.shaders;
		this.uniforms = {
			u_time: {type:"f", value:0}
		}

		var geometry = new THREE.RingGeometry( 5.3, 6, 64,4 );
		var material = new THREE.ShaderMaterial( { uniforms: this.uniforms, fragmentShader:this.shaders.fragment, vertexShader:this.shaders.vertex, side: THREE.DoubleSide } );
		var mesh = new THREE.Mesh( geometry, material );

		return mesh;
	}


}
export default RingFossil;