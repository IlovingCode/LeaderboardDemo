var Profile = module.exports = {};

Profile.load = function () {
    this.bestScore = cc.sys.localStorage.getItem('bestScore') || 0;
    this.coin = cc.sys.localStorage.getItem('coin') || 0;
    cc.log('Load Profile');
    Profile.load = function () { };
}

Profile.set = function (score, coin) {
    if (this.bestScore < score) {
        this.bestScore = score;
        cc.sys.localStorage.setItem('bestScore', score);
    }

    this.coin = coin;
    cc.sys.localStorage.setItem('coin', coin);
}