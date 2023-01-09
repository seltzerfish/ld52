import Phaser, { LEFT } from 'phaser'
export default class FarmingScene extends Phaser.Scene {
	private map!: Phaser.Tilemaps.Tilemap;
	private player1!: Phaser.Physics.Matter.Sprite;
	private player2!: Phaser.Physics.Matter.Sprite;
	private player1SpeedCoef = 1;
	private player2SpeedCoef = 1;
	private player1Engine!: Phaser.Sound.BaseSound;
	private player2Engine!: Phaser.Sound.BaseSound;
	private p1Cursors!: any;
	private p2Cursors!: any;
	private soil: Phaser.Physics.Matter.TileBody[] = [];
	private obstaclesLayer: any;
	private tractor1label!: Phaser.GameObjects.Container;
	private tractor2label!: Phaser.GameObjects.Container;
	private p1BluberryHolding = 0;
	private p1TomatoHolding = 0;
	private p2BluberryHolding = 0;
	private p2TomatoHolding = 0;
	private p1CoffeeTimer = 0;
	private p2CoffeeTimer = 0;
	private p1StarTimer = 0;
	private p2StarTimer = 0;
	private p1StarParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
	private p2StarParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
	private p1MagnetTimer = 0;
	private p2MagnetTimer = 0;
	private player1Dead = false;
	private player2Dead = false;
	private clock = 0;
	private countingIn = true;
	private gameOver = false;
	private countdownLabel!: Phaser.GameObjects.Text;
	private countinLabel!: Phaser.GameObjects.Text;
	private cpuControlClock = 0;
	private powerupsOnMap = []
	private cpuKeys = {
		up: {
			isDown: false,
		},
		down: {
			isDown: false,
		},
		left: {
			isDown: false,
		},
		right: {
			isDown: false,
		},
	}
	constructor() {
		super('farming')
	}

	preload() {

	}

	create() {
		this.player1SpeedCoef = 1;
		this.player2SpeedCoef = 1;

		this.p1BluberryHolding = 0;
		this.p1TomatoHolding = 0;
		this.p2BluberryHolding = 0;
		this.p2TomatoHolding = 0;
		this.p1CoffeeTimer = 0;
		this.p2CoffeeTimer = 0;
		this.p1StarTimer = 0;
		this.p2StarTimer = 0;
		this.p1MagnetTimer = 0;
		this.p2MagnetTimer = 0;
		this.clock = 0;
		this.cpuControlClock = 0;
		this.player1Dead = false;
		this.player2Dead = false;
		this.countingIn = true;
		this.gameOver = false;
		this.powerupsOnMap = []
		this.setupGoalzones();
		// this.sound.volume = 0.7
		this.game["p1CountB"] = 0
		this.game["p1CountT"] = 0
		this.game["p2CountB"] = 0
		this.game["p2CountT"] = 0
		this.clock = 0;
		this.makeMap();
		this.makePlayers();
		this.setUpSoil();
		this.setUpCameras();
		this.createLabels();
		this.p2Cursors = this.input.keyboard.createCursorKeys();
		this.p1Cursors = this.input.keyboard.addKeys(
			{
				up: Phaser.Input.Keyboard.KeyCodes.W,
				down: Phaser.Input.Keyboard.KeyCodes.S,
				left: Phaser.Input.Keyboard.KeyCodes.A,
				right: Phaser.Input.Keyboard.KeyCodes.D
			});
		this.sound.play("banjo", {
			loop: true,
			volume: 0.3,
		})
		this.time.delayedCall(Phaser.Math.Between(POWERUP_MIN, POWERUP_MAX) + 3000, () => { this.spawnPowerup() })
		this.time.delayedCall(Phaser.Math.Between(CAR_MIN, CAR_MAX), () => { this.spawnCar() })
		this.makeCountdown()
		this.makeCountin()
	}

	private makeCountdown() {
		this.countdownLabel = this.add.text(20, 10, "1:30", {
			fontFamily: "font1",
			fontSize: 57,
			resolution: 6,
		})
		this.countdownLabel.setShadow(20, 20, "black", 20)
		this.countdownLabel.setDepth(0.2)
		this.countdownLabel.setVisible(false)
	}

	private makeCountin() {
		this.countinLabel = this.add.text(180, 140, "    Get Ready!", {
			fontFamily: "font1",
			fontSize: 57,
			// color: "black",
			resolution: 6,
		})
		this.countinLabel.setDepth(0.2)
		this.countinLabel.setShadow(20, 20, "black", 20)
		this.countinLabel.setAlpha(0)
		this.tweens.add({
			targets: this.countinLabel,
			alpha: 1,
		})
		this.time.delayedCall(2300, () => {
			this.countinLabel.setText("Game starts in 3")
			this.sound.play("buzz", {
				volume: 0.15,
			})
		})
		this.time.delayedCall(3300, () => {
			this.countinLabel.setText("Game starts in 2")
			this.sound.play("buzz", {
				volume: 0.15,
			})
		})
		this.time.delayedCall(4300, () => {
			this.countinLabel.setText("Game starts in 1")
			this.sound.play("buzz", {
				volume: 0.15,
			})
		})
		this.time.delayedCall(5300, () => {
			this.countinLabel.setText("       Start!")
			this.tweens.add({
				targets: this.countinLabel,
				alpha: 0,
				duration: 2000,
			})
			this.countingIn = false
			this.countdownLabel.setVisible(true)
			this.sound.play("whistle", {
				volume: 0.5,
			})
		})
	}

