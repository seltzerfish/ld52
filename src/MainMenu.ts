import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {

    constructor() {
        super('main')
    }

    preload() {
        this.load.image("thumb", "tiles/thumb.png")
        this.load.image("wasd", "menus/wasd.png")
        this.load.image("arrowkeys", "menus/arrowkeys.png")
    }

    create() {
        this.sound.play("banjo", {
            loop: true,
            volume: 0.3,
        })
        this.game["numplayers"] = 1
        const w = this.sys.canvas.width;
        const h = this.sys.canvas.height;
        const thumb = this.add.image(w / 2, h / 2.6, "thumb").setScale(2)
        this.add.image(145, 200, "wasd").setScale(2)
        const arrows = this.add.image(560, 200, "arrowkeys").setScale(2).setVisible(false)

        const startButton = this.add.text(80, 10, "  \"NEIGHBORLY LOVE\"", {
            fontFamily: "font1",
            fontSize: 57,
            resolution: 6,
        })
        this.add.text(130, 120, "P1", {
            fontFamily: "font1",
            fontSize: 37,
            resolution: 6,
            color: "blue"
        })
        const p2text = this.add.text(545, 120, "P2", {
            fontFamily: "font1",
            fontSize: 37,
            resolution: 6,
            color: "red"
        }).setVisible(false)
        const cputext = this.add.text(520, 180, "CPU", {
            fontFamily: "font1",
            fontSize: 35,
            resolution: 6,
            color: "grey"
        })

        const butt2 = this.add.text(250, 300, "Mode: 1 Player", {
            fontFamily: "font1",
            fontSize: 37,
            resolution: 6,
        }).setInteractive().on('pointerdown', () => {
            if (this.game["numplayers"] === 1) {
                butt2.setText("Mode: 2 Players")
                this.game["numplayers"] = 2
                arrows.setVisible(true)
                p2text.setVisible(true)
                cputext.setVisible(false)
            }
            else {
                this.game["numplayers"] = 1
                arrows.setVisible(false)
                p2text.setVisible(false)
                cputext.setVisible(true)

                butt2.setText("Mode: 1 Player")
            }
        }, this)
            .on('pointerover', () => butt2.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => butt2.setStyle({ fill: '#FFF' }))



        const butt3 = this.add.text(250, 350, "START", {
            fontFamily: "font1",
            fontSize: 77,
            resolution: 6,
        }).setInteractive().on('pointerdown', () => {
            this.sound.stopAll()
            this.sound.removeAll()
            this.scene.start('farming')
        }, this)
            .on('pointerover', () => butt3.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => butt3.setStyle({ fill: '#FFF' }))
    }
}
