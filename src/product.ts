class Product {
    game: Game;
    damage: number;
    health: number;
    mesh: BABYLON.AbstractMesh;
    name: string;

    constructor(game: Game, name: string, mesh: BABYLON.AbstractMesh) {
        this.damage = 0;
        this.health = 20;
        this.game = game;
        this.name = name;
        this.mesh = mesh;
    }
}
