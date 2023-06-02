const scoreEl = document.querySelectorAll(".score-num");
const killEl = document.querySelector(".kills-num");
const result = document.querySelector(".result");
const startGameBtn = document.querySelector(".start-game-btn");
const enemyHealth = document.querySelector(".enemy-health");
const health = enemyHealth.querySelector(".health");

const canvas = document.querySelector(".canvas");
const backgroundSound = createAudio("audio/background.mp3");
// const chickenSound = createAudio("audio/chicken.mp3");

canvas.width = innerWidth - 40; // padding Size : 40
canvas.height = innerHeight - 40; // padding Size : 40

const context = canvas.getContext("2d");
const speed = 5;

const playerImg = createImage("img/Small_Plane.png");
const eggImg = createImage("img/egg.png");
const chickenImg = createImage("img/chicken.png");
const chickenFoodImg = createImage("img/chicken_food.png");
const motherChichenFoodImg = createImage("img/motherChicken_food.png");
const motherChickenImage = [
	createImage("img/daco1.png"),
	createImage("img/daco2.png"),
	createImage("img/daco3.png"),
];

class Player {
	constructor() {
		this.rotation = 0;
		this.opacity = 1;

		this.image = playerImg;
		// Width :  100px  , Height : 60px
		this.width = 100;
		this.height = 60;

		this.position = {
			x: canvas.width / 2 - this.width / 2,
			y: canvas.height - this.height - 30,
		};
		this.velocity = {
			x: 0,
			y: 0,
		};
	}

	draw() {
		context.beginPath();
		context.save();
		context.globalAlpha = this.opacity;
		context.translate(
			this.position.x + this.width / 2,
			this.position.y + this.height / 2
		);
		context.rotate(this.rotation);
		context.translate(
			-this.position.x - this.width / 2,
			-this.position.y - this.height / 2
		);

		context.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);

		// context.strokeStyle = 'green';
		// context.strokeRect(this.position.x, this.position.y, this.width, this.height);

		context.restore();
		context.closePath();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

class Projectile {
	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;

		this.radius = 5;
	}

	draw() {
		context.beginPath();
		context.fillStyle = "red";
		context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
		context.fill();
		context.closePath();
	}

