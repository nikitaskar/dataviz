import Country from "./Country"

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

		this.radius = args.size ? args.size : Earth.SIZE;
		this.ratio = this.radius / Earth.SIZE
		this.geojson = args.geojson;
		this.countries = [];
		this.nbPoints = 0;
		this.vertices = [];
		this.setDatas();
	}

	setDatas(){
		for(var i=0; i<this.geojson.features.length; i++) {
			this.countries.push(new Country(this.geojson.features[i]));
			this.countries[i].genCartesian(this.radius);
			this.countries[i].startRank = this.nbPoints;
			this.vertices = this.vertices.concat( this.countries[i].geometry.points); 
		}
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

	initObject3d() {
		if(this.countries && this.shaders) {
			
			this.geometry = new THREE.BufferGeometry();
			this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.genBuffer(), 3))

			this.uniforms = { u_time: { type: "f", value: 0 } };
	        this.material = new THREE.ShaderMaterial({
	            uniforms: this.uniforms,
	            vertexShader: this.shaders.vertex,
	            fragmentShader: this.shaders.fragment,
	            transparent: true
	        });

	        this.mesh = new THREE.Points(this.geometry, this.material);

	    	return this.mesh; 
		}
		console.warn("Error in initObject3d");
	}
}

export default Earth;