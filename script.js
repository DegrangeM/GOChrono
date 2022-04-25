timer = 0;

function afficher() {
    document.querySelector('.overlay').style.height = timer/1200 * 100 + '%';
    document.querySelector('#chrono3').style.height = timer/1200 * 100 + '%';
    if(timer <= 5*60) {
        document.querySelector('#chrono1 .etape1').textContent = temps(5*60 - timer);
        document.querySelector('#chrono2 .etape1').textContent = temps(5*60 - timer);
    } else if(timer <= 15*60) {
        document.querySelector('.etape2').textContent = temps(15*60 - timer);
    } else if(timer <= 20*60) {
        document.querySelector('.etape3').textContent = temps(20*60 - timer);
    }
    timer1 = 5*60 - timer;
    timer2 = 15*60 - timer;
    timer3 = 20*60 - timer;
}

function temps(secondes) {
    return parseInt(secondes/60) + ':' + (secondes%60).toString().padStart(2,'0')
}

setInterval(function(){
    timer++;
    afficher();
}, 10);