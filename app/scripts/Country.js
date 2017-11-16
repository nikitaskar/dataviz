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
		//console.log(this)
	}

	concatCoords() {
		this.geometry.coords = [];
		for(var i = 0; i<this.geometry.coordinates.length; i++) {
			for(var j = 0; j<this.geometry.coordinates[i].length; j++) {
				this.geometry.coords.push({
					lon: this.geometry.coordinates[i][j][0],
					lat: this.geometry.coordinates[i][j][1]
				})
			}
		}
		this.nbPoint = this.geometry.coords.length;
	}

	genCartesian(r) {
		this.geometry.points = [];
		if(this.geometry.coords.length) {
			for(var i = 0; i<this.geometry.coords.length; i++) {
				this.geometry.points.push(GeoUtil.convertGeoCoord(this.geometry.coords[i], r))
			}
		}
	}
}

export default Country;