attribute vec3 translation;
attribute vec4 rotation;
attribute vec3 scale;

varying vec2 vUv;
varying vec3 vPos;
vec3 transform(inout vec3 position, vec3 T, vec4 R, vec3 S){

	position += 2.0 * cross( R.xyz, cross( R.xyz, position ) );
	
	position *= S;
	position += T;
	return position;
}

void main(){
	vUv = uv;
	vPos = position;
	vec3 pos = position;
	pos= transform(pos, translation, rotation, scale);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
}