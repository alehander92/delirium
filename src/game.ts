class Game {
  private _canvas: HTMLCanvasElement;
  weapon?: Weapon;
  level?: Level;
  levels: Level[];
  public engine: BABYLON.Engine;
  public scene: BABYLON.Scene;
  public camera: BABYLON.FreeCamera;
  player?: Player;
  private _light: BABYLON.Light;
  private _loader: BABYLON.AssetsManager;
  public assets: {[key: string]: BABYLON.MeshAssetTask};
  private _meshes: {[key: string]: BABYLON.Mesh};
  private _ground: BABYLON.GroundMesh;
  controlEnabled: boolean;
  size: number;
  
  finish() : void {
    console.log('finish.. wind');
  }
  loseLevel() : void {
    console.log('just a dust in the wind');
    this.level.restart();
  }

  constructor(canvasElement : string) {
    this._canvas = <HTMLCanvasElement>document.querySelector('#canvas');
    this.engine = new BABYLON.Engine(this._canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this._loader = new BABYLON.AssetsManager(this.scene);
    let a = {};
    this.assets = a;
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
    this.controlEnabled = true;
    this._canvas.addEventListener('click', (evt) => {
      let width = scene.getEngine().getRenderWidth();
      let height = scene.getEngine().getRenderHeight();

      if (this.controlEnabled) { 
        let pick = scene.pick(width/2, height/2, undefined, false, this.camera);
        if (this.weapon) {
          this.weapon.fire(pick);
        }
      
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

        
  //good
  //var wp = game.assets["gun"][0];
  initMeshes() : void {
    this._loader.addMeshTask('shelf', '', 'assets/', 'e.babylon');
    this._loader.addMeshTask('object', '', 'assets/', 'gun.babylon');
    // this.scene.debugLayer.show();
    this._loader.load();
    (<any>window).game = this;
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
      // let raft5 = this.newRaft(s, new BABYLON.Vector3(72, 12, 72), rotation, 2, true);
      console.log('raft4');
      this._loader = new BABYLON.AssetsManager(this.scene);
      this.level = new HallucinationLevel(this, 'level1', [], 20);
      this.loadModel('xinpang', ((m: BABYLON.AbstractMesh[], s: BABYLON.Skeleton[]) => {
        
        var human = new Human(this, 'xinpang', s[0], m, new BABYLON.Vector3(0, 1, 0), new Potion(this, 'a'));
        this.level.humans.push(human);
        this.level.humansName['xinpang'] = human;
        // this.scene.beginAnimation(this.scene.skeletons[0], 50, 200, true, 1);
        
      }));
      this._loader.load();
      this.player = undefined;
      this.weapon = new Weapon(this, this.player, new Product(this, "jar", this.scene.meshes[1]));
      this._loader.onFinish = () => {
        setTimeout(() => this.level.applySettings(), 200);
      }

      let mm = new BABYLON.FreeCamera('minimap', new BABYLON.Vector3(0,100,0), this.scene);
      mm.setTarget(new BABYLON.Vector3(0.1,0.1,0.1));
      mm.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
      mm.orthoLeft = -this.size / 2;
      mm.orthoRight = this.size / 2;
      mm.orthoTop = this.size / 2;
      mm.orthoBottom = - this.size / 2;
      mm.rotation.x = Math.PI / 2;
      var xstart = 0.80;
      var ystart = 0.75;
      var width = 0.98 - xstart;
      var heigth = 1 - ystart;

      mm.viewport = new BABYLON.Viewport(
        xstart,
        ystart,
        width,
        heigth
      );
      this.scene.activeCameras.push(this.camera);
      this.scene.activeCameras.push(mm);
    }
    this._ground = <BABYLON.GroundMesh>BABYLON.MeshBuilder.CreateGround('ground1', {width: this.size, height: this.size, subdivisions: 2}, this.scene);
    this._ground.checkCollisions = true;
       
    this.newBox('Box1', 5.0, {x: -20, checkCollisions: true}, this.scene);
    // this.newSphere('sasho', {segments: 16, diameter: 2}, {y: 1, checkCollisions: true}, this.scene);
  }

  a() : string[] {
    return this.scene.meshes.map((v) => v.name);
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
      this.assets[t.name] = t;
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
    var i = 0;
    var final = 62;
     // run the render loop
    this.engine.runRenderLoop(() => {
      if (this.level && this.level.config && this.level.config['level']) {
        if (this.level.config['level'] == 'shaking') {
          if (i % 4 == 0) {
            this.camera.position.x += (Math.random() - 0.5) * 4;
            // this.camera.position.y += (Math.random() - 0.5) * 4
            this.camera.position.z += (Math.random() - 0.5) * 4
          }
        } else if(this.level.config['level'] == 'light') {
          if (i == final) {
            let count = Math.ceil(Math.random() * 80);
            final += count;
            this.scene.lightsEnabled = !this.scene.lightsEnabled;
          }
        } else if(this.level.config['level'] == 'hallucination') {
          if (i == final && this.level.config['model']) {
            let count = Math.ceil(Math.random() * 80);
            final += count;
            // this.level.config['model']
          }
        }
        
      }
      i += 1;

      this.scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  loadModel(model: string, callback: (m: BABYLON.AbstractMesh[], s: BABYLON.Skeleton[]) => void) : void {
    let task = this._loader.addMeshTask(model, '', 'assets/', `${model}.babylon`);
    task.onSuccess = (mesh) => { callback((<BABYLON.MeshAssetTask>mesh).loadedMeshes, (<BABYLON.MeshAssetTask>mesh).loadedSkeletons) };
    //OPTIMIZE
  }
  handleKeyboard(evt : number) : void {
    let gravity = 0.20;
    let speed = 1;    
    switch(evt) {
      default: console.log(evt)
    }  
  }

  resetLoader() {
    this._loader = new BABYLON.AssetsManager(this.scene);
  }

  load() {
    this._loader.load();
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
