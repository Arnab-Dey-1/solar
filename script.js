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

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Sun with Glow
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunTexture = textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/sun_texture.jpg');
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Sun Glow
const spriteMaterial = new THREE.SpriteMaterial({
    map: textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/glow.png'),
    color: 0xffff00,
    transparent: true,
    blending: THREE.AdditiveBlending
});
const sprite = new THREE.Sprite(spriteMaterial);
sprite.scale.set(20, 20, 1.0);
sun.add(sprite);

// Planet Data with Textures and Orbits
const planets = [
    { name: "mercury", radius: 0.2, distance: 10, speed: 0.02, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/mercury_texture.jpg', moons: [] },
    { name: "venus", radius: 0.4, distance: 15, speed: 0.015, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/venus_texture.jpg', moons: [] },
    { name: "earth", radius: 0.5, distance: 20, speed: 0.01, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earth_texture.jpg', moons: [
        { name: "moon", radius: 0.1, distance: 2, speed: 0.05, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/moon_texture.jpg' }
    ] },
    { name: "mars", radius: 0.3, distance: 25, speed: 0.008, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/mars_texture.jpg', moons: [
        { name: "phobos", radius: 0.05, distance: 1, speed: 0.07, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/moon_texture.jpg' },
        { name: "deimos", radius: 0.04, distance: 1.5, speed: 0.06, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/moon_texture.jpg' }
    ] },
    { name: "jupiter", radius: 1, distance: 35, speed: 0.005, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/jupiter_texture.jpg', moons: [
        { name: "io", radius: 0.15, distance: 3, speed: 0.04, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/moon_texture.jpg' },
        { name: "europa", radius: 0.12, distance: 4, speed: 0.03, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/moon_texture.jpg' }
    ] },
    { name: "saturn", radius: 0.9, distance: 45, speed: 0.004, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/saturn_texture.jpg', moons: [
        { name: "titan", radius: 0.1, distance: 3, speed: 0.035, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/moon_texture.jpg' }
    ] },
    { name: "uranus", radius: 0.7, distance: 55, speed: 0.003, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/uranus_texture.jpg', moons: [
        { name: "titania", radius: 0.08, distance: 2.5, speed: 0.03, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/moon_texture.jpg' }
    ] },
    { name: "neptune", radius: 0.7, distance: 65, speed: 0.002, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/neptune_texture.jpg', moons: [
        { name: "triton", radius: 0.1, distance: 3, speed: 0.025, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/moon_texture.jpg' }
    ] }
];

// Create Planets, Moons, and Orbital Paths
const planetMeshes = [];
planets.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const texture = textureLoader.load(planet.texture);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance;
    scene.add(mesh);
    planetMeshes.push({ mesh, planet });

    // Orbital Path (like CSS border)
    const pathGeometry = new THREE.RingGeometry(planet.distance - 0.05, planet.distance + 0.05, 64);
    const pathMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    path.rotation.x = Math.PI / 2;
    scene.add(path);

    // Moons
    planet.moons.forEach(moon => {
        const moonGeometry = new THREE.SphereGeometry(moon.radius, 16, 16);
        const moonTexture = textureLoader.load(moon.texture);
        const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
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
const light = new THREE.PointLight(0xffffff, 2, 0);
light.position.set(0, 0, 0);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

// Camera Position (Top-Down View)
camera.position.set(0, 100, 0);
camera.lookAt(0, 0, 0);

// Animation Loop (like CSS @keyframes orbit)
function animate() {
    requestAnimationFrame(animate);

    sun.rotation.y += 0.01;

    planetMeshes.forEach(({ mesh, planet }) => {
        // Orbit around Sun (like CSS transform: rotate)
        mesh.position.x = Math.cos(Date.now() * planet.speed / 1000) * planet.distance;
        mesh.position.z = Math.sin(Date.now() * planet.speed / 1000) * planet.distance;
        mesh.rotation.y += 0.02;

        // Moons orbit their planets
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
