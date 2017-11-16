// example import asset
// import imgPath from './assets/img.jpg';

import earth from "./../data/earth.json"; 
import vertShader from './../glsl/shader.vert'
import fragShader from './../glsl/shader.frag'
import Earth from "./Earth";
import OrbitControls from 'three/examples/js/controls/OrbitControls'

export default class App {

    constructor() {

        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.camera.position.z = 15;

    	this.scene = new THREE.Scene();

        let geometry = new THREE.SphereGeometry( 5, 32, 32 );
	    let material = new THREE.MeshBasicMaterial({
            transparent: true,
            color: 0x000000
        });
    	this.mesh = new THREE.Mesh( geometry, material );
    	this.scene.add( this.mesh );

    	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.container.appendChild( this.renderer.domElement );
        this.controls = new THREE.OrbitControls( this.camera );
        this.controls.update();
    	
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();
        this.init();
        this.renderer.animate( this.render.bind(this) );
    }

    init(){

        this.earth = new Earth({
            size: 5,
            geojson: earth,
            shaders: {
                fragment: fragShader,
                vertex: vertShader
            }
        });
        this.earth.initObject3d();
        this.scene.add(this.earth.mesh)
    }

    render() {

        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;

    	this.renderer.render( this.scene, this.camera );
    }

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
