//to do list
//min and max added and x and y positions
// make it continous so another ball spawns when
// Main variables
//fix line 190 and the function so that it is one big function that checks all values
let scene, camera, renderer
let cannonBalls = []
let ballMeshes = []
let cannonBody, cannonMesh
let groundBody, groundMesh

// Physics parameters
let gravity = 9.8
let cannonAngle = 45
let cannonSpeed = 20
let ballCount = 5
let ballSize = 0.5
let world
// Mouse controls for camera
/*
let mouseX = 0,
  mouseY = 0
let targetRotationX = 0,
  targetRotationY = 0
*/
let isDragging = false

// Initialize the scene
function initialize () {
  // Create scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a1929)
  scene.fog = new THREE.Fog(0x0a1929, 20, 50)

  // Create camera
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 5, 15)

  // Create renderer
  renderer = new THREE.WebGLRenderer
  renderer.setSize(
    document.getElementById('scene-container').offsetWidth,
    document.getElementById('scene-container').offsetHeight
  )
  renderer.shadowMap.enabled = true
  document.getElementById('scene-container').appendChild(renderer.domElement)
 
  // Create physics world
  world = new CANNON.World()
  world.gravity.set(0, -gravity, 0)
  //world.broadphase = new CANNON.NaiveBroadphase();
  //world.solver.iterations = 100;

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
  directionalLight.position.set(5, 10, 7)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // Create ground
  const groundGeometry = new THREE.PlaneGeometry(20, 20)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a5b3c,

  })

  groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
  groundMesh.rotation.x = -Math.PI / 2
  // Is for the ground to show properly
  groundMesh.receiveShadow = true
  scene.add(groundMesh)

  // Create ground physics body
  const groundShape = new CANNON.Plane()
  groundBody = new CANNON.Body({ mass: 0 })
  groundBody.addShape(groundShape)
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  // Cannon 
  world.addBody(groundBody)

  // Create cannon
  createCannon()

  // Add event listeners for controls
  setupEventListeners()

  // Start animation loop
  animate()
}

function createCannon () {
  // Remove existing cannon if it exists
  if (cannonMesh) {
    scene.remove(cannonMesh)
  }

  // Create cannon body (physics)
  const cannonShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.2, 0.2))
  cannonBody = new CANNON.Body({ mass: 0 })
  cannonBody.addShape(cannonShape)
  cannonBody.position.set(0, 0.2, 0)
  world.addBody(cannonBody)

  // Create cannon mesh (visual)
  const cannonGeometry = new THREE.BoxGeometry(1, 0.4, 0.4)
  const cannonMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.7,
    roughness: 0.3
  })

  cannonMesh = new THREE.Mesh(cannonGeometry, cannonMaterial)
  cannonMesh.castShadow = true
  scene.add(cannonMesh)

  // Position the cannon mesh to match physics body
  //updateCannonPosition()
}
/*
function updateCannonPosition () {
  if (cannonMesh && cannonBody) {
    cannonMesh.position.copy(cannonBody.position)
    cannonMesh.quaternion.copy(cannonBody.quaternion)
  }
}
  */

function launchBalls () {
  // Remove existing balls
  clearBalls()

  current_cannon_speed = cannonSpeed
  // Create new balls
  for (let i = 0; i < ballCount; i++) {
    cannonSpeed = current_cannon_speed + i
    createBall()
  }
  cannonSpeed = current_cannon_speed
}

function createBall () {
  // Create physics body
  const ballShape = new CANNON.Sphere(ballSize)
  const ballBody = new CANNON.Body({ mass: 1 })
  ballBody.addShape(ballShape)

  // Set initial position at cannon
  ballBody.position.set(0, 0.5, 0)

  // Calculate velocity based on angle and speed
  const radians = (cannonAngle * Math.PI) / 180
  const velocityX = cannonSpeed * Math.cos(radians)
  const velocityZ = cannonSpeed * Math.sin(radians)

  ballBody.velocity.set(velocityX,0,velocityZ)

  // Add to world
  world.addBody(ballBody)
  cannonBalls.push(ballBody)

  // Create visual mesh
  const ballGeometry = new THREE.SphereGeometry(ballSize, 32, 32)
  const ballMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(Math.random() * 0xffffff),
    metalness: 0.3,
    roughness: 0.4
  })

  const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial)
  ballMesh.castShadow = true
  scene.add(ballMesh)
  ballMeshes.push(ballMesh)
}

function clearBalls () {
  // Remove physics bodies
  
  for (const ball of cannonBalls) {
    world.removeBody(ball)
  }

  for (const mesh of ballMeshes) {
    scene.remove(mesh)
  }
  // Remove visual meshes

}

