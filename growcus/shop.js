const shopitems= [
    {id:'def',name:'Default Tree',price:'$1/₹90', thumb:'grown.png', stages:['sprout.png','young.png','grown.png',], link: "https://whop.com/checkout/plan_s22c2CJmt3BMQ", GD:['grownonly.png','deadonly.png']},
    {id:'cherry',name:'Cherry Tree',price:'$1/₹90', thumb:'cherrythumb.png', stages:['cherrysprout.png','cherryyoung.png','cherrygrown.png'], link: "https://whop.com/checkout/plan_s22c2CJmt3BMQ", GD:['cherrycardA.png','cherrycardD.png']},
    {id:'autumn',name:'Autumn Tree',price:'$1/₹90', thumb:'grown.png', stages:['autumnsprout.png','autumnyoung.png','autumngrown.png'], link: "https://whop.com/checkout/plan_NqJsm9Ft0k5aV", GD:['autumncardA.png','autumncardD.png']}, 
    {id:'pine',name:'Pine Tree',price:'$1/₹90', thumb:'grown.png', stages:['pineprout.png','pineyoung.png','pinegrown.png'], link: "https://whop.com/checkout/plan_IFRl8AlKeFvzo", GD:['pinecardA.png','pinecardD.png'],},
    {id:'maple',name:'Maple Tree',price:'$1/₹90', thumb:'grown.png', stages:['maplesprout.png','mapleyoung.png','maplegrown.png'], link: "https://whop.com/checkout/plan_vtYUUuTLvIJsq", GD:['maplecardA.png','maplecardD.png'],},
    
    {id:'bamboo',name:'Bamboo',price:'$1/₹90', thumb:'grown.png', stages:['bamboosprout.png','bambooyoung.png','bamboogrown.png'], link: "https://whop.com/checkout/plan_HV1acvgnzQ6YU", GD:['bamboocardA.png','bamboocardD.png'],},
    {id:'willow',name:'Willow Tree',price:'$1/₹90', thumb:'grown.png', stages:['willowsprout.png','willowyoung.png','willowgrown.png'], link: "https://whop.com/checkout/plan_emCe3j6FR6Hia", GD:['willowcardA.png','willowcardD.png'],},
    {id:'sakura',name:'Sakura Tree',price:'$1/₹90', thumb:'grown.png', stages:['sakurasprout.png','sakurayoung.png','sakuragrown.png'], link: "https://whop.com/checkout/plan_wrboFVuKgBolS", GD:['sakuracardA.png','sakuracardD.png'],},
    {id:'baobab',name:'Baobab Tree',price:'$1/₹90', thumb:'grown.png', stages:['baobabsprout.png','baobabyoung.png','baobabgrown.png'], link: "https://whop.com/checkout/plan_gmnE62NftF910", GD:['baobabcardA.png','baobabcardD.png'],},
    {id:'palm',name:'Palm Tree',price:'$1/₹90', thumb:'grown.png', stages:['palmsprout.png','palmyoung.png','palmgrown.png'], link: "https://whop.com/checkout/plan_nl6UBl3xfx870", GD:['palmcardA.png','palmcardD.png'],},
]   

const ownedgrid = document.querySelector('.ownedgrid')
const moregrid = document.querySelector('.moregrid')
const pmsg = document.querySelector('.pmsg')

const pickerbox = document.querySelector('.skinpicker');

const shopscr= document.querySelector('.shopscreen')
const shopgrid= document.querySelector('.shopgrid')

const FREESKINS = ['def'];   // put your real free skin id(s) here

let cloudowned = [];

function getowned(){
    return [...new Set([...FREESKINS, ...(currentuid ? cloudowned : [])])];
}

function buyskin(){
    let id= localStorage.getItem('activeskin') || 'def';
    if (!getowned().includes(id)) id = 'def';    
    return shopitems.find(s => s.id === id) || shopitems[0];
}

let sessionskin= buyskin()
treevisual.querySelector('img').src = sessionskin.stages[2]

