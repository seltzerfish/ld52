import Phaser from 'phaser'

export default class LoadingScene extends Phaser.Scene {

    constructor() {
        super('loading')
    }

    preload() {

    }

    create() {
        const startButton = this.add.text(270, 194, "Loading", {
            fontFamily: "font1",
            fontSize: 57,
            resolution: 6,
            color: "#222222"
        })
        this.scene.run('preload')
    }
}
