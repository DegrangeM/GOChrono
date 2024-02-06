const MINUTE = 60000; // milliseconds

const AUXIALIARY_MOUSE_BUTTON = 1;

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

let overlay = document.querySelector('#overlay');
let steps = Array.from(document.querySelectorAll('.step'));

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
        if (e.button === AUXIALIARY_MOUSE_BUTTON) { // Detect middle click
            /* !anim && clearInterval(anim);
             anim = setInterval(function () {
                 ctx.fillStyle = "white";
                 ctx.fillRect(0, 0, canvas.width, canvas.height);
                 ctx.fillStyle = "black";
                 ctx.fillText(new Date().toTimeString().split(' ')[0], canvas.width / 2, canvas.height / 2);
             }, 1000);*/
            video.play();
            video.requestPictureInPicture();
        }
    }, false);
}

// Point d'entrée
setupListeners();

function setupListeners() {

    /**
     * Gestion de la pause:
     *  - si le timer tourne: met en pause le timer.
     *  - si le timer est en pause: relance le timer.
     */
    document.body.addEventListener('click', () => {
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

    // Gestion du passage au prochain timer (appui long sur l'étape).
    zip(steps, [0, 10/*, 15*/]).forEach(([step, stepStartingTime]) => {
        [
            ['mousedown', 'mouseup', 'mousemove'],
            ['touchstart', 'touchend', 'touchmove']
        ].forEach(([downEvent, upEvent, moveEvent]) => {
            step.addEventListener(downEvent, () => {
                const mouseDownTimer = setTimeout(x => {
                    vibrer(10);
                    timer = stepStartingTime * MINUTE;
                    skip = true;
                    afficher();
                }, 1000);

                this.addEventListener(upEvent, function () {
                    clearTimeout(mouseDownTimer);
                });

                this.addEventListener(moveEvent, function () {
                    clearTimeout(mouseDownTimer);
                });
            });
        });
    });
}

function afficher() {
    // Code fouilli à refaire ...
    if (pip) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.fillStyle = "black";
    }
    if (timer < 20 * MINUTE) {
        overlay.style.height = (timer / 1000) / (20 * 60) * 100 + '%';
    } else {
        overlay.style.height = '100%';
        etape <= 3 && (vibrer([350, 350, 350, 350, 350]), etape = 4, steps[/*2*/1].textContent = formatTemps(0));
    }
    if (timer <= 10 * MINUTE) {
        steps[0].textContent = formatTemps(10 * 60 - parseInt(timer / 1000));
        if (pip) {
            ctx.fillStyle = "#FE218B";
            ctx.fillRect(0, canvas.height * (timer / (10 * MINUTE)), canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillText(formatTemps(10 * 60 - parseInt(timer / 1000)), canvas.width / 2, canvas.height / 2);
        }
    } else if (timer <= 20 * MINUTE) {
        etape <= 1 && (vibrer(500), etape = 2, steps[0].textContent = formatTemps(0));
        steps[1].textContent = formatTemps(20 * 60 - parseInt(timer / 1000));
        if (pip) {
            ctx.fillStyle = "#FED700";
            ctx.fillRect(0, canvas.height * (timer / (20 * MINUTE) - 10 / 10), canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillText(formatTemps(20 * 60 - parseInt(timer / 1000)), canvas.width / 2, canvas.height / 2);
        }
    } /* else {
        etape <= 2 && (vibrer(500), etape = 3, steps[1].textContent = formatTemps(0));
        steps[2].textContent = formatTemps(20 * 60 - parseInt(timer / 1000));
        if (pip) {
            ctx.fillStyle = "#21B0FE";
            let percent = (timer / (5 * MINUTE) - 15 / 5);
            percent = percent < 0 ? 0 : percent;
            ctx.fillRect(0, canvas.height * percent, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillText(formatTemps(20 * 60 - parseInt(timer / 1000)), canvas.width / 2, canvas.height / 2);
        }
    } */
}

function formatTemps(secondes) {
    if (secondes < 0) {
        return '-' + formatTemps(-secondes);
    }
    return parseInt(secondes / 60) + ':' + (secondes % 60).toString().padStart(2, '0');
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

function zip(a, b) {
    return a.map((k, i) => [k, b[i]]);
}