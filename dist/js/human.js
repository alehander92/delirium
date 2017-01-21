var Human = (function () {
    function Human(game, model, spawn, potion) {
        var _this = this;
        this.game = game;
        this.health = 20;
        this.camera = game.scene.activeCamera;
        this.potion = potion;
        this.game.loadModel(model, function (mesh) { return _this.mesh = mesh; });
    }
    Human.prototype.finish = function () {
        console.log('finish');
        this.mesh.dispose();
    };
    return Human;
}());
//# sourceMappingURL=human.js.map