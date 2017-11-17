class GeoUtil {

	//Convertit les degré en radian
	static toRadian(deg){
	  return Math.PI * (deg) / 180;
	}

	static toDegre(rad){
	  return rad*180/Math.PI;
	}


	// cubic-bezier(0,.59,0,1)
	static  coordToCart(coord, r){
		return new THREE.Vector3(
			r * Math.cos(GeoUtil.toRadian(coord.lat)) * Math.cos(GeoUtil.toRadian(coord.lon)),
			r * Math.cos(GeoUtil.toRadian(coord.lat)) * Math.sin(GeoUtil.toRadian(coord.lon)), 
			r * Math.sin(GeoUtil.toRadian(coord.lat)));
	}

}

export default GeoUtil;