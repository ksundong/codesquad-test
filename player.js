const constants = require("./constants");

class Player {
  constructor(order, name, batAvg) {
    this.order = order;
    this.name = name;
    this.batAvg = batAvg;
    this.balls = 0;
    this.strikes = 0;
    this.calculateAvg(batAvg);
    this.out = false;
  }
  calculateAvg(batAvg) {
    this.strAvg = (1 - batAvg) / 2 - 0.05;
    this.ballAvg = (1 - batAvg) / 2 - 0.05;
    this.outAvg = 0.1;
  }
  changeBatter() {
    this.out = true;
    this.balls = 0;
    this.strikes = 0;
  }
  showInfo() {
    return this.order + "번 타자 " + this.name + "입니다.";
  }
  bat(random) {
    if (random <= this.outAvg) return constants.OUT;
    else if (random <= this.outAvg + this.strAvg) return constants.STRIKE;
    else if (random <= this.outAvg + this.strAvg + this.ballAvg)
      return constants.BALL;
    else return constants.HIT;
  }
}

module.exports = Player;
