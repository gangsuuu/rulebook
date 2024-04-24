import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { gsap } from 'gsap';
import { degToRad } from 'three/src/math/MathUtils.js';

export default function () {
  /** 변수 */

  //** const */

  //** let */
  
  //** param */



  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });

  // renderer.outputEncoding = new THREE.sRGBEncoding;
  // renderer.autoClear = false;

  const container = document.querySelector('#container');
  container.appendChild(renderer.domElement);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // 
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );

  /** fog */
  scene.fog = new THREE.Fog( 0x00b81414, 2, 19 );
  console.log(scene.fog)

  /** layerModel */

  /** library */

  /** Camera */
  camera.position.set(0, 0, 5);

  /** Controls */
  const orbitControls = () => {
    const controls = new OrbitControls(camera, renderer.domElement);

    // controls.enabled = false;  // controls off
    return controls;
  }
  
  /** light */
  const pointLight = new THREE.PointLight(0xffaa00,1,100)

  pointLight.position.set(1,1,50)

  scene.add(pointLight)

  /** texture */
  const loader = new THREE.TextureLoader();
  const texture = loader.load("public/assets/test.png")
  const texture2 = loader.load("public/assets/test2.png")
  let object 
  let object2 

  /** create */
  const create = () => {
    const geometry = new THREE.PlaneGeometry(2,2.7)  ;
    const material  = new THREE.MeshBasicMaterial({
      // color: '#7FAEDA',
      map:texture,
      transparent: true
    })
    const mesh = new THREE.Mesh(
      geometry,
      material
    )
    const geometry2 = new THREE.PlaneGeometry(2,2.7)  ;
    const material2  = new THREE.MeshBasicMaterial({
      // color: '#7FAEDA',
      map:texture2,
      transparent: true,
      // side: THREE.DoubleSide
    })
    const mesh2 = new THREE.Mesh(
      geometry2,
      material2
    )



    scene.add(mesh);  
    scene.add(mesh2);  
    mesh.rotation.z = 0.3
    mesh2.rotation.z = -0.3
    mesh2.rotation.y = degToRad(180)
    object = mesh
    object2 = mesh2
  };


  /** resize */
  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };


  /** addEvent */
  const addEvent = () => {
    window.addEventListener('resize', resize);
  };

  /** render */
  const draw = ( orbitControl) => {
    orbitControl.update();
    object.rotation.y += 0.01
    object2.rotation.y += 0.01
    renderer.render(scene, camera);

    requestAnimationFrame(() => {
      draw(orbitControl);
    });
  };
  /** init */
  const initialize = () => {
    create();
    const orbitControl = orbitControls()
    addEvent();
    resize();
    draw(orbitControl);
  };
  initialize();
}