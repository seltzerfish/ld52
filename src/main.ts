import Phaser from 'phaser'

import FarmingScene from './FarmingScene'
import StoryScene from './StoryScene'
import PreloadScene from './PreloadScene'
import LoadingScene from './LoadingScene'
import StartScene from './StartScreen'
import MainScene from './MainMenu'
import ScoreScene from './ScoreScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 704,
	height: 450,
	physics: {
		default: 'matter',
		matter: {
			// debug: true,
			gravity: {
				y: 0,
			}
		},
	},
	scene: [LoadingScene, ScoreScene, MainScene, StartScene, PreloadScene, StoryScene, FarmingScene],
	pixelArt: true,
	zoom: 2,
	roundPixels: true,
}

export default new Phaser.Game(config)
