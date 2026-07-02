import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Grundeinstellungen ---
const BASEPLATE_SIZE = 256; // Kantenlänge der Baseplate
const GRID_CELL = 4;        // Rastergröße

// --- Szene, Kamera, Renderer ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 200, 600);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.set(60, 50, 60);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('app').appendChild(renderer.domElement);

// --- Steuerung ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI / 2 - 0.02; // nicht unter die Platte schauen
controls.minDistance = 5;
controls.maxDistance = 500;

// --- Licht ---
scene.add(new THREE.HemisphereLight(0xffffff, 0x668866, 0.9));
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(80, 120, 60);
scene.add(sun);

// --- Baseplate ---
const baseplate = new THREE.Mesh(
  new THREE.BoxGeometry(BASEPLATE_SIZE, 2, BASEPLATE_SIZE),
  new THREE.MeshStandardMaterial({ color: 0x6d8f5a, roughness: 0.9 })
);
baseplate.position.y = -1; // Oberkante liegt bei y = 0
baseplate.name = 'Baseplate';
scene.add(baseplate);

const grid = new THREE.GridHelper(
  BASEPLATE_SIZE,
  BASEPLATE_SIZE / GRID_CELL,
  0x5e7d50,
  0x5e7d50
);
grid.position.y = 0.01;
grid.material.transparent = true;
grid.material.opacity = 0.35;
scene.add(grid);

// --- Fenstergröße ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Render-Schleife ---
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
