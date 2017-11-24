import nuclearVert from './../glsl/nuclearVert.vert'
import nuclearFrag from './../glsl/nuclearFrag.frag'

class NuclearRing {
	constructor() {
		this.uniforms = {
			u_time: {type:"f", value:0}
		}

		this.material = new THREE.ShaderMaterial( {uniforms: this.uniforms, color:0xffffff, transparent:true, opacity:1, fragmentShader: nuclearFrag, vertexShader: nuclearVert} );
		this.geometry = new THREE.RingGeometry( 8., 8.25, 64,4 )
		this.geometry.verticesNeedUpdate = true;
		this.mesh = new THREE.Mesh(this.geometry, this.material);

		return this.mesh
	}
}

export default NuclearRing