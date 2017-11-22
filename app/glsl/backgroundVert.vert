uniform float u_time;

varying vec3 pos;
varying vec2 vUv;
varying float time;

void main() {
	pos = position;
	vUv = uv;
	time = u_time;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}