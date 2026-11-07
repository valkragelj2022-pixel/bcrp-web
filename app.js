
const CONFIG = {
  connectUrl: 'fivem://connect/cfx.re/join/SOON',
  players: 0, maxPlayers: 64,
  // Živo število igralcev: vpiši URL (glej player-count-worker.js ali http://IP:30120/players.json). Prazno = prikaže 0.
  playerApi: '',
  paypalEmail: 'val.kragelj2010@icloud.com',
  purchaseWebhook:'',
  purchasePingUserId: '1400616825116561520',

  // Mesečni paketi — urejajte tukaj
  donations: {
    bronze:{name:'Bronze Podpornik',price:'€9.99',period:'/ mesec',tag:'Bronze',blurb:'Vhodni nivo podpore za predane igralce.',perks:['Ekskluzivna vloga v Discordu','Dostop do prioritetnega čakanja','Ekskluzivni pack kož za vozila','Dostop do podpore v klepetu']},
    silver:{name:'Silver Podpornik',price:'€19.99',period:'/ mesec',tag:'Silver',blurb:'Napredni paket z več ekskluzivnimi koristmi.',perks:['Vse iz Bronza','Ekskluzivna registrska številka','Mesečni bonus v igri','Ekskluzivni oblačilni predmeti','Predogled novih funkcij']},
    gold:{name:'Gold Podpornik',price:'€34.99',period:'/ mesec',tag:'Gold',featured:true,blurb:'Premium paket za naše najbolj predane podpornike.',perks:['Vse iz Silver','Edinstveno vozilo Gold tier','Edinstven naslov v igri','Prioritetni support ticketi','Ekskluzivni Gold kanali v Discordu','Poudarjeno ime v igri']}
  },
  // ===== Custom pedi =====
  // Nov ped dodaš tako, da kopiraš eno vrstico spodaj in spremeniš podatke.
  // photo: pot do slike v mapi peds/  |  preview: (opcijsko) YouTube/drugi link do predogleda
  // price: številka v € (npr. 35 ali 34.99)  |  featured:true = poudarjena kartica
  peds:[
    {id:'felix',   photo:'peds/ped1.jpg', name:'Felix',    price:35,    preview:'https://youtu.be/S7ddBN4NC4U', blurb:'Custom ped model, narejen po meri.', featured:false},
    {id:'jose',    photo:'peds/ped2.jpg', name:'Jose',     price:35, preview:'https://youtu.be/6ZTj7JuXqv0', blurb:'Custom ped model, narejen po meri.', featured:false},
    {id:'elgario', photo:'peds/ped3.jpg', name:'Elgario',  price:35, preview:'https://youtu.be/KxDP5RPLZn8', blurb:'Custom ped model, narejen po meri.', featured:false},
    {id:'cube', photo:'peds/ped4.jpg', name:'Cube',  price:35, preview:'https://youtu.be/edqxJ7ERcJk', blurb:'Custom ped model, narejen po meri.', featured:false},
    {id:'carle', photo:'peds/ped5.jpg', name:'Carle',  price:35, preview:'https://youtu.be/ipslxSRNSCg?si=HgZ_MjbPem_nTYPJ', blurb:'Custom ped model, narejen po meri.', featured:false},
    {id:'hector', photo:'peds/ped6.jpg', name:'Hector',  price:35, preview:'https://youtu.be/HFANvNwXA0U', blurb:'Custom ped model, narejen po meri.', featured:false},
    {id:'takeo', photo:'peds/ped7.jpg', name:'Takeo',  price:35, preview:'https://youtu.be/SZWLKFlg7ks', blurb:'Custom ped model, narejen po meri.', featured:false},
    {id:'hao', photo:'peds/ped8.jpg', name:'Hao',  price:35, preview:'https://youtu.be/edqxJ7ERcJk', blurb:'Custom ped model, narejen po meri.', featured:false},
    // ,{id:'nov-ped', photo:'peds/ped9.jpg', name:'Ime peda', price:39.99, blurb:'Kratek opis.'}
  ],
  // ===== MLO / hiše za donatorje =====
  // Nov MLO dodaš tako, da kopiraš eno vrstico in spremeniš podatke. photo: slika v mapi mlo/ (če je ni, se prikaže ikona hiše)
  // range:true = kupec sam izbere znesek med min in max (drsnik)
  mlos:[
    {id:'custom',   photo:'mlo/mlo0.jpg', name:'MLO po vaši izbiri', price:30, range:true, min:15, max:80, blurb:'Sami izberite znesek med €15 in €80.'},
  ],
  mloPerks:['Zasebna lokacija v igri','Ključi in dostop za vaš karakter','Pomoč ekipe pri postavitvi'],
  pedPerks:['En custom ped model','Dodan v vaš karakter','Zamenjava ob težavah z modelom'],
  pedsPerPage:6,
  features:[
    ['','Resna vloga','Jasni standardi, Fear RP in zgodbe brez naključnih deathmatchov. Vsak lik ima razlog za to, kar počne.'],
    ['','Lastni sistemi','Zaposlitve, ekonomija in interakcije, narejene za BlueCity Roleplay in redno posodobljene po povratnih informacijah igralcev.'],
    ['','Skupnost, ki igra skupaj','Vsak dan aktivni igralci, ki pomagajo novincem pri prvih korakih.'],
    ['','Ekipa na voljo','Moderatorji in podpora so dosegljivi prek Discorda in ticketov.']
  ],
  rules:[
    ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v4M12 16h.01','Spoštuj vse','Spoštujte vse igralce in ekipo. Nadlegovanje, diskriminacija in toksičnost niso dovoljeni.'],
    ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z','Ostani v vlogi','Vlogo menjajte le, če je nujno. Cenite immersijo drugih okoli vas.'],
    ['M9 12l2 2 4-4M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z','Brez exploitov','Zapleti, glitchi in orodja tretjih oseb, ki dajejo nepravične prednosti, so strogo prepovedana.']
  ],
  staff:[{name:'Darkangel',role:'Lastnik',desc:'Ustanovitelj BlueCity Roleplay',avatar:'staff-darkangel.png'},
    { name: 'Skino', role: 'Lastnik', desc: 'Ustanovitelj BlueCity Roleplay', avatar: 'staff-skino.png' },
    { name: 'ZeusX', role: 'Developer', desc: 'Developer BlueCity Roleplay', avatar: 'staff-zeus.png' },]
};

