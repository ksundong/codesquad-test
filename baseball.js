const main = function() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  class Player {
    constructor(order, name, batAvg) {
      this.order = order;
      this.name = name;
      this.batAvg = batAvg;
    }
  }

  class Team {
    constructor(teamName) {
      this.teamName = teamName;
    }
  }

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
    selectMenu: function(input) {
      if (input === "1") this.enterData();
      else if (input === "2") this.printData();
      else console.log("올바른 값을 입력해주세요.");
      rl.close();
    },
    enterData: function() {},
    printData: function() {},
    play: function() {
      const random = Math.floor(Math.random() * this.actions.length);
      this.update(this.actions[random]);
      this.log();
    },
    update: function(action) {
      if (action === this.STRIKE) this.handleStrike();
      else if (action === this.BALL) this.handleBall();
      else if (action === this.OUT) this.handleOut();
      else if (action === this.HIT) this.handleHit();
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

  console.log("신나는 야구시합\n1. 데이터 입력\n2. 데이터 출력\n");
  rl.question("메뉴선택 (1 - 2) ", answer => game.selectMenu(answer));

  // while (game.outs < 3) {
  //   game.play();
  // }
  // game.over();
};

main();
