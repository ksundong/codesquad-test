const randomResult = function() {
  const results = ["스트라이크", "볼", "안타", "아웃"];
  const result = results[Math.floor(Math.random() * results.length)];
  console.log(result + "!");
};

const playgame = function() {
  randomResult();
};

const start = function() {
  console.log("신나는 야구 게임!\n첫 번째 타자가 타석에 입장했습니다.\n");
  playgame();
};

start();