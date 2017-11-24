var MeshLine = require('three.meshline') 

class Graph {
	constructor(args) {
		this.datas = args.datas;
		this.scene = args.scene;
		this.showText = false;
		this.points = []
		this.camera = args.camera;
		this.min = Math.min(...this.datas)
		this.max = Math.max(...this.datas)
		this.type = args.type;
		this.ringInfo = args.info;
		this.more = document.querySelector('.more')
		this.nav = document.querySelector('.nav')

		this.infos = document.querySelector('.infos')
		this.years = document.querySelector('.years')
		this.more.addEventListener('click', this.moreInfos.bind(this));
		console.log(this.datas)
		
		this.createSpheres()

	}

	moreInfos(){
		this.infos.style.opacity = 0.7;
		this.infos.innerHTML = this.ringInfo;
	}

	createline(){
		var geometry = new THREE.Geometry();
		var v;
		for( var j = 0; j < 1; j ++ ) {
			v = new THREE.Vector3( -12, (this.max-this.min)/2, 1 );
			geometry.vertices.push( v );
			v = new THREE.Vector3( -12, -1, 1 );
			geometry.vertices.push( v );
			v = new THREE.Vector3( 12, -1, 1 );
			geometry.vertices.push( v );
		}
		geometry.verticesNeedsUpdate = true;
		var line = new MeshLine.MeshLine();
		line.setGeometry( geometry, function( p ) { return 1/15 } );
		var material = new MeshLine.MeshLineMaterial();

		var mesh = new THREE.Mesh( line.geometry, material ); // this syntax could definitely be improved!
		this.scene.add( mesh );
	}

	createSpheres() {
		var material = new THREE.MeshBasicMaterial( {color:0xffffff, transparent: true, opacity:0} );
		var geometry = new THREE.SphereGeometry(1,8,8);
		var pos;
		var max = 0;
		for (var i = 0; i < this.datas.length; i++) {
			if (this.datas[i]>max) {
				max = this.datas[i];
			}
			this.mesh = new THREE.Mesh(geometry, material);
			pos = -11;
			this.mesh.scale.set(0.15,0.15,0.15)
			this.mesh.position.set(pos+i/2,-3,1)
			this.points.push(this.mesh)
			this.scene.add(this.mesh)

			TweenMax.to(this.mesh.material,1,{opacity:1, delay:1.5})
			TweenMax.to(this.mesh.position,1.5,{y:((this.datas[i]-this.min)/2)-3, delay:2,ease:Back.easeOut.config(1.4), onCompleteScope:this})

		}
		console.log(this.showText)
		if (this.showText = true) {
			this.createText()
		}
	}

	createText(){
		this.name = document.querySelector(".name")
		this.name.style.opacity = 1;
		this.name.innerHTML = this.type
		this.name.addEventListener('click', this.backToEarth.bind(this))
		this.createGraphText()
		
	}

	createGraphText(x,y,z){
		this.low = document.querySelector('.lowPrct');
		this.low.style.opacity = 1;
		this.low.innerHTML = Math.round(this.min)+"%"
		
		var vector = new THREE.Vector3(-12, -3, 2);
        vector.project(this.camera);
        vector.x = Math.round((0.48 + vector.x / 2) * (window.innerWidth));
        vector.y = Math.round((0.48 - vector.y / 2) * (window.innerHeight));
        
        this.low.style.transform = "translate(" + vector.x + "px," + vector.y + "px) scale(0.75)";

        var vector2 = new THREE.Vector3(-12, ((this.max-this.min)/2-3), 2);
        vector2.project(this.camera);
        vector2.x = Math.round((0.48 + vector2.x / 2) * (window.innerWidth));
        vector2.y = Math.round((0.48 - vector2.y / 2) * (window.innerHeight));
        
        this.high = document.querySelector('.highPrct');
        console.log(this.high)
		this.high.innerHTML = Math.round(this.max)+"%"
		this.high.style.opacity = 1
        this.high.style.transform = "translate(" + vector2.x + "px," + vector2.y + "px) scale(0.75)";
        this.nav.style.opacity = 1;
        this.nav.style.pointerEvents = "auto"
        this.years.style.opacity = 1
        
	}

	backToEarth(){
		for (var i = 0; i < this.points.length; i++) {
			
			var currentPoint = this.points[i];
			
			var posTween = TweenMax.to(this.points[i].position,1,{y:0, ease:Back.easeIn.config(1.4)})
			var opTween = TweenMax.to(this.points[i].material,0.7,{opacity:0, onCompleteScope: this, onComplete:function(currentPoint){
				for (var i = 0; i < this.points.length; i++) {
					this.scene.remove(this.points[i])
				}
			},delay:0.4})
		}
			
		this.high.style.opacity = 0;
		this.low.style.opacity = 0;
		this.name.style.opacity = 0;
		this.nav.style.opacity = 0;
		this.nav.style.pointerEvents = "none"
		this.infos.style.opacity = 0
		this.years.style.opacity = 0
	}
}

export default Graph