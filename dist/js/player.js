var Player = (function () {
    function Player(game, model, checklist, spawn, callback) {
        var _this = this;
        this.game = game;
        this.health = 20;
        this.camera = game.scene.activeCamera;
        this.checklist = checklist;
        this.checklistLevel = {};
        this.bascet = {};
        this.game.loadModel(model, function (mesh) {
            _this.mesh = mesh;
            callback(_this);
        });
    }
    // finish play
    Player.prototype.finish = function () {
        console.log('finish');
    };
    return Player;
}());
//# sourceMappingURL=player.js.map