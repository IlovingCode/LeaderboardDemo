var Profile = module.exports = {};

Profile.load = function () {
    this.bestScore = cc.sys.localStorage.getItem('bestScore') || 0;
    cc.log('Load Profile');
    Profile.load = function () { };
}

Profile.save = function () {
    cc.sys.localStorage.setItem('bestScore', this.bestScore);
}

Profile.setBestScore = function (score) {
    if (this.bestScore < score) {
        this.bestScore = score;
        this.save();
    }
}