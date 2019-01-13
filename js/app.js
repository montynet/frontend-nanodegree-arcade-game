let FROGGER = function () {

  /**
   * Class to help build the game.
   * This was added after Udacity reviewer stated
   * not to use declared functions.
   */
  class Util {
    constructor(){
    }

    static randomEnemyPosition(){
      let position = {};
      let enemyRow = Math.floor(Math.random() * 3);
      position.x = -80;
      position.y = 65 + 83 * enemyRow;
      return position;
    }

    static randomSpeed({baseSpeed = 250,
                  rangeSpeed= 300} = {}) {
      return baseSpeed + Math.floor(Math.random() * rangeSpeed);
    }
  }


  /**
   * Base class for the game objects.
   */
  class GameObject {
    constructor(sprite, x, y) {
      this.sprite = sprite;
      this.x = x;
      this.y = y;
    }

    render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
  }

  /**
   * Enemy class inherits from base game object.
   */
  class Enemy extends GameObject {

    constructor(sprite = 'images/enemy-bug.png', position = Util.randomEnemyPosition(), speed = Util.randomSpeed()) {
      super(sprite, position.x, position.y);
      this.speed = speed;
    }

    update(dt) {
      this.x += dt * this.speed;
      if (this.x > 505) {
        this.reset();
      }
    }

    reset() {
      let position = Util.randomEnemyPosition();
      this.speed = Util.randomSpeed();
      this.x = position.x;
      this.y = position.y;
    }
  }

  class Player extends GameObject {
    constructor(sprite = 'images/char-boy.png', playerstartx = 202, playerstarty = 380) {
      super(sprite, playerstartx, playerstarty);
      this.playerstartx = playerstartx;
      this.playerstarty = playerstarty;
    }

    update(dt) {
      if (this.haveCollisionsOccurred.call(this)) {
        this.reset();
      } else if (this.isPlayerOnWater.call(this)) {
        this.reset();
        let isCocky = confirm("You won! Increase difficulty? ");

        //Add an enemy to the game if the player has chosen to do. Increase the speed, override baseSpeed default.
        if(isCocky){
          allEnemies.push(new Enemy('images/monster-small.png', undefined, Util.randomSpeed({baseSpeed: 500})))
        }
      }
    }

    reset() {
      this.x = this.playerstartx;
      this.y = this.playerstarty;
    }

    handleInput(key) {
      function handleChange(changeX, changeY) {
        if (withinBounds.call(this, changeX, changeY)) {
          this.x = this.x + changeX;
          this.y = this.y + changeY;
        }

        function withinBounds(changeX, changeY) {
          let newX = this.x + changeX;
          let newY = this.y + changeY;
          return newX >= 0 && newX <= 490 && newY >= -80 && newY <= 400;
        }
      }

      if (key === undefined) {
        return;
      }

      let changeX = 0,
        changeY = 0;
      if (key === 'left') {
        changeX = -101;
        changeY = 0;
      } else if (key === 'right') {
        changeX = 101;
        changeY = 0;
      } else if (key === 'up') {
        changeX = 0;
        changeY = -83;
      } else if (key === 'down') {
        changeX = 0;
        changeY = 83;
      }

      handleChange.call(this, changeX, changeY);
    }

    isPlayerOnWater(){
      return ( this.y === this.playerstarty - 83 * 5 );
    }

    haveCollisionsOccurred(){
      let collided = false;
      for (let i = 0; i < allEnemies.length; i++) {
        if (Math.abs(allEnemies[i].x - this.x) <= 70 &&
          Math.abs(allEnemies[i].y - this.y) <= 25) {
          collided = true;
        }
      }
      return collided;
    }
  }

  let allEnemies = [];
  for (let i = 0; i < 2; i++) {
    allEnemies.push(new Enemy());
  }

  let player = new Player();

  document.addEventListener('keyup', function (e) {
    let allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
  });

  //Only expose the objects that the game engine needs to run the game.
  return {
    allEnemies: allEnemies,
    player: player
  }

}();

//TODO change the engine so that we don't pollute global scope with these variables.
let allEnemies = FROGGER.allEnemies;
let player = FROGGER.player;

