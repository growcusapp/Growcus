const focbtn = document.getElementById("focus")
const forbtn = document.getElementById("forest1")
const focsc = document.querySelector(".focusscreen")
const forsc = document.querySelector(".forest")
const treevisual = document.querySelector(".treeic")

const plantbtn = document.querySelector(".plantbtn")
const pausebtn = document.querySelector(".pausebtn")
const startbtn = document.querySelector(".startbtn")
const timertxt = document.getElementById("timertxt")
const timertxt2 = document.getElementById("timertxt2")
const settcard = document.getElementById("settings")
const slider = document.getElementById("slider")
const timcont = document.querySelector(".timcont")
const plus = document.querySelector(".plus")
const minus = document.querySelector(".minus")
const suck = document.querySelector(".suck")
const namesess = document.querySelector(".namesess")


const steps = document.querySelectorAll(".onbdstep")
const nxtstepbtns = document.querySelectorAll(".nextstep")
const finonb = document.querySelector(".finalstep")
let curronbstep = 0;
let onbd = true;
const durpref = document.getElementById('onbdpref')
const durval = document.getElementById('onbddurval')

pausebtn.style.display = 'none';
startbtn.style.display = 'none';
let ispaused = false;
let currtab = 'forest';

let totalsec;
let countdowninterval;
let ttldur;

let sessionactive = false;
let currstage = 0;

const hammenu = document.querySelector('.hammenu')
const sidebar = document.querySelector('.sidebar')
let menopen = false;

const typefilt = document.querySelector('.typefilt')
const timefilt = document.querySelector('.timefilt')

const soundtoggle = document.querySelector('.soundtoggle')
const ambaudio = document.querySelector('.ambientaudio')
let audplaying = false;

const sidelabel = document.getElementById('slabel')

const popupend = document.getElementById('popupend')
const popbox = document.getElementById('popbox')
const poptxt = document.getElementById('poptxt')
const popimg = document.querySelector('.treeimgpop')
const popmsg = document.getElementById('popmsg')

const toast = document.querySelector('.toast')

const username = document.getElementById('username')

const settlink = document.getElementById('settinglink')
const settscr = document.querySelector('.settingscreen')

const gracetoggle = document.getElementById('gracetoggle');


function swapscreen(from, to){
    from.classList.add('sfade');
    from.style.opacity = 0;
    setTimeout(()=>{
        from.style.display = 'none';
        from.style.opacity = '';
        to.classList.add('sfade');
        to.style.opacity = 0;
        to.style.display = 'flex';
        to.offsetHeight;              // force reflow so the fade runs
        to.style.opacity = 1;
    }, 400);
}

function swapbtns(hide, show){
    hide.style.transition = 'opacity .5s ease, transform .5s ease';
    hide.offsetHeight;
    hide.style.opacity = 0;
    hide.style.transform = 'scale(.95)';
    setTimeout(()=>{
        hide.style.display = 'none';
        hide.style.opacity = '';
        hide.style.transform = '';
        hide.style.transition = '';
        show.forEach(b=>{
            b.style.transition = 'none';
            b.style.opacity = 0;
            b.style.display = 'block';
            b.offsetHeight;
            b.style.transition = 'opacity .7s ease';
            b.style.opacity = 1;
        });
    }, 500);
}

function gracems(){
    return localStorage.getItem('grace') === 'off' ? 0 : 3000;
}
gracetoggle.checked = localStorage.getItem('grace') !== 'off';
gracetoggle.addEventListener('change', ()=>{
    localStorage.setItem('grace', gracetoggle.checked ? 'on' : 'off');
});


const motmsgs = [
  "Every forest starts fresh.",
  "Breathe, reset, try again.",
  "Progress isn't always linear.",
  "Tomorrow is another seed.",
  "Mistakes help you grow.",
  "Be kind to yourself.",
  "Your next tree awaits.",
  "Keep growing, keep trying.",
  "A setback, not a stop.",
  "Clear your mind, restart.",
  "Stronger roots take time.",
  "Plant a new seed.",
  "Focus is a practice.",
  "Every effort still matters.",
  "Reset and grow again."
];

let currentuid = null;
let cloudforest = [];