	private createLabels() {
		this.tractor1label = this.add.container();
		this.tractor1label.add(this.add.image(0, 0, "bubble"))
		this.tractor1label.add(this.add.image(0, 0, "bubble_tall"))
		this.tractor1label.add(this.add.image(0, 0, "bubble_wide"))
		this.tractor1label.add(this.add.image(0, 0, "bubble_tall_wide"))
		this.tractor1label.add(this.add.text(-17, -7, "0", {
			fontFamily: "font1",
			fontSize: 27,
			align: "center",
			color: "black",
			resolution: 6,
		}));
		this.tractor1label.add(this.add.image(11, 5, "blueberry"))
		this.tractor1label.add(this.add.text(-17, -7, "0", {
			fontFamily: "font1",
			fontSize: 27,
			align: "center",
			color: "black",
			resolution: 6,
		}));
		this.tractor1label.add(this.add.image(11, 5, "tomato"))


		this.tractor2label = this.add.container();
		this.tractor2label.add(this.add.image(0, 0, "bubble"))
		this.tractor2label.add(this.add.image(0, 0, "bubble_tall"))
		this.tractor2label.add(this.add.image(0, 0, "bubble_wide"))
		this.tractor2label.add(this.add.image(0, 0, "bubble_tall_wide"))
		this.tractor2label.add(this.add.text(-17, -7, "0", {
			fontFamily: "font1",
			fontSize: 27,
			align: "center",
			color: "black",
			resolution: 6,
		}));
		this.tractor2label.add(this.add.image(11, 5, "blueberry"))
		this.tractor2label.add(this.add.text(-17, -7, "0", {
			fontFamily: "font1",
			fontSize: 27,
			align: "center",
			color: "black",
			resolution: 6,
		}));
		this.tractor2label.add(this.add.image(11, 5, "tomato"))
	}

	private setupGoalzones() {
		this.matter.add.circle(270, 400, 50, {
			isSensor: true,
			label: "goalzone1",
			onCollideCallback: (collision: Phaser.Types.Physics.Matter.MatterCollisionData) => {
				if (collision.bodyB.label === "tractor1" && (this.p1BluberryHolding > 0 || this.p1TomatoHolding > 0)) {
					if (this.player1Dead) return;
					this.player1SpeedCoef = 1;
					this.game["p1CountB"] += this.p1BluberryHolding
					this.game["p1CountT"] += this.p1TomatoHolding

					if (this.p1BluberryHolding + this.p1TomatoHolding > 99) {
						this.sound.play("yeehaw", {
							pan: -0.5,
							volume: 0.7,
						})
					}
					this.p1BluberryHolding = 0;
					this.p1TomatoHolding = 0;
					this.sound.play("cash", {
						pan: -0.5,
						volume: 0.6,
					})
					//TODO: add scores
				}
			},
		});
		this.matter.add.circle(455, 50, 50, {
			isSensor: true,
			label: "goalzone2",
			onCollideCallback: (collision: Phaser.Types.Physics.Matter.MatterCollisionData) => {
				if (collision.bodyB.label === "tractor2" && (this.p2BluberryHolding > 0 || this.p2TomatoHolding > 0)) {
					if (this.player2Dead) return;
					this.player2SpeedCoef = 1;
					this.game["p2CountB"] += this.p2BluberryHolding
					this.game["p2CountT"] += this.p2TomatoHolding
					if (this.p2BluberryHolding + this.p2TomatoHolding > 99) {
						this.sound.play("yeehaw", {
							pan: 0.5,
							volume: 0.8,
						})
					}
					this.p2BluberryHolding = 0;
					this.p2TomatoHolding = 0;
					this.sound.play("cash", {
						pan: 0.5,
						volume: 0.6,
					})
				}
			},
		});
	}

	private makeMap() {
		this.map = this.make.tilemap({
			key: "main",
			tileWidth: 16,
			tileHeight: 16,
		})
		const tileset1 = this.map.addTilesetImage("eliz", "eliz_tileset");
		const tileset2 = this.map.addTilesetImage("flowers", "flowers");
		const tileset3 = this.map.addTilesetImage("obstacles", "obstacles");
		const tileset4 = this.map.addTilesetImage("roadtiles", "roadtiles");
		this.map.createLayer("grass", tileset1);
		this.map.createLayer("road", tileset4);
		this.map.createLayer("flowers", tileset2);
		this.obstaclesLayer = this.map.createLayer("obstacles", tileset3).setCollisionByProperty({ "collides": true });
		this.map.createLayer("foreground", tileset3).setDepth(0.1);
		this.matter.world.convertTilemapLayer(this.obstaclesLayer);
		this.add.image(270, 405, "blueberryhouse")
		this.add.image(450, 50, "tomatohouse")
	}

	private makePlayers() {
		const spawn1 = this.map.findObject("objects", o => o.name === "spawn1");
		this.player1 = this.matter.add.sprite(0, 0, "tractor2");
		this.anims.create({
			key: 'p1',
			frames: [{ key: 'tractor', frame: 0 }],
			frameRate: 20,
		});
		this.player1.anims.play("p1")
		this.makePlayer(this.player1, spawn1, "tractor1")
		this.player1.setDisplayOrigin(24, 48)
		this.player1Engine = this.sound.add("engine");
		this.player1Engine.play({
			loop: true,
			volume: 0,
		})
		this.player1.setName("player1")



		const spawn2 = this.map.findObject("objects", o => o.name === "spawn2");
		this.player2 = this.matter.add.sprite(0, 0, "tractor2");
		this.makePlayer(this.player2, spawn2, "tractor2")
		this.player2.setDisplayOrigin(24, 48)
		this.player2.setRotation(Math.PI)
		this.player2Engine = this.sound.add("engine");
		this.player2Engine.play({
			loop: true,
			volume: 0,
			delay: 0.2,
		})
		this.player2.setName("player2")
	}

