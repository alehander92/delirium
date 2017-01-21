var Level = (function () {
    function Level(game, name, checklist, health) {
        this.game = game;
        this.health = health;
        this.camera = game.scene.activeCamera;
        this.checklist = checklist;
        this.checklistLevel = {};
        this.basket = {};
        this.name = name;
        this.started = false;
        this.humans = [];
        this.humansName = {};
        this.difficulty = 1;
        this.config = {};
    }
    Level.prototype.restart = function () {
        if (this.started) {
            for (var _i = 0, _a = this.humans; _i < _a.length; _i++) {
                var human = _a[_i];
                human.restart();
            }
            this.applySettings();
            return true;
        }
        else {
            return false;
        }
    };
    Level.prototype.applySettings = function () {
        for (var _i = 0, _a = this.humans; _i < _a.length; _i++) {
            var human = _a[_i];
            human.moveHuman(50, 200, 1.04);
        }
        this.started = true;
        this.levelSettings();
    };
    Level.prototype.levelSettings = function () {
    };
    return Level;
}());
//# sourceMappingURL=level.js.map