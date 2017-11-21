import Country from "./Country"
import GeoUtil from "./GeoUtil"
import * as glMatrix from "gl-matrix"
import earthTexture from "../img/EarthSpec.png"
// import vertShader from './../glsl/shader.vert'
// import fragShader from './../glsl/shader.frag'

class Earth {

	static get SIZE(){
		return 6371;
	}

	constructor(args) {
		this.geometry; 
		this.material;
		this.mesh; 
		this.uniforms;
		this.shaders = args.shaders;

		this.refPos = {
			x: glMatrix.vec3.create(),
			y: glMatrix.vec3.create(),
			z: glMatrix.vec3.create()
		}
		this.refPos.x[0] = 1;
		this.refPos.x[1] = 0;
		this.refPos.x[2] = 0;

		this.refPos.y[0] = 0;
		this.refPos.y[1] = 1;
		this.refPos.y[2] = 0;

		this.refPos.z[0] = 0;
		this.refPos.z[1] = 0;
		this.refPos.z[2] = 1;

		this.radius = args.size ? args.size : Earth.SIZE;
		this.ratio = this.radius / Earth.SIZE
		this.datas = args.datas;
		this.datasType = args.datasType;
		this.countries = [];
		this.nbPoints = 0;
		this.vertices = [];
		this.uniforms = { 
			u_time: { type: "f", value: 0 },
			start: { type: "f", value: 0 },
			end: { type: "f", value: 0 },
			texture: {type: "t", value: THREE.ImageUtils.loadTexture(earthTexture)}
		};
		this.setDatas();
	}

	loadGeojson(){
		for(var i=0; i<this.datas.features.length; i++) {
			this.countries.push(new Country(this.datas.features[i]));
			this.countries[i].genCartesian(this.radius);
			this.countries[i].startRank = this.nbPoints;
			this.vertices = this.vertices.concat( this.countries[i].geometry.points); 
			if(this.countries[i].nameLong === "France") {
				this.uniforms.start = this.countries[i].startRank*3;
				this.uniforms.end = this.countries[i].startRank*3 + this.countries[i].geometry.points.length*3;
				console.log(this.countries[i].geometry.points)
			}
			this.nbPoints += this.countries[i].geometry.points.length; 
		}
	}

	loadRawDatas() {
		this.vertices = [];
		var vec = new THREE.Vector3(0, 0, 0);
		for(var i=0; i<this.datas.length; i++) {
			this.vertices.push(GeoUtil.coordToCart({
				lon: this.datas[i][2],
				lat: this.datas[i][1]
			}, this.radius + this.datas[i][0]*0.5))		
		}
	}

	setDatas(){
		switch(this.datasType) {
			case "geojson": this.loadGeojson(); break;
			case "raw": this.loadRawDatas(); break;
		}
		console.log(this.datasType)
		this.nbPoints = this.vertices.length;
	}

	findCountryBy(attr, value, single) {
		if(typeof this.countries[attr] !== "undefined") {
			var results = [];
			for(var i=0; i<this.countries.length; i++) {
				if(this.countries[i][attr] == value) {
					if ( single ) return this.countries[i];
					results.push(this.countries[i]);
				}
			}
			return results;
		}
		return null;
	}

	genBuffer(){
		var l = this.nbPoints*3;
		this.buffer = new Float32Array(l);
		for(var i=0, j=0; i<this.nbPoints; i+=3, j++) {
			this.buffer[i] 		= this.vertices[j].x
			this.buffer[i + 1] 	= this.vertices[j].y
			this.buffer[i + 2] 	= this.vertices[j].z
		}
		return this.buffer;
	}


	//  rotation(vec3 refPos) {
	// 	float dotProduct = dot(position, refPos);
	// 	float magnitude = (sqrt(position.x*position.x+position.y*position.y+position.z*position.z))*(sqrt(refPos.x*refPos.x+refPos.y*refPos.y+refPos.z*refPos.z));
	// 	float angle = acos(dotProduct/magnitude);
	// 	angle = radians(angle);
	// 	return angle;
	// }

	initObject3d() {
		if(this.countries && this.shaders) {
			this.geometry2 = new THREE.SphereGeometry(1,254,254)
			this.geometry = new THREE.InstancedBufferGeometry()

			this.bluePrint = [];
			for (var i = 0; i < 3; i++) {
				var angle = Math.PI/180*i*120;
				this.bluePrint.push(Math.cos(angle), Math.sin(angle), Math.cos(angle))
			}

			this.attribute = new THREE.BufferAttribute(new Float32Array(this.bluePrint),3)
			this.geometry.addAttribute('position', this.attribute)

			this.translation = new Float32Array(this.nbPoints*3)
			this.translationIterator = 0;

			this.rotation = new Float32Array(this.nbPoints*4)
			this.rotationIterator = 0;
			var q = new THREE.Quaternion();

			for (var i = 0; i < this.nbPoints; i+=6) {
				this.translation[this.translationIterator++] = this.vertices[i].x
				this.translation[this.translationIterator++] = this.vertices[i].y
				this.translation[this.translationIterator++] = this.vertices[i].z
				this.pos = glMatrix.vec3.create();
				this.pos[0] = this.vertices[i].x;
				this.pos[1] = this.vertices[i].y;
				this.pos[2] = this.vertices[i].z;
				console.log()

				 q.set(  ( Math.random() - .5 ) * 2,
		                ( Math.random() - .5 ) * 2,
		                ( Math.random() - .5 ) * 2,
		                Math.random() * Math.PI );
		        q.normalize();
		        //assign to bufferAttribute
		        this.rotation[ this.rotationIterator++ ] = glMatrix.vec3.angle(this.pos,this.refPos.x) / Math.PI;
		        this.rotation[ this.rotationIterator++ ] = glMatrix.vec3.angle(this.pos,this.refPos.y) / Math.PI;
		        this.rotation[ this.rotationIterator++ ] = glMatrix.vec3.angle(this.pos,this.refPos.z) / Math.PI;
		        this.rotation[ this.rotationIterator++ ] = q.w;

			}

			this.geometry.addAttribute('translation', new THREE.InstancedBufferAttribute(this.translation, 3,1))
			this.geometry.addAttribute('rotation', new THREE.InstancedBufferAttribute(this.rotation, 4,1))

			this.material = new THREE.ShaderMaterial({ 				
		        uniforms: this.uniforms,
		        vertexShader: this.shaders.vertex,
		        fragmentShader: this.shaders.fragment,
		        side : THREE.DoubleSide,
			 });

			this.mesh = new THREE.Mesh(this.geometry2, this.material)
		}
	}
}

export default Earth;