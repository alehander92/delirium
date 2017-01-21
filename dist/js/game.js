var Game = (function () {
    function Game(canvasElement) {
        this._canvas = document.querySelector('#canvas');
        this.engine = new BABYLON.Engine(this._canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this._loader = new BABYLON.AssetsManager(this.scene);
        var a = {};
        this.assets = a;
        this._meshes = {};
        this.size = 500;
    }
    Game.prototype.finish = function () {
        console.log('finish.. wind');
    };
    Game.prototype.loseLevel = function () {
        console.log('just a dust in the wind');
        this.level.restart();
    };
    Game.prototype.createScene = function () {
        var _this = this;
        this.camera = this.initCamera(this.scene);
        this.initLight();
        this.initMeshes();
        this.initGravity(this.scene, this.camera);
        window.addEventListener("keyup", function (evt) {
            _this.handleKeyboard(evt.keyCode);
        });
    };
    Game.prototype.initCamera = function (scene) {
        var _this = this;
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
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
        this._canvas.addEventListener('click', function (evt) {
            var width = scene.getEngine().getRenderWidth();
            var height = scene.getEngine().getRenderHeight();
            if (_this.controlEnabled) {
                var pick = scene.pick(width / 2, height / 2, undefined, false, _this.camera);
                if (_this.weapon) {
                    _this.weapon.fire(pick);
                }
            }
        }, false);
        this.initPointerLock(scene);
        camera.ellipsoid = new BABYLON.Vector3(2, 2, 2);
        return camera;
    };
    Game.prototype.initPointerLock = function (scene) {
        var _this = this;
        var canvas = scene.getEngine().getRenderingCanvas();
        canvas.addEventListener("click", function (evt) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);
        // Event listener when the pointerlock is updated.
        var pointerlockchange = function (event) {
            _this.controlEnabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
            if (!_this.controlEnabled) {
                _this.camera.detachControl(canvas);
            }
            else {
                _this.camera.attachControl(canvas);
            }
        };
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    };
    //good
    //var wp = game.assets["gun"][0];
    Game.prototype.initMeshes = function () {
        var _this = this;
        this._loader.addMeshTask('shelf', '', 'assets/', 'e.babylon');
        this._loader.addMeshTask('object', '', 'assets/', 'gun.babylon');
        // this.scene.debugLayer.show();
        this._loader.load();
        window.game = this;
        this._loader.onFinish = function () {
            var s = _this.scene.meshes[2];
            _this.camera.position = new BABYLON.Vector3(65, 4, 10);
            _this.camera.rotation = new BABYLON.Vector3(-0.1, -2.1, 0);
            var rotation = new BABYLON.Vector3(1.56, 1.1, 2);
            var boxes = [_this.scene.meshes[1]];
            var raft = _this.newRaft(s, new BABYLON.Vector3(0, 11, 0), rotation, 3, false);
            var raft2 = _this.newRaft(s, new BABYLON.Vector3(-42, 22, -42), rotation, 3, true);
            var raft3 = _this.newRaft(s, new BABYLON.Vector3(-72, 12, -52), rotation, 3, true);
            var raft4 = _this.newRaft(s, new BABYLON.Vector3(-82, 12, -82), rotation, 2, true); //   let shelf = newShelf()
            // let raft5 = this.newRaft(s, new BABYLON.Vector3(72, 12, 72), rotation, 2, true);
            console.log('raft4');
            _this._loader = new BABYLON.AssetsManager(_this.scene);
            _this.level = new HallucinationLevel(_this, 'level1', [], 20);
            _this.loadModel('xinpang', (function (m, s) {
                var human = new Human(_this, 'xinpang', s[0], m, new BABYLON.Vector3(0, 1, 0), new Potion(_this, 'a'));
                _this.level.humans.push(human);
                _this.level.humansName['xinpang'] = human;
                // this.scene.beginAnimation(this.scene.skeletons[0], 50, 200, true, 1);
            }));
            _this._loader.load();
            _this.player = undefined;
            _this.weapon = new Weapon(_this, _this.player, new Product(_this, "jar", _this.scene.meshes[1]));
            _this._loader.onFinish = function () {
                setTimeout(function () { return _this.level.applySettings(); }, 200);
            };
            var mm = new BABYLON.FreeCamera('minimap', new BABYLON.Vector3(0, 100, 0), _this.scene);
            mm.setTarget(new BABYLON.Vector3(0.1, 0.1, 0.1));
            mm.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
            mm.orthoLeft = -_this.size / 2;
            mm.orthoRight = _this.size / 2;
            mm.orthoTop = _this.size / 2;
            mm.orthoBottom = -_this.size / 2;
            mm.rotation.x = Math.PI / 2;
            var xstart = 0.80;
            var ystart = 0.75;
            var width = 0.98 - xstart;
            var heigth = 1 - ystart;
            mm.viewport = new BABYLON.Viewport(xstart, ystart, width, heigth);
            _this.scene.activeCameras.push(_this.camera);
            _this.scene.activeCameras.push(mm);
        };
        this._ground = BABYLON.MeshBuilder.CreateGround('ground1', { width: this.size, height: this.size, subdivisions: 2 }, this.scene);
        this._ground.checkCollisions = true;
        this.newBox('Box1', 5.0, { x: -20, checkCollisions: true }, this.scene);
        // this.newSphere('sasho', {segments: 16, diameter: 2}, {y: 1, checkCollisions: true}, this.scene);
    };
    Game.prototype.a = function () {
        return this.scene.meshes.map(function (v) { return v.name; });
    };
    Game.prototype.newRaft = function (s, position, ro, countObjects, clone) {
        if (clone) {
            s = s.clone('cloning', s.parent);
        }
        s.position = position;
        s.rotation = ro;
        var boxes = [this.newBox('box0', 5.0, { x: s.position.x, y: s.position.y + 0.4, z: s.position.z + 5, checkCollisions: true }, this.scene)];
        var colors = [new BABYLON.Color3(1, 0, 0), new BABYLON.Color3(0, 1, 0), new BABYLON.Color3(0, 0, 1), new BABYLON.Color3(0.2, 0.2, 0.2)];
        var l = new BABYLON.StandardMaterial('maer', this.scene);
        l.diffuseColor = colors[0];
        boxes[0].material = l;
        boxes[0].rotation = ro;
        for (var i = 0; i < countObjects - 1; i++) {
            boxes.push(boxes[0].clone("box" + (i + 1), boxes[0].parent));
            boxes[i + 1].position = new BABYLON.Vector3(position.x, position.y + 11 + 9 * i, position.z + 5);
            boxes[i + 1].rotation = ro;
            var m = new BABYLON.StandardMaterial('material', this.scene);
            m.diffuseColor = colors[(i + 1) % 4];
            boxes[i + 1].material = m;
        }
    };
    Game.prototype.initLight = function () {
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
    };
    Game.prototype.newBox = function (box, big, coords, scene) {
        var box1 = BABYLON.Mesh.CreateBox(box, big, scene);
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
    };
    Game.prototype.newSphere = function (sphere, data, coords, scene) {
        var s = BABYLON.MeshBuilder.CreateSphere(sphere, data, scene);
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
    };
    Game.prototype.initGravity = function (scene, camera) {
        scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        camera.applyGravity = true;
        scene.collisionsEnabled = true;
        camera.checkCollisions = true;
        scene.workerCollisions = true;
    };
    Game.prototype.initMesh = function (label, path, name) {
        var _this = this;
        var task = this._loader.addMeshTask(label, "", path, name);
        task.onSuccess = function (task) {
            var t = task;
            _this.assets[t.name] = t;
            _this.hide(t);
        };
    };
    Game.prototype.show = function (task) {
        for (var i = 0; i < task.loadedMeshes.length; i++) {
            task.loadedMeshes[i].isVisible = true;
        }
    };
    Game.prototype.hide = function (task) {
        for (var i = 0; i < task.loadedMeshes.length; i++) {
            task.loadedMeshes[i].isVisible = false;
        }
    };
    Game.prototype.animate = function () {
        var _this = this;
        var i = 0;
        var final = 62;
        // run the render loop
        this.engine.runRenderLoop(function () {
            if (_this.level && _this.level.config && _this.level.config['level']) {
                if (_this.level.config['level'] == 'shaking') {
                    if (i % 4 == 0) {
                        _this.camera.position.x += (Math.random() - 0.5) * 4;
                        // this.camera.position.y += (Math.random() - 0.5) * 4
                        _this.camera.position.z += (Math.random() - 0.5) * 4;
                    }
                }
                else if (_this.level.config['level'] == 'light') {
                    if (i == final) {
                        var count = Math.ceil(Math.random() * 80);
                        final += count;
                        _this.scene.lightsEnabled = !_this.scene.lightsEnabled;
                    }
                }
                else if (_this.level.config['level'] == 'hallucination') {
                    if (i == final && _this.level.config['model']) {
                        var count = Math.ceil(Math.random() * 80);
                        final += count;
                    }
                }
            }
            i += 1;
            _this.scene.render();
        });
        // the canvas/window resize event handler
        window.addEventListener('resize', function () {
            _this.engine.resize();
        });
    };
    Game.prototype.loadModel = function (model, callback) {
        var task = this._loader.addMeshTask(model, '', 'assets/', model + ".babylon");
        task.onSuccess = function (mesh) { callback(mesh.loadedMeshes, mesh.loadedSkeletons); };
        //OPTIMIZE
    };
    Game.prototype.handleKeyboard = function (evt) {
        var gravity = 0.20;
        var speed = 1;
        switch (evt) {
            default: console.log(evt);
        }
    };
    Game.prototype.resetLoader = function () {
        this._loader = new BABYLON.AssetsManager(this.scene);
    };
    Game.prototype.load = function () {
        this._loader.load();
    };
    return Game;
}());
window.addEventListener('DOMContentLoaded', function () {
    // Create the game using the 'renderCanvas'
    var game = new Game('renderCanvas');
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
//# sourceMappingURL=game.js.map