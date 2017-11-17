import GeoUtil from "./GeoUtil";

class Country {

	constructor(data) {
		var properties = data.properties;
		this.cd = properties.iso_a3;
		this.cdShort = properties.iso_a2;
		this.geometry = data.geometry;
		this.nameLong = properties.name_long;
		this.nameShort = properties.name_short;
		this.name = properties.format_fr !== null ? properties.format_fr : properties.format_en;
		this.pib = properties.gdp_md_est ? properties.gdp_md_est : null;
		this.pop = properties.pop_est;
		this.economy = properties.economy;
		this.concatCoords();
	}

	loopCoords(array) {
		var points = [];
		for(var i=0; i<array.length; i++) {
			if( typeof array[i][0] == "number" ){
				points.push({ lon: array[i][0], lat: array[i][1] })
			} else {
				points = points.concat(this.loopCoords(array[i])); 
			}
		}
		return points;
	}

	concatCoords() {
		console.log(this.geometry.type);
		this.geometry.coords = []
		//if( this.geometry.type == "MultiPolygon") {
			this.geometry.coords = this.loopCoords(this.geometry.coordinates);	
		//}
		

		this.nbPoint = this.geometry.coords.length;
	}

	genCartesian(r) {
		this.geometry.points = [];
		if(this.geometry.coords.length) {
			for(var i = 0; i<this.geometry.coords.length; i++) {
				this.geometry.points.push(GeoUtil.coordToCart(this.geometry.coords[i], r))
			}
		}
	}
}

export default Country;