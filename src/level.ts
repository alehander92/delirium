class Level {
    game: Game;
    health: number;
    humans: Human[];
    config: {[key: string]: any};

    humansName: {[key: string]: Human};
    camera: BABYLON.Camera;
    mesh: BABYLON.AbstractMesh;
    checklist: Product[];
    checklistLevel: {[key: string]: boolean};
    started: boolean;
        
    basket: {[key: string]: Product};
    name: string;
    difficulty: number;

    constructor(game: Game, name: string, checklist: Product[], health: number) {
        this.game = game;
        this.health = health;
        this.camera = game.scene.activeCamera;
        this.checklist = checklist;
        this.checklistLevel = {};
        this.basket = {};
        this.name = name;
        this.started = false;
        this.humans = [];
        this.humansName = {};
        this.difficulty = 1;
        this.config = {};
    }


    restart(): boolean {
        if (this.started) {
            for(var human of this.humans) {
                human.restart();
            }
            this.applySettings();
            return true;
        } else {
            return false;
        }
    }

    applySettings() : void {
        for(let human of this.humans) {
          human.moveHuman(50, 200, 1.04);
        }
        this.started = true;
        this.levelSettings();
    }

    levelSettings(): void {
    }
}
