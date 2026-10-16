/* ============================================================
   UI: screens and events
   ============================================================ */
const $app=document.getElementById("app"),$panel=document.getElementById("panel"),$below=document.getElementById("below");
const STEPS=[["select","Choose a life"],["play","Live the day"],["settle","The 1st"],["futures","Futures"],["compare","Your plan"]];
function renderSteps(){const cur=S.screen==="profile"||S.screen==="dream"?"select":S.screen;document.getElementById("steps").innerHTML=STEPS.map(([k,l],i)=>`<li ${k===cur?'aria-current="step"':""}><b>${i+1}</b><span>${l}</span></li>`).join("");
  document.getElementById("quickBtn").setAttribute("aria-pressed",S.settings.quick);const sb=document.getElementById("soundBtn");sb.setAttribute("aria-pressed",S.settings.sound);sb.textContent=S.settings.sound?"Sound on":"Sound off";}
function layout(){const full=S.screen==="select"||S.screen==="play";$app.classList.toggle("full",full);renderSteps();
  document.getElementById("hudL").innerHTML="";document.getElementById("hudR").innerHTML="";document.getElementById("prompt").innerHTML="";PROMPT.html="";setHint("");
  document.getElementById("touch").hidden=!(S.screen==="play"&&document.getElementById("touch").dataset.coarse);
  document.getElementById("mini").hidden=true;document.documentElement.style.setProperty("--hdr",document.getElementById("bar").offsetHeight+"px");resize();}
function go(screen){closeDlg();clearOver();INPUT_LOCK=false;S.screen=screen;layout();({select:renderSelect,dream:renderDream,profile:renderProfile,settle:renderSettle,futures:renderFutures,compare:renderCompare,play:()=>goPlay(true)})[screen]();save();
  if(!$app.classList.contains("full")){const h=$panel.querySelector("h1,h2");if(h){h.setAttribute("tabindex","-1");h.focus({preventScroll:true});}window.scrollTo({top:0});}}
function showcase(P,av,min,center){setPlace(P);VIEWMIN=min;MODE=ViewMode;ViewMode.av=av||null;ViewMode.spin=false;ViewMode.target=center||V(P.spawn[0],0,P.spawn[1]);CAM.user=0;camFollow(ViewMode.target,1,P.camDist,P.pitch,true);}

