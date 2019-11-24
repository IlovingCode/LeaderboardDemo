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

gameEvent.list = ['TAP', 'HIT', 'GAME_OVER', 'KNIFE'];

gameEvent.resetAll = function() {
    gameEvent.reset(gameEvent.list);
}