const readlineSync = require("readline-sync");
const Player = require("./player");

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

module.exports = Team;