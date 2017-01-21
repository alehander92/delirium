interface Gamer {
    game: Game;
    health: number;
    camera: BABYLON.Camera;
    meshes: BABYLON.AbstractMesh[];

    isPlaying: boolean;

    finish() : void
    
}