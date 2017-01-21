class Human {
    public game: Game;
    health: number;
    camera: BABYLON.Camera;
    potion: Potion;
    mesh: BABYLON.AbstractMesh;

    constructor(game: Game, model: string, spawn: BABYLON.Vector3, potion: Potion) {
        this.game = game;
        this.health = 20;
        this.camera = game.scene.activeCamera;
        this.potion = potion;
        this.game.loadModel(model, (mesh) => this.mesh = mesh);
    }

    finish() : void {
        console.log('finish');
        this.mesh.dispose();
    }
}
