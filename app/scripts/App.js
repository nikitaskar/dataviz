// example import asset
// import imgPath from './assets/img.jpg';

import earth from "./../data/europe.json"; 
import datas from "./../data/elevation.js";

import vertShader from './../glsl/shader.vert'
import fragShader from './../glsl/shader.frag'

import Earth from "./Earth";
import OrbitControls from 'three/examples/js/controls/OrbitControls'

export default class App {
    adaptData() {
        var data = [];
        for(var i = 0; i < datas.length; i++) {
            if(datas[i][2] == 1) {
                data.push(datas[i]);
            }
            if(datas[i][2] == 0) {
                console.log(datas[i]);
            }
        }
        for(var i=0; i<data.length; i++){
            datas.push([ data[i][0], data[i][1], 0 ])
        }
        
    }

    constructor() {
        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 15;

    	this.scene = new THREE.Scene();
        this.counter = 0; 

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.scene.add( directionalLight );

    	this.renderer = new THREE.WebGLRenderer( {  antialias: false, alpha: 1, precision:"lowp" } );
        this.renderer.setClearColor( 0x000000, 0 );
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
            datasType: 'raw', // can be geojson
            datas: datas, // raw data
            //datas: earth, // Geogjaon
            shaders: {
                fragment: fragShader,
                vertex: vertShader
            }
        });
        this.earth.initObject3d();
        this.scene.add(this.earth.mesh);
        console.log(this.earth)
    }

    render() {
        this.counter += 0.1;
        this.earth.material.uniforms.u_time.value = this.counter;
    	this.renderer.render( this.scene, this.camera );
    }

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
