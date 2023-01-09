import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {

    constructor() {
        super('tutorial')
    }

    preload() {
        this.load.image("h2p1", "menus/h2p1.png")
        this.load.image("h2p2", "menus/h2p2.png")
    }

    create() {
        this.add.image(300, 270, "h2p1").setScale(2)
        this.add.image(450, 400, "h2p2").setScale(2)
    }
}