Object.assign(CONFIG,window.__CMS||{});
const NIL=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>'':NIL,set:()=>true,apply:()=>NIL});
const $=(s,r=document)=>r.querySelector(s)||NIL, $$=(s,r=document)=>[...r.querySelectorAll(s)];

// Toasts
function toast(msg,type='info'){let w=document.getElementById('toasts');if(!w){w=document.createElement('div');w.id='toasts';w.setAttribute('aria-live','polite');document.body.appendChild(w)}
  const t=document.createElement('div');t.className='toast '+type;t.textContent=msg;w.appendChild(t);requestAnimationFrame(()=>t.classList.add('in'));
  setTimeout(()=>{t.classList.remove('in');setTimeout(()=>t.remove(),400)},3800)}
window.toast=toast;
const svg=(d,w=1.8)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
const check=svg('M20 6 9 17l-5-5',2.4);
const pedSvg=`<svg viewBox="0 0 64 80" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="16" r="10"/><path d="M14 74V50c0-9 8-16 18-16s18 7 18 16v24M24 74V58M40 74V58"/><path d="M32 6v-3M52 20l4-2M12 20l-4-2" opacity=".5"/></svg>`;
const mloSvg=`<svg viewBox="0 0 64 80" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 38 32 14l26 24M12 34v32h40V34M26 66V46h12v20"/></svg>`;
const fmt=n=>'€'+Number(n).toFixed(2); // vse cene v EUR, vedno z 2 decimalkama
const PEDS=CONFIG.peds.map(p=>({...p,key:'ped_'+p.id,ped:true,tag:'Custom ped',period:'enkratno',priceNum:p.price,price:fmt(p.price),perks:p.perks||CONFIG.pedPerks}));
const MLOS=CONFIG.mlos.map(p=>({...p,key:'mlo_'+p.id,mlo:true,tag:'MLO / Hiša',period:'enkratno',priceNum:p.price,price:fmt(p.price),perks:p.perks||CONFIG.mloPerks}));
const ALL={...CONFIG.donations,...Object.fromEntries([...PEDS,...MLOS].map(p=>[p.key,p]))};

