const constants = require("./constants");
const Team = require("./team");
const Inning = require("./inning");
const readlineSync = require("readline-sync");

const game = {
  firstTeam: new Team(),
  secondTeam: new Team(),
  logHistory: "",
  skipNum: 0,
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
    const team1 = this.firstTeam;
    const team2 = this.secondTeam;
    if (this.checkTeams()) {
      this.startMsg();
      for (let i = 1; i < 7; i++) {
        this.playInning(i, constants.TOP, team1, team2);
        if (i === 6 && team2.scores > team1.scores) break;
        this.playInning(i, constants.BOTTOM, team2, team1);
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
  recordLog: function(msg) {
    this.logHistory += "\n" + msg;
  },
  playInning: function(num, state, attackTeam, defenseTeam) {
    const inning = new Inning(num, state);
    this.logHistory = "";
    this.recordLog(inning.showInfo() + attackTeam.teamName + " 공격\n");
    attackTeam.isAttackTeam = true;
    defenseTeam.isAttackTeam = false;
    while (true) {
      for (let i = attackTeam.lastBatter; i < attackTeam.players.length; i++) {
        const player = attackTeam.players[i];
        this.playBatting(player, inning, attackTeam, defenseTeam);
        attackTeam.addLastBatter();
        if (inning.outs === 3) return;
      }
    }
  },
  playBatting: function(player, inning, attackTeam, defenseTeam) {
    this.recordLog(player.showInfo());
    while (!player.out) {
      defenseTeam.pitches++;
      const action = player.bat(Math.random());
      this.update(action, player, inning, attackTeam, defenseTeam);
      this.log(player, inning);
      this.showScoreBoard(inning);
      this.skipInning(inning);
    }
    this.logHistory = "";
    player.out = false;
  },
  skipInning: function(inning) {
    if (inning.num <= this.skipNum) return;
    const question =
      "다음 투구 보기(enter) or 스킵하고 X회말 후 투구보기(숫자+enter) ? ";
    while (true) {
      const input = readlineSync.question(question);
      if (this.inputChecking(input)) break;
    }
  },
  inputChecking: function(input) {
    const check = this.skipValidation(input);
    if (check) {
      this.skipNum = Number.parseInt(input);
      return true;
    } else if (input === "") return true;
    else {
      console.log("올바르지 않은 입력값입니다. 다시 입력해주세요.");
      return false;
    }
  },
  skipValidation: function(input) {
    if (input.length === 1) {
      const number = Number.parseInt(input);
      return Number.isInteger(number) && number < 7;
    } else {
      return false;
    }
  },
  update: function(action, player, inning, attackTeam, defenseTeam) {
    if (action === constants.STRIKE)
      this.handleStrike(player, inning, defenseTeam);
    else if (action === constants.BALL)
      this.handleBall(player, inning, attackTeam);
    else if (action === constants.OUT) this.handleOut(player, inning);
    else if (action === constants.HIT)
      this.handleHit(player, inning, attackTeam);
  },
  handleStrike(player, inning, defenseTeam) {
    this.recordLog("스트라이크!");
    player.strikes++;
    if (player.strikes === 3) {
      defenseTeam.strikeouts++;
      this.update(constants.OUT, player, inning);
    }
  },
  handleBall(player, inning, attackTeam) {
    this.recordLog("볼!");
    player.balls++;
    if (player.balls === 4) {
      this.update(constants.HIT, player, inning, attackTeam);
    }
  },
  handleOut(player, inning) {
    this.recordLog("아웃!");
    player.changeBatter();
    inning.outs++;
  },
  handleHit(player, inning, attackTeam) {
    this.recordLog("안타!");
    player.changeBatter();
    inning.hits++;
    attackTeam.hits++;
    if (inning.hits === 4) {
      this.recordLog(attackTeam.teamName + "팀 득점!!\n");
      inning.hits--;
      attackTeam.scores++;
      attackTeam.scoreHistory[inning.num - 1]++;
    }
  },
  log(player, inning) {
    this.recordLog(
      player.strikes + "S " + player.balls + "B " + inning.outs + "O\n"
    );
  },
  showScoreBoard: function(inning) {
    const team1 = this.firstTeam;
    const team2 = this.secondTeam;
    console.clear();
    this.showTopBoard(team1, team2);
    this.showMiddleBoard(team1, team2, inning);
    this.showBottomBoard(team1, team2);
    if (inning.num > this.skipNum) console.log("\n" + this.logHistory);
  },
  showTopBoard: function(team1, team2) {
    const topBar = new Team("TEAM");
    topBar.scoreHistory = [1, 2, 3, 4, 5, 6];
    topBar.scores = "TOT";
    console.log("+--------------------------------------------+");
    this.showScoreInfo(topBar);
    this.showScoreInfo(team1);
    this.showScoreInfo(team2);
    console.log("|                                            |");
  },
  showScoreInfo: function(team) {
    const h = team.scoreHistory;
    const totScr = team.scores !== "TOT" ? ` ${team.scores} ` : team.scores;
    let msg = "| " + team.teamName + "  ";
    for (let i = 0; i < h.length; i++) {
      msg += h[i] + " ";
    }
    msg += "               |   " + totScr + "   |";
    console.log(msg);
  },
  showMiddleBoard: function(team1, team2, inning) {
    const msg = `|     ${
      team1.teamName
    }          ${inning.showInfo()}             ${team2.teamName}  |`;
    console.log(msg);
    this.showPlayerStatus(team1, team2, inning);
  },
  showPlayerStatus: function(team1, team2, inning) {
    const attackTeam = team1.isAttackTeam ? team1 : team2;
    const attackTeamBatter = attackTeam.players[attackTeam.lastBatter];
    for (let i = 0; i < team1.players.length; i++) {
      let msg = "| ";
      const team1Player = team1.players[i];
      const team2Player = team2.players[i];
      msg += team1Player.order + ". " + team1Player.name + " ";
      msg += this.displayBatter(team1, i);
      msg += this.showGameCount(i, inning, attackTeamBatter);
      msg += this.displayBatter(team2, i);
      msg += "  " + team2Player.order + ". " + team2Player.name + " |";
      console.log(msg);
    }
  },
  displayBatter: function(team, num) {
    return team.isAttackTeam && num === team.lastBatter ? "V" : " ";
  },
  showGameCount: function(num, inning, attackTeamBatter) {
    if (num === 2) {
      if (attackTeamBatter.strikes === 0) return "     S             ";
      else if (attackTeamBatter.strikes === 1) return "     S X           ";
      else if (attackTeamBatter.strikes === 2) return "     S X X         ";
    } else if (num === 3) {
      if (attackTeamBatter.balls === 0) return "     B             ";
      else if (attackTeamBatter.balls === 1) return "     B X           ";
      else if (attackTeamBatter.balls === 2) return "     B X X         ";
      else if (attackTeamBatter.balls === 3) return "     B X X X       ";
    } else if (num === 4) {
      if (inning.outs === 0) return "     O             ";
      else if (inning.outs === 1) return "     O X           ";
      else if (inning.outs === 2) return "     O X X         ";
      else if (inning.outs === 3) return "     O X X X       ";
    } else return "                   ";
  },
  showBottomBoard: function(team1, team2) {
    console.log("|                                            |");
    this.makeBottomMsg("투구", team1.pitches, team2.pitches);
    this.makeBottomMsg("삼진", team1.strikeouts, team2.strikeouts);
    this.makeBottomMsg("안타", team1.hits, team2.hits);
    console.log("+--------------------------------------------+");
  },
  makeBottomMsg: function(msg1, msg2, msg3) {
    let msg = "| ";
    msg +=
      this.concatMsg(msg1, msg2) +
      "                        " +
      this.concatMsg(msg1, msg3) +
      " |";
    console.log(msg);
  },
  concatMsg: function(msg1, msg2) {
    if ((msg2 + "").length < 2) msg2 += "  ";
    else if ((msg2 + "").length < 3) msg2 += " ";
    return msg1 + ": " + msg2;
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
    team1.scores < team2.scores
      ? console.log(team2.teamName + "팀 승리!!")
      : team1.scores > team2.scores
      ? console.log(team1.teamName + "팀 승리!!")
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
