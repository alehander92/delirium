var Human = (function () {
    function Human(game, model, skeleton, meshes, spawn, potion) {
        this.game = game;
        this.health = 20;
        this.camera = game.scene.activeCamera;
        this.isPlaying = true;
        this.potion = potion;
        this.skeleton = skeleton;
        this.meshes = meshes;
        for (var _i = 0, meshes_1 = meshes; _i < meshes_1.length; _i++) {
            var mesh = meshes_1[_i];
            mesh.checkCollisions = false;
            mesh.name = mesh.name + ":human";
        }
    }
    Human.prototype.dispose = function () {
        this._meshes = [];
        this._skeleton = this.skeleton.clone('backup', '2');
        var x = new BABYLON.Node('x', this.game.scene);
        for (var _i = 0, _a = this.meshes; _i < _a.length; _i++) {
            var mesh = _a[_i];
            mesh.scaling = new BABYLON.Vector3(1, 1, 1);
            this._meshes.push(mesh.clone(mesh.name, x));
            this._meshes[this._meshes.length - 1].isVisible = false;
            mesh.dispose();
        }
        this.skeleton.dispose();
        this.isPlaying = false;
    };
    Human.prototype.restart = function () {
        this.isPlaying = true;
    };
    Human.prototype.moveHuman = function (start, final, speed) {
        var _this = this;
        var i = 0;
        var recursion = function () {
            if (i > 0) {
                for (var _i = 0, _a = _this.meshes; _i < _a.length; _i++) {
                    var mesh = _a[_i];
                    mesh.scaling.x *= 1.05;
                    mesh.scaling.y *= 1.05;
                    mesh.scaling.z *= 1.05;
                }
                if (mesh.scaling.z > 16) {
                    mesh.scaling = new BABYLON.Vector3(1, 1, 1);
                    _this.game.loseLevel();
                }
            }
            i += 1;
            if (!_this.isPlaying) {
                for (var _b = 0, _c = _this.meshes; _b < _c.length; _b++) {
                    var mesh = _c[_b];
                    mesh.scaling = new BABYLON.Vector3(1, 1, 1);
                }
                return;
            }
            _this.game.scene.beginAnimation(_this.skeleton, start, final, false, speed, recursion);
        };
        if (!this.isPlaying) {
            for (var _i = 0, _a = this.meshes; _i < _a.length; _i++) {
                var mesh = _a[_i];
                mesh.scaling = new BABYLON.Vector3(1, 1, 1);
            }
            return;
        }
        recursion();
    };
    Human.prototype.finish = function () {
        this.skeleton.dispose();
        this.isPlaying = false;
    };
    return Human;
}());
//# sourceMappingURL=human.js.map