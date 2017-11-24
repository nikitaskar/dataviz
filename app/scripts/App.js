// example import asset
// import imgPath from './assets/img.jpg';

global.THREE = require('three')
import earth from "./../data/europe.json"; 
import datas from "./../data/elevation.js";

import fossil from "./../data/fossil.js"
import nuclear from "./../data/nuclear.js"
import clean from "./../data/clean.js"
import Infos from './Infos.js'
import {TweenMax, TimelineMax} from "gsap"


import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6';
import vertShader from './../glsl/shader.vert'
import fragShader from './../glsl/shader.frag'

import fossilVert from './../glsl/fossilVert.vert'
import fossilFrag from './../glsl/fossilFrag.frag'

import Graph from './Graph'

let fxaa = require('three-shader-fxaa')
import RingFossil from './Ring'
import Shard from './Shard'
import Background from './Background'
import CleanRing from './CleanRing'
import NuclearRing from './NuclearRing'

import Earth from "./Earth";
import OrbitControls from 'three/examples/js/controls/OrbitControls'
import createControls from './../orbit-controls'

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
        this.camera.position.z = 21;
        this.onData = false;

    	this.scene = new THREE.Scene();
        this.counter = 0; 
        this.rings = [];
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.scene.add( directionalLight );

        this.parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false }
        this.renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, this.parameters );
    	this.renderer = new THREE.WebGLRenderer( {  antialias: true, alpha: 1, precision:"highp"  } );

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
        this.click = document.querySelector('.click')

        this.target = new THREE.Vector3();
        this.controls = createControls({
            position : [0,0,0],
            distance: 21,
            zoom: false,
            rotateSpeed: 0.0015,
            damping: 0.05,
        });

    	this.container.appendChild( this.renderer.domElement );
    	
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        document.querySelector('canvas').addEventListener('click', this.mouseMove.bind(this))

        this.onWindowResize()

        this.init()
        this.fossil()
        this.shard()
        this.background()
        this.clean()
        this.nuclear()
        this.render()
    }

    backButton(){
        this.back = document.querySelector(".back")
        this.back.addEventListener('click', this.backToEarth.bind(this))
    }

    backToEarth(){
        
        this.graph.backToEarth()

        setTimeout(function(){
            var tween = TweenMax.to(this.earth.mesh.scale,0.6,{x:1,y:1,z:1,ease: Power1.easeOut, delay:0.9})
            for (var i = 0; i < this.rings.length; i++) {
                var tweenRings = new TweenMax.to(this.rings[i].scale,1,{x:1, y:1, z:1,ease: Back.easeIn.config(1.5)})
            }
            TweenMax.to(this.shard.scale,2,{x:1,y:1,z:1,ease:Back.easeOut.config(1.2)})
            this.onData = false;
        }.bind(this),700)
        this.mouse.x = 0;
        this.mouse.y = 0;
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

        this.backButton()
        
    }

    mouseMove(event){
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    fossil() {
        this.fossilRing = new RingFossil({
            shaders:{
                fragment: fossilFrag,
                vertex: fossilVert
            }
        });
        this.fossilRing.data = fossil;
        this.fossilRing.info = Infos[0]
        this.fossilRing.name = "Production avec des énérgies fossiles";
        this.rings.push(this.fossilRing)
        this.scene.add(this.fossilRing)
    }

    clean() {
        this.cleanRing = new CleanRing();
        this.cleanRing.data = clean;
        this.cleanRing.info = Infos[2]
        this.cleanRing.name = "Production avec des énérgies renouvelables"
        this.rings.push(this.cleanRing)
        this.scene.add(this.cleanRing);
    }

    nuclear() {
        this.nuclearRing = new NuclearRing();
        this.nuclearRing.data = nuclear;

        this.nuclearRing.info = Infos[1]
        this.nuclearRing.name = "Production avec des énérgies nucléaires"
        this.rings.push(this.nuclearRing)
        this.scene.add(this.nuclearRing);
    }

    shard(){
        this.shard = new Shard();
        this.scene.add(this.shard)
    }

    background() {
        this.background = new Background();
        this.scene.add(this.background)
    }

    render() {
        requestAnimationFrame(this.render.bind(this))
        this.counter += 0.1;
        this.earth.material.uniforms.u_time.value = this.counter;
        this.earth.mesh.rotation.y += Math.PI /720;

        this.fossilRing.material.uniforms.u_time.value = this.counter;
        this.nuclearRing.material.uniforms.u_time.value = this.counter;
        this.fossilRing.rotation.z = this.counter/50.;
        this.nuclearRing.rotation.z = -this.counter/100.;
        this.shard.material.uniforms.u_time.value = this.counter;
        this.background.material.uniforms.u_time.value = this.counter;

        this.raycaster.setFromCamera( this.mouse, this.camera );

        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects( this.rings );

        for ( var i = 0; i < intersects.length; i++ ) {
            this.click.style.opacity = 0;
            if (!this.onData) {
                this.onData = true;

                var tween = TweenMax.to(this.earth.mesh.scale,0.6,{x:0,y:0,z:0,ease: Power1.easeIn, delay:0.3})
                for (var i = 0; i < this.rings.length; i++) {
                    var tweenRings = new TweenMax.to(this.rings[i].scale,1,{x:3, y:3, z:3,ease: Back.easeOut.config(1.5)})
                }
                TweenMax.to(this.shard.scale,1,{x:2,y:2,z:2,})
                this.graph = new Graph({scene:this.scene, datas:intersects[0].object.data, type:intersects[0].object.name, camera:this.camera, info:intersects[0].object.info})
            }
            this.mouse.x = 0;
            this.mouse.y = 0;

        }

        this.controls.update();
        console.log(this.controls)
      this.camera.position.fromArray(this.controls.position);
      this.camera.up.fromArray(this.controls.up);
      this.camera.lookAt(this.target);

    	this.effectComposer.render()
    }

    onWindowResize() {
        
    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
