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

module.exports = Inning;
