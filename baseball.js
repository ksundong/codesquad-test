const status = {
  S: 0,
  B: 0,
  O: 0,
  H: 0,
  toString: function() {
    console.log(this.S + "S " + this.B + "B " + this.O + "O");
  }
};

const randomResult = function() {
  const results = ["스트라이크", "볼", "안타", "아웃"];
  const random = Math.floor(Math.random() * results.length);
  console.log(results[random] + "!");
};

const playgame = function() {
  randomResult();
};

const start = function() {
  console.log("신나는 야구 게임!\n첫 번째 타자가 타석에 입장했습니다.\n");
  playgame();
};

start();
