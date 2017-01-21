class Game {
  private _canvas: HTMLCanvasElement;
  public engine: BABYLON.Engine;
  public scene: BABYLON.Scene;
  public camera: BABYLON.FreeCamera;
  private _light: BABYLON.Light;
  private _loader: BABYLON.AssetsManager;
  private _assets: {[key: string]: BABYLON.MeshAssetTask};
  private _meshes: {[key: string]: BABYLON.Mesh};
  private _ground: BABYLON.GroundMesh;
  controlEnabled: boolean;
  size: number;
  

  constructor(canvasElement : string) {
    this._canvas = <HTMLCanvasElement>document.querySelector('#canvas');
    this.engine = new BABYLON.Engine(this._canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this._loader = new BABYLON.AssetsManager(this.scene);
    let a = {};
    this._assets = a;
    this._meshes = {};
    this.size = 500;
  }

  createScene() :  void {
    this.camera = this.initCamera(this.scene);
    this.initLight();
    this.initMeshes();
    this.initGravity(this.scene, this.camera);
    window.addEventListener("keyup", (evt) => {
      this.handleKeyboard(evt.keyCode);
    });
  }
  
  initCamera(scene: BABYLON.Scene) : BABYLON.FreeCamera {
    let camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(this._canvas, false);
    camera.keysUp = [87]; // W
    camera.keysDown = [83]; // S
    camera.keysLeft = [65]; // A
    camera.keysRight = [68]; // D
    camera.speed = 1;
    camera.inertia = 0.9;
    camera.angularSensibility = 800;
    camera.layerMask = 2;
    this.controlEnabled = false;
    this._canvas.addEventListener('click', (evt) => {
      let width = scene.getEngine().getRenderWidth();
      let height = scene.getEngine().getRenderHeight();

      if (this.controlEnabled) { 
        let pick = scene.pick(width/2, height/2, undefined, false, this.camera);
      }
    }, false);
    this.initPointerLock(scene);
    camera.ellipsoid = new BABYLON.Vector3(2, 2, 2);
    return camera;
  }

  initPointerLock(scene: BABYLON.Scene) : void {
    var canvas = scene.getEngine().getRenderingCanvas();
      canvas.addEventListener("click", (evt) => {
          canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
          if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
          }
        }, false);

    // Event listener when the pointerlock is updated.
    var pointerlockchange = (event) => {
      this.controlEnabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
        if (!this.controlEnabled) {
          this.camera.detachControl(canvas);
        } else {
          this.camera.attachControl(canvas);
        }
      };
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    
  }
  initMeshes() : void {
    // this.initMesh("gun", "./assets/", "gun.babylon");
    // this.initMesh("cat", "./assets/particles/", "SSAOca.babylon");
    // this.initMesh("main_room", "./assets/rooms", "main_roo.babylon");
    this._loader.addMeshTask('shelf', '', 'assets/', 'e.babylon');
    this._loader.load();
    (<any>window).A = this;
    this._loader.onFinish = () => {
      let s = this.scene.meshes[2];
      this.camera.position = new BABYLON.Vector3(65, 4, 10);
      this.camera.rotation = new BABYLON.Vector3(-0.1, -2.1, 0);
      let rotation = new BABYLON.Vector3(1.56, 1.1,  2);
      let boxes = [this.scene.meshes[1]];
      let raft = this.newRaft(s, new BABYLON.Vector3(0, 11, 0), rotation, 3, false);
      let raft2 = this.newRaft(s, new BABYLON.Vector3(-42, 22, -42), rotation, 3, true);
      let raft3 = this.newRaft(s, new BABYLON.Vector3(-72, 12, -52), rotation, 3, true);
      let raft4 = this.newRaft(s, new BABYLON.Vector3(-82, 12, -82), rotation, 2, true);//   let shelf = newShelf()
    }
    this._ground = <BABYLON.GroundMesh>BABYLON.MeshBuilder.CreateGround('ground1', {width: this.size, height: this.size, subdivisions: 2}, this.scene);
    this._ground.checkCollisions = true;
       
    this.newBox('Box1', 5.0, {x: -20, checkCollisions: true}, this.scene);
    // this.newSphere('sasho', {segments: 16, diameter: 2}, {y: 1, checkCollisions: true}, this.scene);
  }

  newRaft(s: BABYLON.AbstractMesh, position: BABYLON.Vector3, ro: BABYLON.Vector3, countObjects: number, clone: boolean) {
    if (clone) {
        s = s.clone('cloning', s.parent);
    }

    s.position = position;
    s.rotation = ro;
    var boxes = [this.newBox('box0', 5.0, {x: s.position.x, y: s.position.y + 0.4, z: s.position.z + 5, checkCollisions: true}, this.scene)];
    var colors = [new BABYLON.Color3(1, 0, 0), new BABYLON.Color3(0, 1, 0), new BABYLON.Color3(0, 0, 1), new BABYLON.Color3(0.2, 0.2, 0.2)];
    let l = new BABYLON.StandardMaterial('maer', this.scene);
    l.diffuseColor = colors[0];
    boxes[0].material = l;
    boxes[0].rotation = ro;
    for(var i = 0;i < countObjects - 1; i ++) {
        boxes.push(boxes[0].clone(`box${i + 1}`, boxes[0].parent));
        boxes[i + 1].position = new BABYLON.Vector3(position.x, position.y + 11 + 9 * i, position.z + 5);
        boxes[i + 1].rotation = ro;
        let m = new BABYLON.StandardMaterial('material', this.scene);
        m.diffuseColor = colors[(i + 1) % 4];
        boxes[i + 1].material = m;
        
    }    
  }
  initLight() : void {
    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this.scene);
  }
  
  newBox(box: string, big: number, coords: {x?: number, y?: number, z?: number, checkCollisions?: boolean}, scene: BABYLON.Scene) : BABYLON.Mesh {
    let box1 = BABYLON.Mesh.CreateBox(box, big, scene);
    if (coords.x) {
      box1.position.x = coords.x;
    }
    if (coords.z) {
      box1.position.z = coords.z;
    }
    if (coords.y) {
      box1.position.y = coords.y;
    }
    box1.checkCollisions = coords.checkCollisions ? true : false;
    this._meshes[box] = box1;
    return box1;
  }

  newSphere(sphere: string, data: {segments: number, diameter: number}, coords: {x?: number, y?: number, z?: number, checkCollisions?: boolean}, scene: BABYLON.Scene) : void {
    let s = BABYLON.MeshBuilder.CreateSphere(sphere, data, scene);
    if (coords.x) {
      s.position.x = coords.x;
    }
    if (coords.y) {
      s.position.y = coords.y;
    }
    if (coords.z) {
      s.position.z = coords.z;
    s.checkCollisions = coords.checkCollisions ? true : false;
    }
    this._meshes[sphere] = s;
}

  initGravity(scene: BABYLON.Scene, camera: BABYLON.FreeCamera) : void {
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    camera.applyGravity = true;
    scene.collisionsEnabled = true;
    camera.checkCollisions = true;
    scene.workerCollisions = true;
  }
  
  initMesh(label: string, path: string, name: string) : void {
    let task = this._loader.addMeshTask(label, "", path, name);
    task.onSuccess = (task) => {
      let t = <BABYLON.MeshAssetTask>task;
      this._assets[t.name] = t;
      this.hide(t);
    }
  }

  show(task: BABYLON.MeshAssetTask) : void {
    for (var i = 0;i < task.loadedMeshes.length; i++) {
      task.loadedMeshes[i].isVisible = true;
    }
  }

  hide(task: BABYLON.MeshAssetTask) : void {
    for (var i=0; i < task.loadedMeshes.length; i++ ){
      task.loadedMeshes[i].isVisible = false;
    }
  }

  animate() : void {
     // run the render loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  handleKeyboard(evt : number) : void {
    let gravity = 0.20;
    let speed = 1;    
    switch(evt) {
      default: console.log(evt)
    }  
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Create the game using the 'renderCanvas'
  let game = new Game('renderCanvas');

  // Create the scene
  game.createScene();

  // start animation
  game.animate();
});

// # style colors 
// # 3d models products
// # humans
// # checklist
// # health
// # subs
// # effects
// # animation
