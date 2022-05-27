import * as THREE from './three.js-master/build/three.module.js'

let w = window.innerWidth;
let h = window.innerHeight;
let aspect = w/h;

let persCam = new THREE.PerspectiveCamera(50, aspect, 1, 10000);
let persCam2 = new THREE.PerspectiveCamera(50, aspect, 1, 10000);

let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({antialias: true});

renderer.shadowMap.enabled = true;

persCam.position.set(0,10,50);
persCam2.position.set(0,25,-25);
persCam.lookAt(0,0,0);
persCam2.lookAt(0,0,0);
renderer.setSize(w,h);

// ambient light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);

import {OrbitControls}  from './three.js-master/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader}  from './three.js-master/examples/jsm/loaders/GLTFLoader.js'

let controls = new OrbitControls(persCam, renderer.domElement);
let controls2 = new OrbitControls(persCam2, renderer.domElement);

let loader = new GLTFLoader();
let loader2 = new THREE.TextureLoader();
let sandTexture = loader2.load('./sand.jpg');
let diamond = loader2.load('./diamond.jpg');

// box
const geo = new THREE.BoxGeometry(40, 15, 1);
const mat = new THREE.MeshPhongMaterial({color: 0x8ba691, shininess: 2});
const block = new THREE.Mesh(geo, mat);
// block.position.x = 30;
block.position.y=15;
block.receiveShadow = true;
scene.add(block);
block.castShadow = true;


// cylinder
const cygeometry = new THREE.CylinderGeometry( 2, 2, 20, 32 );
const cymaterial = new THREE.MeshBasicMaterial( {color: 0x8ba691} );
const cylinder = new THREE.Mesh( cygeometry, cymaterial );
// cylinder.position.x = 30;
cylinder.position.y = 8;
cylinder.position.z = -3;
scene.add( cylinder );
cylinder.castShadow = true;

// circle
const cgeometry = new THREE.CircleGeometry( 2, 32 );
const cmaterial = new THREE.MeshBasicMaterial( { color: 0x243628 } );
const circle = new THREE.Mesh( cgeometry, cmaterial);
const circle2 = new THREE.Mesh( cgeometry, cmaterial);
const circle3 = new THREE.Mesh( cgeometry, cmaterial);
const circle4 = new THREE.Mesh( cgeometry, cmaterial);
const circle5 = new THREE.Mesh( cgeometry, cmaterial);

circle.position.x = -10;
circle.position.y = 10;
circle.position.z = 1;
scene.add( circle );
circle2.position.x = -5;
circle2.position.y = 10;
circle2.position.z = 1;
scene.add( circle2 );
circle3.position.y = 10;
circle3.position.z = 1;
scene.add( circle3 );
circle4.position.x = 5;
circle4.position.y = 10;
circle4.position.z = 1;
scene.add( circle4 );
circle5.position.x = 10;
circle5.position.y = 10;
circle5.position.z = 1;
scene.add( circle5 );

// plane
const basicMat = new THREE.MeshPhongMaterial({map: sandTexture,side: THREE.DoubleSide});
const planeGeo = new THREE.PlaneGeometry(50,50);
const plane = new THREE.Mesh(planeGeo, basicMat);
plane.rotation.x = -Math.PI/2;
plane.position.y = -2;
plane.receiveShadow = true;

scene.add(plane);

// text
let fontLoader = new THREE.FontLoader();
fontLoader.load('./three.js-master/examples/fonts/helvetiker_bold.typeface.json',(font)=>{
    let textGeo = new THREE.TextGeometry("Open the Treasure Chest!",{
        font: font,
        size: 2,
        height: 2
    });
    let textGeo2 = new THREE.TextGeometry("Psst You found the hidden gem!",{
        font: font,
        size: 0.5,
        height: 1
    });
    let material = new THREE.MeshNormalMaterial();
    let text = new THREE.Mesh(textGeo, material);
    let text2 = new THREE.Mesh(textGeo2, material);

    text.position.x = -17;
    text.position.y = 15;
    text2.position.x = 13;
    text2.position.y = 15;
    text2.position.z = -5;
    text2.rotation.y = -185;

    scene.add(text);
    scene.add(text2);

    
});

