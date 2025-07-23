import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

// Pause control variables
let isPaused = false;
let pauseStartTime = 0;
let pausedTimeTotal = 0;

// Raycasting for planet hover detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let planetObjects = []; // Store all planet meshes and their names for tooltips

// THREE.js essentials
let scene, camera, renderer, controls, skybox;

// Planet meshes
let planet_sun,
  planet_earth,
  planet_mercury,
  planet_venus,
  planet_mars,
  planet_jupiter,
  planet_saturn,
  planet_uranus,
  planet_neptune;

// Orbit radii
let mercury_orbit_radius = 50;
let venus_orbit_radius = 60;
let earth_orbit_radius = 70;
let mars_orbit_radius = 80;
let jupiter_orbit_radius = 100;
let saturn_orbit_radius = 120;
let uranus_orbit_radius = 140;
let neptune_orbit_radius = 160;

// Revolution speeds stored globally for slider control
window.mercury_revolution_speed = 2;
window.venus_revolution_speed = 1.5;
window.earth_revolution_speed = 1;
window.mars_revolution_speed = 0.8;
window.jupiter_revolution_speed = 0.7;
window.saturn_revolution_speed = 0.6;
window.uranus_revolution_speed = 0.5;
window.neptune_revolution_speed = 0.4;

//  Returns array of materials for 6-sided skybox

function createMatrixArray() {
  const skyboxImagepaths = [
    "../img/skybox/space_ft.png",
    "../img/skybox/space_bk.png",
    "../img/skybox/space_up.png",
    "../img/skybox/space_dn.png",
    "../img/skybox/space_rt.png",
    "../img/skybox/space_lf.png",
  ];

  return skyboxImagepaths.map((image) => {
    const texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
}

//  Adds skybox cube to scene

function setSkyBox() {
  const materialArray = createMatrixArray();
  const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}

// Creates orbit rings for planets

function createRing(outerRadius) {
  const innerRadius = outerRadius - 0.1;
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 200);
  const material = new THREE.MeshBasicMaterial({
    color: "grey",
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  return ring;
}

//  Loads sphere planet with texture

function loadPlanetTexture(
  texture,
  radius,
  widthSegments,
  heightSegments,
  meshType
) {
  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );
  const planetTexture = new THREE.TextureLoader().load(texture);
  const material =
    meshType === "standard"
      ? new THREE.MeshStandardMaterial({ map: planetTexture })
      : new THREE.MeshBasicMaterial({ map: planetTexture });

  return new THREE.Mesh(geometry, material);
}

// Adds visible rings like Saturn's

function addPlanetRing(planet, innerRadius, outerRadius) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 200);
  const material = new THREE.MeshBasicMaterial({
    color: "grey",
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2;
  planet.add(ring);
}

//  Adds random background stars

function addStars(count) {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
  const starPositions = [];

  for (let i = 0; i < count; i++) {
    starPositions.push(
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000
    );
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starPositions, 3)
  );
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

//  Creates Dark/Light mode toggle button

function createDarkLightToggle() {
  const toggleButton = document.createElement("button");
  toggleButton.textContent = "Toggle Dark/Light";
  Object.assign(toggleButton.style, {
    position: "fixed",
    top: "60px",
    right: "10px",
    padding: "10px 20px",
    background: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    zIndex: "999",
  });

  let isDarkMode = true;

  toggleButton.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    skybox.visible = isDarkMode;
    renderer.setClearColor(isDarkMode ? 0x000000 : 0xffffff);
    toggleButton.style.background = isDarkMode ? "#333" : "#ddd";
    toggleButton.style.color = isDarkMode ? "#fff" : "#000";
  });

  document.body.appendChild(toggleButton);
}

// Initial angles for planets to avoid them all starting in a straight line
const planetInitialAngles = {
  mercury: 0,
  venus: Math.PI / 4,
  earth: Math.PI / 2,
  mars: (3 * Math.PI) / 4,
  jupiter: Math.PI,
  saturn: (5 * Math.PI) / 4,
  uranus: (3 * Math.PI) / 2,
  neptune: (7 * Math.PI) / 4,
};