// Static fills
$('#playerCount').textContent=CONFIG.players; $('.maxp').textContent=CONFIG.maxPlayers;
$('#statusPlayers').textContent=`${CONFIG.players} / ${CONFIG.maxPlayers}`; $('#footerPlayers').textContent=CONFIG.players;
$$('[data-connect]').forEach(a=>a.href=CONFIG.connectUrl);
async function livePlayers(){
  if(!CONFIG.playerApi)return;
  try{const r=await fetch(CONFIG.playerApi,{cache:'no-store'}),j=await r.json();let n,m=CONFIG.maxPlayers;
    if(Array.isArray(j))n=j.length;else if(j.Data){n=j.Data.clients;m=j.Data.sv_maxclients||m}else{n=j.players;m=j.max||m}
    if(!Number.isFinite(n))throw 0;
    $('#playerCount').textContent=n;$('.maxp').textContent=m;$('#statusPlayers').textContent=`${n} / ${m}`;$('#footerPlayers').textContent=n}catch{}
}
livePlayers();setInterval(livePlayers,30000);
const card=(i,t,p,d=0)=>`<div class="card reveal" style="--d:${d}s"><div class="icon">${svg(i)}</div><h3>${t}</h3><p>${p}</p></div>`;
$('#features').innerHTML=CONFIG.features.map(f=>`<div class="frow"><h3>${f[1]}</h3><p>${f[2]}</p></div>`).join('');
$('#rulesGrid').innerHTML=CONFIG.rules.map((f,i)=>card(...f,i*.1)).join('');
const tier=(k,p,i)=>`<div class="card tier ${p.ped?'ped':p.mlo?'mlo':k} ${p.featured?'featured':''} reveal" style="--d:${i*.1}s">
  ${(p.ped||p.mlo)?`<div class="ped-art shimmer">${p.mlo?mloSvg:pedSvg}<img src="${p.photo}" alt="${p.name}" loading="lazy" onload="this.classList.add('ok');this.parentNode.classList.remove('shimmer')" onerror="this.parentNode.classList.remove('shimmer');this.remove()"></div>`:''}
  <span class="badge">${p.tag}</span><h3>${p.name}</h3>
  <div class="price"><span class="pv">${p.price}</span> <small>${p.period}</small></div>
  <p>${p.blurb||''}</p>
  ${p.range?`<div class="range"><label>Izberite znesek</label><input type="range" min="${p.min}" max="${p.max}" step="1" value="${p.priceNum}" data-range="${k}" aria-label="Znesek v evrih"><div class="range-ends"><span>${fmt(p.min)}</span><span>${fmt(p.max)}</span></div></div>`:''}
  ${p.preview?`<a class="prev-link" href="${p.preview}" target="_blank" rel="noopener">${svg('M5 3l14 9-14 9V3z')}Poglej predogled</a>`:''}
  <ul class="perks">${p.perks.map(x=>`<li>${check}${x}</li>`).join('')}</ul>
  <button class="btn" data-pkg="${k}">${p.ped?'Naroči ped':p.mlo?'Naroči MLO':'Podpri'}</button></div>`;
