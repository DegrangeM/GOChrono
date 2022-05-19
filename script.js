let timer = 0;
let pause = true;
let last = false;
let timeout = null;
let speed = location.hash === '#demo' ? 100 : 1;
let noSleep = new NoSleep(); // empêche l'écran du téléphone de s'éteindre automatiquement
let etape = 1;

function afficher() {
    if (timer < 20 * 60 * 1000) {
        document.querySelector('.overlay').style.height = (timer / 1000) / (20 * 60) * 100 + '%';
    } else {
        document.querySelector('.overlay').style.height = '100%';
        etape === 3 && (vibrer([350, 350, 350, 350, 350]), etape = 4);
    }
    if (timer <= 5 * 60 * 1000) {
        document.querySelector('.etape1').textContent = temps(5 * 60 - parseInt(timer / 1000));
    } else if (timer <= 15 * 60 * 1000) {
        etape === 1 && (vibrer(500), etape = 2);
        document.querySelector('.etape2').textContent = temps(15 * 60 - parseInt(timer / 1000));
    } else {
        etape === 2 && (vibrer(500), etape = 3);
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