function getforest(){
    if (currentuid) return cloudforest;
    return JSON.parse(localStorage.getItem('forest') || '[]');
}

function saveforest(list){
    if (currentuid) {
        cloudforest = list;
        sb.from('profiles')
          .update({ forest: list, updated_at: new Date().toISOString() })
          .eq('id', currentuid)
          .then(({ error }) => { if (error) showtoast('Could not save to the cloud'); });
    } else {
        localStorage.setItem('forest', JSON.stringify(list));
    }
}


function showtoast(msg){
    toast.textContent = msg
    toast.classList.remove('show')
    void toast.offsetWidth;
    toast.classList.add('show')
}

function randmsg(){
    return motmsgs[Math.floor(Math.random()*motmsgs.length)]
}


function showpopup(msg, img, sub){
    poptxt.textContent = msg;
    popmsg.textContent = sub || '';
    if (img) {
        popimg.src = img
        popimg.style.display = 'block'
    } else {
        popimg.style.display = 'none'
    }
    popupend.classList.add('open')
}
document.getElementById('popbtn').addEventListener('click', ()=>{
    popupend.classList.remove('open')
})
popupend.addEventListener('click', (e)=>{
    if (e.target === popupend) popupend.classList.remove('open')
})

function timefiltfunc(dstr, per){
    if (per === 'all') return true;

    let treedate = new Date(dstr);
    let now = new Date();

    if (per === 'week') {
        let weekago = new Date();
        weekago.setDate(now.getDate() - 7);
        return treedate >= weekago;
    }

    if (per === 'month') {
        return treedate.getMonth() === now.getMonth() && treedate.getFullYear() === now.getFullYear();
    }
}

function switchtab(){
    if (onbd) return;
    const forestShown = getComputedStyle(forsc).display !== 'none';
    showtoast(forestShown ? 'going to focus' : 'going to forest');   // temporary debug
    if (forestShown) {
        swapscreen(forsc, focsc);
        currtab = 'forest';
        forbtn.textContent = 'FOREST';
    } else {
        swapscreen(focsc, forsc);
        currtab = 'focus';
        forbtn.textContent = 'FOCUS';
    }
    sidelabel.textContent = currtab === 'forest' ? 'Forest' : 'Focus';
}

nxtstepbtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        steps[curronbstep].classList.remove('active');
        curronbstep++
        steps[curronbstep].classList.add('active')
    })
})
// document.querySelector('.btn').addEventListener('click',()=>{
//         steps[curronbstep].classList.remove('active');
//         curronbstep--
//         steps[curronbstep].classList.add('active')   
// })


// durpref.addEventListener('input',()=>{
//     durval.textContent = `${durpref.value} min`;
// })


finonb.addEventListener('click', ()=>{
    onbd=false;
    document.querySelector('.onbds').style.display = 'none';
    localStorage.setItem('seenonb', 'true');
    localStorage.setItem('prefdur',durpref.value)
    localStorage.setItem('username', username.value)
    setTimeout(showfirsthints, 400);
})

if (localStorage.getItem('seenonb')) {
    document.querySelector('.onbds').style.display = 'none';
    onbd = false;
}

let forlist = JSON.parse(localStorage.getItem("forest") || '[]');
if (forlist.length>=1) {
    plantbtn.innerHTML = "Plant"
}

function updtime(){
    let totalsec = slider.value*60;
    
        
    let minutes = Math.floor(totalsec/60);
    let seconds = totalsec % 60;
    let display = `${minutes}:${ seconds < 10 ?'0':""}${seconds}`;

    timertxt.textContent = display;
    timertxt2.textContent = display; 
}


slider.addEventListener('input', ()=>{
    clearInterval(countdowninterval)
    updtime();
    localStorage.setItem('prefdur', slider.value)
})

let savedprefdur= localStorage.getItem('prefdur') || 25;
slider.value = savedprefdur
updtime()

plus.addEventListener('click',()=>{
    if (Number(slider.value)<Number(slider.max)) {
       slider.value = Number(slider.value)+5;
       updtime(); 
       localStorage.setItem('prefdur', slider.value);
    }
});


