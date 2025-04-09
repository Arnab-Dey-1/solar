// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Orbit Controls for Zoom and Pan
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 200;

// Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet Data
const planets = [
    { name: "Mercury", radius: 0.2, distance: 10, speed: 0.02, color: 0xaaaaaa, moons: [] },
    { name: "Venus", radius: 0.4, distance: 15, speed: 0.015, color: 0xffcc00, moons: [] },
    { name: "Earth", radius: 0.5, distance: 20, speed: 0.01, color: 0x0000ff, moons: [
        { radius: 0.1, distance: 2, speed: 0.05 }
    ] },
    { name: "Mars", radius: 0.3, distance: 25, speed: 0.008, color: 0xff0000, moons: [
        { radius: 0.05, distance: 1, speed: 0.07 },
        { radius: 0.04, distance: 1.5, speed: 0.06 }
    ] },
    { name: "Jupiter", radius: 1, distance: 35, speed: 0.005, color: 0xffa500, moons: [
        { radius: 0.15, distance: 3, speed: 0.04 },
        { radius: 0.12, distance: 4, speed: 0.03 }
    ] },
    { name: "Saturn", radius: 0.9, distance: 45, speed: 0.004, color: 0xffff99, moons: [
        { radius: 0.1, distance: 3, speed: 0.035 }
    ] },
    { name: "Uranus", radius: 0.7, distance: 55, speed: 0.003, color: 0x00ffff, moons: [
        { radius: 0.08, distance: 2.5, speed: 0.03 }
    ] },
    { name: "Neptune", radius: 0.7, distance: 65, speed: 0.002, color: 0x000099, moons: [
        { radius: 0.1, distance: 3, speed: 0.025 }
    ] }
];

// Create Planets and Moons
const planetMeshes = [];
planets.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: planet.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance;
    scene.add(mesh);
    planetMeshes.push({ mesh, planet });

    planet.moons.forEach(moon => {
        const moonGeometry = new THREE.SphereGeometry(moon.radius, 16, 16);
        const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
        const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
        moonMesh.position.x = moon.distance;
        mesh.add(moonMesh);
        moon.mesh = moonMesh;
    });
});

// Starfield
const starGeometry = new THREE.BufferGeometry();
const starCount = 10000;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Lighting
const light = new THREE.PointLight(0xffffff, 1, 0);
light.position.set(0, 0, 0);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Camera Position
camera.position.z = 50;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    sun.rotation.y += 0.01;

    planetMeshes.forEach(({ mesh, planet }) => {
        mesh.position.x = Math.cos(Date.now() * planet.speed / 1000) * planet.distance;
        mesh.position.z = Math.sin(Date.now() * planet.speed / 1000) * planet.distance;
        mesh.rotation.y += 0.02;

        planet.moons.forEach(moon => {
            moon.mesh.position.x = Math.cos(Date.now() * moon.speed / 1000) * moon.distance;
            moon.mesh.position.z = Math.sin(Date.now() * moon.speed / 1000) * moon.distance;
        });
    });

    controls.update();
    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
