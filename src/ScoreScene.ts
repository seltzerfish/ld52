import Phaser from 'phaser'

export default class ScoreScene extends Phaser.Scene {

    constructor() {
        super('score')
    }

    preload() {
        this.load.image("happyblueberry", "menus/happyblueberry.png")
        this.load.image("sadblueberry", "menus/sadblueberry.png")
        this.load.image("happytomato", "menus/happytomato.png")
        this.load.image("sadtomato", "menus/sadtomato.png")
        this.load.image("winner", "menus/winner.png")
        this.load.image("loser", "menus/loser.png")
    }

    create() {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',

            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });
        this.sound.play("banjo", {
            loop: true,
            volume: 0.3,
        })
        this.add.image(140, 120, "blueberry").setScale(2)
        this.add.text(50, 105, this.game["p1CountB"], {
            fontFamily: "font1",
            fontSize: 35,
            resolution: 6,
            color: "blue",
        })
        this.add.text(180, 105, "x $10", {
            fontFamily: "font1",
            fontSize: 35,
            resolution: 6,
        })

        this.add.image(140, 190, "tomato").setScale(2)
        this.add.text(50, 175, this.game["p1CountT"], {
            fontFamily: "font1",
            fontSize: 35,
            resolution: 6,
            color: "red",
        })
        this.add.text(180, 175, "x $5", {
            fontFamily: "font1",
            fontSize: 35,
            resolution: 6,
        })
        this.add.text(130, 128, "+", {
            fontFamily: "font1",
            fontSize: 65,
            resolution: 6,
        })
        this.add.text(130, 215, "=", {
            fontFamily: "font1",
            fontSize: 65,
            resolution: 6,
        })
        const p1total = this.game["p1CountB"] * 10 + this.game["p1CountT"] * 5
        this.add.text(50, 275, formatter.format(p1total), {
            fontFamily: "font1",
            fontSize: 75,
            resolution: 6,
            color: "green",
        })






        const offf = 350
        this.add.image(140 + offf, 120, "tomato").setScale(2)
        this.add.text(50 + offf, 105, this.game["p2CountT"], {
            fontFamily: "font1",
            fontSize: 35,
            resolution: 6,
            color: "red",
        })
        this.add.text(180 + offf, 105, "x $10", {
            fontFamily: "font1",
            fontSize: 35,
            resolution: 6,
        })

        this.add.image(140 + offf, 190, "blueberry").setScale(2)
        this.add.text(50 + offf, 175, this.game["p2CountB"], {
            fontFamily: "font1",
            fontSize: 35,
            resolution: 6,
            color: "blue",
        })
        this.add.text(180 + offf, 175, "x $5", {
            fontFamily: "font1",
            fontSize: 35,
            resolution: 6,
        })
        this.add.text(130 + offf, 128, "+", {
            fontFamily: "font1",
            fontSize: 65,
            resolution: 6,
        })
        this.add.text(130 + offf, 215, "=", {
            fontFamily: "font1",
            fontSize: 65,
            resolution: 6,
        })
        const p2total = this.game["p2CountT"] * 10 + this.game["p2CountB"] * 5
        this.add.text(50 + offf, 275, formatter.format(p2total), {
            fontFamily: "font1",
            fontSize: 75,
            resolution: 6,
            color: "green",
        })

        if (p1total > p2total) {
            this.add.image(150, 50, "happyblueberry")
            this.add.image(150, 70, "winner").setAlpha(0.8)
            // this.add.image(370, 60, "sadtomato")
        }
        else if (p2total > p1total) {
            this.add.image(500, 50, "happytomato")
            this.add.image(500, 70, "winner").setAlpha(0.8)
            // this.add.image(270, 60, "sadblueberry")

        }
        const butt3 = this.add.text(250, 350, "Menu", {
            fontFamily: "font1",
            fontSize: 87,
            resolution: 6,
        }).setInteractive().on('pointerdown', () => {
            this.sound.stopAll()
            this.sound.removeAll()
            this.scene.start('main')
        }, this)
            .on('pointerover', () => butt3.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => butt3.setStyle({ fill: '#FFF' }))

    }
}