minus.addEventListener('click',()=>{
    if (Number(slider.value)>Number(slider.min)) {
        slider.value = Number(slider.value)-5;
        console.log(slider.value)
        updtime();
        localStorage.setItem('prefdur', slider.value);
    }
})


// pausebtn.addEventListener('click', ()=> {
//     clearInterval(countdowninterval)
// })

// startbtn.addEventListener('click', ()=> {
//     totalsec = parseInt(timertxt.textContent.slice(0,3))*60;
//     countdowninterval= setInterval(() => {
//         totalsec--;
//         let minutes = Math.floor(totalsec/60);
//         let seconds = totalsec % 60;
//         timertxt.textContent = `${minutes}:${ seconds < 10 ? '0' : ""} ${seconds}`;
//     }, 1000);
// })

function Updtreeic(progress){
    let newstage;

    if (progress<0.33) {
        newstage = 0
    }else if (progress<0.66){
        newstage = 1;
    }else{
        newstage = 2;
    }

    if (newstage==currstage) return;

    currstage = newstage

    treevisual.classList.add('overshoote');

    treevisual.style.opacity = 0.8;
    setTimeout(()=>{
        // const images =  ["sprout.png","young.png","grown.png"];
        treevisual.querySelector('img').src = sessionskin.stages[newstage];
        treevisual.style.opacity = 1;

        setTimeout(()=>{
            treevisual.classList.remove('overshoote');
        }, 150)
    }, 300)
}

let lastdur = localStorage.getItem('prefdur') || 10 ;

function tick() {
  totalsec--;

  let minutes = Math.floor(totalsec/60);
  let seconds = totalsec % 60;
  timertxt.textContent = `${minutes}:${seconds < 10 ? '0' : ""}${seconds}`;

  let progress = 1 - (totalsec / ttldur);
  treevisual.style.transform = `scale(${1.0 + progress * 0.0})`;
  Updtreeic(progress);


  if (totalsec <= 0) {
    clearInterval(countdowninterval);
    showpopup("YOUR TREE SURVIVED! SESSION COMPLETE", sessionskin.stages[2])
    plantbtn.style.display = "block";
    pausebtn.style.display = "none";
    startbtn.style.display = "none";
    sessionactive = false;
    savesession("survived", ttldur);
    let minutes = Math.floor(slider.value);
    let display = `${minutes}:00`;
    timertxt.textContent = `${lastdur}:00`;
    timertxt2.textContent = `${lastdur}:00`;
    slider.value = lastdur;
  }
  
}

function savesession(status, secs){
    if (namesess.value==='') {
        namesess.value='Session'
    }
    let forest = getforest();
    forest.push({ inputval:namesess.value.toUpperCase(), date: new Date().toLocaleDateString(), ts: Date.now(), status: status, duration: Math.round(ttldur / 60), focused: secs, skin: sessionskin.id});
    saveforest(forest);
    localStorage.setItem('forest',JSON.stringify(forest));
    plantbtn.innerHTML = "Plant";
};


function rendersess(){
    let forest = getforest();
    const forestgrid = document.querySelector(".grid");
    forestgrid.innerHTML = '';

    let typval = typefilt.value;
    let timval = timefilt.value;    
    let total = 0
    let alive = 0
    let dead = 0

    forest.slice().reverse().forEach(tree => {
        if (typval!=='all' && tree.status!== typval) return;
        if(!timefiltfunc(tree.ts || tree.date, timval))return;

        if (tree.status === 'survived') alive++; else dead++;
        total += tree.focused ?? (tree.status === 'survived' ? (Number(tree.duration) || 0) * 60 : 0);

        const sk = shopitems.find(s => s.id === tree.skin) || shopitems[0];
        let icontree = tree.status === 'survived' ? (sk.GD?.[0] || sk.stages[2]) : (sk.GD?.[1] || 'deadonly.png');
        forestgrid.innerHTML += `<div class="treecard ${tree.status === 'died' ? 'died' : ''}" data-info="${(tree.inputval + ' · ' + tree.date + ' · ' + tree.duration + ' min').replace(/"/g, '&quot;')}">
        <span class="treedt">${tree.inputval}</span>
        <img src='${icontree}' class='treeinforest'>
        <span class="treedt">${tree.date}</span>
        </div>`;
    });
    let mins = Math.round(total / 60);
    let h = Math.floor(mins / 60), m = mins % 60;
    document.querySelector('.summary').textContent=
    `⏱ ${h > 0 ? h + 'h ' : ''}${m}m   🌳 ${alive}   🥀 ${dead}`
    

}

