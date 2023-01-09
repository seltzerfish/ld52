import Phaser from 'phaser'

export default class StartScene extends Phaser.Scene {

    constructor() {
        super('start')
    }

    preload() {

    }

    create() {
        const startButton = this.add.text(290, 194, "Begin", {
            fontFamily: "font1",
            fontSize: 57,
            resolution: 6,
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('story')
        }, this)
            .on('pointerover', () => startButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => startButton.setStyle({ fill: '#FFF' }))
        // this.scene.run('story')
    }
}
