class Unmoving implements Gamer {
    public game: Game;
    health: number;
    box: BABYLON.Mesh;
    skeleton: BABYLON.Skeleton;
    camera: BABYLON.Camera;
    potion: Potion;
    meshes: BABYLON.AbstractMesh[];
    
    _meshes: BABYLON.AbstractMesh[];
    _skeleton: BABYLON.Skeleton;
    
    isPlaying: boolean;

    
    constructor(game: Game, model: string, skeleton: BABYLON.Skeleton, meshes: BABYLON.AbstractMesh[], spawn: BABYLON.Vector3, potion: Potion) {
        this.game = game;
        this.health = 20;
        this.camera = game.scene.activeCamera;
        this.isPlaying = true;
        this.potion = potion;
        this.skeleton = skeleton;
        this.meshes = meshes;
        for (var mesh of meshes) {
            mesh.checkCollisions = true;
        }
    }

    dispose(): void {
        this._meshes = [];
        this._skeleton = this.skeleton.clone('backup', '2');
        let x = new BABYLON.Node('x', this.game.scene);
        for (var mesh of this.meshes) {
            mesh.scaling = new BABYLON.Vector3(1, 1, 1);
            this._meshes.push(mesh.clone(mesh.name, x));
            this._meshes[this._meshes.length - 1].isVisible = false;
            mesh.dispose();
        }
        // this.skeleton.dispose();
        this.isPlaying = false;
    }
    restart(): void {
        this.meshes = this._meshes;
        for(var mesh of this.meshes) {
            mesh.isVisible = true;
        }
        this.isPlaying = true;
    }
    moveHuman(start: number, final: number, speed: number) {
        var i = 0;
        let recursion = () => {
            i += 1;
            if (!this.isPlaying) {
                return;
            }
            this.game.scene.beginAnimation(this.skeleton, start, final, false, speed, recursion);  
        }
        if (!this.isPlaying) {
            return;
        }
        recursion();    
    }
    
    finish() : void {
        this.skeleton.dispose();
        this.isPlaying = false;
    }
}
