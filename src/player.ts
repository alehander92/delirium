class Player implements Gamer {
    public game: Game;
    health: number;

    camera: BABYLON.Camera;
    meshes: BABYLON.AbstractMesh[];
    checklist: Product[];
    checklistLevel: {[key: string]: boolean};
    isPlaying: boolean;

    bascet: {[key: string]: Product};


    constructor(game: Game, model: string, checklist: Product[], spawn: BABYLON.Vector3, callback: (player: Player) => void) {
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
    finish() : void {
        this.isPlaying = false;
        console.log('finish');
    }
}