//  Initializes scene, camera, planets, and controls

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    85,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  setSkyBox();

  // Load planets
  planet_sun = loadPlanetTexture("../img/sun_hd.jpg", 20, 100, 100, "basic");
  planet_earth = loadPlanetTexture(
    "../img/earth_hd.jpg",
    4,
    100,
    100,
    "standard"
  );
  planet_mercury = loadPlanetTexture(
    "../img/mercury_hd.jpg",
    2,
    100,
    100,
    "standard"
  );
  planet_venus = loadPlanetTexture(
    "../img/venus_hd.jpg",
    3,
    100,
    100,
    "standard"
  );
  planet_mars = loadPlanetTexture(
    "../img/mars_hd.jpg",
    3.5,
    100,
    100,
    "standard"
  );
  planet_jupiter = loadPlanetTexture(
    "../img/jupiter_hd.jpg",
    10,
    100,
    100,
    "standard"
  );
  planet_saturn = loadPlanetTexture(
    "../img/saturn_hd.jpg",
    8,
    100,
    100,
    "standard"
  );
  planet_uranus = loadPlanetTexture(
    "../img/uranus_hd.jpg",
    6,
    100,
    100,
    "standard"
  );
  planet_neptune = loadPlanetTexture(
    "../img/neptune_hd.jpg",
    5,
    100,
    100,
    "standard"
  );

  // Rings for Saturn and Jupiter
  addPlanetRing(planet_saturn, 9, 12);
  addPlanetRing(planet_jupiter, 14, 14.2);

  // Add planets to scene
  scene.add(
    planet_sun,
    planet_earth,
    planet_mercury,
    planet_venus,
    planet_mars,
    planet_jupiter,
    planet_saturn,
    planet_uranus,
    planet_neptune
  );

  // Planet info for tooltips
  planetObjects = [
    { mesh: planet_mercury, name: "Mercury" },
    { mesh: planet_venus, name: "Venus" },
    { mesh: planet_earth, name: "Earth" },
    { mesh: planet_mars, name: "Mars" },
    { mesh: planet_jupiter, name: "Jupiter" },
    { mesh: planet_saturn, name: "Saturn" },
    { mesh: planet_uranus, name: "Uranus" },
    { mesh: planet_neptune, name: "Neptune" },
  ];

  // Light source at sun
  const sunLight = new THREE.PointLight(0xffffff, 1, 0);
  sunLight.position.copy(planet_sun.position);
  scene.add(sunLight);

  // Orbit rings
  [
    mercury_orbit_radius,
    venus_orbit_radius,
    earth_orbit_radius,
    mars_orbit_radius,
    jupiter_orbit_radius,
    saturn_orbit_radius,
    uranus_orbit_radius,
    neptune_orbit_radius,
  ].forEach(createRing);

  // Renderer setup
  // renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);
  
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); // Change alpha to false
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  renderer.domElement.style.cssText =
    "display: block; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;";

  // Camera controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 12;
  controls.maxDistance = 1000;

  camera.position.z = 100;
  planet_earth.position.x = planet_sun.position.x + earth_orbit_radius;
}

// Creates tooltip display on planet hover

function setupTooltip() {
  const tooltip = document.createElement("div");
  Object.assign(tooltip.style, {
    position: "fixed",
    padding: "5px 8px",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    borderRadius: "4px",
    fontSize: "12px",
    pointerEvents: "none",
    display: "none",
    zIndex: "1000",
  });
  document.body.appendChild(tooltip);

  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
      planetObjects.map((p) => p.mesh)
    );

    if (intersects.length) {
      const hovered = intersects[0].object;
      const planetInfo = planetObjects.find((p) => p.mesh === hovered);

      if (planetInfo) {
        tooltip.style.display = "block";
        tooltip.textContent = planetInfo.name;
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
        return;
      }
    }
    tooltip.style.display = "none";
  });
}

//  Adds sliders to control revolution speed

