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
  }
};

const checkStatus = function() {
  if (status.S === 3) {
    status.S = 0;
    status.addOutCount();
  }
  if (status.B === 4) {
    status.B = 0;
    status.addHitCount();
  }
};

const updateStatus = function(random) {
  if (random === 0) {
    status.S++;
  } else if (random === 1) {
    status.B++;
  } else if (random === 2) {
    status.addHitCount();
  } else if (random === 3) {
    status.addOutCount();
  }
  checkStatus();
};

const randomResult = function() {
  const results = ["스트라이크", "볼", "안타", "아웃"];
  const random = Math.floor(Math.random() * results.length);
  updateStatus(random);
  console.log(results[random] + "!");
  console.log(status.toString());
};

const playgame = function() {
  randomResult();
};

const start = function() {
  console.log("신나는 야구 게임!\n첫 번째 타자가 타석에 입장했습니다.\n");
  playgame();
};

start();
