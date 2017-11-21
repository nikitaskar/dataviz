class RingFossil {
	constructor(args) {
		this.shaders = args.shaders;
		this.uniforms = {
			u_time: {type:"f", value:0}
		}

		var geometry = new THREE.RingGeometry( 4.7, 5.15, 64,4 );
		var material = new THREE.ShaderMaterial( { uniforms: this.uniforms, fragmentShader:this.shaders.fragment, vertexShader:this.shaders.vertex, side: THREE.DoubleSide, transparent: true, } );
		var mesh = new THREE.Mesh( geometry, material );

		return mesh;
	}


}
export default RingFossil;