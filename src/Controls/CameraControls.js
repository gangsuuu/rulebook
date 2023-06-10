import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class CameraControls{
  constructor (controls) {
    this.controls = controls

  }

  cameraInsertPage(){
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.minDistance  = 0.65;
    this.controls.maxDistance  = 1.9;
  }

  cameraSet() {

  }
  cameraMove() {

  }  
}