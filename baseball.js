const game = {
  STRIKE: "strike",
  BALL: "ball",
  OUT: "out",
  HIT: "hit",
  get actions() {
    return [this.STRIKE, this.BALL, this.OUT, this.HIT];
  },
  strikes: 0,
  balls: 0,
  outs: 0,
  hits: 0,
  play: function() {
    const random = Math.floor(Math.random() * this.actions.length);
    this.update(this.actions[random]);
    this.log();
  },
  update: function(action) {
    switch (action) {
      case this.STRIKE:
        return this.handleStrike();
      case this.BALL:
        return this.handleBall();
      case this.OUT:
        return this.handleOut();
      case this.HIT:
        return this.handleHit();
    }
  },
  log: function() {
    console.log(this.strikes + "S " + this.balls + "B " + this.outs + "O\n");
  },
  over: function() {
    console.log("최종 안타수: " + this.hits + "\nGAME OVER");
  },
  handleStrike: function() {
    console.log("스트라이크!");
    this.strikes++;
    if (this.strikes === 3) this.update("out");
  },
  handleBall: function() {
    console.log("볼!");
    this.balls++;
    if (this.balls === 4) this.update("hit");
  },
  handleOut: function() {
    console.log("아웃! 다음 타자가 타석에 입장했습니다.");
    this.changeBatter();
    this.outs++;
  },
  handleHit: function() {
    console.log("안타! 다음 타자가 타석에 입장했습니다.");
    this.changeBatter();
    this.hits++;
  },
  changeBatter: function() {
    this.strikes = 0;
    this.balls = 0;
  }
};

const main = function() {
  console.log("신나는 야구 게임!\n첫 번째 타자가 타석에 입장했습니다.\n");
  while (game.outs < 3) {
    game.play();
  }
  game.over();
};

main();
