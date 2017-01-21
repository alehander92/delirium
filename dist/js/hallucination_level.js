var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HallucinationLevel = (function (_super) {
    __extends(HallucinationLevel, _super);
    function HallucinationLevel() {
        return _super.apply(this, arguments) || this;
    }
    HallucinationLevel.prototype.levelSettings = function () {
        var _this = this;
        this.config['level'] = 'hallucination';
        this.game.resetLoader();
        this.game.loadModel('animation69', function (a, b) {
            _this.config['model'] = new Human(_this.game, 'animation69', b[0], a, new BABYLON.Vector3(0, 1, 0), new Potion(_this.game, 'm'));
            _this.config['model'].moveHuman();
        });
        this.game.load();
    };
    return HallucinationLevel;
}(Level));
//# sourceMappingURL=hallucination_level.js.map