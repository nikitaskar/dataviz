import shardFrag from './../glsl/shardFrag.frag'
import shardVert from './../glsl/shardVert.vert'

class Shard {
	constructor() {
		this.geometry = new THREE.InstancedBufferGeometry()

		this.uniforms = {
			u_time:{
				type:"f",
				value:"0"
			}
		}

		this.bluePrint = [];
		for (var i = 0; i < 3; i++) {
			var angle = Math.PI/180*i*120;
			this.bluePrint.push(Math.cos(angle), Math.sin(angle), Math.cos(angle))
		}
		var shards = 200;

		this.attribute = new THREE.BufferAttribute(new Float32Array(this.bluePrint),3)
		this.geometry.addAttribute('position', this.attribute)

		this.translation = new Float32Array(shards*3)
		this.translationIterator = 0;

		this.scale = new Float32Array(shards*3)
		this.scaleIterator = 0;

		this.rotation = new Float32Array(shards*4)
		this.rotationIterator = 0;

		this.rotationDir = new Float32Array(shards)
		this.rotationDirIterator = 0;

		var q = new THREE.Quaternion();

		for (var i = 0; i < shards; i++) {
			this.translation[this.translationIterator++] = Math.cos((i/shards)*Math.PI*2)*25+Math.random()*8-4
			this.translation[this.translationIterator++] = Math.sin((i/shards)*Math.PI*2)*13+Math.random()*2-1
			this.translation[this.translationIterator++] = 2;

			 q.set(  ( Math.random() - .5 ) * 2,
	                ( Math.random() - .5 ) * 2,
	                ( Math.random() - .5 ) * 2,
	                Math.random() * Math.PI );
	        q.normalize();

	        this.scale[this.scaleIterator++] = Math.random()*0.15+0.1;
	        this.scale[this.scaleIterator++] = Math.random()*0.15+0.1;
	        this.scale[this.scaleIterator++] = Math.random()*0.15+0.1;

	        //assign to bufferAttribute
	        this.rotation[ this.rotationIterator++ ] = q.x;
	        this.rotation[ this.rotationIterator++ ] = q.y;
	        this.rotation[ this.rotationIterator++ ] = q.z;
	        this.rotation[ this.rotationIterator++ ] = q.w;


	        this.rotationDir[this.rotationDirIterator++] = Math.random() < 0.5 ? -1 : 1;

		}

		this.geometry.addAttribute('translation', new THREE.InstancedBufferAttribute(this.translation, 3,1))
		this.geometry.addAttribute('scale', new THREE.InstancedBufferAttribute(this.scale, 3,1))
		this.geometry.addAttribute('rotation', new THREE.InstancedBufferAttribute(this.rotation, 4,1))
		this.geometry.addAttribute('rotationDir', new THREE.InstancedBufferAttribute(this.rotationDir, 1,1))

		this.material = new THREE.ShaderMaterial({
			uniforms: this.uniforms,
	        vertexShader: shardVert,
	        fragmentShader: shardFrag,
	        side : THREE.DoubleSide,
		 });

		return new THREE.Mesh(this.geometry, this.material)
	}
}

export default Shard;