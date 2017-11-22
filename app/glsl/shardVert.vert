attribute vec3 translation;
attribute vec4 rotation;
attribute vec3 scale;
attribute float rotationDir;

uniform float u_time;
varying vec2 vUv;
varying vec3 vPos;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


vec3 transform(inout vec3 position, vec3 T, vec4 R, vec3 S, float D){

	position += 2.0 * cross( R.xyz, cross( R.xyz, position ) )+(D*((cos(u_time/50.)*3.)*(sin(u_time/50.)*2.)));
	
	position *= S;
	position += T;
	return position;
}

void main(){
	vUv = uv;
	vPos = position;
	vec3 pos = position;
	pos= transform(pos, translation, rotation, scale, rotationDir);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
}