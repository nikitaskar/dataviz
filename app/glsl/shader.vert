//uniform float u_time;
attribute float rank;

varying vec4 color;
void main(){
	color = vec4(1.0, 1.0, 1.0, 1.0);
	gl_PointSize = 3.0;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}


