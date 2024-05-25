const ARROWS = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};
const GRID = 32;
const APPLECOLOR = "red";
const SNAKECOLOR = "green";

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
    this.callStack = [];
  }

  enqueue(crid) {
    this.snakeBody.push(crid);
  }

  dequeue() {
    this.snakeBody.shift();
  }

  renderSnake(crid) {
    const snakeBody = document.createElement("div");
    snakeBody.style.gridColumnStart = crid[0];
    snakeBody.style.gridRowStart = crid[1];
    snakeBody.style.backgroundColor = SNAKECOLOR;
    document.getElementById("box").appendChild(snakeBody);
  }

  renderApple() {
    const apple = document.createElement("div");
    apple.style.gridColumnStart = this.apple[0];
    apple.style.gridRowStart = this.apple[1];
    apple.style.backgroundColor = APPLECOLOR;
    document.getElementById("box").appendChild(apple);
  }

  render() {
    this.checks();
    if (this.lost) {
      clearInterval(this.intervalId);
      document.removeEventListener("keydown", this.handleKeydown);
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

  changeDirection(newDirection) {
    this.direction = newDirection;
  }

  handleKeydown = (event) => {
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
      this.changeDirection(newDirection);
      if (!this.intervalId) {
        this.snakeMovement();
      }
    }
  };

  addKeyboardListener() {
    document.addEventListener("keydown", this.handleKeydown);
  }

  processCallStack() {
    if (this.callStack.length > 0) {
      const call = this.callStack.shift();
      call();
    } else {
      this.moveSnake();
    }
  }

  snakeMovement() {
    this.intervalId = setInterval(() => this.processCallStack(), this.speed);
  }

  moveSnake() {
    const newHead = this.getMovementDirection();
    if (!this.isGoingBack()) {
      this.enqueue(newHead);
      this.dequeue();
      this.render();
    } else {
      switch (this.direction) {
        case "ArrowUp":
          this.changeDirection("ArrowDown");
          break;
        case "ArrowDown":
          this.changeDirection("ArrowUp");
          break;
        case "ArrowLeft":
          this.changeDirection("ArrowRight");
          break;
        case "ArrowRight":
          this.changeDirection("ArrowLeft");
          break;
      }
    }
  }

  getMovementDirection() {
    let [x, y] = this.snakeBody[this.snakeBody.length - 1];
    const [newX, newY] = ARROWS[this.direction];
    [x, y] = [x + newX, y + newY];
    return [x, y];
  }

  randomApple() {
    const x = Math.floor(Math.random() * (GRID - 1 + 1)) + 1;
    const y = Math.floor(Math.random() * (GRID - 1 + 1)) + 1;
    return [x, y];
  }

  isGoingBack() {
    const [x, y] = this.getMovementDirection();
    const [nextX, nextY] = this.snakeBody[this.snakeBody.length - 2];
    return x === nextX && y === nextY;
  }

  checks() {
    const [appleX, appleY] = this.apple;
    const [x, y] = this.snakeBody[this.snakeBody.length - 1];
    if (x === appleX && y === appleY) {
      this.enqueue([appleX, appleY]);
      this.apple = this.randomApple();
      return;
    }
    if (x > GRID || x < 1 || y > GRID || y < 1) {
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
      game.addKeyboardListener();
    },
  };
}
