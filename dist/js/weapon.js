/// <reference path="./player.ts" />
var Weapon = (function () {
    function Weapon(game, player, product) {
        this.game = game;
        this.player = player;
        this.product = product;
        var wp = game.scene.meshes[3];
        wp.isVisible = true;
        // wp.rotationQuaternion = undefined;
        wp.rotation.x = -Math.PI / 2;
        wp.rotation.y = Math.PI;
        wp.parent = game.camera;
        wp.position = new BABYLON.Vector3(0.25, -0.4, 1);
        this.mesh = wp;
        this._initialRotation = this.mesh.rotation.clone();
        this.fireRate = 250.0;
        this._currentFireRate = this.fireRate;
        this.canFire = true;
        var particleSys = new BABYLON.ParticleSystem("particles", 100, game.scene);
        particleSys.emitter = this.mesh; // the starting object, the emitter
        particleSys.particleTexture = new BABYLON.Texture("assets/potato.png", game.scene);
        particleSys.emitRate = 5;
        particleSys.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        particleSys.minEmitPower = 1;
        particleSys.maxEmitPower = 4;
        particleSys.colorDead = new BABYLON.Color4(1, 1, 0.8, 0.0);
        particleSys.minLifeTime = 0.2;
        particleSys.maxLifeTime = 0.8;
        particleSys.updateSpeed = 0.02;
        //particleSystem.start();
        this.particleSys = particleSys;
        game.scene.registerBeforeRender(function () {
            if (!this.canFire) {
                this._currentFireRate -= game.engine.getDeltaTime();
                if (this._currentFireRate <= 0) {
                    this.canFire = true;
                    this._currentFireRate = this.fireRate;
                }
            }
        });
    }
    Weapon.prototype.animate = function () {
        var _this = this;
        this.particleSys.start();
        var start = this._initialRotation.clone();
        var end = start.clone();
        end.x += Math.PI / 10;
        var display = new BABYLON.Animation("fire", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys = [{
                frame: 0,
                value: start
            }, {
                frame: 10,
                value: end
            }, {
                frame: 100,
                value: start
            }];
        display.setKeys(keys);
        this.mesh.animations.push(display);
        this.game.scene.beginAnimation(this.mesh, 0, 80, false, 10, function () {
            _this.particleSys.stop();
        });
    };
    Weapon.prototype.fire = function (pick) {
        window.sex = pick;
        if (pick.pickedPoint && this.canFire) {
            this.animate();
        }
        console.log(pick.pickedMesh.name);
        if (pick.pickedPoint && this.canFire && pick.hit) {
            if (pick.pickedMesh.name == 'cloning') {
            }
            else if (pick.pickedMesh.name.slice(0, 3).toLowerCase() == 'box') {
                pick.pickedMesh.dispose();
            }
            else if (pick.pickedMesh.name.slice(-6, 0) != ':human') {
                //DONT kill moving humans
                var object = this.game.level.humansName[pick.pickedMesh.name.slice(0, pick.pickedMesh.name.indexOf(':'))];
                console.log(object);
                if (object) {
                    object.dispose();
                }
            }
            else {
                var b = BABYLON.Mesh.CreateBox('box', 0.1, this.game.scene);
                b.position = pick.pickedPoint.clone();
            }
        }
    };
    return Weapon;
}());
//# sourceMappingURL=weapon.js.map