	update() {
		this.draw();
		// this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

class Particle {
	constructor({ position, velocity, radius, color, fades }) {
		this.position = position;
		this.velocity = velocity;

		this.radius = radius;
		this.color = color;
		this.opacity = 1;
		this.fades = fades;
	}

	draw() {
		context.save();
		context.beginPath();
		context.globalAlpa = this.opacity;
		context.fillStyle = this.color;
		context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
		context.fill();
		context.restore();
		context.closePath();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		if (this.fades) this.opacity -= 0.01;
	}
}

// need To Convert To Egg Image
class InvaderProjectile {
	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;
		this.image = eggImg;
		// Width :  30      Height :    31
		this.width = 30;
		this.height = 31;
	}

	draw() {
		context.beginPath();
		// context.fillStyle = "white";
		// context.fillRect(this.position.x, this.position.y, this.width, this.height);
		context.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
		context.closePath();
	}

	update() {
		this.draw();
		// this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

// need To Convert To Chicken Image
class Invader {
	constructor(position) {
		this.speed = speed;
		this.image = chickenImg;
		// Width :  100px  , Height : 85px
		this.width = 100;
		this.height = 85;

		this.position = position;
	}

	draw() {
		context.beginPath();
		context.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
		context.closePath();
	}

	update(velocity) {
		this.draw();
		this.position.x += velocity.x;
		this.position.y += velocity.y;
	}

	shoot() {
		invaderProjectiles.push(
			new InvaderProjectile({
				position: {
					x: this.position.x + this.width / 2,
					y: this.position.y + this.height,
				},
				velocity: { x: 0, y: Math.random() * 2 + 1 },
			})
		);
	}
}

// need To Convert To Big Chicken Image
class MotherInvader {
	constructor(position) {
		this.velocity = {
			x: -2,
			y: +2,
		};
		const randChicken = Math.floor(Math.random() * 3);
		this.image = motherChickenImage[randChicken];
		// Width :  100px  , Height : 85px
		this.width = 100 * 3;
		this.height = 85 * 3;

		this.position = position;
		this.health = 100;
	}

	draw() {
		context.beginPath();
		context.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
		// context.strokeStyle = "#FF0000";
		// context.strokeRect(this.position.x + 80, this.position.y, this.width - 160, this.height - 50);
		context.closePath();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

class Prize {
	constructor({ position, velocity, img, score = 50 }) {
		this.position = position;
		this.velocity = velocity;
		this.image = img;
		// Width :  70      Height :    33
		this.width = 70;
		this.height = 33;
		this.score = score;
	}

	draw() {
		context.beginPath();
		// context.fillStyle = "white";
		// context.fillRect(this.position.x, this.position.y, this.width, this.height);
		context.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
		context.closePath();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

class Grid {
	constructor() {
		const columns = Math.floor(Math.random() * 5) + 2;
		const rows = Math.floor(Math.random() * 3) + 2;
		this.width = columns * 100;

		this.position = {
			x: 0,
			y: 0,
		};
		this.velocity = {
			x: 2,
			y: 0,
		};
		this.invaders = [];

		for (let x = 0; x < columns; x++) {
			for (let y = 0; y < rows; y++) {
				this.invaders.push(new Invader({ x: x * 100, y: y * 85 }));
			}
		}
	}

	update() {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.velocity.y = 0;

		if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
			this.velocity.x = -this.velocity.x;
			this.velocity.y = 40;
		}
	}
}

const keys = {
	left: { pressed: false },
	right: { pressed: false },
	up: { pressed: false },
	down: { pressed: false },
	space: { pressed: false },
};

const game = {
	over: false,
	active: true,
};

const player = new Player();

let projectiles = [];
let grids = [];
let invaderProjectiles = [];
let particles = [];
let prizes = [];
let frame;
let randomInterval;
let score;
let invadersNum;
let motherInvader;

function initGame() {
	player.opacity = 1;
	player.position = {
		x: canvas.width / 2 - player.width / 2,
		y: canvas.height - player.height - 30,
	};

	game.over = false;
	game.active = true;

	projectiles = [];
	grids = [];
	invaderProjectiles = [];
	particles = [];
	prizes = [];

	score = 0;
	frame = 0;
	randomInterval = Math.floor(Math.random() * 500) + 2000;
	invadersNum = 1;
	motherInvader = null;
	scoreEl[0].innerHTML = score;

	for (let i = 0; i < 100; i++) {
		particles.push(
			new Particle({
				position: {
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
				},
				velocity: {
					x: 0,
					y: 0.3,
				},
				radius: Math.random() * 3,
				color: "white",
				fades: false,
			})
		);
	}

	// Play background Sound
	backgroundSound.play();
	backgroundSound.volume = 0.1;

	animate();
}

function createImage(path) {
	let img = new Image();
	img.src = path;
	return img;
}

function createAudio(path) {
	const audio = new Audio();
	audio.src = path;
	return audio;
}

function createParticles(object, color, fades, r = 3) {
	for (let i = 0; i < 15; i++) {
		particles.push(
			new Particle({
				position: {
					x: object.position.x + object.width / 2,
					y: object.position.y + object.height / 2,
				},
				velocity: {
					x: (Math.random() - 0.5) * 2,
					y: (Math.random() - 0.5) * 2,
				},
				radius: Math.random() * r,
				color: color || "#BAA0DE",
				fades: fades,
			})
		);
	}
}

function gameOver(arr, index) {
	console.log("You Lose");
	createParticles(player, "white", true);
	setTimeout(() => {
		arr.splice(index, 1);
		player.opacity = 0;
		game.over = true;
	}, 0);
	setTimeout(() => {
		game.active = false;
		scoreEl[1].innerHTML = score;
		result.style.display = "block";
	}, 500);
}

function gameOver2() {
	const pointX = player.position.x + player.width / 2;
	const pointY = player.position.y + player.height / 2;
	// (this.position.x + 60,this.position.y,this.width - 120,this.height - 30)
	if (
		motherInvader.position.x + 60 <= pointX &&
		motherInvader.position.x + motherInvader.width - 120 >= pointX &&
		motherInvader.position.y <= pointY &&
		motherInvader.position.y + motherInvader.height >= pointY
	) {
		console.log("You Lose");
		createParticles(player, "white", true);
		game.over = true;
		player.opacity = 0;
		setTimeout(() => {
			game.active = false;
			scoreEl[1].innerHTML = score;
			result.style.display = "block";
		}, 500);
	}
}

function animate() {
	if (!game.active) return;
	requestAnimationFrame(animate);
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);

	particles.forEach((particle, index) => {
		if (particle.position.y - particle.radius >= canvas.height) {
			particle.position.x = Math.random() * canvas.width;
			particle.position.y = -particle.radius;
		}

		if (particle.opacity <= 0) {
			setTimeout(() => {
				particles.splice(index, 1);
			}, 0);
		} else {
			particle.update();
		}
	});

	player.update();

	// Fixed Errors
	if (motherInvader) {
		motherInvader.update();
		enemyHealth.style.display = "block";

		// Mother Invader with Wall
		if (motherInvader.position.y + motherInvader.height >= canvas.height)
			motherInvader.velocity.y = -motherInvader.velocity.y;
		if (motherInvader.position.y <= 0)
			motherInvader.velocity.y = -motherInvader.velocity.y;
		if (motherInvader.position.x + motherInvader.width >= canvas.width)
			motherInvader.velocity.x = -motherInvader.velocity.x;
		if (motherInvader.position.x <= 0)
			motherInvader.velocity.x = -motherInvader.velocity.x;

		// Kill Mother Invader
		let x = 0;
		projectiles.forEach((projectile, idx) => {
			// (this.position.x + 80, this.position.y, this.width - 160, this.height - 50);
			if (
				motherInvader &&
				projectile.position.x >= motherInvader.position.x + 80 &&
				projectile.position.x <=
					motherInvader.position.x + motherInvader.width - 160 &&
				projectile.position.y <=
					motherInvader.position.y + motherInvader.height - 50 &&
				projectile.position.y >= motherInvader.position.y
			) {
				motherInvader.health -= 5;
				health.style.width = `${motherInvader.health}%`;

				// Delete Mother Invader and Prize
				if (motherInvader.health <= 0) {
					prizes.push(
						new Prize({
							position: {
								x: motherInvader.position.x + motherInvader.width / 2,
								y: motherInvader.position.y + motherInvader.height,
							},
							velocity: {
								x: Math.random(),
								y: Math.random() * 2,
							},
							img: motherChichenFoodImg,
							score: 500,
						})
					);
					createParticles(motherInvader, "#f00", true, 8);
					enemyHealth.style.display = "none";
					motherInvader = null;
				}
				setTimeout(() => {
					projectiles.splice(idx - x++, 1);
				}, 0);
			}
		});

		// Game Over (Mother Invader Touch Player)
		// (this.position.x + 60,this.position.y,this.width - 120,this.height - 30)
		gameOver2();
	}

	prizes.forEach((prize, index) => {
		if (
			prize.position.y <= player.position.y + player.height &&
			prize.position.y + prize.height >= player.position.y &&
			prize.position.x + prize.width >= player.position.x &&
			prize.position.x <= player.position.x + player.width
		) {
			// Score
			score += prize.score;
			scoreEl[0].innerHTML = score;
			killEl.innerHTML = invadersNum;
			invadersNum++;

			setTimeout(() => {
				prizes.splice(index, 1);
			}, 0);
		} else {
			if (prize.position.y >= canvas.height - 55) {
				prize.velocity.y = 0;
			}
			if (prize.position.x + prize.width >= canvas.width) {
				prize.velocity.x = -prize.velocity.x;
			}

			prize.update();
		}
	});

	invaderProjectiles.forEach((invaderProjectile, index) => {
		if (
			invaderProjectile.position.y + invaderProjectile.height >=
			canvas.height
		) {
			setTimeout(() => {
				invaderProjectiles.splice(index, 1);
			}, 0);
		} else {
			invaderProjectile.update();
		}
		/// Game Over
		if (
			invaderProjectile.position.y >= player.position.y &&
			invaderProjectile.position.y <= player.position.y + player.height &&
			invaderProjectile.position.x >= player.position.x &&
			invaderProjectile.position.x <= player.position.x + player.width
		) {
			gameOver(invaderProjectiles, index);
		}
	});

	grids.forEach((grid, gridIndex) => {
		grid.update();

		if (grid.invaders.length === 0) {
			setTimeout(() => {
				grids.splice(gridIndex, 1);
			}, 0);
		}

		// Spawn Projectiles
		if (frame % 100 === 0 && grid.invaders.length > 0) {
			const randomNum = Math.floor(Math.random() * grid.invaders.length);
			grid.invaders[randomNum].shoot();
		}
		grid.invaders.forEach((invader, invaderIdx) => {
			// Invader Touch Player
			if (
				invader.position.y <= player.position.y + player.height &&
				invader.position.y + invader.height >= player.position.y &&
				invader.position.x + invader.width >= player.position.x &&
				invader.position.x <= player.position.x + player.width
			) {
				const invaderFound = grid.invaders.find(
					(invader2) => invader2 === invader
				);
				if (invaderFound) {
					gameOver(grid.invaders, invaderIdx);
				}
			}

			if (invader.position.y >= canvas.height) {
				setTimeout(() => {
					grid.invaders.splice(invaderIdx, 1);
				}, 0);
			} else {
				invader.update(grid.velocity);
				projectiles.forEach((projectile, projectileIdx) => {
					// Kill Invader (Chicken)
					if (
						invader.position.y <= projectile.position.y - projectile.radius &&
						invader.position.y + invader.height >=
							projectile.position.y + projectile.radius &&
						invader.position.x <= projectile.position.x - projectile.radius &&
						invader.position.x + invader.width >=
							projectile.position.x + projectile.radius
					) {
						const invaderFound = grid.invaders.find(
							(invader2) => invader2 === invader
						);
						const projectileFound = projectiles.find(
							(projectile2) => projectile2 === projectile
						);
						// Remove invader and projectile
						if (invaderFound && projectileFound) {
							// Sound Effect

							createParticles(invader, "#BAA0DE", true);

							prizes.push(
								new Prize({
									position: {
										x: invader.position.x + invader.width / 2,
										y: invader.position.y + invader.height,
									},
									velocity: { x: Math.random(), y: Math.random() * 2 + 2 },
									img: chickenFoodImg,
								})
							);

							grid.invaders.splice(invaderIdx, 1);
							projectiles.splice(projectileIdx, 1);
							if (grid.invaders.length > 0) {
								const firstInvader = grid.invaders[0];
								const lastInvader = grid.invaders[grid.invaders.length - 1];
								grid.width =
									lastInvader.position.x -
									firstInvader.position.x +
									lastInvader.width;
								grid.position.x = firstInvader.position.x;
							} else {
								setTimeout(() => {
									grids.splice(gridIndex, 1);
								}, 0);
							}
						}
					}
				});
			}
		});
	});

	projectiles.forEach((projectile, index) => {
		if (projectile.position.y + projectile.radius < 0) {
			setTimeout(() => {
				projectiles.splice(index, 1);
			}, 0);
		} else {
			projectile.update();
		}
	});

	if (keys.left.pressed && player.position.x > 0) {
		player.velocity.x = -speed;
		player.rotation = -0.2;
	} else if (
		keys.right.pressed &&
		player.position.x + player.width < canvas.width
	) {
		player.velocity.x = speed;
		player.rotation = 0.2;
	} else {
		player.velocity.x = 0;
		player.rotation = 0;
	}

	if (keys.up.pressed && player.position.y > 20) {
		player.velocity.y = -speed;
	} else if (
		keys.down.pressed &&
		player.position.y < canvas.height - player.height - 30
	) {
		player.velocity.y = speed;
	} else {
		player.velocity.y = 0;
	}

	// Create Big Invader after kill 100 invader
	if (!motherInvader && invadersNum % 51 == 0) {
		invadersNum++;
		motherInvader = new MotherInvader({ x: canvas.width / 2, y: 1 });
		enemyHealth.style.display = "block";
		health.style.width = "100%";
	} else if (
		!motherInvader &&
		(frame % randomInterval == 0 || grids.length === 0)
	) {
		grids.push(new Grid());
		randomInterval = Math.floor(Math.random() * 500) + 2000;
	}

	frame++;
}

startGameBtn.addEventListener("click", () => {
	result.style.display = "none";
	enemyHealth.style.display = "none";
	initGame();
});

addEventListener("keydown", (event) => {
	if (game.over) return;
	// console.log(event.key);
	switch (event.key) {
		case "a":
		case "ArrowLeft":
			keys.left.pressed = true;
			break;
		case "d":
		case "ArrowRight":
			keys.right.pressed = true;
			break;
		case "w":
		case "ArrowUp":
			keys.up.pressed = true;
			break;
		case "s":
		case "ArrowDown":
			keys.down.pressed = true;
			break;
		case " ":
			keys.space.pressed = true;
			projectiles.push(
				new Projectile({
					position: {
						x: player.position.x + player.width / 2,
						y: player.position.y,
					},
					velocity: { x: 0, y: -2 * speed },
				})
			);
			break;
	}
});

addEventListener("keyup", (event) => {
	switch (event.key) {
		case "a":
		case "ArrowLeft":
			keys.left.pressed = false;
			break;
		case "d":
		case "ArrowRight":
			keys.right.pressed = false;
			break;
		case "w":
		case "ArrowUp":
			keys.up.pressed = false;
			break;
		case "s":
		case "ArrowDown":
			keys.down.pressed = false;
			break;
		case " ":
			keys.space.pressed = false;
			break;
	}
});

window.addEventListener("mousemove", (e) => {
	player.position = {
		x: e.clientX - player.width / 2 - 20,
		y: e.clientY - player.height / 2,
	};

	if (player.position.x < 0) {
		player.position.x = 0;
	} else if (player.position.x + player.width > canvas.width) {
		player.position.x = canvas.width - player.width;
	} else {
	}

	if (player.position.y < 20) {
		player.position.y = 20;
	} else if (player.position.y > canvas.height - player.height - 30) {
		player.position.y = canvas.height - player.height - 30;
	} else {
	}
});

addEventListener("click", () => {
	keys.space.pressed = true;
	projectiles.push(
		new Projectile({
			position: {
				x: player.position.x + player.width / 2,
				y: player.position.y,
			},
			velocity: { x: 0, y: -2 * speed },
		})
	);
});

addEventListener("mouseup", () => {
	keys.space.pressed = false;
});

addEventListener("contextmenu", (e) => {
	e.preventDefault();

	if (score >= 5000 && grids.length > 0) {
		score -= 5000;
		scoreEl[0].innerHTML = score;
		// Kill all Chickens
		grids.forEach((grid) => {
			grid.invaders.forEach((invader) => {
				createParticles(invader, "#BAA0DE", true);

				prizes.push(
					new Prize({
						position: {
							x: invader.position.x + invader.width / 2,
							y: invader.position.y + invader.height,
						},
						velocity: { x: Math.random(), y: Math.random() * 2 + 2 },
						img: chickenFoodImg,
					})
				);
			});
			grid.invaders = [];
		});
		grids = [];
	}
});
