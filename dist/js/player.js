var Player = (function () {
    function Player(game, model, checklist, spawn, callback) {
        console.log('load');
        this.game = game;
        this.health = 20;
        this.camera = game.scene.activeCamera;
        this.isPlaying = true;
        this.checklist = checklist;
        this.checklistLevel = {};
        this.bascet = {};
        console.log('load');
        // this.game.loadModel(model, (meshes) => {
        //     this.meshes = meshes;
        //     callback(this);
        // });
    }
    // finish play
    Player.prototype.finish = function () {
        this.isPlaying = false;
        console.log('finish');
    };
    return Player;
}());
//# sourceMappingURL=player.js.map