const readlineSync = require("readline-sync");

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
    this.players = new Array(9);
  }
  addPlayers() {
    for (var i = 0; i < this.players.length; i++) {
      this.addPlayer(i);
    }
  }
  addPlayer(number) {
    while (true) {
      const info = readlineSync.question(number + 1 + "번 타자 정보 입력> ");
      const infoArr = info.split(",");
      if (!this.checkPlayerInfoArrCount(infoArr)) continue;
      const name = infoArr[0].trim();
      const batAvgStr = infoArr[1].trim();
      const batAvg = Number.parseFloat(batAvgStr);
      const validation = this.validatePlayerInfo(batAvgStr, batAvg);
      if (validation) this.players[number] = new Player(number + 1, name, batAvg);
      else continue;
      break;
    }
  }
  checkPlayerInfoArrCount(infoArr) {
    if (infoArr.length !== 2) {
      console.log("잘못된 값이 입력되었습니다.");
      return false;
    }
    return true;
  }
  validatePlayerInfo(batAvgStr, batAvg) {
    if (batAvgStr.length === 5 && batAvg > 0.1 && batAvg < 0.5) {
      return true;
    } else {
      console.log("잘못된 타율이 입력되었습니다.");
      return false;
    }
  }
  showInfo() {
    console.log(this.teamName + " 팀 정보");
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      console.log(player.order + "번 " + player.name + ", " + player.batAvg);
    }
  }
}

const main = function() {
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
    firstTeam: new Team(),
    secondTeam: new Team(),
    selectMenu: function(input) {
      if (input === "1") this.enterData();
      else if (input === "2") this.printData();
      else console.log("올바른 값을 입력해주세요.");
    },
    enterData: function() {
      const firstTeamName = readlineSync.question("1팀의 이름을 입력하세요> ");
      this.firstTeam = new Team(firstTeamName);
      this.firstTeam.addPlayers();
      const secondTeamName = readlineSync.question("2팀의 이름을 입력하세요> ");
      this.secondTeam = new Team(secondTeamName);
      this.secondTeam.addPlayers();
      console.log("\n팀 데이터 입력이 완료되었습니다.\n");
    },
    printData: function() {
      this.firstTeam.showInfo();
      console.log();
      this.secondTeam.showInfo();
      process.exit();
    },
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

  while (true) {
    console.log("신나는 야구시합\n1. 데이터 입력\n2. 데이터 출력\n");
    game.selectMenu(readlineSync.question("메뉴선택 (1 - 2) "));
  }

  // while (game.outs < 3) {
  //   game.play();
  // }
  // game.over();
};

main();
