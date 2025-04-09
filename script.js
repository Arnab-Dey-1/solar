// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls for Zoom and Pan
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 20;
controls.maxDistance = 200;

// Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow Sun
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 0, 0); // Ensure Sun is at the center
scene.add(sun);

// Planet Data (Simplified, No Textures)
const planets = [
    { name: "mercury", radius: 0.2, distance: 10, speed: 0.02, color: 0xaaaaaa, moons: [] },
    { name: "venus", radius: 0.4, distance: 15, speed: 0.015, color: 0xffcc00, moons: [] },
    { name: "earth", radius: 0.5, distance: 20, speed: 0.01, color: 0x0000ff, moons: [
        { name: "moon", radius: 0.1, distance: 2, speed: 0.05, color: 0xaaaaaa }
    ] },
    { name: "mars", radius: 0.3, distance: 25, speed: 0.008, color: 0xff0000, moons: [
        { name: "phobos", radius: 0.05, distance: 1, speed: 0.07, color: 0xaaaaaa },
        { name: "deimos", radius: 0.04, distance: 1.5, speed: 0.06, color: 0xaaaaaa }
    ] },
    { name: "jupiter", radius: 1, distance: 35, speed: 0.005, color: 0xffa500, moons: [
        { name: "io", radius: 0.15, distance: 3, speed: 0.04, color: 0xaaaaaa },
        { name: "europa", radius: 0.12, distance: 4, speed: 0.03, color: 0xaaaaaa }
    ] },
    { name: "saturn", radius: 0.9, distance: 45, speed: 0.004, color: 0xffff99, moons: [
        { name: "titan", radius: 0.1, distance: 3, speed: 0.035, color: 0xaaaaaa }
    ] },
    { name: "uranus", radius: 0.7, distance: 55, speed: 0.003, color: 0x00ffff, moons: [
        { name: "titania", radius: 0.08, distance: 2.5, speed: 0.03, color: 0xaaaaaa }
    ] },
    { name: "neptune", radius: 0.7, distance: 65, speed: 0.002, color: 0x000099, moons: [
        { name: "triton", radius: 0.1, distance: 3, speed: 0.025, color: 0xaaaaaa }
    ] }
];

// Create Planets and Moons
const planetMeshes = [];
planets.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: planet.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance; // Initial position
    scene.add(mesh);
    planetMeshes.push({ mesh, planet });

    // Moons
    planet.moons.forEach(moon => {
        const moonGeometry = new THREE.SphereGeometry(moon.radius, 16, 16);
        const moonMaterial = new THREE.MeshBasicMaterial({ color: moon.color });
        const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
        moonMesh.position.x = moon.distance;
        mesh.add(moonMesh);
        moon.mesh = moonMesh;
    });
});

// Starfield (Reduced for Simplicity)
const starGeometry = new THREE.BufferGeometry();
const starCount = 1000; // Reduced from 10,000
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Lighting (Simplified)
const light = new THREE.PointLight(0xffffff, 1, 0);
light.position.set(0, 0, 0);
scene.add(light);

// Camera Position (Top-Down View)
camera.position.set(0, 100, 0);
camera.lookAt(0, 0, 0);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate Sun
    sun.rotation.y += 0.01;

    // Orbit Planets and Moons
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
