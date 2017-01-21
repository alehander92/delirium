class LightLevel extends Level {
    levelSettings(): void {
        this.config['level'] = 'light';
        this.config['frame'] = 16;
        this.config['count'] = 3;
    }
}
