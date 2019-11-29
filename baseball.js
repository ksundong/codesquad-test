const status = {
  S: 0,
  B: 0,
  O: 0,
  H: 0,
  isBatterOut: false,
  toString: function() {
    console.log(this.S + "S " + this.B + "B " + this.O + "O");
  },
  addOutCount: function() {
    this.O++;
    this.isBatterOut = true;
  },
  addHitCount: function() {
    this.H++;
    this.isBatterOut = true;
  },
  changeBatter: function() {
    if (this.O === 3) {
      this.isBatterOut = false;
      this.S = 0;
      this.B = 0;
      return "";
    }
    if (this.isBatterOut) {
      this.isBatterOut = false;
      this.S = 0;
      this.B = 0;
      return " 다음 타자가 타석에 입장했습니다.";
    }
    return "";
  },
  gameOver: function() {
    console.log("최종 안타수: " + this.H + "\nGAME OVER");
  }
};

const checkStatus = function() {
  if (status.S === 3) {
    status.S = 0;
    status.addOutCount();
    console.log("아웃!" + status.changeBatter());
  }
  if (status.B === 4) {
    status.B = 0;
    status.addHitCount();
    console.log("안타!" + status.changeBatter());
  }
};

const updateStatus = function(results, random) {
  if (random === 0) {
    status.S++;
  } else if (random === 1) {
    status.B++;
  } else if (random === 2) {
    status.addHitCount();
  } else if (random === 3) {
    status.addOutCount();
  }
  console.log(results[random] + "!" + status.changeBatter());
};

const randomResult = function() {
  const results = ["스트라이크", "볼", "안타", "아웃"];
  const random = Math.floor(Math.random() * results.length);
  updateStatus(results, random);
  checkStatus();
  console.log(status.toString());
};

const playgame = function() {
  while (status.O !== 3) {
    randomResult();
  }
  status.gameOver();
};

const start = function() {
  console.log("신나는 야구 게임!\n첫 번째 타자가 타석에 입장했습니다.\n");
  playgame();
};

start();
