const readlineSync = require("readline-sync");
const constants = require("./constants");
const Team = require("./team");

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
        this.playInning(i, constants.TOP, this.firstTeam);
        this.playInning(i, constants.BOTTOM, this.secondTeam);
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
    if (action === constants.STRIKE) this.handleStrike(player, inning);
    else if (action === constants.BALL) this.handleBall(player, inning, team);
    else if (action === constants.OUT) this.handleOut(player, inning);
    else if (action === constants.HIT) this.handleHit(player, inning, team);
  },
  handleStrike(player, inning) {
    console.log("스트라이크!");
    player.strikes++;
    if (player.strikes === 3) {
      this.update(constants.OUT, player, inning);
    }
  },
  handleBall(player, inning, team) {
    console.log("볼!");
    player.balls++;
    if (player.balls === 4) {
      this.update(constants.HIT, player, inning, team);
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