function setupEventListeners () {
  // Gravity slider
  const gravitySlider = document.getElementById('gravity')
  const gravityValue = document.getElementById('gravity-value')

  gravitySlider.addEventListener('input', function () {
    gravity = parseFloat(this.value)
    gravityValue.value = gravity
    world.gravity.set(0, -gravity, 0)
  })

  // Cannon angle slider
  const cannonAngleSlider = document.getElementById('cannon-angle')
  const cannonAngleValue = document.getElementById('cannon-angle-value')

  cannonAngleSlider.addEventListener('input', function () {
    cannonAngle = parseInt(this.value)
    cannonAngleValue.value = cannonAngle
    updateCannonOrientation()
  })

  // Cannon speed slider
  const cannonSpeedSlider = document.getElementById('cannon-speed')
  const cannonSpeedValue = document.getElementById('cannon-speed-value')

  cannonSpeedSlider.addEventListener('input', function () {
    cannonSpeed = parseInt(this.value)
    cannonSpeedValue.value = cannonSpeed
  })

  // Ball count slider
  const ballCountSlider = document.getElementById('ball-count')
  const ballCountValue = document.getElementById('ball-count-value')

  ballCountSlider.addEventListener('input', function () {
    ballCount = parseInt(this.value)
    ballCountValue.value = ballCount
  })

  // Ball size slider
  const ballSizeSlider = document.getElementById('ball-size')
  const ballSizeValue = document.getElementById('ball-size-value')

  ballSizeSlider.addEventListener('input', function () {
    ballSize = parseFloat(this.value)
    ballSizeValue.value = ballSize
  })

  // Launch button
  document.getElementById('launch-btn').addEventListener('click', launchBalls)

  // Window resize
  window.addEventListener('resize', function () {
    camera.aspect =
      document.getElementById('scene-container').offsetWidth /
      document.getElementById('scene-container').offsetHeight
    camera.updateProjectionMatrix()
    renderer.setSize(
      document.getElementById('scene-container').offsetWidth,
      document.getElementById('scene-container').offsetHeight
    )
  })
/*
  renderer.domElement.addEventListener('mousedown', function (event) {
    isDragging = true
    mouseX = event.clientX
    mouseY = event.clientY
  })

  window.addEventListener('mousemove', function (event) {
    if (isDragging) {
      const deltaX = event.clientX - mouseX
      const deltaY = event.clientY - mouseY

      targetRotationY += deltaX * 0.01
      targetRotationX += deltaY * 0.01

      mouseX = event.clientX
      mouseY = event.clientY
    }
  })

  window.addEventListener('mouseup', function () {
    isDragging = false
  })
    */
}

function updateCannonOrientation () {
  // Update cannon body orientation
  if (cannonBody) {
    const radians = (cannonAngle * Math.PI) / 180
    cannonBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), radians)
  }
}

function animate () {
  requestAnimationFrame(animate)

  // Update physics
  world.step(1 / 60)  

  // Update cannon position
  //updateCannonPosition()

  // Update ball positions
  cannonBalls.forEach((ball, index) => {
    if (index < ballMeshes.length) {
      ballMeshes[index].position.copy(ball.position)
      ballMeshes[index].quaternion.copy(ball.quaternion)
    }
  })

  // Smooth camera rotation
  /*X = Math.sin(targetRotationX) * 5
  const targetZ = Math.cos(targetRotationX) * 15

  camera.position.x = targetX
  camera.position.z = targetZ
  */
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
}
function resetBall (i, canvas) {
  velocity[i] =
    Math.random() * (simulator.maxVelocity - simulator.minVelocity) +
    simulator.minVelocity
  launchAngle[i] =
    Math.random() * (simulator.maxLaunchAngle - simulator.minLaunchAngle) +
    simulator.minLaunchAngle
  gravity[i] =
    Math.random() * (simulator.maxGravity - simulator.minGravity) +
    simulator.minGravity
  airResistance[i] =
    Math.random() * (simulator.maxAirResistance - simulator.minAirResistance) +
    simulator.minAirResistance
  ballColors[i] = color[Math.floor(Math.random() * color.length)]

  x[i] = simulator.xPos = parseFloat(xPos.value)
  y[i] = simulator.yPos = parseFloat(yPos.value)
  vx[i] = -velocity[i] * Math.cos((launchAngle[i] * Math.PI) / 180)
  vy[i] = -velocity[i] * Math.sin((launchAngle[i] * Math.PI) / 180)
}
// Initialize the application
window.onload = initialize
// this file has used help from generative ai
