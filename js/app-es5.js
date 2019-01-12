'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FROGGER = function () {

  /**
   * Global scope functions.
   * Scope is the FROGGER object.
   */
  function randomEnemyPosition() {
    var position = {};
    var enemyRow = Math.floor(Math.random() * 3);
    position.x = -80;
    position.y = 65 + 83 * enemyRow;
    return position;
  }

  function randomSpeed() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$baseSpeed = _ref.baseSpeed,
      baseSpeed = _ref$baseSpeed === undefined ? 250 : _ref$baseSpeed,
      _ref$rangeSpeed = _ref.rangeSpeed,
      rangeSpeed = _ref$rangeSpeed === undefined ? 300 : _ref$rangeSpeed;

    return baseSpeed + Math.floor(Math.random() * rangeSpeed);
  }

  /**
   * Base class for the game objects.
   */

  var GameObject = function () {
    function GameObject(sprite, x, y) {
      _classCallCheck(this, GameObject);

      this.sprite = sprite;
      this.x = x;
      this.y = y;
    }

    _createClass(GameObject, [{
      key: 'render',
      value: function render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
      }
    }]);

    return GameObject;
  }();

  /**
   * Enemy class inherits from base game object.
   */


  var Enemy = function (_GameObject) {
    _inherits(Enemy, _GameObject);

    function Enemy() {
      var sprite = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'images/enemy-bug.png';
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : randomEnemyPosition();
      var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : randomSpeed();

      _classCallCheck(this, Enemy);

      var _this = _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, sprite, position.x, position.y));

      _this.speed = speed;
      return _this;
    }

    _createClass(Enemy, [{
      key: 'update',
      value: function update(dt) {
        this.x += dt * this.speed;
        if (this.x > 505) {
          this.reset();
        }
      }
    }, {
      key: 'reset',
      value: function reset() {
        var position = randomEnemyPosition();
        this.speed = randomSpeed();
        this.x = position.x;
        this.y = position.y;
      }
    }]);

    return Enemy;
  }(GameObject);

  var Player = function (_GameObject2) {
    _inherits(Player, _GameObject2);

    function Player() {
      var sprite = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'images/char-boy.png';
      var playerstartx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 202;
      var playerstarty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 380;

      _classCallCheck(this, Player);

      var _this2 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, sprite, playerstartx, playerstarty));

      _this2.playerstartx = playerstartx;
      _this2.playerstarty = playerstarty;
      return _this2;
    }

    _createClass(Player, [{
      key: 'update',
      value: function update(dt) {
        function isPlayerOnWater() {
          return this.y === this.playerstarty - 83 * 5;
        }

        function haveCollisionsOccurred() {
          var collided = false;
          for (var i = 0; i < allEnemies.length; i++) {
            if (Math.abs(allEnemies[i].x - this.x) <= 60 && Math.abs(allEnemies[i].y - this.y) <= 20) {
              collided = true;
            }
          }
          return collided;
        }

        if (haveCollisionsOccurred.call(this)) {
          this.reset();
        } else if (isPlayerOnWater.call(this)) {
          this.reset();
          var isCocky = confirm("You won! Increase difficulty? ");

          //Add an enemy to the game if the player has chosen to do. Increase the speed, override baseSpeed default.
          if (isCocky) {
            allEnemies.push(new Enemy('images/monster-small.png', undefined, randomSpeed({ baseSpeed: 500 })));
          }
        }
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.x = this.playerstartx;
        this.y = this.playerstarty;
      }
    }, {
      key: 'handleInput',
      value: function handleInput(key) {
        function handleChange(changeX, changeY) {
          if (withinBounds.call(this, changeX, changeY)) {
            this.x = this.x + changeX;
            this.y = this.y + changeY;
          }

          function withinBounds(changeX, changeY) {
            var newX = this.x + changeX;
            var newY = this.y + changeY;
            return newX >= 0 && newX <= 490 && newY >= -80 && newY <= 400;
          }
        }

        if (key === undefined) {
          return;
        }

        var changeX = 0,
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
    }]);

    return Player;
  }(GameObject);

  var allEnemies = [];
  for (var i = 0; i < 2; i++) {
    allEnemies.push(new Enemy());
  }

  var player = new Player();

  document.addEventListener('keyup', function (e) {
    var allowedKeys = {
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
  };
}();

//TODO change the engine so that we don't pollute global scope with these variables.
var allEnemies = FROGGER.allEnemies;
var player = FROGGER.player;