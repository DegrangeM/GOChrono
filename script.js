let timer = 0;
let pause = true;
let last = false;
let timeout = null;
let speed = location.hash === '#demo' ? 100 : 1;

function afficher() {
    if (timer < 20 * 60 * 1000) {
        document.querySelector('.overlay').style.height = (timer / 1000) / (20 * 60) * 100 + '%';
    }
    if (timer <= 5 * 60 * 1000) {
        document.querySelector('.etape1').textContent = temps(5 * 60 - parseInt(timer / 1000));
    } else if (timer <= 15 * 60 * 1000) {
        document.querySelector('.etape2').textContent = temps(15 * 60 - parseInt(timer / 1000));
    } else {
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

document.body.addEventListener('click', function () {
    if (pause) {
        pause = false;
        tick();
    } else {
        tick();
        if (timeout) {
            clearTimeout(timeout);
        }
        last = false;
        pause = true;
    }
});