document.querySelector('.grid').addEventListener('click', (e) => {
    const card = e.target.closest('.treecard');
    if (!card) return;
    showtoast(card.dataset.info);
});

typefilt.addEventListener('change', rendersess);
timefilt.addEventListener('change', rendersess);  


forbtn.addEventListener('click', ()=>{
    if (onbd) return;
    rendersess();
    switchtab();
});


plantbtn.addEventListener('click', ()=>{
    if (onbd) {
        return
    }
    ttldur = slider.value*60;
    lastdur = slider.value;    
    sessionactive = true;
    swapbtns(plantbtn, [pausebtn, startbtn]);
    clearInterval(countdowninterval)
    totalsec = ttldur;
 
    countdowninterval= setInterval(tick,1000);
    treevisual.querySelector('img').src=sessionskin.stages[0];
    currstage = 0;
    pausecount=0;
    ispaused=false;
    pausebtn.textContent = "Pause"
    settcard.classList.remove('open');
})

let grace;
document.addEventListener('visibilitychange',()=>{
    if (document.hidden && sessionactive) {
        grace = setTimeout(()=>{
            clearInterval(countdowninterval);
            sessionactive = false;
            showpopup("YOUR TREE DIED! YOU LEFT THE TAB", sessionskin.stages[currstage], randmsg())
            treevisual.style.transform = 'scale(1)';
            plantbtn.style.display = 'block';
            pausebtn.style.display = 'none';
            startbtn.style.display = 'none';
            slider.value = lastdur;
            timertxt.textContent = `${lastdur}:00`;
            timertxt2.textContent = `${lastdur}:00`;
            
            settcard.classList.remove('open');
            treevisual.querySelector('img').src= sessionskin.stages[2];
            savesession("died", ttldur-totalsec)
        },gracems())
    }
    if (!document.hidden) {
        clearTimeout(grace);
    }
});

let pausecount = 0;

pausebtn.addEventListener('click', ()=>{
    if (!ispaused) {
        if (pausecount>=1) {
            showtoast("You can only pause one time per session")
            return;
        }
        clearInterval(countdowninterval);
        ispaused =true; 
        pausecount++
        pausebtn.textContent="Resume";
    } else {
        countdowninterval= setInterval(tick,1000)
        ispaused = false;
        pausebtn.textContent = "Pause"
    }
})

startbtn.addEventListener('click', ()=>{
     clearInterval(countdowninterval);
        sessionactive = false;
        showpopup("YOUR TREE DIED!", sessionskin.stages[currstage], randmsg())
        treevisual.style.transform = 'scale(1)';
        plantbtn.style.display = 'block';
        pausebtn.style.display = 'none';
        startbtn.style.display = 'none';
        slider.value = lastdur;
        timertxt.textContent = `${lastdur}:00`;
        timertxt2.textContent = `${lastdur}:00`;

        settcard.classList.remove('open');
        treevisual.querySelector('img').src= sessionskin.stages[2];
        savesession("died", ttldur-totalsec)
})

timertxt.addEventListener('click', ()=>{
    if (onbd) return;
    if (sessionactive) return;
    settcard.classList.add('open');
})

const closeset = document.getElementById("closeset")
closeset.addEventListener('click', ()=>{
    settcard.classList.remove('open');
})

