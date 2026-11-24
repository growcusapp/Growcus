const sb = supabase.createClient('https://nuhjpzqdzauhhpculmrp.supabase.co', 'sb_publishable_Rr0_K4Hf6oXhBkeUBJa68Q_buD8zylo');

const authscr = document.querySelector('.authscreen');

const confirmout = document.querySelector('.signoutpopup');

document.getElementById('signout').addEventListener('click', ()=>{
    if (localStorage.getItem('user')) {
        confirmout.classList.add('open');
    } else {
        authscr.classList.add('open');
    }
});

document.getElementById('noout').addEventListener('click', ()=>{
    confirmout.classList.remove('open');
});

document.getElementById('yesout').addEventListener('click', async ()=>{
    confirmout.classList.remove('open');
    await sb.auth.signOut();
    showtoast('Signed out');
});

document.getElementById('cancelauth').addEventListener('click', ()=>{
    authscr.classList.remove('open');
    document.getElementById('authmsg').textContent = '';
    const b = document.getElementById('magiclink');
    b.disabled = false;
    b.textContent = 'send verification on email';
    authscr.classList.remove('open');
});

document.getElementById('magiclink').addEventListener('click', async ()=>{
    const email = document.getElementById('email').value.trim();
    if (!email) return;
    const { error } = await sb.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin }
    });
    const msg = document.getElementById('authmsg');
    const btn = document.getElementById('magiclink');

    if (error) {
        msg.style.color = '#e55';
        msg.textContent = error.message;
        return;
    }
    msg.style.color = '';
    msg.textContent = 'Link sent! Check your inbox (and spam) for ' + email;
    btn.disabled = true;
    btn.textContent = 'Link sent';
});

document.getElementById('googleauth').addEventListener('click', ()=>{
    sb.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
    });
});

async function loadcloud(user){
    currentuid = user.id;
    let { data } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (!data) {
        data = {
            id: user.id,
            username: localStorage.getItem('username') || '',
            forest: JSON.parse(localStorage.getItem('forest') || '[]'),
            prefdur: Number(localStorage.getItem('prefdur') || 25)
        };
        await sb.from('profiles').insert(data);
    }
    cloudforest = data.forest || [];
    if (data.username) {
        localStorage.setItem('username', data.username);
        const cu = JSON.parse(localStorage.getItem('user') || 'null');
        if (cu) { cu.name = data.username; localStorage.setItem('user', JSON.stringify(cu)); }
        showacc();
    }

    if (!sessionactive) {
        sessionskin = buyskin();
        treevisual.querySelector('img').src = sessionskin.stages[2];
    }

    const { data: bought } = await sb.from('purchases').select('skin_id').eq('user_id', user.id);
    cloudowned = (bought || []).map(r => r.skin_id);
    if (typeof renderpicker === 'function') renderpicker();
    if (typeof rendershop === 'function') rendershop();

    if (forsc.style.display === 'flex') rendersess();
}

sb.auth.onAuthStateChange((event, session)=>{
    const u = session && session.user;
    if (u) {
        localStorage.setItem('user', JSON.stringify({
            name: localStorage.getItem('username') || (u.user_metadata && u.user_metadata.full_name) || 'Player',
            email: u.email
        }));
        if (currentuid !== u.id) setTimeout(()=>loadcloud(u), 0);
    } else {
        localStorage.removeItem('user');
        currentuid = null;
        cloudforest = [];
        cloudowned = [];
        if (!sessionactive) {
            sessionskin = buyskin();
            treevisual.querySelector('img').src = sessionskin.stages[2];
        }
        if (typeof renderpicker === 'function') renderpicker();
        if (typeof rendershop === 'function') rendershop();        
        if (forsc.style.display === 'flex') rendersess();
    }
    showacc();
});

document.getElementById('setnamebtn').addEventListener('click', async () => {
    const input = document.getElementById('setname');
    const name = input.value.trim().slice(0, 8);
    if (!name) { showtoast('Enter a name'); return; }
    localStorage.setItem('username', name);
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    if (u) { u.name = name; localStorage.setItem('user', JSON.stringify(u)); }
    showacc();
    if (currentuid) {
        const { error } = await sb.from('profiles')
            .upsert({ id: currentuid, username: name, updated_at: new Date().toISOString() });
        console.log('name save', error);
        if (error) { showtoast('Saved here, but not synced'); return; }
    }
    input.value = ''; showtoast('Name changed');
});