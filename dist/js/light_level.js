var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LightLevel = (function (_super) {
    __extends(LightLevel, _super);
    function LightLevel() {
        return _super.apply(this, arguments) || this;
    }
    LightLevel.prototype.levelSettings = function () {
        this.config['level'] = 'light';
        this.config['frame'] = 16;
        this.config['count'] = 3;
    };
    return LightLevel;
}(Level));
//# sourceMappingURL=light_level.js.map