import shardFrag from './../glsl/shardFrag.frag'
import shardVert from './../glsl/shardVert.vert'

class Shard {
	constructor() {
		this.geometry = new THREE.InstancedBufferGeometry()

			this.bluePrint = [];
			for (var i = 0; i < 3; i++) {
				var angle = Math.PI/180*i*120;
				this.bluePrint.push(Math.cos(angle), Math.sin(angle), Math.cos(angle))
			}

			this.attribute = new THREE.BufferAttribute(new Float32Array(this.bluePrint),3)
			this.geometry.addAttribute('position', this.attribute)

			this.translation = new Float32Array(40*3)
			this.translationIterator = 0;

			this.rotation = new Float32Array(40*4)
			this.rotationIterator = 0;
			var q = new THREE.Quaternion();

			for (var i = 0; i < 40; i++) {
				this.translation[this.translationIterator++] = Math.random()*40-20
				this.translation[this.translationIterator++] = Math.random()*40-20
				this.translation[this.translationIterator++] = Math.random()*40-20

				 q.set(  ( Math.random() - .5 ) * 2,
		                ( Math.random() - .5 ) * 2,
		                ( Math.random() - .5 ) * 2,
		                Math.random() * Math.PI );
		        q.normalize();
		        //assign to bufferAttribute
		        this.rotation[ this.rotationIterator++ ] = q.x;
		        this.rotation[ this.rotationIterator++ ] = q.y;
		        this.rotation[ this.rotationIterator++ ] = q.z;
		        this.rotation[ this.rotationIterator++ ] = q.w;

			}

			this.geometry.addAttribute('translation', new THREE.InstancedBufferAttribute(this.translation, 3,1))
			this.geometry.addAttribute('rotation', new THREE.InstancedBufferAttribute(this.rotation, 4,1))

			this.material = new THREE.ShaderMaterial({
		        vertexShader: shardVert,
		        fragmentShader: shardFrag,
		        side : THREE.DoubleSide,
			 });

			return new THREE.Mesh(this.geometry, this.material)
	}
}

export default Shard;