class GeoUtil {

	//Convertit les degré en radian
	static toRadian(deg){
	  return Math.PI * (deg) / 180;
	}

	static toDegre(rad){
	  return rad*180/Math.PI;
	}


	// cubic-bezier(0,.59,0,1)
	static geoToCart(coord, r){
		return new THREE.Vector3(
			r * Math.cos(coord.lat) * Math.cos(coord.lon),
			r * Math.cos(coord.lat) * Math.sin(coord.lon), 
			r * Math.sin(coord.lat));
	}

	static convertGeoCoord(coord, r){
	  var lat, lon, xFact, yFact, zFact,  y, x, z, newRr;
	  lat = coord.lat;
	  lon = coord.lon;

	  xFact = lon>=-90 || lon<=90 ? 1 : -1;
	  yFact = lat>=0 ? 1 : -1;
	  zFact = lon>0 ? -1 : 1;

	  y = Math.sin(GeoUtil.toRadian(Math.abs(lat)))*r*yFact;
	  newRr = Math.sqrt(Math.pow(r, 2) - Math.pow(y, 2));
	  x = Math.cos(GeoUtil.toRadian(Math.abs(lon)))*newRr*xFact;
	  z = Math.sqrt(Math.pow(newRr, 2) - Math.pow(x, 2))*zFact;
	  return new THREE.Vector3(x, y, z);
	}
}

export default GeoUtil;