/* ---------- Character select ---------- */
const STAT_MAX={pay:200000,hours:95,commute:110,entry:8200000};
function statRow(label,v,max,txt,log){const w=log?Math.min(100,Math.log10(Math.max(1,v))/Math.log10(max)*100):Math.min(100,v/max*100);return `<div class="statrow"><span class="muted">${label}</span><span class="statbar"><i style="width:${w}%"></i></span><span class="num">${txt}</span></div>`;}
function renderSelect(){const c=CH[S.sel];const wx=S.wx[c.id]||c.defaultWx;WX.kind=wx;WX.rain=wx==="monsoon"?.6:0;WX.target=WX.rain;
  const P=bPodium({},c);const av=makeAvatar(lookFor(c));P.add(av);showcase(P,av,wx==="haze"?16.8*60:wx==="monsoon"?11*60:10*60,V(0,.2,0));ViewMode.spin=true;CAM.yaw=0;
  const over=document.getElementById("over");
  over.innerHTML=`<div class="ov sel" style="position:absolute">
    <div class="roster" role="group" aria-label="Characters">${ALL().map(x=>{const L=lookFor(x);return `<button class="av" aria-pressed="${x.id===c.id}" data-act="pick" data-id="${x.id}"><span class="face" style="--s:${L.shirt};--k:${L.skin};--h:${L.helmet||L.cap||L.hair}" aria-hidden="true"><i class="h"></i><i class="k"></i><i class="b"></i></span><span><span class="n">${esc(x.name)}</span><br><span class="r">${esc(x.role)} · ${x.age}</span>${S.played[x.id]?' <span class="tag play" style="font-size:9px;padding:0 4px">played</span>':""}</span></button>`;}).join("")}</div>
    <div class="mid"><span class="card-g small"><b>All 12 lives are open.</b> Drag to turn the avatar. ← → to browse, Enter to play.</span></div>
    <div class="info"><div class="infocard">
      <div class="stack-s"><span class="eyebrow">${esc(c.role)}</span><h1>${esc(c.name)}, ${c.age}</h1><p class="small muted">${esc(c.pronouns)} · lives in ${esc(c.homeLabel)} · works: ${esc(c.workLabel)}</p><p>${esc(c.intro)}</p></div>
      <div class="stack-s">${statRow("Free each month",c.available,STAT_MAX.pay,fmt(c.available))}${statRow("Work week",c.hours.work+c.hours.commute,STAT_MAX.hours,(c.hours.work+c.hours.commute)+" h")}${statRow("Commute",c.commuteMin,STAT_MAX.commute,c.commuteMin?c.commuteMin+" min":"none")}${statRow("Cost to get here",c.entryCost.amt,STAT_MAX.entry,fmt(c.entryCost.amt),true)}
        <p class="tiny muted">${esc(c.income)} · ${esc(c.commuteText)}</p></div>
      <div class="stack-s"><span class="tiny muted" id="outfitLbl">Outfit</span><div class="swatches" role="group" aria-labelledby="outfitLbl">${c.outfits.map((o,i)=>`<button class="sw" style="background:${o}" aria-label="Outfit ${i+1}" aria-pressed="${(S.outfit[c.id]||c.outfits[0])===o}" data-act="outfit" data-v="${o}"></button>`).join("")}</div></div>
      <div class="stack-s"><span class="tiny muted" id="wxLbl">Weather for the day</span><div class="segs" role="group" aria-labelledby="wxLbl">${Object.entries(WXL).map(([k,l])=>`<button aria-pressed="${wx===k}" data-act="wx" data-v="${k}">${l}</button>`).join("")}</div></div>
      <div class="row"><button class="btn terra" data-act="live" data-id="${c.id}">Play ${esc(c.short)}'s day</button><button class="btn ghost" data-act="meet" data-id="${c.id}">Meet ${esc(c.short)}</button></div>
      ${S.day&&!S.day.done&&S.day.char?`<button class="link" data-act="resume">Resume ${esc(CH[S.day.char].short)}'s day in progress</button>`:""}
      <p class="tiny muted">Fictional composites. Every number is an illustrative assumption. <button class="link" data-act="dream">Build your dream lifestyle</button></p>
    </div></div></div>`;}

/* ---------- Dream ---------- */
function dreamControls(prefix){return Object.entries(DREAM_OPTS).map(([k,o])=>`<fieldset><legend>${o.label}</legend><div class="seg">${o.opts.map(([v,l])=>`<label><input type="radio" name="${prefix}-${k}" value="${v}" data-dream="${k}" ${S.dream[k]===v?"checked":""}><span>${l}</span></label>`).join("")}</div></fieldset>`).join("");}
function receiptHTML(){const b=dreamBudget(S.dream);const sec=(t,ls)=>ls.length?`<div class="rgroup"><h3>${t}</h3>${ls.map(l=>`<div class="line"><span class="l">${esc(l.label)}</span><span class="a">${fmt(l.amt)}</span><span class="n">${esc(l.note)}</span></div>`).join("")}</div>`:"";
  return `<div class="receipt"><div class="total"><span><span class="eyebrow">Your life costs</span><br><span class="muted small">take-home pay needed every month</span></span><b class="num">${fmt(b.monthly)}</b></div>
  <p class="small muted">${fmt(b.monthly*12)} a year after tax, plus <b class="num">${fmt(b.upfront)}</b> up front.</p>
  <div class="cols2">${sec("Every month",b.g.monthly)}<div>${sec("Put aside every month",b.g.fund)}${sec("Family",b.g.family)}${sec("Once, up front",b.g.upfront)}</div></div><p class="tiny muted" style="margin-top:10px">${BASIS}.</p></div>`;}
function dreamScene(){WX.kind="sunny";WX.rain=WX.target=0;showcase(bDream({},S.dream),null,15.5*60,V(8.5,0,6.5));}
function renderDream(){dreamScene();$panel.innerHTML=`<div class="stack"><div class="stack-s"><span class="eyebrow">Your dream</span><h1>How do you want to live?</h1><p class="lede">Pick the life you'd want at 25. The city and the bill change as you choose.</p></div><form class="stack" onsubmit="return false">${dreamControls("d")}</form><div class="row"><button class="btn terra" data-act="select">That's the life you want. Now step into someone else's.</button></div></div>`;$below.innerHTML=receiptHTML();}

/* ---------- Profile ---------- */
const TABS=[["today","Today"],["edu","Education"],["work","Work history"],["start","Starting point"],["money","Money today"],["moments","Turning points"]];
function moneyLines(lines){let run=0;return lines.map(l=>{if(l.sub)return `<div class="line sub"><span class="l">${esc(l.sub)}</span><span class="a">${fmt(run)}</span></div>`;run+=l.amt;return `<div class="line"><span class="l">${esc(l.label)}</span><span class="a ${l.amt<0?"neg":l.amt>0?"pos":""}">${fmtS(l.amt)}</span>${l.note?`<span class="n">${esc(l.note)}</span>`:""}</div>`;}).join("")+`<div class="line sub"><span class="l">Left at the end of the month</span><span class="a">${fmt(run)}</span></div>`;}
function renderProfile(){const c=CH[S.profileOf];const tab=S.profileTab;const p=c.profile;const m=p.moments;
  const key=tab==="moments"&&S.momentOpen!=null?m[S.momentOpen].place:(c.day[0].place||c.day[0].drive);WX.kind=S.wx[c.id]||c.defaultWx;WX.rain=WX.target=WX.kind==="monsoon"?.4:0;
  const P=buildPlace(key,{min:11*60,wx:WX.kind});const av=makeAvatar(lookFor(c));const sp=P.city?[P.anchors.home[0],P.anchors.home[1]]:[P.spawn[0],P.spawn[1]-(P.indoor?1.2:0)];av.position.set(sp[0],0,sp[1]);P.add(av);showcase(P,av,11*60,V(sp[0],0,sp[1]));
  let body="";
  if(tab==="today")body=`<dl class="facts">${p.today.map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`;
  if(tab==="edu")body=`<ol class="timeline">${p.education.map(e=>`<li><div class="tl"><span class="when">${e.when}</span><span class="what">${esc(e.what)}</span><span class="small">${esc(e.detail)}</span></div></li>`).join("")}</ol><hr><dl class="facts" style="margin-top:10px">${p.eduNotes.map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`;
  if(tab==="work")body=`<ol class="timeline">${p.work.map((w,i)=>`<li><button aria-expanded="${S.workOpen===i}" data-act="work" data-i="${i}"><span class="when">${w.when}</span><span class="what">${esc(w.what)}</span></button>${S.workOpen===i?`<div class="more">${w.pay?`<span><b>Pay:</b> ${esc(w.pay)}</span>`:""}${w.detail?`<span>${esc(w.detail)}</span>`:""}${w.skills?`<span class="muted small"><b>Picked up:</b> ${esc(w.skills)}</span>`:""}</div>`:""}</li>`).join("")}</ol>`;
  if(tab==="start")body=`<dl class="facts">${p.start.map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`;
  if(tab==="money"){const mo=c.month({});body=`<p class="small muted">${esc(mo.kind)}</p>${moneyLines(mo.lines)}<div class="rgroup"><h3>Still owed or missing</h3>${mo.owed.map(o=>`<div class="line"><span class="l">${esc(o.label)}</span><span class="a">${o.amt==null?"—":fmt(o.amt)}</span><span class="n">${esc(o.note)}</span></div>`).join("")}</div><p class="tiny muted">A typical month. ${BASIS}.</p>`;}
  if(tab==="moments")body=`<div class="stack-s">${m.map((x,i)=>`<div class="moment"><button aria-expanded="${S.momentOpen===i}" data-act="moment" data-i="${i}"><span class="yr">${x.yr}</span><b>${esc(x.title)}</b></button>${S.momentOpen===i?`<div class="inner"><p>${esc(x.happened)}</p><div><h4>Options on the table</h4><ul>${x.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ul></div>${x.outOfReach.length?`<div><h4>Out of reach</h4><ul>${x.outOfReach.map(o=>`<li>${esc(o)}</li>`).join("")}</ul></div>`:""}<div><h4>What ${esc(c.short)} chose</h4><p>${esc(x.chose)}</p></div><div><h4>What it depended on</h4><p>${esc(x.depended)}</p></div></div>`:""}</div>`).join("")}</div>`;
  $panel.innerHTML=`<div class="stack"><div class="stack-s"><span class="eyebrow">Meet them</span><h1>${esc(c.name)}, ${c.age}</h1><p class="muted small">${esc(c.pronouns)} · ${esc(c.role)} · ${esc(c.place)}</p></div>
  <div class="tabs" role="tablist" aria-label="Profile sections">${TABS.map(([k,l])=>`<button role="tab" id="tab-${k}" aria-selected="${tab===k}" aria-controls="tabpanel" tabindex="${tab===k?0:-1}" data-act="tab" data-tab="${k}">${l}</button>`).join("")}</div>
  <div role="tabpanel" id="tabpanel" aria-labelledby="tab-${tab}">${body}</div>
  <div class="row">${S.day&&S.day.char===c.id&&!S.day.done?`<button class="btn teal" data-act="resume">Back to the day</button>`:`<button class="btn teal" data-act="live" data-id="${c.id}">Play ${esc(c.short)}'s day</button>`}<button class="btn ghost" data-act="select">Everyone else</button></div></div>`;}

/* ---------- Settlement ---------- */
let settleTimer=null;
function stopSettle(){if(settleTimer){clearInterval(settleTimer);settleTimer=null;}if(S.settle)S.settle.playing=false;}
function buildSettle(){const c=CH[S.day.char];const mo=c.month(S.day.flags);let run=0;const steps=[];for(const l of mo.lines){if(l.sub){steps.push({sub:l.sub,total:run});continue;}run+=l.amt;steps.push(Object.assign({},l,{total:run}));}
  S.settle={char:c.id,steps,owed:mo.owed,kind:mo.kind,shown:0,playing:true};}
function cubePos(i){const per=25,l=Math.floor(i/per),r=i%per;return [.2+(r%5)*1.2,.15+l*1.1,.2+Math.floor(r/5)*1.2];}
function syncCubes(){const P=CUR;if(!P||!P.cubes)return;const st=S.settle;const tot=st.shown?st.steps[st.shown-1].total:0;const n=Math.min(150,Math.floor(Math.abs(tot)/1000));const neg=tot<0;if(P.neg!==neg){P.neg=neg;while(P.cubes.length){const m=P.cubes.pop();P.fly.push({m,v:0});}}
  while(P.cubes.length>n){const m=P.cubes.pop();P.fly.push({m,v:0});m.material=M(neg?"#2C6B66":"#B4553A");}
  while(P.cubes.length<n){const i=P.cubes.length;const m=new THREE.Mesh(G_MIN,M(neg?"#B4553A":"#2C6B66"));m.scale.set(1.05,1,1.05);const [x,y,z]=cubePos(i);m.position.set(x,y+(REDUCED?0:4),z);m.userData.y=y;m.castShadow=true;P.g.add(m);P.cubes.push(m);}}
function settleFrame(dt){const P=CUR;if(!P||!P.cubes)return;for(const m of P.cubes){if(m.position.y>m.userData.y)m.position.y=Math.max(m.userData.y,m.position.y-dt*14);}
  for(let i=P.fly.length-1;i>=0;i--){const f=P.fly[i];f.v+=dt*10;f.m.position.y+=f.v*dt;f.m.rotation.y+=dt*3;if(f.m.position.y>12||REDUCED){P.g.remove(f.m);P.fly.splice(i,1);}}}
function settleStep(dir){const st=S.settle;const p=st.shown;st.shown=Math.max(0,Math.min(st.steps.length,st.shown+dir));if(p===st.shown)return false;syncCubes();const l=st.steps[st.shown-1];if(l&&!l.sub)blip(l.amt<0?300:600,.07);return true;}
function playSettle(){stopSettle();S.settle.playing=true;settleTimer=setInterval(()=>{if(!settleStep(1))stopSettle();renderSettlePanel();},S.settings.quick?600:1100);renderSettlePanel();}
function renderSettle(){if(!S.settle)buildSettle();WX.kind="sunny";WX.rain=WX.target=0;showcase(bSettle({}),null,14*60,V(3,1,3));syncCubes();renderSettlePanel();if(S.settle.playing)playSettle();}
HOOK.frame2=settleFrame;
function renderSettlePanel(){const st=S.settle;const c=CH[st.char];const shown=st.steps.slice(0,st.shown);const done=st.shown>=st.steps.length;const tot=st.shown?shown[shown.length-1].total:0;let lastG=null;
  const rows=shown.map(s=>{if(s.sub)return `<div class="line sub"><span class="l">${esc(s.sub)}</span><span class="a">${fmt(s.total)}</span></div>`;let h="";if(s.g!==lastG){h=`<h3 style="margin-top:10px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink2)">${esc(s.g)}</h3>`;lastG=s.g;}return h+`<div class="line"><span class="l">${esc(s.label)}</span><span class="a ${s.amt<0?"neg":s.amt>0?"pos":""}">${fmtS(s.amt)}</span>${s.note?`<span class="n">${esc(s.note)}</span>`:""}</div>`;}).join("");
  $panel.innerHTML=`<div class="stack"><div class="stack-s"><span class="eyebrow">The 1st of the month · ${esc(c.name)}</span><h1>${st.shown===0?"Pay day.":done?"What's left, and what still needs paying?":"Watch it go."}</h1><p class="small muted">${esc(st.kind)} Each block is ₹1,000; red blocks are money short.</p></div>
  <div class="row"><button class="btn ghost sm" data-act="sPlay">${st.playing?"Pause":"Play"}</button><button class="btn ghost sm" data-act="sBack" ${st.shown===0?"disabled":""}>Step back</button><button class="btn ghost sm" data-act="sStep" ${done?"disabled":""}>Next line</button><button class="btn ghost sm" data-act="sAll">Show all</button><button class="btn ghost sm" data-act="sReplay">Replay</button></div>
  <div class="card-g"><b class="num" style="font-size:20px">${fmt(tot)}</b> <span class="small muted">${tot<0?"short this month":"in the account"}</span></div>
  <div aria-live="polite">${rows||`<p class="muted">The money is about to arrive.</p>`}</div>
  ${done?`<div class="card stack-s" style="background:${tot<0?"#F6E3DC":"var(--ivory)"}"><h3>Left at the end of the month: <span class="num">${fmt(tot)}</span></h3><p class="small">${tot<0?"This month doesn't close. Something gets delayed, borrowed or skipped.":tot<3000?"Enough to get through, not enough for one bad week.":"Some room. Here's what's still waiting:"}</p>${st.owed.map(o=>`<div class="line"><span class="l">${esc(o.label)}</span><span class="a">${o.amt==null?"—":fmt(o.amt)}</span><span class="n">${esc(o.note)}</span></div>`).join("")}</div>
  <div class="row"><button class="btn terra" data-act="toFutures">See possible futures</button><button class="btn ghost" data-act="select">Choose another life</button></div>`:""}
  <p class="tiny muted">Money spent during the day you played is already inside these monthly lines. ${BASIS}.</p></div>`;}

/* ---------- Futures ---------- */
function branchFor(c,f){return c.branches.find(b=>b.cond(f||{}));}
const val=(v,f)=>typeof v==="function"?v(f||{}):v;
function renderFutures(){const c=CH[S.cur];const f=(S.played[c.id]||{}).flags||{};const br=branchFor(c,f);const yr=S.futureYear;const y=br["y"+yr];
  WX.kind="sunny";WX.rain=WX.target=0;const P=buildPlace(y.place,{min:11*60,wx:"sunny"});const av=makeAvatar(lookFor(c,yr===15?{grey:true}:{}));const sp=P.city?P.anchors.home:[P.spawn[0],P.spawn[1]-(P.indoor?1.2:0)];av.position.set(sp[0],0,sp[1]);P.add(av);showcase(P,av,11*60,V(sp[0],0,sp[1]));
  const others=c.branches.filter(b=>b.id!==br.id);
  $panel.innerHTML=`<div class="stack"><div class="stack-s"><span class="eyebrow">A possible future · ${esc(br.title)} · fictional, not a prediction</span><h1>${esc(c.short)} at ${y.age}</h1><p><b>${esc(y.role)}</b></p></div>
  <div class="tabs" role="tablist" aria-label="Years ahead">${[5,15].map(n=>`<button role="tab" aria-selected="${yr===n}" tabindex="${yr===n?0:-1}" data-act="year" data-y="${n}">In ${n} years</button>`).join("")}</div>
  <div class="cols2"><div class="line"><span class="l">Free for life each month</span><span class="a">${fmt(y.available)}</span><span class="n">${esc(y.availableNote)}</span></div><div class="line"><span class="l">Work week</span><span class="a"></span><span class="n" style="font-size:14px;color:var(--ink)">${esc(y.hours)}</span></div></div>
  <dl class="facts"><dt>What changed</dt><dd>${esc(val(y.changed,f))}</dd><dt>What made it possible</dt><dd>${esc(val(y.enabled,f))}</dd><dt>What it cost</dt><dd>${esc(val(y.cost,f))}</dd><dt>Still uncertain</dt><dd>${esc(val(y.uncertain,f))}</dd></dl>
  <div class="card stack-s"><h3>Another way it could have gone</h3>${others.map(o=>`<p class="small"><b>${esc(o.title)}:</b> at ${o["y"+yr].age}, ${esc(o["y"+yr].role.toLowerCase())}. About ${fmt(o["y"+yr].available)} a month free for life.</p>`).join("")}
   <div class="row"><button class="btn ghost sm" data-act="replay" data-id="${c.pivot}" ${S.day&&S.day.char===c.id&&S.day.snaps&&S.day.snaps[c.pivot]?"":"disabled"}>Replay the decision that shaped this</button></div></div>
  <p class="tiny muted">In today's rupees. Effort doesn't guarantee an outcome; support and luck shaped every path here.</p>
  <div class="row"><button class="btn terra" data-act="toCompare">Back to your dream</button><button class="btn ghost" data-act="select">Live another day</button></div></div>`;}

/* ---------- Compare ---------- */
function compareRows(){const b=dreamBudget(S.dream);const rows=ALL().map(c=>{const pl=S.played[c.id];const f=pl?pl.flags:{};const br=branchFor(c,f);
  return {c,played:!!pl,br,pts:[{k:"Today",age:c.age,v:c.available},...(pl?[{k:"In 5 years",age:br.y5.age,v:br.y5.available},{k:"In 15 years",age:br.y15.age,v:br.y15.available}]:[])]};});return {b,rows};}
function renderCompare(){const {b,rows}=compareRows();dreamScene();const mx=Math.max(b.monthly,...rows.flatMap(r=>r.pts.map(p=>p.v)))*1.05;
  const sorted=rows.slice().sort((a,z)=>(z.played-a.played));
  const bar=p=>{const gap=p.v-b.monthly;return `<div class="rowc"><span class="small"><b>${p.k}</b>, age ${p.age}</span><div><div class="track" role="img" aria-label="${fmt(p.v)} against ${fmt(b.monthly)}"><div class="fill" style="width:${Math.min(100,p.v/mx*100)}%"></div><div class="dreamline" style="left:calc(${b.monthly/mx*100}% - 1px)"></div></div><span class="tiny ${gap<0?"neg":"pos"}"><b class="num">${fmt(p.v)}</b> free · ${gap<0?`<b class="num">${fmt(-gap)}</b> short`:`<b class="num">${fmt(gap)}</b> to spare`}</span></div></div>`;};
  $panel.innerHTML=`<div class="stack"><div class="stack-s"><span class="eyebrow">Return to your dream</span><h1>Your life costs ${fmt(b.monthly)} a month.</h1><p class="lede">The bar is what each person has free each month; the terracotta line is your dream. Lives you've played show their futures too.</p></div>
  <div class="legend"><span><i style="background:var(--teal)"></i>Free each month</span><span><i style="background:var(--terra)"></i>Your dream</span></div>
  ${sorted.map(r=>`<div class="card stack-s"><div class="row" style="justify-content:space-between"><h3>${esc(r.c.name)} · ${esc(r.c.role)}</h3>${r.played?`<span class="tag play">${esc(r.br.title)}</span>`:`<button class="link" data-act="live" data-id="${r.c.id}">Play this day</button>`}</div><div class="cmp">${r.pts.map(bar).join("")}</div>
   <div class="tiny muted">${esc(r.c.hours.label)}. Cost of getting here: <b class="num">${fmt(r.c.entryCost.amt)}</b>. ${esc(r.c.entryCost.note)}</div></div>`).join("")}
  <details class="card"><summary><b>Change your dream</b></summary><form class="stack" style="margin-top:12px" onsubmit="return false">${dreamControls("c")}</form></details>
  <div class="stack-s"><h2>What matters enough to you to plan for it?</h2><p class="small muted">Copy this into your notes. It isn't financial advice or a career recommendation.</p><textarea class="reflect" id="reflect" readonly aria-label="Your reflection">${esc(reflection())}</textarea><div class="row"><button class="btn teal" data-act="copy">Copy reflection</button><span class="tiny muted" id="copied" role="status"></span></div></div></div>`;}
function reflection(){const {b,rows}=compareRows();const d=S.dream;const L=["HOWTOLIFE · MY REFLECTION","","The life I said I wanted:"];
  for(const [k,o] of Object.entries(DREAM_OPTS))L.push("  "+o.label+": "+o.opts.find(x=>x[0]===d[k])[1]);L.push("  Monthly cost: "+fmt(b.monthly),"  Up front: "+fmt(b.upfront),"","Lives I played:");
  rows.filter(r=>r.played).forEach(r=>{L.push("  "+r.c.name+" ("+r.c.role+") · path: "+r.br.title);r.pts.forEach(p=>L.push("    "+p.k+", age "+p.age+": "+fmt(p.v)+" free ("+(p.v>=b.monthly?"covers it":"short by "+fmt(b.monthly-p.v))+")"));});
  if(!rows.some(r=>r.played))L.push("  None yet.");
  L.push("","Questions I want to research:","  1. What do people in the careers I like actually earn in their first three years? Who can I ask?","  2. What would getting there cost: fees, exams, coaching, time without income?","  3. Which part of my dream matters most, and which could wait?","  4. Who could support me, and what would I ask them for?","","All figures are illustrative assumptions from a game with fictional characters. Check real numbers with people in those jobs and official sources.");return L.join("\n");}

/* ---------- Numbers ---------- */
function renderNumbers(){const b=dreamBudget(S.dream);const tbl=(t,ls)=>`<h3>${esc(t)}</h3><div class="tw"><table><thead><tr><th>Item</th><th>Amount</th><th>Status</th></tr></thead><tbody>${ls.map(l=>`<tr><td>${esc(l.label)}${l.note?`<br><span class="tiny muted">${esc(l.note)}</span>`:""}</td><td class="a">${fmtS(l.amt)}</td><td class="tiny">Illustrative</td></tr>`).join("")}</tbody></table></div>`;
  const fares=[];ALL().forEach(c=>Object.values(c.routes||{}).forEach(R=>R.options.forEach(o=>o.legs.forEach(l=>{if(l.fare)fares.push({label:`${c.short}: ${MODE_NAME[l.m]} ${l.from} → ${l.to}, ${l.min} min`,amt:-l.fare,note:""});}))));
  document.getElementById("numbersBody").innerHTML=`<div class="row" style="justify-content:space-between"><h2 id="numTitle">How these numbers work</h2><button class="btn ghost sm" data-act="closeNum">Close</button></div>
  <p>Every amount is an <b>illustrative assumption</b> in 2026 rupees, chosen to be plausible for Mumbai. None has been independently verified. They live in one dataset at the top of the page's code.</p>
  <ul class="small"><li><b>Gross</b> is pay before deductions; <b>take-home</b> is what reaches the bank.</li><li>Salaried lives go gross → deductions → take-home → spending. Self-employed lives go earnings → job costs → spending.</li><li>Fares and journey times change with rain and rush hour. The commute you choose sets that month's travel line.</li><li>Money spent while playing is already inside the monthly lines; nothing is counted twice.</li><li>Futures are fictional and in today's rupees.</li></ul>
  ${tbl("Your dream",[...b.g.monthly,...b.g.fund,...b.g.family,...b.g.upfront])}${ALL().map(c=>tbl(c.name+": a typical month",c.month({}).lines.filter(l=>!l.sub))).join("")}${tbl("Journey fares (one way)",fares)}`;}

/* ---------- Events ---------- */
document.addEventListener("click",e=>{const a=e.target.closest("[data-act],[data-route]");if(!a)return;
  if(a.dataset.route!=null&&PLAN){PLAN.pick(+a.dataset.route);return;}
  const act=a.dataset.act;switch(act){
    case "select":go("select");break;case "dream":go("dream");break;
    case "pick":S.sel=a.dataset.id;renderSelect();save();setTimeout(()=>{const b=document.querySelector(`.av[data-id="${S.sel}"]`);b&&b.focus({preventScroll:true});},0);break;
    case "outfit":S.outfit[S.sel]=a.dataset.v;renderSelect();break;
    case "wx":S.wx[S.sel]=a.dataset.v;renderSelect();break;
    case "live":stopSettle();S.settle=null;startDay(a.dataset.id);break;
    case "resume":if(S.day&&!S.day.done){S.screen="play";layout();WX.kind=S.day.wx;runStep(true);}break;
    case "meet":closeDlg();S.profileOf=a.dataset.id;S.profileTab="today";S.momentOpen=null;S.workOpen=null;go("profile");break;
    case "tab":S.profileTab=a.dataset.tab;S.momentOpen=null;renderProfile();document.getElementById("tab-"+S.profileTab)?.focus();break;
    case "work":S.workOpen=S.workOpen===+a.dataset.i?null:+a.dataset.i;renderProfile();break;
    case "moment":S.momentOpen=S.momentOpen===+a.dataset.i?null:+a.dataset.i;renderProfile();break;
    case "interact":if(PROMPT.mk&&HOOK.interact&&MODE!==DriveMode)HOOK.interact(PROMPT.mk);break;
    case "routePlay":if(PLAN)finishTravel(PLAN.sel(),PLAN.st,false);break;
    case "routeSkip":if(PLAN)finishTravel(PLAN.sel(),PLAN.st,true);break;
    case "skipLeg":case "skipRide":SKIPLEG&&SKIPLEG();break;
    case "pause":openPause();break;
    case "replay":clearOver();replayFrom(a.dataset.id);break;
    case "toSettle":S.settle=null;go("settle");break;
    case "sPlay":if(S.settle.playing){stopSettle();renderSettlePanel();}else{if(S.settle.shown>=S.settle.steps.length){S.settle.shown=0;syncCubes();}playSettle();}break;
    case "sStep":stopSettle();settleStep(1);renderSettlePanel();break;
    case "sBack":stopSettle();settleStep(-1);renderSettlePanel();break;
    case "sAll":stopSettle();while(settleStep(1));renderSettlePanel();break;
    case "sReplay":S.settle.shown=0;syncCubes();playSettle();break;
    case "toFutures":stopSettle();S.futureYear=5;go("futures");break;
    case "year":S.futureYear=+a.dataset.y;renderFutures();break;
    case "toCompare":go("compare");break;
    case "copy":{const ta=document.getElementById("reflect");const sel=()=>{ta.select();document.getElementById("copied").textContent="Selected. Press Ctrl/Cmd+C to copy.";};try{navigator.clipboard.writeText(ta.value).then(()=>{document.getElementById("copied").textContent="Copied.";},sel);}catch(err){sel();}break;}
    case "numbers":renderNumbers();document.getElementById("numbers").showModal();break;
    case "closeNum":document.getElementById("numbers").close();break;
    case "quick":S.settings.quick=!S.settings.quick;renderSteps();save();toast(S.settings.quick?"3-min mode: journeys are skipped automatically":"Journeys are playable again");break;
    case "sound":S.settings.sound=!S.settings.sound;renderSteps();save();blip(660);break;
    case "restart":if(a.dataset.confirm==="1"){const st=S.settings;S=DEF();S.settings=st;save();go("select");}else{a.dataset.confirm="1";a.textContent="Tap again to erase progress";setTimeout(()=>{a.dataset.confirm="";a.textContent="Start over";},3500);}break;
  }});
document.addEventListener("change",e=>{const i=e.target;if(!i.dataset||!i.dataset.dream)return;S.dream[i.dataset.dream]=i.value;save();
  if(S.screen==="dream"){$below.innerHTML=receiptHTML();dreamScene();}
  if(S.screen==="compare"){const y=window.scrollY;renderCompare();const det=$panel.querySelector("details");if(det)det.open=true;const el=$panel.querySelector(`input[name="${i.name}"][value="${i.value}"]`);el&&el.focus({preventScroll:true});window.scrollTo(0,y);}});
document.addEventListener("keydown",e=>{
  if(S.screen==="select"&&!e.target.closest("input,textarea")){const i=ORDER.indexOf(S.sel);
    if(e.key==="ArrowRight"||e.key==="ArrowDown"&&e.target.closest(".roster")){S.sel=ORDER[(i+1)%12];renderSelect();e.preventDefault();setTimeout(()=>document.querySelector(`.av[data-id="${S.sel}"]`)?.focus({preventScroll:true}),0);}
    else if(e.key==="ArrowLeft"||e.key==="ArrowUp"&&e.target.closest(".roster")){S.sel=ORDER[(i+11)%12];renderSelect();e.preventDefault();setTimeout(()=>document.querySelector(`.av[data-id="${S.sel}"]`)?.focus({preventScroll:true}),0);}
    else if(e.key==="Enter"&&!e.target.closest("button")){startDay(S.sel);}}
  if(e.target.getAttribute&&e.target.getAttribute("role")==="tab"&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){const tabs=[...e.target.parentElement.querySelectorAll("[role=tab]")];const i=tabs.indexOf(e.target);tabs[(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length].click();e.preventDefault();}
  if(S.screen==="play"&&e.code==="Space"&&SKIPLEG&&MODE===RideMode){e.preventDefault();}});
const _hf=HOOK.frame;HOOK.frame=(dt,t)=>{_hf&&_hf(dt,t);if(S.screen==="settle")settleFrame(dt);};

/* Boot */
(function boot(){if(S.screen==="play"&&!(S.day&&!S.day.done))S.screen="select";if(["settle","futures"].includes(S.screen)&&!S.cur)S.screen="select";if(S.screen==="settle"&&!S.day)S.screen="select";if(S.screen==="profile"&&!S.profileOf)S.screen="select";
  if(S.screen==="play"){S.screen="play";layout();WX.kind=S.day.wx;runStep(true);}else go(S.screen);})();
