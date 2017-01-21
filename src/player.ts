class Player {
    public game: Game;
    health: number;

    camera: BABYLON.Camera;
    mesh: BABYLON.AbstractMesh;
    checklist: Product[];
    checklistLevel: {[key: string]: boolean};

    bascet: {[key: string]: Product};


    constructor(game: Game, model: string, checklist: Product[], spawn: BABYLON.Vector3, callback: (Player) => void) {
        this.game = game;
        this.health = 20;
        this.camera = game.scene.activeCamera;
        this.checklist = checklist;
        this.checklistLevel = {};
        this.bascet = {};
        this.game.loadModel(model, (mesh) => {
            this.mesh = mesh;
            callback(this);
        });
    }

    // finish play
    finish() : void {
        console.log('finish');
    }
}