	private makePlayer(player: any, spawn: any, label: string) {
		const circleA = this.matter.bodies.rectangle(0, 0, 22, 30, {
			label: label + "_body"
		});
		circleA.onCollideCallback = (collision: Phaser.Types.Physics.Matter.MatterCollisionData) => {
			if (label === "tractor1") {
				if (collision.bodyB.label.includes("tractor2") || collision.bodyA.label.includes("tractor2")) {
					if (this.player2Dead) return;
					if (this.p1StarTimer > 0 && this.p2StarTimer === 0) {
						this.killPlayer2();
					}
				}
				else if (collision.bodyB.label.includes("car") && collision.bodyB.frictionAir < 0.09) {
					if (this.p1StarTimer === 0) {
						this.killPlayer1()
					}
					collision.bodyB.gameObject.tint = 0x333333
					collision.bodyB.frictionAir = 0.09
					this.time.delayedCall(1500, () => {
						if (collision.bodyB.gameObject) {
							collision.bodyB.gameObject.destroy()

						}
					})
				}

			}
			else {
				if (collision.bodyB.label.includes("tractor1") || collision.bodyA.label.includes("tractor1")) {
					if (this.player1Dead) return;
					if (this.p2StarTimer > 0 && this.p1StarTimer === 0) {
						this.killPlayer1();
					}
				}
				else if (collision.bodyB.label.includes("car") && collision.bodyB.frictionAir < 0.09) {
					if (this.p2StarTimer === 0) {
						this.killPlayer2()

					}
					collision.bodyB.gameObject.tint = 0x333333
					collision.bodyB.frictionAir = 0.09
					this.time.delayedCall(1500, () => {
						if (collision.bodyB.gameObject) {
							collision.bodyB.gameObject.destroy()

						}
					})

				}
			}
		}
		const rectA = this.matter.bodies.rectangle(0, -18, 40, 10, {
			isSensor: true,
			label: label,
			density: 0.00001
		})
		rectA.onCollideCallback = (collision) => {
			if (label === "tractor1") {
				if (this.player2Dead) return;
				if (!collision.bodyB.label.includes("tractor2") && !collision.bodyA.label.includes("tractor2")) return;
				if (this.p1StarTimer > 0 && this.p2StarTimer === 0) {
					this.killPlayer2();
				}
			}
			else {
				if (this.player1Dead) return;
				if (!collision.bodyB.label.includes("tractor1") && !collision.bodyA.label.includes("tractor1")) return;
				if (this.p2StarTimer > 0 && this.p1StarTimer === 0) {
					this.killPlayer1();
				}
			}
		}
		const compoundBody = this.matter.body.create({
			parts: [circleA, rectA],
			friction: 0.00001,
			frictionAir: 0.08,
			restitution: 0.8,
		})
		player.setExistingBody(compoundBody)
		player.setPosition(spawn.x, spawn.y)
		const stars = this.add.particles("smallstar")
		const zone = new Phaser.Geom.Circle(0, 0, 20)
		const emitter = stars.createEmitter({
			speed: 10,
			lifespan: 300,
			scale: {
				start: 1,
				end: 0.5,
			},
			blendMode: Phaser.BlendModes.ADD,
			alpha: {
				start: 1,
				end: 0,
			},
			emitZone: {
				source: zone,
			}
		}).startFollow(player).stop();
		if (label === "tractor1") {
			this.p1StarParticles = emitter;
		}
		else {
			this.p2StarParticles = emitter;
		}
	}

	private setUpSoil() {
		const soilTiles = this.map.filterTiles((t) => {
			return t.properties["soil"];
		}, undefined, undefined, undefined, undefined, undefined, undefined, "grass");

		soilTiles.forEach((tile) => {
			tile.setCollision(true);
			const body = this.matter.add.tileBody(tile);
			body.setSensor(true);
			body.setOnCollide((collision: Phaser.Types.Physics.Matter.MatterCollisionData) => {
				if (collision.bodyA.label === "tractor1") {
					this.tractor1HitsSoil(collision);

				}
				else if (collision.bodyA.label === "tractor2") {
					this.tractor2HitsSoil(collision)
				}
			})
			this.soil.push(body);
		})
		// const grassLayer = this.map.layers[this.map.getLayerIndex("grass")]
		// grassLayer.setCollisionByProperty({ "soil": true });
	}

