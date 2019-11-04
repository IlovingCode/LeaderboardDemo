let size = 100;
let recordSize = 1000;
let userList = [];

let onUpdate = function () {
    this.onUpdate = undefined;
    if (size-- > 0) {
        let c = client.create(Date.now());
        c.onUpdate = onUpdate;

        userList.push(c);
    } else update();
}

onUpdate();

let update = function (dt) {
    let id = Math.floor(Math.random() * userList.length);
    let score = Math.floor(Math.random() * 5000);
    userList[id].postScore(score);

    window.requestAnimationFrame(update);
}

client.onUpdate = () => {
    console.log(client.buffer);
}
setInterval(() => {
    client.getRank(0, 3);
}, 3000);