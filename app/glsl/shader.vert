attribute vec3 translation;
attribute vec4 rotation;
varying vec2 vUv;
varying vec3 vPos;
uniform float u_time;
varying float time;

vec3 transform(inout vec3 position, vec3 T, vec4 R){

	position += 2.0 * cross( R.xyz, cross( R.xyz, position ) );
	position += T;
	return position;
}

void main(){
	vPos = position;
	vec3 pos = position;
	vUv = uv;
	time = u_time;

	transform(pos, translation, rotation);


	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
}


