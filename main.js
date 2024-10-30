import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import JSConfetti from "js-confetti";
import { Fireworks } from 'fireworks-js';

const loader = new GLTFLoader();

const canvas = document.querySelector("#parentcanvas");
const bg = document.querySelector("#app");

const fireworkcanvas = document.querySelector('#childcanvas');
const fireworks = new Fireworks(bg);
fireworks.start();

// bg.addEventListener("click", function () {
//   const jsConfetti = new JSConfetti({ bg });

//   jsConfetti.addConfetti({
//     emojis: ["💰","💸","🪙"],
//     emojiSize: 50,
//   });
//   setTimeout(function(){
//     jsConfetti.clearCanvas();
//   }, 3000)
// });

// const context = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Initial resize
resizeCanvas();

// Resize canvas whenever the window is resized
window.addEventListener("resize", resizeCanvas);

const scene = new THREE.Scene();
scene.receiveShadow = true;

let model;
loader.load("/models/diwali_3d_poster/scene.gltf", function (gltf) {
  // console.log(gltf);
  const model = gltf.scene;
  model.position.set(0, -5, 0);
  model.rotateY(Math.PI);
  model.rotateX(0.2);

  scene.add(model);
});

const pointLightContainer = new THREE.Object3D();
scene.add(pointLightContainer);

const light = new THREE.PointLight(0xfffc00, 1000, 100);
light.position.set(12, 7, 5);
light.castShadow = true;
scene.add(light);
pointLightContainer.add(light);
// light.target = model;

// const lightHelper = new THREE.PointLightHelper(light, 1);
// scene.add(lightHelper);

const alight = new THREE.AmbientLight(0xffffff, 5);
scene.add(alight);

//constants
const sizes = {
  width: canvas.width,
  height: canvas.height,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, -30);
camera.lookAt(0, 0, 0);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    alpha:true,
  antialias: true,
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, renderer.domElement);

function action() {
  requestAnimationFrame(action);
  pointLightContainer.rotation.y += Math.sin(0.005);
  pointLightContainer.rotation.x -= Math.tan(0.001);

  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(sizes.width, sizes.height);
});

action();
