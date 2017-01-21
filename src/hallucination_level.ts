class HallucinationLevel extends Level {
    levelSettings(): void {
        this.config['level'] = 'hallucination';
        this.game.resetLoader();
        this.game.loadModel('animation69', (a, b) => {
            this.config['model'] = new Human(this.game, 'animation69', b[0], a, new BABYLON.Vector3(0, 1, 0), new Potion(this.game, 'm'));
            this.config['model'].moveHuman();
    });
        this.game.load();
    }
}
