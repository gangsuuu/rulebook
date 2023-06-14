import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import vertexShader from '../shaders/earth/vertex.glsl?raw';
import fragmentShader from '../shaders/earth/fragment.glsl?raw';
import pointsVertexShader from '../shaders/earthPoints/vertex.glsl?raw';
import pointsFragmentShader from '../shaders/earthPoints/fragment.glsl?raw';
import glowVertexShader from '../shaders/earthGlow/vertex.glsl?raw';
import glowFragmentShader from '../shaders/earthGlow/fragment.glsl?raw';
import CameraControls from '../Controls/CameraControls';
import Animation from '../Controls/Animation';
import GUI from 'lil-gui';
import { gsap } from 'gsap';

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  renderer.setClearColor(0x000000, 1);

  const container = document.querySelector('#container');

  container.appendChild(renderer.domElement);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const clock = new THREE.Clock();
  const textureLoader = new THREE.TextureLoader();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );

  /** BackGround 
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const environmentMap = cubeTextureLoader.load([
   'assets/environment/px.png',
   'assets/environment/nx.png',
   'assets/environment/py.png',
   'assets/environment/ny.png',
   'assets/environment/pz.png',
   'assets/environment/nz.png'
  ])
  environmentMap.encoding = THREE.sRGBEncoding;
  scene.background = environmentMap;
  scene.environment = environmentMap;
*/

  /** library */
  //const gui = new GUI();
  
  /** animation */
  let introStart = true;
  const animation = new Animation(introStart,gsap);
  
  //introStart = animation.animationIntro();
  


  /** Camera */
  camera.position.set(0, 0, 1.9);

  /** Controls */
  const orbitControls = () => {
    const controls = new OrbitControls(camera, renderer.domElement);

    const cameraControls = new CameraControls(controls)
    cameraControls.cameraSet()

    cameraControls.cameraInsertPage()

    return controls;
  }
  
  /** create Earth */
  const createEarth = () => {
    const material = new THREE.ShaderMaterial({
      wireframe: false,
      uniforms: {
        uTexture: {
          value: textureLoader.load('assets/earth-specular-map.png'),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const geometry = new THREE.SphereGeometry(0.8, 30, 30);
    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  };

  /** create EarthPointe*/
  const createEarthPoints = () => {
    const material = new THREE.ShaderMaterial({
      wireframe: true,
      uniforms: {
        uTexture: {
          value: textureLoader.load('assets/earth-specular-map.png'),
        },
        uTime: {
          value: 0,
        },
      },
      vertexShader: pointsVertexShader,
      fragmentShader: pointsFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    const geometry = new THREE.IcosahedronGeometry(0.8, 30, 30);
    geometry.rotateY(-Math.PI);

    const mesh = new THREE.Points(geometry, material);

    return mesh;
  };

  
  /** create EarthGlow */
  const createEarthGlow = () => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uZoom: {
          value: 1,
        },
      },
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      side: THREE.BackSide,
      transparent: true,
    });

    const geometry = new THREE.SphereGeometry(1, 40, 40);
    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  };

  /** create Galaxis */
  const createGalaxis = () => {
    const count  = 10000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++){
      positions[i] = (Math.random() - 0.5) * 4;
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 4; 
    }
    const starsGeometric = new THREE.BufferGeometry();
    starsGeometric.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )
    const starsMaterial = new THREE.PointsMaterial({
      size : Math.random() * 0.007,
      transparent : true,
      depthWrite : false,
      color: '#3f9f8e',
      alphaMap : textureLoader.load('assets/particle.png'),
      map: textureLoader.load('assets/particle.png'),
    })
    const star = new THREE.Points(starsGeometric, starsMaterial);

    return star
  }  


  /** create */
  const create = () => {
    const earth = createEarth();
    const earthPoints = createEarthPoints();
    const earthGlow = createEarthGlow();
    const stars = createGalaxis()
    // const glowNormalHelper = new VertexNormalsHelper(earthGlow, 0.1);

    scene.add(earth, earthPoints, earthGlow, stars);

    return {
      earth,
      earthPoints,
      earthGlow,
      stars
    };
  };

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const addEvent = () => {
    window.addEventListener('resize', resize);
  };

  const draw = (obj, orbitControl) => {
    const { earth, earthPoints, earthGlow, stars} = obj;
    earth.rotation.x += 0.0005;
    earth.rotation.y += 0.0005;

    earthPoints.rotation.x += 0.0005;
    earthPoints.rotation.y += 0.0005;

    stars.rotation.x += 0.0007;
    stars.rotation.y += 0.0007;




    orbitControl.update();
    renderer.render(scene, camera);
    // console.log(orbitControl.getDistance)
    earthGlow.material.uniforms.uZoom.value = orbitControl.target.distanceTo(
      orbitControl.object.position
    );

    earthPoints.material.uniforms.uTime.value = clock.getElapsedTime();

    requestAnimationFrame(() => {
      draw(obj, orbitControl);
    });
  };

  const initialize = () => {
    const obj = create();
    const orbitControl = orbitControls()
    addEvent();
    resize();
    draw(obj, orbitControl);
  };

  initialize();
}