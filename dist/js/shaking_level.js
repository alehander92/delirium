var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ShakingLevel = (function (_super) {
    __extends(ShakingLevel, _super);
    function ShakingLevel() {
        return _super.apply(this, arguments) || this;
    }
    ShakingLevel.prototype.levelSettings = function () {
        this.config['level'] = 'shaking';
        this.config['shaking'] = 4;
    };
    return ShakingLevel;
}(Level));
//# sourceMappingURL=shaking_level.js.map