// octahedron
const ogeometry = new THREE.OctahedronGeometry(4);
const ogeometry2 = new THREE.OctahedronGeometry(2);

const omaterial = new THREE.MeshPhongMaterial({map: diamond});
const octahedron = new THREE.Mesh( ogeometry, omaterial );
const octahedron2 = new THREE.Mesh( ogeometry, omaterial );
const octahedron3 = new THREE.Mesh( ogeometry2, omaterial );

octahedron.position.x = -20;
octahedron.position.y = 10;
octahedron.position.z = 10;
octahedron2.position.x = 20;
octahedron2.position.y = 10;
octahedron2.position.z = 10;
octahedron3.position.x = 5;
octahedron3.position.y = 13;
octahedron3.position.z = -5;

scene.add( octahedron );
scene.add( octahedron2 );
scene.add( octahedron3 );

octahedron.name = 'Diamond1';
octahedron2.name = 'Diamond2';
octahedron3.name = 'Diamond3';

octahedron.castShadow = true;
octahedron2.castShadow = true;
octahedron3.castShadow = true;


// spotlight
const spotlight = new THREE.SpotLight(0xFFFFFF, 5, 100, Math.PI/4, 1, 2);
spotlight.position.set(25,50,20);
spotlight.castShadow = true;
scene.add(spotlight);
// const spotHelper = new THREE.SpotLightHelper(spotlight, 0x0000FF);
// scene.add(spotHelper);

loader.load('./Chest.gltf', (e)=>{
    console.log(e);
    let model = e.scene;
    model.name = 'chest';
    model.scale.set(30, 30, -30);
    model.position.y = 2;
    model.position.z = 13;

    model.castShadow = true;
    scene.add(model);
})


let raycast = new THREE.Raycaster();
let mouse = new THREE.Vector2();

let animation = false;
let changeCam = false;
function onclick(event) {
    mouse.x = (event.clientX/window.innerWidth) * 2 - 1; 
    mouse.y = -(event.clientY/window.innerHeight) * 2 + 1; 
    
    raycast.setFromCamera(mouse, persCam);

    const intersects = raycast.intersectObjects(scene.children);
    for(let i = 0; i < intersects.length; i++) {
        if(intersects[i].object.name == 'Diamond1') {
            animation = true;
            changeCam = !changeCam;
        } else if(intersects[i].object.name == 'Diamond2') {
            animation = true;
            changeCam = !changeCam;
        }else if(intersects[i].object.name == 'Diamond3') {
            animation = true;
            changeCam = !changeCam;
        }
    }
}
document.addEventListener("pointerdown", onclick);


let textureLoader = new THREE.TextureLoader();
let texture = [
    new THREE.MeshBasicMaterial({
        map:textureLoader.load('./skybox/dessert_skybox_right.gif'), side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map:textureLoader.load('./skybox/dessert_skybox_left.gif'), side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map:textureLoader.load('./skybox/dessert_skybox_top.gif'), side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map:textureLoader.load('./skybox/dessert_skybox_bottom.gif'), side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map:textureLoader.load('./skybox/dessert_skybox_front.gif'), side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map:textureLoader.load('./skybox/dessert_skybox_back.gif'), side: THREE.DoubleSide
    })
]

const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
const cube = new THREE.Mesh(geometry, texture);
scene.add(cube);

function animate(){
    if(animation) {
        octahedron.rotation.x += 0.02;
        octahedron.rotation.y += 0.02;
        octahedron2.rotation.x += 0.02;
        octahedron2.rotation.y += 0.02;
        octahedron3.rotation.x += 0.02;
        octahedron3.rotation.y += 0.02;
    }
    if(!changeCam){
        renderer.render(scene, persCam);
    }else{
        renderer.render(scene, persCam2);
    }
    requestAnimationFrame(animate);
}
animate();

document.body.appendChild(renderer.domElement);