	private setUpCameras() {
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels).fadeIn()
	}

	private tractor1HitsSoil(collision: Phaser.Types.Physics.Matter.MatterCollisionData) {
		const currentTile = this.map.getTileAtWorldXY(collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass").index;
		if (BERRIES.includes(currentTile) && currentTile != 45) {
			return;
		}
		if (currentTile === 36 || currentTile === 45) {
			if (this.p1MagnetTimer === 0) {
				this.player1SpeedCoef -= 0.005
				this.player1SpeedCoef = Math.max(0.2, this.player1SpeedCoef)
			}
			this.map.putTileAtWorldXY(28, collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass")
			if (currentTile === 36) {
				this.harvestTomato(collision.bodyB.position.x, collision.bodyB.position.y, this.player1);
			}
			else {
				this.harvestBlueberry(collision.bodyB.position.x, collision.bodyB.position.y, this.player1);
			}
		}
		else {
			this.sound.play(["plant1", "plant2", "plant3"][Phaser.Math.Between(0, 2)], {
				volume: 0.3,
			})
			const delay = 5000;
			this.map.putTileAtWorldXY(42, collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass")
			this.time.delayedCall(delay, () => {
				const currentTile = this.map.getTileAtWorldXY(collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass").index;
				if (currentTile !== 42) return;
				this.map.putTileAtWorldXY(43, collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass")
				this.time.delayedCall(delay, () => {
					const currentTile = this.map.getTileAtWorldXY(collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass").index;
					if (currentTile !== 43) return;
					this.map.putTileAtWorldXY(44, collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass")
					this.time.delayedCall(delay, () => {
						const currentTile = this.map.getTileAtWorldXY(collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass").index;
						if (currentTile !== 44) return;
						this.map.putTileAtWorldXY(45, collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass")
					})
				})
			})
		}

	}

	private tractor2HitsSoil(collision: Phaser.Types.Physics.Matter.MatterCollisionData) {
		const currentTile = this.map.getTileAtWorldXY(collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass").index;
		if (TOMATOES.includes(currentTile) && currentTile != 36) {
			return;
		}
		if (currentTile === 36 || currentTile === 45) {
			if (this.p2MagnetTimer === 0) {
				this.player2SpeedCoef -= 0.005
				this.player2SpeedCoef = Math.max(0.2, this.player2SpeedCoef)
			}
			this.map.putTileAtWorldXY(28, collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass")
			if (currentTile === 36) {
				this.harvestTomato(collision.bodyB.position.x, collision.bodyB.position.y, this.player2);
			}
			else {
				this.harvestBlueberry(collision.bodyB.position.x, collision.bodyB.position.y, this.player2);
			}
		}



		else {
			this.sound.play(["plant1", "plant2", "plant3"][Phaser.Math.Between(0, 2)], {
				volume: 0.2,
			})
			const delay = 5000;
			this.map.putTileAtWorldXY(33, collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass")
			this.time.delayedCall(delay, () => {
				const currentTile = this.map.getTileAtWorldXY(collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass").index;
				if (currentTile !== 33) return;
				this.map.putTileAtWorldXY(34, collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass")
				this.time.delayedCall(delay + 1000, () => {
					const currentTile = this.map.getTileAtWorldXY(collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass").index;
					if (currentTile !== 34) return;
					this.map.putTileAtWorldXY(35, collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass")
					this.time.delayedCall(delay + 2000, () => {
						const currentTile = this.map.getTileAtWorldXY(collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass").index;
						if (currentTile !== 35) return;
						this.map.putTileAtWorldXY(36, collision.bodyB.position.x, collision.bodyB.position.y, undefined, undefined, "grass")
					})
				})
			})
		}
	}

	private spawnPowerup() {
		// const powerups = ["star"]
		const powerups = ["pesticide", "star", "coffee", "magnet", "watercan"]
		const chosen_powerup = powerups[Phaser.Math.Between(0, powerups.length - 1)]
		const lower_x = 30
		const upper_x = 680
		const lower_y = 40
		const upper_y = 410
		let x = Phaser.Math.Between(lower_x, upper_x)
		let y = Phaser.Math.Between(lower_y, upper_y)
		while (this.tooCloseToPlayer(x, y)) {
			x = Phaser.Math.Between(lower_x, upper_x)
			y = Phaser.Math.Between(lower_y, upper_y)
		}
		const powerupContainer = this.add.container(0, 0)
		this.powerupsOnMap.push(powerupContainer)
		powerupContainer.add(this.add.pointlight(x, y, 0xffffff, 40, 0.3, 0.05))
		powerupContainer.add(this.matter.add.image(x, y, chosen_powerup, undefined, {
			isSensor: true,
			onCollideCallback: (collision: Phaser.Types.Physics.Matter.MatterCollisionData) => {
				if (collision.bodyA.label === "tractor1" || collision.bodyB.label === "tractor1") {
					this.powerupsOnMap = this.powerupsOnMap.filter((p) => {
						return (p.getAt(1).x !== x || p.getAt(1).y !== y)
					})
					this.applyPowerup("tractor1", chosen_powerup)
					powerupContainer.destroy()
				}
				else if (collision.bodyA.label === "tractor2" || collision.bodyB.label === "tractor2") {
					this.applyPowerup("tractor2", chosen_powerup)
					this.powerupsOnMap = this.powerupsOnMap.filter((p) => {
						return (p.getAt(1).x !== x || p.getAt(1).y !== y)
					})
					powerupContainer.destroy()
				}
			}
		}))
		const startY = powerupContainer.y;
		this.tweens.add({
			targets: powerupContainer,
			y: {
				from: startY - 7,
				to: startY + 7,
			},
			ease: "Quad.easeInOut",
			yoyo: true,
			repeat: -1,
		})
		this.time.delayedCall(Phaser.Math.Between(POWERUP_MIN, POWERUP_MAX), () => { this.spawnPowerup() })


	}
	private tooCloseToPlayer(x: number, y: number) {
		const tolerance = 100;
		const v1 = new Phaser.Math.Vector2(x, y)
		const p1 = new Phaser.Math.Vector2(this.player1.x, this.player1.y)
		const p2 = new Phaser.Math.Vector2(this.player2.x, this.player2.y)
		return p1.distance(v1) < tolerance || p2.distance(v1) < tolerance;
	}

	private spawnCar() {
		const cars = ["bigtruck", "smalltruck", "car1", "car2"]
		const selection = cars[Phaser.Math.Between(0, cars.length - 1)]
		const car = this.matter.add.sprite(343, -80, selection, undefined, {
			frictionAir: 0,
			label: "car",
		})
		car.setOnCollide((collision) => {
			if (car.body.frictionAir === 0 && collision.bodyA.label === "car" && collision.bodyB.label === "car") {
				car.setFrictionAir(0.08)
				if (car.y > 0 && car.y < 430) {
					this.sound.play("boom", {
						volume: 0.2,
					})
				}

				car.setTint(0x333333)
				this.time.delayedCall(1500, () => {
					if (car) {
						car.destroy()

					}
				})
			}

		})
		car.setScale(0.9)
		if (selection === "bigtruck") car.setScale(0.7)

		const drivingNorth = Math.random() < 0.5;
		const s = Math.random() * 1.5 + 1.8
		if (drivingNorth) {
			car.setPosition(380, 500)
			car.setVelocity(0, -s)
			this.time.delayedCall(Phaser.Math.Between(CAR_MIN, CAR_MAX), () => { this.spawnCar() })
		}
		else {
			car.setRotation(Math.PI)
			car.setVelocity(0, s)
			this.time.delayedCall(Phaser.Math.Between(CAR_MIN, CAR_MAX), () => { this.spawnCar() })
		}
		this.time.delayedCall(10000, () => {
			if (car) {
				car.destroy()
			}
		})

	}

	private applyPowerup(tractor: string, powerup: string) {
		if (tractor === "tractor1") {
			if (powerup === "coffee") {
				this.p1CoffeeTimer = 5000;
				this.sound.play("gulp")
			}
			else if (powerup === "star") {
				this.sound.play("arp")
				this.p1StarParticles.start();
				this.p1StarTimer = 6000;
				this.player1.setScale(1.5)
			}
			else if (powerup === "magnet") {
				this.sound.play("magnet", {
					volume: 0.6
				});
				this.player1.setFrame(1)
				this.p1MagnetTimer = 6000;
				this.player1SpeedCoef = 1;
				if (this.p1BluberryHolding > 0 || this.p1TomatoHolding > 0) {
					this.time.delayedCall(400, () => {
						this.sound.play("cash", {
							pan: -0.5,
							volume: 0.6,
						})
					})
				}
				for (let i = 0; i < this.p1BluberryHolding; i++) {
					this.time.delayedCall(i * 30, () => {
						this.p1BluberryHolding -= 1;
						this.game["p1CountB"] += 1
						this.tweenFruit(this.add.image(this.player1.x, this.player1.y, "blueberry"), 270, 405)
					})
				}
				for (let i = 0; i < this.p1TomatoHolding; i++) {
					this.time.delayedCall(i * 30, () => {
						this.game["p1CountT"] += 1
						this.p1TomatoHolding -= 1;
						this.tweenFruit(this.add.image(this.player1.x, this.player1.y, "tomato"), 270, 405)
					})
				}
			}
			else if (powerup === "watercan") {
				this.sound.play("watercan")
				this.growAllBlueberries();
			}
			else if (powerup === "pesticide") {
				this.sound.play("poof")
				this.killAllTomatoes()
			}
		}
		else {
			if (powerup === "coffee") {
				this.p2CoffeeTimer = 5000;
				this.sound.play("gulp")
			}
			else if (powerup === "star") {
				this.sound.play("arp")
				this.p2StarParticles.start();
				this.player2.setScale(1.5)
				this.p2StarTimer = 6000;
			}
			else if (powerup === "magnet") {
				this.sound.play("magnet", {
					volume: 0.6
				});
				this.player2.setFrame(1)
				this.p2MagnetTimer = 6000;
				this.player2SpeedCoef = 1;
				if (this.p2BluberryHolding > 0 || this.p2TomatoHolding > 0) {
					this.time.delayedCall(400, () => {
						this.sound.play("cash", {
							pan: 0.5,
							volume: 0.6,
						})
					})
				}
				for (let i = 0; i < this.p2BluberryHolding; i++) {
					this.time.delayedCall(i * 30, () => {
						this.game["p2CountB"] += 1
						this.p2BluberryHolding -= 1;
						this.tweenFruit(this.add.image(this.player2.x, this.player2.y, "blueberry"), 450, 50)
					})
				}
				for (let i = 0; i < this.p2TomatoHolding; i++) {
					this.time.delayedCall(i * 30, () => {
						this.game["p2CountT"] += 1
						this.p2TomatoHolding -= 1;
						this.tweenFruit(this.add.image(this.player2.x, this.player2.y, "tomato"), 450, 50)
					})
				}
			}
			else if (powerup === "watercan") {
				this.sound.play("watercan")
				this.growAllTomatoes();
			}
			else if (powerup === "pesticide") {
				this.sound.play("poof")
				this.killAllBlueberries()
			}
		}
	}

	private growAllBlueberries() {
		this.soil.forEach((t: Phaser.Physics.Matter.TileBody) => {
			if (BERRIES.includes(t.tile.index)) {
				t.tile.index = 45
			}
		})
	}

	private growAllTomatoes() {
		this.soil.forEach((t: Phaser.Physics.Matter.TileBody) => {
			if (TOMATOES.includes(t.tile.index)) {
				t.tile.index = 36
			}
		})
	}

	private killAllBlueberries() {
		this.soil.forEach((t: Phaser.Physics.Matter.TileBody) => {
			if (BERRIES.includes(t.tile.index)) {
				t.tile.index = 28
				const p = this.add.particles("smoke")
				p.createEmitter({
					speed: 20,
					alpha: {
						start: 1,
						end: 0,
					}
				}).explode(3, t.tile.getCenterX(), t.tile.getCenterY())
				this.time.delayedCall(2000, () => {
					p.destroy()
				})
			}
		})
	}

	private killAllTomatoes() {
		this.soil.forEach((t: Phaser.Physics.Matter.TileBody) => {
			if (TOMATOES.includes(t.tile.index)) {
				t.tile.index = 28
				const p = this.add.particles("smoke")
				p.createEmitter({
					speed: 20,
					alpha: {
						start: 1,
						end: 0,
					}
				}).explode(3, t.tile.getCenterX(), t.tile.getCenterY())
				this.time.delayedCall(2000, () => {
					p.destroy()
				})
			}
		})
	}

	private killPlayer1() {
		if (this.player1Dead) {
			return;
		}
		const w = this.sys.game.canvas.width;
		const spawn1 = this.map.findObject("objects", o => o.name === "spawn1");

		const pan = (this.player1.x - w / 2) / w
		this.sound.play("boom", {
			pan: pan,
			volume: 0.4,
		})
		this.player1.tint = 0x444444
		const p = this.add.particles("smoke")
		p.createEmitter({
			speed: 40,
			alpha: {
				start: 0.7,
				end: 0,
			},
			scale: { start: 1, end: 1.6 },
			blendMode: Phaser.BlendModes.DARKEN
		}).startFollow(this.player1)
		this.player1Dead = true;
		this.p1StarTimer = 0;
		this.p1CoffeeTimer = 0;
		this.time.delayedCall(4000, () => {
			this.player1.setPosition(spawn1.x, spawn1.y)
			p.destroy()
			this.player1.tint = 0xffffff
			this.player1Dead = false
			this.player1.setRotation(0)
			this.p1BluberryHolding = 0;
			this.p1TomatoHolding = 0;
			this.player1SpeedCoef = 1;
		})

	}


	private killPlayer2() {
		if (this.player2Dead) {
			return;
		}
		const w = this.sys.game.canvas.width;
		const spawn2 = this.map.findObject("objects", o => o.name === "spawn2");

		const pan = (this.player2.x - w / 2) / w
		this.sound.play("boom", {
			pan: pan,
			volume: 0.4,
		})
		this.player2.tint = 0x444444
		const p = this.add.particles("smoke")
		p.createEmitter({
			speed: 40,
			alpha: {
				start: 0.7,
				end: 0,
			},
			scale: { start: 1, end: 1.6 },
			blendMode: Phaser.BlendModes.DARKEN
		}).startFollow(this.player2)
		this.player2Dead = true;
		this.p2StarTimer = 0;
		this.p2CoffeeTimer = 0;
		this.time.delayedCall(4000, () => {
			this.player2.setPosition(spawn2.x, spawn2.y)
			p.destroy()
			this.player2.tint = 0xffffff
			this.player2Dead = false
			this.player2.setRotation(Math.PI)
			this.p2BluberryHolding = 0;
			this.p2TomatoHolding = 0;
			this.player2SpeedCoef = 1;
		})

	}

	private harvestTomato(x: number, y: number, player: Phaser.Physics.Matter.Sprite) {
		const w = this.sys.game.canvas.width;
		this.sound.play(["pop1", "pop2", "pop3"][Phaser.Math.Between(0, 2)], {
			pan: (x - w / 2) / w,
			rate: 0.8,
			volume: 0.7,
		})
		if (player.name === "player1") {
			if (this.p1MagnetTimer > 0) {
				const img = this.add.image(x, y, "tomato")
				this.tweenFruit(img, 270, 405);
				this.game["p1CountT"] += 1

			}
			else {
				this.p1TomatoHolding += 1;
			}

		}
		else {
			if (this.p2MagnetTimer > 0) {
				const img = this.add.image(x, y, "tomato")
				this.tweenFruit(img, 450, 50);
				this.game["p2CountT"] += 1
			}
			else {
				this.p2TomatoHolding += 1;
			}
		}
	}


	private harvestBlueberry(x: number, y: number, player: Phaser.Physics.Matter.Sprite) {
		const w = this.sys.game.canvas.width;
		this.sound.play(["pop1", "pop2", "pop3"][Phaser.Math.Between(0, 2)], {
			pan: (x - w / 2) / w,
			rate: 1.5,
			volume: 0.7,
		})
		if (player.name === "player1") {
			if (this.p1MagnetTimer > 0) {
				const img = this.add.image(x, y, "blueberry")
				this.tweenFruit(img, 270, 405);
				this.game["p1CountB"] += 1
			}
			else {
				this.p1BluberryHolding += 1;
			}

		}
		else {
			if (this.p2MagnetTimer > 0) {
				const img = this.add.image(x, y, "blueberry")
				this.tweenFruit(img, 450, 50);
				this.game["p2CountB"] += 1
			}
			else {
				this.p2BluberryHolding += 1;
			}
		}

	}


	private tweenFruit(img: Phaser.GameObjects.Image, x: number, y: number) {
		this.tweens.add({
			targets: img,
			x: x,
			y: y,
			ease: 'Power2',
			duration: 2000,
			onComplete: () => {
				img.destroy();
			}
		});
		this.tweens.add({
			targets: img,
			alpha: 0,
			ease: 'Quart.easeIn',
			duration: 2000
		})
	}

	update(time: number, delta: number): void {
		this.updateEngineNoises();
		this.processPlayersInput(delta);
		this.updateLabels();
		this.updateCoffee(delta);
		this.updateStars(delta);
		this.updateMagnet(delta);
		this.updateCountdown(delta);
	}

	private updateCountdown(delta: number) {
		if (this.countingIn) return;
		if (this.gameOver) return;
		this.clock += delta;
		const left = GOAL - this.clock
		if (left < 15000 && this.sound.get("banjo").rate === 1) {
			this.sound.get("banjo")!.setRate(1.01)
			this.tweens.add({
				targets: this.sound.get("banjo"),
				rate: 1.7,
			})
			this.spawnPowerup()
			this.countdownLabel.setColor("red")
		}
		if (left <= 0) {
			this.sound.play("whistle")
			this.gameOver = true
			this.tweens.add({
				targets: this.sound.get("banjo"),
				volume: 0,
			})
			this.time.delayedCall(2000, () => {
				this.sound.stopAll()
				this.sound.removeAll()
				this.scene.start('score')
			})
		}
		this.countdownLabel.setText(this.formats(Math.max(0, Math.ceil(left / 1000))))

	}

	private updateCoffee(delta: number) {
		this.p1CoffeeTimer -= delta;
		this.p1CoffeeTimer = Math.max(this.p1CoffeeTimer, 0);
		this.p2CoffeeTimer -= delta;
		this.p2CoffeeTimer = Math.max(this.p2CoffeeTimer, 0);
	}

	private updateStars(delta: number) {
		this.p1StarTimer -= delta;
		this.p1StarTimer = Math.max(this.p1StarTimer, 0);
		if (this.p1StarTimer === 0) {
			this.p1StarParticles.stop()
			this.player1.setScale(1)
		}
		this.p2StarTimer -= delta;
		this.p2StarTimer = Math.max(this.p2StarTimer, 0);
		if (this.p2StarTimer === 0) {
			this.player2.setScale(1)
			this.p2StarParticles.stop()
		}
	}

	private updateMagnet(delta: number) {
		this.p1MagnetTimer -= delta;
		this.p1MagnetTimer = Math.max(this.p1MagnetTimer, 0);
		if (this.p1MagnetTimer === 0) {
			this.player1.setFrame(0)
		}
		this.p2MagnetTimer -= delta;
		this.p2MagnetTimer = Math.max(this.p2MagnetTimer, 0);
		if (this.p2MagnetTimer === 0) {
			this.player2.setFrame(0)
		}
	}

	private updateLabels() {
		if (this.p1BluberryHolding < 1 && this.p1TomatoHolding < 1) {
			this.tractor1label.visible = false;
		}
		else {
			this.tractor1label.visible = true;
			this.tractor1label.getAt(0).setVisible(false);
			this.tractor1label.getAt(1).setVisible(false);
			this.tractor1label.getAt(2).setVisible(false);
			this.tractor1label.getAt(3).setVisible(false);
			(this.tractor1label.getAt(4) as Phaser.GameObjects.Text).setVisible(false)
			this.tractor1label.getAt(5).setVisible(false);
			this.tractor1label.getAt(6).setVisible(false);
			this.tractor1label.getAt(7).setVisible(false);
			if (this.p1TomatoHolding < 1) {
				if (this.p1BluberryHolding > 99) {
					this.tractor1label.getAt(2).setVisible(true);
					(this.tractor1label.getAt(4) as Phaser.GameObjects.Text).setX(-23).setVisible(true)
					this.tractor1label.getAt(5).setVisible(true).x = 14
				}
				else {
					this.tractor1label.getAt(0).setVisible(true);
					(this.tractor1label.getAt(4) as Phaser.GameObjects.Text).setX(-17).setVisible(true)
					this.tractor1label.getAt(5).setVisible(true).x = 11
				}
			}
			else if (this.p1BluberryHolding < 1) {
				if (this.p1TomatoHolding > 99) {
					this.tractor1label.getAt(2).setVisible(true);
					(this.tractor1label.getAt(6) as Phaser.GameObjects.Text).setX(-23).setY(-7).setVisible(true)
					this.tractor1label.getAt(7).setVisible(true).x = 14
					this.tractor1label.getAt(7).setVisible(true).y = 5
				}
				else {
					this.tractor1label.getAt(0).setVisible(true);
					(this.tractor1label.getAt(6) as Phaser.GameObjects.Text).setX(-17).setY(-7).setVisible(true)
					this.tractor1label.getAt(7).setVisible(true).x = 11
					this.tractor1label.getAt(7).setVisible(true).y = 5
				}
			}
			else {
				this.tractor1label.getAt(4).setVisible(true);
				this.tractor1label.getAt(5).setVisible(true);
				this.tractor1label.getAt(6).setVisible(true).setY(-25);
				this.tractor1label.getAt(7).setVisible(true).y = -14;
				if (this.p1BluberryHolding > 99 || this.p1TomatoHolding > 99) {
					this.tractor1label.getAt(3).setVisible(true);
					if (this.p1BluberryHolding > 99) {
						this.tractor1label.getAt(4).setX(-23)
					}
					if (this.p1TomatoHolding > 99) {
						this.tractor1label.getAt(6).setX(-23)
					}
				}
				else {
					this.tractor1label.getAt(1).setVisible(true);

				}
			}

			this.tractor1label.setPosition(this.player1.x, this.player1.y - 50);
			(this.tractor1label.getAt(4) as Phaser.GameObjects.Text).setText(this.p1BluberryHolding);
			(this.tractor1label.getAt(6) as Phaser.GameObjects.Text).setText(this.p1TomatoHolding);


		}


		if (this.p2BluberryHolding < 1 && this.p2TomatoHolding < 1) {
			this.tractor2label.visible = false;
		}
		else {
			this.tractor2label.visible = true;
			this.tractor2label.getAt(0).setVisible(false);
			this.tractor2label.getAt(1).setVisible(false);
			this.tractor2label.getAt(2).setVisible(false);
			this.tractor2label.getAt(3).setVisible(false);
			(this.tractor2label.getAt(4) as Phaser.GameObjects.Text).setVisible(false)
			this.tractor2label.getAt(5).setVisible(false);
			this.tractor2label.getAt(6).setVisible(false);
			this.tractor2label.getAt(7).setVisible(false);
			if (this.p2TomatoHolding < 1) {
				if (this.p2BluberryHolding > 99) {
					this.tractor2label.getAt(2).setVisible(true);
					(this.tractor2label.getAt(4) as Phaser.GameObjects.Text).setX(-23).setVisible(true)
					this.tractor2label.getAt(5).setVisible(true).x = 14
				}
				else {
					this.tractor2label.getAt(0).setVisible(true);
					(this.tractor2label.getAt(4) as Phaser.GameObjects.Text).setX(-17).setVisible(true)
					this.tractor2label.getAt(5).setVisible(true).x = 11
				}
			}
			else if (this.p2BluberryHolding < 1) {
				if (this.p2TomatoHolding > 99) {
					this.tractor2label.getAt(2).setVisible(true);
					(this.tractor2label.getAt(6) as Phaser.GameObjects.Text).setX(-23).setY(-7).setVisible(true)
					this.tractor2label.getAt(7).setVisible(true).x = 14
					this.tractor2label.getAt(7).setVisible(true).y = 5
				}
				else {
					this.tractor2label.getAt(0).setVisible(true);
					(this.tractor2label.getAt(6) as Phaser.GameObjects.Text).setX(-17).setY(-7).setVisible(true)
					this.tractor2label.getAt(7).setVisible(true).x = 11
					this.tractor2label.getAt(7).setVisible(true).y = 5
				}
			}
			else {
				this.tractor2label.getAt(4).setVisible(true);
				this.tractor2label.getAt(5).setVisible(true);
				this.tractor2label.getAt(6).setVisible(true).setY(-25);
				this.tractor2label.getAt(7).setVisible(true).y = -14;
				if (this.p2BluberryHolding > 99 || this.p2TomatoHolding > 99) {
					this.tractor2label.getAt(3).setVisible(true);
					if (this.p2BluberryHolding > 99) {
						this.tractor2label.getAt(4).setX(-23)
					}
					if (this.p2TomatoHolding > 99) {
						this.tractor2label.getAt(6).setX(-23)
					}
				}
				else {
					this.tractor2label.getAt(1).setVisible(true);

				}
			}

			this.tractor2label.setPosition(this.player2.x, this.player2.y - 50);
			(this.tractor2label.getAt(4) as Phaser.GameObjects.Text).setText(this.p2BluberryHolding);
			(this.tractor2label.getAt(6) as Phaser.GameObjects.Text).setText(this.p2TomatoHolding);
		}
	}

	private processPlayersInput(delta: number) {
		this.processPlayerInput(delta, this.player1, this.p1Cursors, this.player1SpeedCoef)
		if (this.game["numplayers"] === 2) {
			this.processPlayerInput(delta, this.player2, this.p2Cursors, this.player2SpeedCoef)
		}
		else {
			this.cpuControlClock += delta;
			if (this.cpuControlClock > 100) {
				this.cpuControlClock = 0;
				this.calculateCpuKeys()

			}
			this.processPlayerInput(delta, this.player2, this.cpuKeys as any, this.player2SpeedCoef);
		}
	}

	private calculateCpuKeys() {
		const circ = new Phaser.Geom.Circle(this.player2.x, this.player2.y, 200)
		this.cpuKeys.up.isDown = true;
		this.cpuKeys.left.isDown = false;
		this.cpuKeys.right.isDown = false;
		let tilesOfInterest = this.map.getTilesWithinShape(circ, undefined, undefined, "grass")
		tilesOfInterest = tilesOfInterest.filter((t: Phaser.Tilemaps.Tile) => {
			if (t.index === 28) return true;
			if (BERRIES.includes(t.index)) return true;
			if (t.index === 36) return true;
			return false;
		})
		let x_pull = 0
		let y_pull = 0
		if (Math.abs(32 * 16 + 8 - this.player2.x) < 50 && Math.abs(17 * 16 + 8 - this.player2.y) < 50) {
			x_pull = this.player2.x - (32 * 16 + 8)
			y_pull = this.player2.y - (17 * 16 + 8)
		}
		else if (this.p2StarTimer > 0 && !this.player1Dead) {
			x_pull = this.player1.x - this.player2.x
			y_pull = this.player1.y - this.player2.y
		}
		else if (this.p2BluberryHolding + this.p2TomatoHolding > 50) {
			x_pull = 455 - this.player2.x
			y_pull = 50 - this.player2.y
		}
		else {
			this.powerupsOnMap.forEach((p) => {

				const a = p.getAt(1).x - this.player2.x
				const b = p.getAt(1).y - this.player2.y
				let c = new Phaser.Math.Vector2(a, b)
				let special = 600
				x_pull += c.x / Math.pow(c.length(), 2) * special
				y_pull += c.y / Math.pow(c.length(), 2) * special
			})
			tilesOfInterest.forEach((tile: Phaser.Tilemaps.Tile) => {
				const a = (tile.x * 16 + 8) - this.player2.x
				const b = (tile.y * 16 + 8) - this.player2.y
				let c = new Phaser.Math.Vector2(a, b)
				let special = tile.index === 36 ? 300 : 1;
				if (tile.index === 45) special = 200;
				x_pull += c.x / Math.pow(c.length(), 2) * special
				y_pull += c.y / Math.pow(c.length(), 2) * special

			})
		}
		const pull = new Phaser.Math.Vector2(x_pull, y_pull)
		const angle = Phaser.Math.Angle.ShortestBetween(Phaser.Math.RadToDeg(pull.angle() - Math.PI * 1.5), this.player2.angle)
		this.cpuKeys.right.isDown = angle < 0;
		this.cpuKeys.left.isDown = angle > 0;

	}

	private updateEngineNoises() {
		if (this.gameOver) {
			return;
		}
		const w = this.sys.game.canvas.width;
		const p1Speed = new Phaser.Math.Vector2(this.player1.body.velocity.x, this.player1.body.velocity.y).length()
		this.player1Engine.setRate(0.6 + p1Speed / 2.3)
		this.player1Engine.setVolume((0.5 + p1Speed / 3.6) * 0.15)
		const pan1 = (this.player1.body.position.x - w / 2) / w * 2;
		this.player1Engine.setPan(pan1)
		const p2Speed = new Phaser.Math.Vector2(this.player2.body.velocity.x, this.player2.body.velocity.y).length()
		this.player2Engine.setRate(0.6 + p2Speed / 2.3)
		this.player2Engine.setVolume((0.5 + p2Speed / 3.6) * 0.15)
		const pan2 = (this.player2.body.position.x - w / 2) / w * 2;
		this.player2Engine.setPan(pan2)
	}

	private processPlayerInput(delta: number, player: Phaser.Physics.Matter.Sprite, cursors: Phaser.Types.Input.Keyboard.CursorKeys, coef: number) {
		if (this.countingIn) return;
		const left = GOAL - this.clock
		if (left <= 0) return;
		if (player.name === "player1" && this.player1Dead) return;
		if (player.name === "player2" && this.player2Dead) return;
		let playerSpeed = 0.00003 * delta * coef;
		let turnspeed = 0.003 * delta;
		let starred = false
		if ((player.name === "player1" && this.p1StarTimer > 0) || (player.name === "player2" && this.p2StarTimer > 0)) {
			playerSpeed = 0.00003 * delta * 2.4;
			starred = true
		}
		if ((player.name === "player1" && this.p1CoffeeTimer > 0) || (player.name === "player2" && this.p2CoffeeTimer > 0)) {
			playerSpeed = 0.00003 * delta * 2
			if (starred) {
				playerSpeed *= 2
			}
			turnspeed *= 1.5
		}
		if (left < 15000) {
			playerSpeed *= 1.25
			turnspeed *= 1.15
		}
		if (cursors.up.isDown) {
			const facingAngle = player.rotation - Math.PI / 2;
			const force = new Phaser.Math.Vector2(Math.cos(facingAngle) * playerSpeed, Math.sin(facingAngle) * playerSpeed)
			player.applyForce(force)
		}
		if (cursors.down.isDown) {
			const facingAngle = player.rotation - Math.PI / 2;
			const force = new Phaser.Math.Vector2(-0.4 * Math.cos(facingAngle) * playerSpeed, -0.4 * Math.sin(facingAngle) * playerSpeed)
			player.applyForce(force)
		}
		if (cursors.right.isDown) {
			player.setRotation(player.rotation += turnspeed)
		}
		if (cursors.left.isDown) {
			player.setRotation(player.rotation -= turnspeed)
		}
	}

	private formats(sec_num: number) {
		var hours = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours < 10) { hours = "0" + hours; }
		if (minutes < 10) { minutes = minutes; }
		if (seconds < 10) { seconds = "0" + seconds; }
		return minutes + ':' + seconds;
	}


}

const TOMATOES = [33, 34, 35, 36]
const BERRIES = [42, 43, 44, 45]

const POWERUP_MIN = 4000
const POWERUP_MAX = 13000

const CAR_MIN = 1000
const CAR_MAX = 3400
// const POWERUP_MAX = 25000
const GOAL = 1.25 * 60 * 1000