function renderpicker(){
    let owned = getowned();
    let active = buyskin().id;
    ownedgrid.innerHTML=''
    moregrid.innerHTML=''
    pmsg.textContent=''

    shopitems.forEach(item =>{
        let isowned = owned.includes(item.id)
        let cls = isowned ? (item.id === active ? 'selected':''):"locked"
        let cell = `
            <div class="scell ${cls}" data-id="${item.id}">
                <img src="${item.stages[2]}" alt="">
                <p>${item.name}</p>
            </div>`

        if (isowned) ownedgrid.innerHTML+= cell;
        else moregrid.innerHTML+= cell;
    })
}

pickerbox.addEventListener('click',(e)=>{
    let cell = e.target.closest('.scell')
    if (!cell) return;
    if (cell.classList.contains("locked")){
        pmsg.textContent= "Buy It From The Shop"
        return
    }
    if (sessionactive) return;
    localStorage.setItem('activeskin', cell.dataset.id);
    sessionskin= buyskin();
    treevisual.querySelector('img').src = sessionskin.stages[2]
    renderpicker()
})

// skinpicker.addEventListener('click', (e)=>{
//         if (!e.target.classList.contains('skinoption')) return;
//         if (sessionactive) return;
//         localStorage.setItem('activeskin', e.target.dataset.id);
//         sessionskin = buyskin();
//         treevisual.querySelector('img').src = sessionskin.stages[2];
//         rendershop()
// })  

let shoptab = 'buy';

function rendershop(){
    let owned = getowned();
    shopgrid.innerHTML='';


    shopitems.forEach(item =>{
        let btn;

        if (shoptab === 'buy' && owned.includes(item.id)) return;
        if (shoptab === 'owned' && !owned.includes(item.id)) return;

        if (owned.includes(item.id)) {
            btn = `<button disabled>Owned</button>`;
        } else {
            btn = `<button data-action="buy" data-id="${item.id}">Buy</button>`;
        }


        shopgrid.innerHTML += `
        <div class="itemcard">
        <img src="${item.stages[2]}">
        <p class='namecard'>${item.name}</p>
        <p class='pricecard'>${item.price}</P>
        ${btn}
        </div>
        `
    })
    renderpicker()
}

shopgrid.addEventListener('click', (e)=>{
    let id = e.target.dataset.id;
    if (!id) return;
    let item = shopitems.find(s => s.id === id)

    if (e.target.dataset.action === 'buy') {
        if (!currentuid) {
            showtoast('Sign in to buy skins');
            shopscr.classList.remove('open');
            settscr.classList.add('open');
            return;
        }
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        window.open(item.link + '?email=' + encodeURIComponent(u.email || ''), '_blank')
    }
})

document.getElementById('shoplink').addEventListener('click', (e)=>{
    e.preventDefault();
    sidebar.classList.remove('active');
    hammenu.classList.remove('active');
    menopen = false;
    rendershop();
    shopscr.classList.add('open');
    settcard.classList.remove('open')
});

treevisual.addEventListener('click', ()=>{
    if (onbd || sessionactive) return;
    renderpicker();
    pickerbox.classList.toggle('open');
});

document.querySelector('.shandle').addEventListener('click', ()=>{
    pickerbox.classList.remove('open');
});

document.addEventListener('click', (e)=>{
    if (!pickerbox.classList.contains('open')) return;
    if (pickerbox.contains(e.target) || treevisual.contains(e.target)) return;
    pickerbox.classList.remove('open');
});

document.querySelectorAll('.stab').forEach(b=>{
    b.addEventListener('click',()=>{
        shoptab = b.dataset.tab
        document.querySelectorAll('.stab').forEach(x=> x.classList.toggle('active', x===b))
        rendershop()
    })
})

function showacc(){
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    document.getElementById('accname').textContent  = u ? u.name  : (localStorage.getItem('username') || 'Guest');
    document.getElementById('accemail').textContent = u ? u.email : 'Not signed in';
    document.getElementById('signout').textContent  = u ? 'Sign Out' : 'Sign In';
}

showacc();

// re-apply the saved skin once cloud ownership has loaded
function syncskin(){
    if (sessionactive) return;
    const want = buyskin();
    if (want.id !== sessionskin.id) {
        sessionskin = want;
        treevisual.querySelector('img').src = sessionskin.stages[2];
    }
}
setInterval(syncskin, 700);
