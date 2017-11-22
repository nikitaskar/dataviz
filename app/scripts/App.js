// example import asset
// import imgPath from './assets/img.jpg';

global.THREE = require('three')
import earth from "./../data/europe.json"; 
import datas from "./../data/elevation.js";
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6';
import vertShader from './../glsl/shader.vert'
import fragShader from './../glsl/shader.frag'

import fossilVert from './../glsl/fossilVert.vert'
import fossilFrag from './../glsl/fossilFrag.frag'

let fxaa = require('three-shader-fxaa')
import RingFossil from './Ring'
import Shard from './Shard'

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

        this.parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false }
        this.renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, this.parameters );
    	this.renderer = new THREE.WebGLRenderer( {  antialias: true, alpha: 1, precision:"highp"  } );

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.renderer.setPixelRatio( window.devicePixelRatio );


        
        console.log(this.shaderPass)

    	this.container.appendChild( this.renderer.domElement );
        this.controls = new THREE.OrbitControls( this.camera );
        this.controls.update();
    	
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize()

        this.init()
        this.fossil()
        this.shard()
        this.render()
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


        this.effectComposer = new EffectComposer(this.renderer, this.renderTarget);
        this.effectComposer.addPass(new RenderPass(this.scene, this.camera))
        this.shaderPass = new ShaderPass(fxaa())
        this.shaderPass.renderToScreen = true

        this.effectComposer.addPass(this.shaderPass)

        this.shaderPass.uniforms.resolution.value.x = window.innerWidth
        this.shaderPass.uniforms.resolution.value.y = window.innerHeight
        
    }

    fossil() {
        this.fossilRing = new RingFossil({
            shaders:{
                fragment: fossilFrag,
                vertex: fossilVert
            }
        });
        this.scene.add(this.fossilRing)
    }

    shard(){
        this.shard = new Shard();
       this.scene.add(this.shard)
    }

    render() {
        requestAnimationFrame(this.render.bind(this))
        this.counter += 0.1;
        this.earth.material.uniforms.u_time.value = this.counter;
        this.fossilRing.material.uniforms.u_time.value = this.counter;
        this.fossilRing.rotation.z = this.counter/50.;
        this.shard.material.uniforms.u_time.value = this.counter;
    	this.effectComposer.render()
    }

    onWindowResize() {
        
    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
