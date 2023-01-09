import Phaser from 'phaser'

export default class StoryScene extends Phaser.Scene {

    constructor() {
        super('preload')
    }

    preload() {

        this.load.spritesheet("main", "story/composite2.png", {
            frameWidth: 144,
            frameHeight: 144,
        })
        this.load.audio("song", "audio/introsong.mp3")
        this.load.tilemapTiledJSON("main", "tiles/main.json")
        this.load.image("eliz_tileset", "tiles/eliz.png")
        this.load.image("free", "tiles/free.png")
        this.load.spritesheet("tractor", "tiles/tractor2.png", {
            frameWidth: 48,
            frameHeight: 67,
            startFrame: 0,
        })
        this.load.spritesheet("tractor2", "tiles/tractor.png", {
            frameWidth: 48,
            frameHeight: 67,
            startFrame: 0,
        })
        this.load.image('blueberryhouse', 'tiles/blueberryhouse.png')
        this.load.image('tomatohouse', 'tiles/tomatohouse.png')
        this.load.image("obstacles", "tiles/obstacles.png")
        this.load.image("flowers", "tiles/flowers.png")
        this.load.image("blueberry", "tiles/blueberry.png")
        this.load.image("tomato", "tiles/tomato.png")
        this.load.image("bubble", "tiles/bubble.png")
        this.load.image("roadtiles", "tiles/roadtiles.png")
        this.load.image("bubble_tall", "tiles/bubble_tall.png")
        this.load.image("bubble_wide", "tiles/bubble_wide.png")
        this.load.image("bubble_tall_wide", "tiles/bubble_tall_wide.png")
        this.load.image("pesticide", "tiles/pesticide.png")
        this.load.image("smoke", "tiles/smoke.png")
        this.load.image("coffee", "tiles/coffee.png")
        this.load.image("magnet", "tiles/magnet.png")
        this.load.image("watercan", "tiles/watercan.png")
        this.load.image("mushroom", "tiles/mushroom.png")
        this.load.image("star", "tiles/star.png")
        this.load.image("smallstar", "tiles/smallstar.png")
        this.load.image("smalltruck", "tiles/smalltruck.png")
        this.load.image("bigtruck", "tiles/bigtruck.png")
        this.load.image("car1", "tiles/whitecar.png")
        this.load.image("car2", "tiles/bluecar.png")


        this.load.audio("pop1", "audio/pop1.wav")
        this.load.audio("pop2", "audio/pop2.wav")
        this.load.audio("pop3", "audio/pop3.wav")
        this.load.audio("poof", "audio/poof.wav")
        this.load.audio("boom", "audio/boom.wav")
        this.load.audio("plant1", "audio/plant1.wav")
        this.load.audio("plant2", "audio/plant2.wav")
        this.load.audio("plant3", "audio/plant3.wav")
        this.load.audio('banjo', 'audio/banjo.mp3')
        this.load.audio('engine', 'audio/engine.wav')
        this.load.audio('cash', 'audio/cash.wav')
        this.load.audio('yeehaw', 'audio/yeehaw1.wav')
        this.load.audio('gulp', 'audio/gulp.wav')
        this.load.audio('arp', 'audio/arp.wav')
        this.load.audio('magnet', 'audio/magnet.wav')
        this.load.audio('buzz', 'audio/buzz.wav')
        this.load.audio('watercan', 'audio/watercan.wav')
        this.load.audio('whistle', 'audio/whistle.wav')
    }

    create() {
        this.scene.stop('loading')
        this.scene.start('start')
    }
}
