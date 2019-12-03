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
    return this.order + "번 " + this.name;
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
    this.lastBatter = 0;
  }
  addLastBatter() {
    this.lastBatter < 8 ? this.lastBatter++ : this.lastBatter = 0;
  }
  addPlayers() {
    for (let i = 0; i < this.players.length; i++) {
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
  showInfo() {
    return this.num + "회" + this.state + " ";
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
      for (let i = 1; i < 7; i++) {
        this.playInning(i, TOP, this.firstTeam);
        this.playInning(i, BOTTOM, this.secondTeam);
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
      "의 시합을 시작합니다.\n";
    console.log(msg);
  },
  noDataMsg: function() {
    console.log("데이터가 입력되지 않았습니다. 입력후에 다시 시도해주세요.\n");
  },
  playInning: function(num, state, attackTeam) {
    const inning = new Inning(num, state);
    console.log(inning.showInfo() + attackTeam.teamName + " 공격\n");
    while (true) {
      for (let i = attackTeam.lastBatter; i < attackTeam.players.length; i++) {
        const player = attackTeam.players[i];
        this.playBatting(player, inning, attackTeam);
        attackTeam.addLastBatter();
        if (inning.outs === 3) return;
      }
    }
  },
  playBatting: function(player, inning, team) {
    console.log(player.showInfo());
    while (!player.out) {
      const action = player.bat(Math.random());
      this.update(action, player, inning, team);
      this.log(player, inning);
    }
    player.out = false;
  },
  update: function(action, player, inning, team) {
    if (action === STRIKE) this.handleStrike(player, inning);
    else if (action === BALL) this.handleBall(player, inning, team);
    else if (action === OUT) this.handleOut(player, inning);
    else if (action === HIT) this.handleHit(player, inning, team);
  },
  handleStrike(player, inning) {
    console.log("스트라이크!");
    player.strikes++;
    if (player.strikes === 3) {
      this.update(OUT, player, inning);
    }
  },
  handleBall(player, inning, team) {
    console.log("볼!");
    player.balls++;
    if (player.balls === 4) {
      this.update(HIT, player, inning, team);
    }
  },
  handleOut(player, innning) {
    console.log("아웃!");
    player.changeBatter();
    innning.outs++;
  },
  handleHit(player, inning, team) {
    console.log("안타!");
    player.changeBatter();
    inning.hits++;
    if (inning.hits === 4) {
      console.log(team.teamName + "팀 득점!!");
      inning.hits--;
      team.scores++;
    }
  },
  log(player, inning) {
    console.log(
      player.strikes + "S " + player.balls + "B " + inning.outs + "O\n"
    );
  },
  over: function() {
    const team1 = this.firstTeam;
    const team2 = this.secondTeam;
    console.log("경기 종료\n");
    console.log(team1.teamName + " VS " + team2.teamName);
    console.log(team1.scores + " : " + team2.scores);
    this.compareScore(team1, team2);
    console.log("Thank you!");
    process.exit();
  },
  compareScore: function(team1, team2) {
    team1.scores < team2.scores ? console.log(team2.teamName + "팀 승리!!")
      : team1.scores > team2.scores ? console.log(team1.teamName + "팀 승리!!")
      : console.log("무승부입니다.");
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