function createSpeedControls() {
  const controlPanel = document.createElement("div");
  Object.assign(controlPanel.style, {
    position: "fixed",
    top: "10px",
    left: "10px",
    background: "rgba(0,0,0,0.5)",
    padding: "10px",
    color: "#fff",
    zIndex: "999",
    maxWidth: "200px",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    borderRadius: "8px",
  });

  document.body.appendChild(controlPanel);

  const planets = [
    { name: "Mercury", speedVar: "mercury_revolution_speed" },
    { name: "Venus", speedVar: "venus_revolution_speed" },
    { name: "Earth", speedVar: "earth_revolution_speed" },
    { name: "Mars", speedVar: "mars_revolution_speed" },
    { name: "Jupiter", speedVar: "jupiter_revolution_speed" },
    { name: "Saturn", speedVar: "saturn_revolution_speed" },
    { name: "Uranus", speedVar: "uranus_revolution_speed" },
    { name: "Neptune", speedVar: "neptune_revolution_speed" },
  ];

  planets.forEach((planet) => {
    const label = document.createElement("label");
    label.textContent = `${planet.name} Speed`;
    label.style.display = "block";
    label.style.marginTop = "8px";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0.1";
    slider.max = "10";
    slider.step = "0.1";
    slider.value = window[planet.speedVar];

    slider.addEventListener("input", (e) => {
      window[planet.speedVar] = parseFloat(e.target.value);
    });

    controlPanel.appendChild(label);
    controlPanel.appendChild(slider);
  });
}

//  Pause and Resume button for simulation

function createPauseButton() {
  const pauseButton = document.createElement("button");
  pauseButton.textContent = "Pause";
  Object.assign(pauseButton.style, {
    position: "fixed",
    top: "10px",
    right: "10px",
    padding: "10px 20px",
    background: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    zIndex: "999",
  });

  pauseButton.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? "Resume" : "Pause";
    if (isPaused) pauseStartTime = performance.now();
    else pausedTimeTotal += performance.now() - pauseStartTime;
  });

  document.body.appendChild(pauseButton);
}

// Positions planets in circular orbits

function planetRevolver(time, speed, planet, orbitRadius, initialAngle = 0) {
  const angle = time * 0.001 * speed + initialAngle;
  planet.position.x = planet_sun.position.x + orbitRadius * Math.cos(angle);
  planet.position.z = planet_sun.position.z + orbitRadius * Math.sin(angle);
}

//  Main render loop

function animate(time) {
  requestAnimationFrame(animate);

  if (isPaused) {
    controls.update();
    renderer.render(scene, camera);
    return;
  }

  const effectiveTime = time - pausedTimeTotal;

  // Planet rotations
  const rotationSpeed = 0.005;
  [
    planet_sun,
    planet_earth,
    planet_mercury,
    planet_venus,
    planet_mars,
    planet_jupiter,
    planet_saturn,
    planet_uranus,
    planet_neptune,
  ].forEach((planet) => {
    planet.rotation.y += rotationSpeed;
  });


  // Orbit motions

  planetRevolver(
    effectiveTime,
    window.mercury_revolution_speed,
    planet_mercury,
    mercury_orbit_radius,
    planetInitialAngles.mercury
  );
  planetRevolver(
    effectiveTime,
    window.venus_revolution_speed,
    planet_venus,
    venus_orbit_radius,
    planetInitialAngles.venus
  );
  planetRevolver(
    effectiveTime,
    window.earth_revolution_speed,
    planet_earth,
    earth_orbit_radius,
    planetInitialAngles.earth
  );
  planetRevolver(
    effectiveTime,
    window.mars_revolution_speed,
    planet_mars,
    mars_orbit_radius,
    planetInitialAngles.mars
  );
  planetRevolver(
    effectiveTime,
    window.jupiter_revolution_speed,
    planet_jupiter,
    jupiter_orbit_radius,
    planetInitialAngles.jupiter
  );
  planetRevolver(
    effectiveTime,
    window.saturn_revolution_speed,
    planet_saturn,
    saturn_orbit_radius,
    planetInitialAngles.saturn
  );
  planetRevolver(
    effectiveTime,
    window.uranus_revolution_speed,
    planet_uranus,
    uranus_orbit_radius,
    planetInitialAngles.uranus
  );
  planetRevolver(
    effectiveTime,
    window.neptune_revolution_speed,
    planet_neptune,
    neptune_orbit_radius,
    planetInitialAngles.neptune
  );

  controls.update();
  renderer.render(scene, camera);
}

//  Handles responsive resizing

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize everything
window.addEventListener("resize", onWindowResize);

init();
addStars(2000);
createSpeedControls();
createPauseButton();
createDarkLightToggle();
setupTooltip();
animate(0);
