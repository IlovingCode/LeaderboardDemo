let gameEvent = module.exports = {};

// deprecated
//gameEvent.invoke = function(name) {
//    let evt = this[name];
//    for (let i in evt)
//        evt[i]();
//}

gameEvent.invoke = function(name, arg1, arg2) {
    let evt = this[name];
    for (let i in evt)
        evt[i](arg1, arg2);
}

gameEvent.reset = function(name) {
    if (typeof (name) == 'object') {
        for (let i in name)
            gameEvent[name[i]] = [];
    } else gameEvent[name] = [];
}

gameEvent.list = ['ENEMY_KILLED', 'GAME_START', 'GAME_OVER', 'COIN_CHANGED', 'BOSS_HIT', 'BOSS_HEALTH', 'SPLASH', 'PLAY_SOUND'];

gameEvent.resetAll = function() {
    gameEvent.reset(gameEvent.list);
}