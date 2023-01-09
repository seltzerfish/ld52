import Phaser from 'phaser'

export default class StoryScene extends Phaser.Scene {
    private index = 0;
    private tot = 0;

    constructor() {
        super('story')
    }

    preload() {
    }

    create() {
        const s = this.sound.add("song", {
            volume: 2,
        })
        s.on('complete', () => {
            this.cameras.main.fadeOut(2000)
            this.time.delayedCall(2000, () => {
                this.scene.start('main')
            })
        })
        s.play(undefined, {
            delay: 0.2,
        })
        const startButton = this.add.text(570, 330, "skip", {
            fontFamily: "font1",
            fontSize: 57,
            resolution: 6,
        }).setInteractive().on('pointerdown', () => {
            this.sound.stopAll()
            this.scene.start('main')
        }, this)
            .on('pointerover', () => startButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => startButton.setStyle({ fill: '#FFF' }))
        const w = this.sys.canvas.width;
        const h = this.sys.canvas.height;
        const main = this.add.image(w / 2, h / 2, "main")
        main.setScale(2)
        this.cameras.main.fadeIn(3000)
        const b = 800;
        this.next(main, 3000);
        this.next(main, 2000);
        this.next(main, b * 2);
        this.next(main, b * 2);
        this.next(main, b * 2);
        this.next(main, b * 2);
        this.next(main, b * 4);
        this.next(main, b * 1.5);
        this.next(main, b * 0);
        this.next(main, b * 1);
        this.next(main, b * 0.5);
        this.next(main, b * 0.5);
        this.next(main, b * 2.5);
        this.next(main, b * 4);
        this.next(main, b * 2);
        this.next(main, b * 2);
        this.next(main, b * 2);
        this.next(main, b * 4);
        this.next(main, b * 2);
        this.next(main, b * 4.7);

        this.next(main, b * 4.7);
        this.next(main, b * 4.7);
        this.next(main, b * 4);
    }

    private next(main: any, dur: number) {
        this.tot += dur
        this.time.delayedCall(this.tot, () => {
            this.index += 1
            main.setFrame(this.index)
        })
    }
    update(time: number, delta: number): void {

    }
}
