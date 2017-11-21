attribute vec3 translation;
attribute vec4 rotation;

vec3 transform(inout vec3 position, vec3 T, vec4 R){

	position += 2.0 * cross( R.xyz, cross( R.xyz, position ) );
	position += T;
	return position;
}

void main(){
	vec3 pos = position;
	pos= transform(pos, translation, rotation);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
}