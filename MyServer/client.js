let url = 'http://192.168.1.120:8080/mygame/';

let getProfile = function (score) {
    let xhttp = new XMLHttpRequest();
    let self = this;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            self.profile = JSON.parse(xhttp.responseText);
            self.onUpdate && self.onUpdate();
        }
    };

    let extend = this.user;
    if (score) extend += score;
    xhttp.open("GET", url + extend, true);
    xhttp.send();
}

let postScore = function (score) {
    if (this.profile.score >= score) return;
    this.getProfile(score);
}

let getRank = function (min, max) {
    let xhttp = new XMLHttpRequest();
    let self = this;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            self.buffer = JSON.parse(xhttp.responseText);
            self.onUpdate && self.onUpdate();
        }
    };

    xhttp.open("GET", url + `rank/${min}/${max}`, true);
    xhttp.send();
}

let test = function () {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhttp.responseText);
        }
    };

    xhttp.open("GET", url + 'hello', true);
    xhttp.send();
}

window.client = {
    create: function (userId) {
        let client = {
            user: `user/${userId}/`,
            getProfile: getProfile,
            postScore: postScore,
        }

        client.getProfile();

        return client;
    },
    getRank: getRank,
    test: test,
};