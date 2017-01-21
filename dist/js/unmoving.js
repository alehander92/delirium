var Unmoving = (function () {
    function Unmoving(game, model, skeleton, meshes, spawn, potion) {
        this.game = game;
        this.health = 20;
        this.camera = game.scene.activeCamera;
        this.isPlaying = true;
        this.potion = potion;
        this.skeleton = skeleton;
        this.meshes = meshes;
        for (var _i = 0, meshes_1 = meshes; _i < meshes_1.length; _i++) {
            var mesh = meshes_1[_i];
            mesh.checkCollisions = true;
        }
    }
    Unmoving.prototype.dispose = function () {
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
        // this.skeleton.dispose();
        this.isPlaying = false;
    };
    Unmoving.prototype.restart = function () {
        this.meshes = this._meshes;
        for (var _i = 0, _a = this.meshes; _i < _a.length; _i++) {
            var mesh = _a[_i];
            mesh.isVisible = true;
        }
        this.isPlaying = true;
    };
    Unmoving.prototype.moveHuman = function (start, final, speed) {
        var _this = this;
        var i = 0;
        var recursion = function () {
            i += 1;
            if (!_this.isPlaying) {
                return;
            }
            _this.game.scene.beginAnimation(_this.skeleton, start, final, false, speed, recursion);
        };
        if (!this.isPlaying) {
            return;
        }
        recursion();
    };
    Unmoving.prototype.finish = function () {
        this.skeleton.dispose();
        this.isPlaying = false;
    };
    return Unmoving;
}());
//# sourceMappingURL=unmoving.js.map