const skel=n=>Array.from({length:n},()=>`<div class="card skel"><div class="sk sk-img shimmer"></div><div class="sk sk-line w40 shimmer"></div><div class="sk sk-line w70 shimmer"></div><div class="sk sk-line w55 shimmer"></div><div class="sk sk-btn shimmer"></div></div>`).join('');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const preload=src=>new Promise(r=>{const i=new Image();i.onload=i.onerror=r;i.src=src});

// ---- Store: skeletons first, then real cards once images are ready ----
if(document.getElementById('tiers')){
  $('#tiers').innerHTML=skel(3);$('#pedGrid').innerHTML=skel(3);$('#mloGrid').innerHTML=skel(3);
  let shown=0,list=[...PEDS];
  const q=$('#pedSearch'),sortSel=$('#pedSort'),more=$('#pedMore'),empty=$('#pedEmpty'),count=$('#pedCount');
  const view=()=>{const t=q.value.trim().toLowerCase();
    let l=PEDS.filter(p=>!t||p.name.toLowerCase().includes(t));
    const s=sortSel.value;
    if(s==='asc')l.sort((a,b)=>a.priceNum-b.priceNum);else if(s==='desc')l.sort((a,b)=>b.priceNum-a.priceNum);
    else if(s==='az')l.sort((a,b)=>a.name.localeCompare(b.name));
    return l};
  const draw=(reset=true)=>{list=view();if(reset)shown=0;
    const next=list.slice(shown,shown+CONFIG.pedsPerPage);
    const html=next.map((p,i)=>tier(p.key,p,i)).join('');
    if(reset)$('#pedGrid').innerHTML=html;else $('#pedGrid').insertAdjacentHTML('beforeend',html);
    shown+=next.length;
    count.textContent=`${list.length} ${list.length===1?'ped':'pedov'}`;
    empty.style.display=list.length?'none':'block';
    more.style.display=shown<list.length?'inline-flex':'none';
    $$('#pedGrid .reveal:not(.in)').forEach(el=>io.observe(el));
    bindBuy()};
  window.__drawPeds=draw;
  Promise.all([wait(650),...MLOS,...PEDS.slice(0,CONFIG.pedsPerPage).map(p=>Promise.race([preload(p.photo),wait(2500)]))]).then(()=>{
    $('#tiers').innerHTML=Object.entries(CONFIG.donations).map(([k,p],i)=>tier(k,p,i)).join('');
    $$('#tiers .reveal').forEach(el=>io.observe(el));
    draw();
    $('#mloGrid').innerHTML=MLOS.map((p,i)=>tier(p.key,p,i)).join('');$('#mloCount').textContent=`${MLOS.length} ${MLOS.length===1?'lokacija':'lokacij'}`;bindBuy();
    q.oninput=()=>draw();sortSel.onchange=()=>draw();more.onclick=()=>draw(false);
    window.__storeReady=true;window.dispatchEvent(new Event('store-ready'));
  });
}
$('#staffGrid').innerHTML=CONFIG.staff.map((m,i)=>`<div class="card staff-card reveal" style="--d:${i*.1}s"><div class="avatar">${m.avatar?`<img src="${m.avatar}" alt="${m.name}">`:`<div class="ph">${m.name.slice(0,2).toUpperCase()}</div>`}</div><h3>${m.name}</h3><div class="role">${m.role}</div><p>${m.desc}</p></div>`).join('');


// Loader, nav, progress, active link
addEventListener('load',()=>setTimeout(()=>$('#loader').classList.add('done'),350));
function onScroll(){
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  $('#nav').classList.toggle('scrolled',y>40); $('#progress').style.width=(h>0?y/h*100:0)+'%';
}
addEventListener('scroll',onScroll,{passive:true});onScroll();
const mob=$('#mobile');
$('#menuBtn').onclick=()=>{mob.classList.toggle('open');document.body.style.overflow=mob.classList.contains('open')?'hidden':''};
$$('.ml,#mobile .btn').forEach(a=>a.onclick=()=>{mob.classList.remove('open');document.body.style.overflow=''});