hammenu.addEventListener('click', (e)=>{
    if (sessionactive) return; 
    if (onbd) return
    e.stopPropagation()
    hammenu.classList.toggle('active')
    sidebar.classList.toggle('active')
    menopen = sidebar.classList.contains('active');
})
focsc.addEventListener('click', ()=>{
    if (menopen) {
        sidebar.classList.toggle('active')
        hammenu.classList.toggle('active')
        menopen=false
    }
    else{
        return
    }
})
forsc.addEventListener('click', ()=>{
    if (menopen) {
        sidebar.classList.toggle('active')
        hammenu.classList.toggle('active')
        menopen=false
    }
    else{
        return
    }
})
document.querySelector('.site-footer').addEventListener('click',()=>{
    if (menopen) {
        sidebar.classList.toggle('active')
        hammenu.classList.toggle('active')
        menopen=false
    }
    else{
        return
    }
})
document.querySelector('.shopscreen').addEventListener('click',()=>{
    if (menopen) {
        sidebar.classList.toggle('active')
        hammenu.classList.toggle('active')
        menopen=false
    }
    else{
        return
    }
})

// sidebar.addEventListener('click',(e)=>{
//     e.stopPropagation()
// })

const menusess = document.querySelector('.options')

soundtoggle.addEventListener('click',()=>{
    if(audplaying){
        ambaudio.pause();
        soundtoggle.textContent="🔊"
    }else{
        ambaudio.play();
        soundtoggle.textContent="🔇"
    }
    audplaying=!audplaying
})


document.getElementById('forestlink').addEventListener('click', (e)=>{
    e.preventDefault();
    if (onbd) return;
    shopscr.classList.remove('open'); 
    settscr.classList.remove('open')  // close the shop if it's open
    switchtab();                        // go to the other screen
    rendersess();
    sidebar.classList.remove('active');
    hammenu.classList.remove('active');
    menopen = false;
});

settlink.addEventListener('click', (e)=>{
    e.preventDefault();
    if (onbd) return;
    shopscr.classList.remove('open');   // close the shop if it's open
    sidebar.classList.remove('active');
    hammenu.classList.remove('active');
    menopen = false;
    settscr.classList.toggle('open')
});

settscr.addEventListener('click',()=>{
    if (menopen) {
        sidebar.classList.toggle('active')
        hammenu.classList.toggle('active')
        menopen=false
    }
    else{
        return
    }
})

document.querySelector('.closesettings').addEventListener('click', ()=>{
    settscr.classList.remove('open')
})


const setreset = document.getElementById('setreset');
let resetarmed = false;

setreset.addEventListener('click', ()=>{
    if (!resetarmed) {
        resetarmed = true;
        setreset.textContent = 'Tap again to confirm';
        setTimeout(()=>{
            resetarmed = false;
            setreset.textContent = 'Reset';
        }, 3000);
        return;
    }
    saveforest([]);
    plantbtn.innerHTML = 'Plant and get started!';
    rendersess();
    resetarmed = false;
    setreset.textContent = 'Reset';
    showtoast('Forest reset');
});

const onbdpref = document.getElementById('onbdpref');
const onbddurval = document.getElementById('onbddurval');

function updonbddur() {
    onbddurval.textContent = onbdpref.value + ' min';
}
onbdpref.addEventListener('input', updonbddur);
updonbddur(); // sets the correct text on first load

document.getElementById('homelink').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.sidebar').classList.remove('active');
    document.querySelector('.hammenu').classList.remove('active');
    if (typeof shopscr !== 'undefined') shopscr.classList.remove('open');
    if (typeof settscr !== 'undefined') settscr.classList.remove('open');
    if (forsc.style.display !== 'none') swapscreen(forsc, focsc);
    currtab = 'forest';
    forbtn.textContent = 'FOREST';
    sidelabel.textContent = 'Forest';
});

function showhint(sel, text, arrow) {
    const el = document.querySelector(sel);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const h = document.createElement('div');
    h.className = 'hint';
    h.innerHTML = arrow === 'up'
        ? `<span class="arr">↑</span>${text}`
        : `${text}<span class="arr">↓</span>`;
    document.body.appendChild(h);
    h.style.left = (r.left + r.width / 2) + 'px';
    h.style.top = arrow === 'up'
        ? (r.bottom + 6) + 'px'
        : (r.top - h.offsetHeight - 6) + 'px';
    requestAnimationFrame(() => h.classList.add('show'));
    setTimeout(() => {
        h.classList.remove('show');
        setTimeout(() => h.remove(), 400);
    }, 2500);
}

function showfirsthints() {
    showhint('.treeic', 'Tap to change your tree', 'up');
    showhint('.timer', 'Slide to set your time', 'up');
}
