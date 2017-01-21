class Human implements Gamer {
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
            mesh.checkCollisions = false;
            mesh.name = `${mesh.name}:human`;
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
        this.skeleton.dispose();
        this.isPlaying = false;
    }
    restart(): void {
        this.isPlaying = true;
    }

    show() {
        this.meshes.forEach((mesh) => mesh.isVisible = true);
    }
    hide() {
        this.meshes.forEach((mesh) => mesh.isVisible = false);
    }
    moveHuman(start: number, final: number, speed: number) {
        var i = 0;
        let recursion = () => {
            if (i > 0) {
                for (var mesh of this.meshes) {
                    mesh.scaling.x *= 1.05;
                    mesh.scaling.y *= 1.05;
                    mesh.scaling.z *= 1.05;
                }
                if (mesh.scaling.z > 16) {
                    mesh.scaling = new BABYLON.Vector3(1, 1, 1);
                    this.game.loseLevel();
                }
            }
            i += 1;
            if (!this.isPlaying) {
                for(var mesh of this.meshes) {
                    mesh.scaling = new BABYLON.Vector3(1, 1, 1);
                }
                return;
            }
            this.game.scene.beginAnimation(this.skeleton, start, final, false, speed, recursion);  
        }
        if (!this.isPlaying) {
            for(var mesh of this.meshes) {
                mesh.scaling = new BABYLON.Vector3(1, 1, 1);
            }
            return;
        }
        recursion();    
    }
    
    finish() : void {
        this.skeleton.dispose();
        this.isPlaying = false;
    }
}