// Reveal + counters
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);
  const c=e.target.querySelector('[data-count]');if(c){const to=+c.dataset.count,suf=c.dataset.suf||'',t0=performance.now();
    (function f(t){const k=Math.min((t-t0)/1400,1);c.textContent=Math.round(to*(1-Math.pow(1-k,3)))+suf;if(k<1)requestAnimationFrame(f)})(t0)}}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));

// ===== Payment modal (PayPal + Paysafe) =====
const ov=$('#overlay');let cur=null,method='paypal';
function setMethod(m){method=m;$$('.tab').forEach(t=>t.classList.toggle('on',t.dataset.m===m));$$('.pane').forEach(p=>p.classList.toggle('on',p.dataset.p===m))}
function openModal(k){cur=k;const p=ALL[k];
  $('#mName').textContent=p.name;$('#mPrice').textContent=`${p.price} ${p.period}`;
  $('#ppAmt').textContent=$('#psAmt').textContent=p.price;$('#ppMail').textContent=CONFIG.paypalEmail;
  $$('#form input,#form textarea').forEach(i=>i.value='');$('#pedNote').style.display=(p.ped||p.mlo)?'block':'none';$('#pedNote label').textContent=p.mlo?'Želena lokacija ali opombe (opcijsko)':'Želeni ped (povezava ali opis)';$('#pedText').placeholder=p.mlo?'Npr. želite hišo na določeni lokaciji ali posebne želje…':'Povežite referenco ali opišite, kako naj ped izgleda…';
  const u=window.Auth&&Auth.user();if(u){$('#email').value=u.email;$('#discord').value=u.discord||''}
  $('#acctName').textContent=u?Auth.display(u):'';
  $('#form').style.display='block';$('#done').style.display='none';setMethod('paypal');
  ov.classList.add('open');document.body.style.overflow='hidden'}
function closeModal(){ov.classList.remove('open');document.body.style.overflow=''}
function buy(k){
  const u=window.Auth&&Auth.user();
  if(!u){toast('Za nakup se najprej prijavite ali ustvarite račun.','info');
    setTimeout(()=>location.href='login.html?next='+encodeURIComponent('trgovina.html')+'&buy='+encodeURIComponent(k),900);return}
  openModal(k)}
document.addEventListener('input',e=>{const r=e.target.closest?.('[data-range]');if(!r)return;const p=ALL[r.dataset.range],v=Math.min(p.max,Math.max(p.min,+r.value||p.min));
  p.priceNum=v;p.price=fmt(v);r.closest('.tier').querySelector('.pv').textContent=p.price});
function bindBuy(){$$('[data-pkg]').forEach(b=>b.onclick=()=>buy(b.dataset.pkg))}
bindBuy();
addEventListener('store-ready',()=>{const k=new URLSearchParams(location.search).get('buy');
  if(k&&ALL[k]&&window.Auth&&Auth.user()){history.replaceState(null,'','trgovina.html');setTimeout(()=>openModal(k),350)}});
$$('.tab').forEach(t=>t.onclick=()=>setMethod(t.dataset.m));
$('#close').onclick=$('#closeDone').onclick=closeModal;
ov.onclick=e=>{if(e.target===ov)closeModal()};
addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
$('#copyBtn').onclick=()=>navigator.clipboard.writeText(CONFIG.paypalEmail).then(()=>{const b=$('#copyBtn');b.textContent='Kopirano!';setTimeout(()=>b.textContent='Kopiraj',2000)});
$('#psCode').oninput=e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,16).replace(/(\d{4})(?=\d)/g,'$1 ')};

