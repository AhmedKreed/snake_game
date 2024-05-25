const ARROWS = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

class Game {
  constructor(speed) {
    this.speed = speed;
    this.snakeBody = [
      [7, 10],
      [8, 10],
      [9, 10],
      [10, 10],
    ];
    this.intervalId = null;
    this.direction = null;
    this.apple = this.randomApple();
    this.lost = false;
  }
  enqueue(crid) {
    this.snakeBody.push(crid);
  }
  dequeue() {
    this.snakeBody.shift();
  }
  renderSnake(crid) {
    let snakeBody = document.createElement("div");
    snakeBody.style.gridColumnStart = crid[0];
    snakeBody.style.gridRowStart = crid[1];
    snakeBody.style.backgroundColor = "green";
    document.getElementById("box").appendChild(snakeBody);
  }
  renderApple() {
    const apple = document.createElement("div");
    apple.style.gridColumnStart = this.apple[0];
    apple.style.gridRowStart = this.apple[1];
    apple.style.backgroundColor = "red";
    document.getElementById("box").appendChild(apple);
  }
  render() {
    this.checks();
    if (this.lost) {
      let popup = document.getElementById("popup");
      popup.classList.add("pop");
      return;
    }
    document.getElementById("box").innerHTML = "";
    document.getElementById("counter").textContent = `Size : ${
      this.snakeBody.length - 4
    }`;
    this.renderApple();
    for (let snake of this.snakeBody) {
      this.renderSnake(snake);
    }
  }
  addKeyboardListener() {
    document.addEventListener("keydown", (event) => {
      let newDirection = this.direction;
      switch (event.key) {
        case "ArrowUp":
          if (this.direction !== "ArrowDown") newDirection = "ArrowUp";
          break;
        case "ArrowDown":
          if (this.direction !== "ArrowUp") newDirection = "ArrowDown";
          break;
        case "ArrowLeft":
          if (this.direction !== "ArrowRight") newDirection = "ArrowLeft";
          break;
        case "ArrowRight":
          if (this.direction !== "ArrowLeft") newDirection = "ArrowRight";
          break;
      }
      if (newDirection !== this.direction) {
        this.direction = newDirection;

        this.snakeMovement();
      }
    });
  }
  snakeMovement() {
    setTimeout(() => {
      this.moveSnake();
    }, this.speed / 4);

    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.moveSnake();
    }, this.speed);
  }
  moveSnake() {
    const newHead = this.getMovementDirection();
    if (!this.isGoingBack()) {
      this.enqueue(newHead);
      this.dequeue(newHead);
      this.render();
    } else {
      switch (this.direction) {
        case "ArrowUp":
          this.direction = "ArrowDown";
          break;
        case "ArrowDown":
          this.direction = "ArrowUp";
          break;
        case "ArrowLeft":
          this.direction = "ArrowRight";
          break;
        case "ArrowRight":
          this.direction = "ArrowLeft";
          break;
      }
    }
  }
  isGoingBack() {
    const [x, y] = this.getMovementDirection();
    const [nextX, nextY] = this.snakeBody[this.snakeBody.length - 2];
    return x === nextX && y === nextY;
  }
  getMovementDirection() {
    let [x, y] = this.snakeBody[this.snakeBody.length - 1];
    const [newX, newY] = ARROWS[this.direction];
    [x, y] = [x + newX, y + newY];
    return [x, y];
  }
  randomApple() {
    const x = Math.floor(Math.random() * (32 - 1 + 1)) + 1;
    const y = Math.floor(Math.random() * (32 - 1 + 1)) + 1;
    return [x, y];
  }
  checks() {
    const [appleX, appleY] = this.apple;
    const [x, y] = this.snakeBody[this.snakeBody.length - 1];
    if (x === appleX && y === appleY) {
      this.enqueue(this.getMovementDirection());
      this.apple = this.randomApple();
      return;
    }
    if (x > 32 || x < 1 || y > 32 || y < 1) {
      this.lost = true;
      return;
    }
    for (let i = 0; i < this.snakeBody.length - 1; i++) {
      const [bodyX, bodyY] = this.snakeBody[i];
      if (x === bodyX && y === bodyY) {
        this.lost = true;
        return;
      }
    }
  }
  reset() {
    clearInterval(this.intervalId);
    this.snakeBody = [
      [7, 10],
      [8, 10],
      [9, 10],
      [10, 10],
    ];
    this.lost = false;
    this.intervalId = null;
    this.direction = null;
    this.apple = this.randomApple();
    document.getElementById("popup").classList.remove("pop");
    document.removeEventListener("keydown", () => {});
  }
}

export default function snakeGame(time) {
  const game = new Game(time);
  return {
    startGame() {
      game.render();
      game.addKeyboardListener();
    },
    resetGame() {
      game.reset();
      game.render();
      game.addKeyboardListener();
    },
  };
}
