const readlineSync = require("readline-sync");

const STRIKE = "strike";
const BALL = "ball";
const OUT = "out";
const HIT = "hit";
const TOP = "초";
const BOTTOM = "말";

class Player {
  constructor(order, name, batAvg) {
    this.order = order;
    this.name = name;
    this.batAvg = batAvg;
    this.balls = 0;
    this.strikes = 0;
    this.calculateAvg(batAvg);
  }
  get getBalls() {
    return this.balls;
  }
  /**
   * @param {number} balls
   */
  set setBalls(balls) {
    this.balls = balls;
  }
  get getStrikes() {
    return this.strikes;
  }
  /**
   * @param {number} strikes
   */
  set setStrikes(strikes) {
    this.strikes = strikes;
  }
  resetCount() {
    this.balls = 0;
    this.strikes = 0;
  }
  calculateAvg(batAvg) {
    this.strAvg = (1 - batAvg) / 2 - 0.05;
    this.ballAvg = (1 - batAvg) / 2 - 0.05;
    this.outAvg = 0.1;
  }
  bat(random) {
    if (random <= this.outAvg) return OUT;
    else if (random <= this.outAvg + this.strAvg) return STRIKE;
    else if (random <= this.outAvg + this.strAvg + this.ballAvg) return BALL;
    else return HIT;
  }
}

class Team {
  constructor(teamName) {
    this.teamName = teamName;
    this.players = new Array(9);
    this.scores = 0;
  }
  get getScores() {
    return this.scores;
  }
  /**
   * @param {number} scores
   */
  set setScores(scores) {
    this.scores = scores;
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
      const validation = this.validatePlayerInfo(name, batAvgStr, batAvg);
      if (validation) {
        this.players[number] = new Player(number + 1, name, batAvg);
      } else {
        continue;
      }
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
  validatePlayerInfo(name, batAvgStr, batAvg) {
    if (name.length === 0) {
      console.log("선수의 이름을 입력해주세요.");
      return false;
    }
    if (batAvgStr.length === 5 && batAvg > 0.1 && batAvg < 0.5) {
      return true;
    } else {
      console.log("잘못된 타율이 입력되었습니다.");
      return false;
    }
  }
  check() {
    return typeof this.teamName === "string";
  }
  showInfo() {
    console.log(this.teamName + " 팀 정보");
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      console.log(player.order + "번 " + player.name + ", " + player.batAvg);
    }
  }
}

class Inning {
  constructor(num, state) {
    this.num = num;
    this.state = state; // TOP or BOTTOM
    this.outs = 0;
    this.hits = 0;
  }
  get getOuts() {
    return this.outs;
  }
  /**
   * @param {number} outs
   */
  set setOuts(outs) {
    this.outs = outs;
  }
  get getHits() {
    return this.hits;
  }
  /**
   * @param {number} hits
   */
  set setHits(hits) {
    this.hits = hits;
  }
}

const game = {
  firstTeam: new Team(),
  secondTeam: new Team(),
  checkTeams: function() {
    return this.firstTeam.check() && this.secondTeam.check();
  },
  selectMenu: function(input) {
    if (input === "1") this.enterData();
    else if (input === "2") this.printData();
    else if (input === "3") this.play();
    else console.log("올바른 값을 입력해주세요.\n");
  },
  enterData: function() {
    const firstTeamName = this.enterTeamName(1);
    this.firstTeam = new Team(firstTeamName);
    this.firstTeam.addPlayers();
    const secondTeamName = this.enterTeamName(2);
    this.secondTeam = new Team(secondTeamName);
    this.secondTeam.addPlayers();
    console.log("\n팀 데이터 입력이 완료되었습니다.\n");
  },
  enterTeamName: function(num) {
    while (true) {
      const teamName = readlineSync.question(num + "팀의 이름을 입력하세요> ");
      if (teamName.length > 0) {
        return teamName;
      } else {
        console.log("팀 이름을 입력해주세요.\n");
      }
    }
  },
  printData: function() {
    if (this.checkTeams()) {
      this.firstTeam.showInfo();
      console.log();
      this.secondTeam.showInfo();
      console.log();
    } else {
      this.noDataMsg();
    }
  },
  play: function() {
    if (this.checkTeams()) {
      this.startMsg();
      for (let i = 0; i < this.firstTeam.players.length; i++) {
        const random = Math.random();
        console.log(this.firstTeam.players[i].bat(random));
      }
      this.over();
    } else {
      this.noDataMsg();
    }
  },
  startMsg: function() {
    const msg =
      this.firstTeam.teamName +
      " VS " +
      this.secondTeam.teamName +
      "의 시합을 시작합니다.";
    console.log(msg);
  },
  noDataMsg: function() {
    console.log("데이터가 입력되지 않았습니다. 입력후에 다시 시도해주세요.\n");
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
    console.log("Thank you!");
    process.exit();
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
  while (true) {
    console.log(
      "신나는 야구시합\n1. 데이터 입력\n2. 데이터 출력\n3. 시합 시작\n"
    );
    game.selectMenu(readlineSync.question("메뉴선택 (1 - 3) "));
  }
};

main();