const cut=(t,n=1000)=>String(t).length>n?String(t).slice(0,n-1)+'…':String(t);
async function sendLog(d){
  const labels={paypal:'PayPal (Friends & Family)',paysafe:'Paysafe karta'};
  const colors={bronze:0xe0955a,silver:0xcfd8e3,gold:0xffd24a};
  const f=[{name:'Paket',value:d.pkg.name,inline:true},{name:'Znesek',value:`${d.pkg.price} ${d.pkg.period}`,inline:true},{name:'Način',value:labels[d.method],inline:true},
    {name:'Št. naročila',value:d.ref||'-',inline:true},{name:'Račun na strani',value:(d.account||'*neznan*'),inline:true},{name:'E-pošta',value:cut(d.email),inline:false},{name:'Discord',value:cut(d.discord||'*Ni navedeno*'),inline:true}];
  if(d.method==='paypal')f.push({name:'PayPal TX ID',value:cut(d.txId||'*Ni navedeno*'),inline:false});
  else f.push({name:'Paysafe koda',value:'`'+d.code.replace(/(\d{4})(?=\d)/g,'$1 ')+'`',inline:false});
  if(d.pkg.ped||d.pkg.mlo)f.push({name:d.pkg.mlo?'Lokacija / opombe':'Želeni ped',value:cut(d.pedText||'*Ni navedeno*'),inline:false});
  f.push({name:'Poslano',value:`<t:${Math.floor(Date.now()/1000)}:F>`,inline:false},{name:'Status',value:'⏳ V teku preverjanje',inline:true});
  const r=await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
    content:`<@${CONFIG.purchasePingUserId}> **Nova pošiljka nakupa** — preverite in aktivirajte ugodnosti.`,
    embeds:[{title:`${d.pkg.ped?'🧍':d.pkg.mlo?'🏠':'🛒'} ${d.pkg.name} — ${labels[d.method]}`,color:d.pkg.mlo?0x39dbff:d.pkg.ped?0xb58cff:(colors[d.key]||0x2b8cff),fields:f,footer:{text:'Sistem nakupov BlueCity Roleplay'},timestamp:new Date().toISOString()}],
    allowed_mentions:{users:[CONFIG.purchasePingUserId]}})});
  if(!r.ok)throw new Error('Webhook '+r.status)}

$('#submit').onclick=async()=>{
  const email=$('#email').value.trim(),code=$('#psCode').value.replace(/\s/g,''),pkg=ALL[cur];
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return toast('Vnesite veljaven e-poštni naslov.','err');
  if(method==='paysafe'&&!/^\d{16}$/.test(code))return toast('Vnesite veljavno 16-mestno kodo Paysafe.','err');
  if(!Auth.user())return buy(cur);
  const b=$('#submit');b.disabled=true;b.classList.add('busy');b.innerHTML='<span class="spin"></span>Pošiljam…';
  try{
    const ref='SP-'+Math.random().toString(36).slice(2,8).toUpperCase();
    await sendLog({ref,account:(Auth.user()||{}).username,key:cur,pkg,method,email,code,discord:$('#discord').value.trim(),txId:$('#txId').value.trim(),pedText:$('#pedText').value.trim()});
    Auth.addOrder({ref,key:cur,name:pkg.name,ped:!!pkg.ped,mlo:!!pkg.mlo,photo:pkg.photo||'',amount:pkg.priceNum??parseFloat(String(pkg.price).replace(/[^0-9.]/g,'')),price:pkg.price,period:pkg.period||'',method,txId:method==='paypal'?$('#txId').value.trim():'',pedText:$('#pedText').value.trim(),ts:Date.now(),status:'pending'});
    $('#doneMsg').textContent=`Naročilo ${ref}: hvala! Podatke za "${pkg.name}" smo prejeli in jih posredovali ekipi. Potrditev bo poslana na ${email}. Ugodnosti se aktivirajo po preverjanju (običajno v nekaj urah).`;
    $('#form').style.display='none';$('#done').style.display='block';
  }catch(err){console.error(err);toast('Pošiljanje ni uspelo. Poskusite znova ali kontaktirajte ekipo na Discordu.','err')}
  finally{b.disabled=false;b.classList.remove('busy');b.textContent='Pošlji plačilo'}
};

const pg=location.pathname.split('/').pop()||'index.html';
$$('.links a,.ml').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===pg));
