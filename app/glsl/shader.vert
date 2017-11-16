//uniform float u_time;

void main(){
	gl_PointSize = 5.0;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}