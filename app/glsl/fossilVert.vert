uniform float u_time;
varying vec3 pos;

varying float time;
varying vec2 vUv;

void main() {
	pos = position;
	time = u_time;
	vUv = uv;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}