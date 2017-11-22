import backgroundFrag from './../glsl/backgroundFrag.frag'
import backgroundVert from './../glsl/backgroundVert.vert'

class Background {
	constructor(){
		this.uniforms = {
			u_time : {
				type:"f",
				value:0
			}
		}
		this.material = new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader:backgroundVert, fragmentShader: backgroundFrag} );
		this.geometry = new THREE.PlaneBufferGeometry( 100, 100);

		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.mesh.position.z = -3;

		return this.mesh
	}
}

export default Background