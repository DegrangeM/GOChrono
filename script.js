let timer = 0;
let pause = true;
let last = false;
let timeout = null;
let speed = location.hash === '#demo' ? 100 : 1;
let noSleep = new NoSleep(); // empêche l'écran du téléphone de s'éteindre automatiquement
let etape = 1;
let skip = false;
let pip = location.hash === '#pip';
let video;
let canvas;
let ctx;
let stream;
if (pip) {
    video = document.createElement('video');
    //video.setAttribute('autoplay', '');
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Il faut dessiner quelque chose avant captureStream
    stream = canvas.captureStream();
    video.srcObject = stream;
    let anim = false;
    document.body.addEventListener('mousedown', function (e) {
        if (e.button === 1) { // Detect middle click
            !anim && clearInterval(anim);
            anim = setInterval(function () {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "black";
                ctx.fillText(new Date().toTimeString().split(' ')[0], canvas.width / 2, canvas.height / 2);
            }, 1000);
            video.play();
            video.requestPictureInPicture();
        }
    }, false);

}


function afficher() {
    if (timer < 20 * 60 * 1000) {
        document.querySelector('.overlay').style.height = (timer / 1000) / (20 * 60) * 100 + '%';
    } else {
        document.querySelector('.overlay').style.height = '100%';
        etape <= 3 && (vibrer([350, 350, 350, 350, 350]), etape = 4, document.querySelector('.etape3').textContent = temps(0));
    }
    if (timer <= 5 * 60 * 1000) {
        document.querySelector('.etape1').textContent = temps(5 * 60 - parseInt(timer / 1000));
    } else if (timer <= 15 * 60 * 1000) {
        etape <= 1 && (vibrer(500), etape = 2, document.querySelector('.etape1').textContent = temps(0));
        document.querySelector('.etape2').textContent = temps(15 * 60 - parseInt(timer / 1000));
    } else {
        etape <= 2 && (vibrer(500), etape = 3, document.querySelector('.etape2').textContent = temps(0));
        document.querySelector('.etape3').textContent = temps(20 * 60 - parseInt(timer / 1000));
    }
}

function temps(secondes) {
    if (secondes < 0) { return '-' + temps(-secondes); }
    return parseInt(secondes / 60) + ':' + (secondes % 60).toString().padStart(2, '0')
}

function tick() {
    if (!pause) {
        if (last !== false) {
            timer += (Date.now() - last) * speed;
        }
        last = Date.now();
        afficher();
        timeout = setTimeout(tick, 1000 / speed);
    }
}

function vibrer(t) {
    if (navigator.vibrate) {
        navigator.vibrate(t);
    }
}

document.body.addEventListener('click', function () {
    if (skip) {
        skip = false;
        return;
    }
    vibrer(10);
    if (pause) {
        noSleep.enable();
        pause = false;
        tick();
    } else {
        noSleep.disable();
        tick();
        if (timeout) {
            clearTimeout(timeout);
        }
        last = false;
        pause = true;
    }
});

[['etape1', 0], ['etape2', 5], ['etape3', 15]].forEach(function (etape) {
    [['mousedown', 'mouseup', 'mousemove'], ['touchstart', 'touchend', 'touchmove']].forEach(function (e) {
        document.querySelector('.' + etape[0]).addEventListener(e[0], function () {
            let mouseDownTimer = setTimeout(x => {
                vibrer(10);
                timer = etape[1] * 60 * 1000;
                skip = true;
                afficher();
            }, 1000);
            this.addEventListener(e[1], function () {
                clearTimeout(mouseDownTimer);
            });

            this.addEventListener(e[2], function () {
                clearTimeout(mouseDownTimer);
            });
        });
    });
});