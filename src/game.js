/* ============================================================
   GAME: state, day runner, dialogs, travel, driving
   ============================================================ */
const KEY="howtolife.v2";
const WXL={sunny:"Sunny",monsoon:"Monsoon",haze:"Winter haze"};
const DEF=()=>({screen:"select",sel:"rohit",outfit:{},wx:{},dream:{hood:"andheri",arrange:"flatmates",transport:"train",eat:"weekly",leisure:"mid",travel:"domestic",family:"5000",save:"5000"},played:{},day:null,profileOf:null,profileTab:"today",momentOpen:null,workOpen:null,settle:null,futureYear:5,cur:null,settings:{sound:false,quick:false},seenHelp:false});
let S=DEF();
try{const raw=localStorage.getItem(KEY);if(raw){const p=JSON.parse(raw);if(p&&p.dream)S=Object.assign(DEF(),p);}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
const fmt=n=>(n<0?"−":"")+"₹"+Math.abs(Math.round(n)).toLocaleString("en-IN");
const fmtS=n=>(n>0?"+":n<0?"−":"")+"₹"+Math.abs(Math.round(n)).toLocaleString("en-IN");
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
const clamp=v=>Math.max(0,Math.min(100,v));
const clone=o=>JSON.parse(JSON.stringify(o));
const toMin=s=>{const [h,m]=s.split(":").map(Number);return h*60+m;};
const hhmm=m=>{m=Math.round(m);const h=Math.floor(((m/60)%24+24)%24),mm=((m%60)+60)%60;return String(h).padStart(2,"0")+":"+String(mm).padStart(2,"0");};
function advanceTo(t){const d=S.day;let target=toMin(t);while(target<d.min-90)target+=1440;if(target>d.min)d.min=target;}
const CC=()=>CH[S.day.char];
function lookFor(c,o){const L=Object.assign({},c.look);const sh=S.outfit[c.id];if(sh)L.shirt=sh;return Object.assign(L,o||{});}
function ctxNow(){return {min:S.day?S.day.min:720,wx:S.day?S.day.wx:"sunny"};}

/* Toasts */
function toast(msg,ms){const el=document.getElementById("toast");const d=document.createElement("div");d.textContent=msg;el.appendChild(d);setTimeout(()=>d.remove(),ms||3200);while(el.children.length>3)el.firstChild.remove();}

/* Dialog */
const $dlg=document.getElementById("dlg");let DLG=null;
function openDlg(o){DLG=o;INPUT_LOCK=true;$dlg.hidden=false;setPrompt(null);
  $dlg.innerHTML=`${o.who?`<span class="who">${esc(o.who)}</span>`:""}${o.title?`<h2>${esc(o.title)}</h2>`:""}${o.text?`<p>${esc(o.text)}</p>`:""}${o.html||""}
  ${o.choices?`<div class="choices" role="group" aria-label="Your choice">${o.choices.map((c,i)=>`<button class="choice" data-dlg="${i}"><span class="k" aria-hidden="true">${i+1}</span><b>${esc(c.label)}</b><small>${esc(c.detail||"")}</small></button>`).join("")}</div><p class="tiny muted">Keys 1–${o.choices.length}</p>`:""}
  ${o.btn?`<div class="row"><button class="btn terra" data-dlg="ok">${esc(o.btn)}</button>${o.btn2?`<button class="btn ghost" data-dlg="ok2">${esc(o.btn2)}</button>`:""}</div>`:""}`;
  const f=$dlg.querySelector("button");if(f)f.focus({preventScroll:true});}
function closeDlg(){DLG=null;$dlg.hidden=true;$dlg.innerHTML="";INPUT_LOCK=false;cv.focus({preventScroll:true});}
$dlg.addEventListener("click",e=>{const b=e.target.closest("[data-dlg]");if(!b||!DLG)return;const v=b.dataset.dlg;const o=DLG;
  if(v==="ok"){closeDlg();o.onOk&&o.onOk();}else if(v==="ok2"){closeDlg();o.onOk2&&o.onOk2();}else{closeDlg();o.onChoose&&o.onChoose(+v);}});
addEventListener("keydown",e=>{if(!DLG)return;if(/^[1-4]$/.test(e.key)&&DLG.choices&&DLG.choices[+e.key-1]){e.preventDefault();const o=DLG;closeDlg();o.onChoose(+e.key-1);}
  else if((e.key==="Enter")&&DLG.btn&&!e.target.closest("button")){e.preventDefault();const o=DLG;closeDlg();o.onOk&&o.onOk();}});

/* HUD */
function meter(v){const on=Math.round(v/10);let h=`<span class="meter${v<30?" low":""}" aria-hidden="true">`;for(let i=0;i<10;i++)h+=`<i class="${i<on?"on":""}"></i>`;return h+"</span>";}
let HUDSTATE={place:"",objs:[]};
function hud(){const d=S.day;if(!d||S.screen!=="play")return;const c=CC();
  const L=document.getElementById("hudL"),R=document.getElementById("hudR");
  const objs=HUDSTATE.objs.map(o=>`<li class="${o.done?"done":""} ${o.exit?"exit":""}">${esc(o.t)}</li>`).join("");
  L.innerHTML=`<div class="card-g clock"><div class="t num">${hhmm(d.min)}</div><div class="p">${esc(HUDSTATE.place)} · ${WXL[d.wx]}</div></div>${objs?`<div class="card-g"><ul class="objs">${objs}</ul></div>`:""}`;
  R.innerHTML=`<div class="card-g"><dl class="stats">${c.payMode==="salary"?`<dt>Day's pay</dt><dd>${fmt(c.dayPay)}</dd>`:`<dt>Earned today</dt><dd>${fmt(d.earned)}</dd>`}<dt>Spent today</dt><dd>${fmt(d.spent)}</dd><dt>Energy</dt><dd>${meter(d.energy)}${d.energy}</dd>${d.wait?`<dt>Unpaid waiting</dt><dd>${d.wait} min</dd>`:""}</dl>
   <div class="commits" style="margin-top:6px;flex-direction:column;align-items:flex-end">${Object.values(d.commits).map(k=>`<span class="commit ${k.status}">${k.status==="kept"?"✓ ":k.status==="missed"?"✗ ":"○ "}${esc(k.label)}</span>`).join("")}</div>
   <div class="row" style="justify-content:flex-end;margin-top:6px"><button class="btn ghost sm" data-act="pause">Menu · Esc</button></div></div>`;}
let lastHudMin=-1;HOOK.frame=()=>{if(S.screen==="play"&&S.day&&Math.floor(S.day.min)!==lastHudMin){lastHudMin=Math.floor(S.day.min);hud();}};
HOOK.clock=()=>S.screen==="play"&&S.day?S.day.min:(VIEWMIN||720);
let VIEWMIN=720;
HOOK.tick=dt=>{if(S.day)S.day.min+=dt/3;};
HOOK.speedMul=()=>S.day&&S.day.energy<30?.8:1;
function setHint(t){document.getElementById("hint").innerHTML=t?`<span>${t}</span>`:"";}

/* ---------- Day runner ---------- */
function startDay(id){const c=CH[id];S.cur=id;
  S.day={char:id,step:0,sub:0,min:toMin(c.day[0].time),earned:0,spent:0,energy:c.startEnergy,wait:0,worked:0,flags:{},commits:clone(c.commits),log:[],snaps:{},goals:null,dropIdx:0,wx:S.wx[id]||c.defaultWx,seq:0,done:false};
  goPlay();}
function goPlay(resume){S.screen="play";layout();WX.kind=S.day.wx;WX.rain=WX.kind==="monsoon"?.4:0;runStep(resume);
  if(!S.seenHelp){S.seenHelp=true;setTimeout(()=>toast("W A S D or arrow keys to move · Shift to run · E to interact · drag to look around",6000),400);}}
function runStep(resume){const d=S.day,c=CC();const st=c.day[d.step];closeDlg();clearOver();
  if(!st){endDay();return;}if(st.time&&!resume)advanceTo(st.time);setWeatherFor(d.min);save();
  if(st.place)enterPlaceStep(st,resume);else if(st.travel)openPlanner(st);else if(st.drive)enterDrive(st,resume);}
function nextStep(){const d=S.day;d.step++;d.sub=0;d.goals=null;runStep();}
function anchorOf(P,k){return P.anchors[k]||P.anchors.door||[P.spawn[0],P.spawn[1]];}

/* Places */
function enterPlaceStep(st,resume){const d=S.day,c=CC();const P=buildPlace(st.place,ctxNow());setPlace(P);
  placePlayer(lookFor(c),P.spawn[0],P.spawn[1],P.spawn[2]);CAM.yaw=Math.PI/4;CAM.user=0;MODE=WalkMode;camFollow(V(PS.x,0,PS.z),1,P.camDist,P.pitch,true);
  HUDSTATE.place=(c.scenes.find(s=>s.id===(st.beats[0]||[])[0])||{}).place||st.place;
  const beats=st.beats||[];
  beats.forEach((b,i)=>{const [x,z]=anchorOf(P,b[1]);addMarker(P,"beat",x,z,{label:b[2],id:"b"+i,data:{i,beat:b[0],who:b[2]},on:i===d.sub});});
  (st.talks||[]).forEach(t=>{const [x,z]=anchorOf(P,t[0]);addMarker(P,"talk",x,z,{label:t[1],data:{text:t[2],who:t[1]}});});
  if(st.exit){const [x,z]=anchorOf(P,P.anchors.exit?"exit":"door");addMarker(P,"exit",x,z,{label:st.exit,id:"exit",on:d.sub>=beats.length});}
  updObjs(st);setHint("WASD move · Shift run · E interact · drag to look · Esc menu");
  HOOK.interact=mk=>{if(mk.kind==="talk"){openDlg({who:mk.data.who,text:mk.data.text,btn:"OK"});blip(660,.05);}
    else if(mk.kind==="beat"){runBeat(mk.data.beat,mk.data.who,r=>{d.sub++;d.min+=8;mk.on=false;mk.g.visible=false;
        const nxt=P.marks.find(m=>m.id==="b"+d.sub);if(nxt){nxt.on=true;nxt.g.visible=true;}
        if(d.sub>=beats.length){const ex=P.marks.find(m=>m.id==="exit");if(ex){ex.on=true;ex.g.visible=true;}else{openDlg({who:"End of the day",title:`${hhmm(d.min)} · ${c.short} is done`,text:"That's the day. The money comes later.",btn:"See the day",onOk:()=>nextStep()});}}
        updObjs(st);save();});}
    else if(mk.kind==="exit"){blip(440);nextStep();}};
  hud();}
function updObjs(st){const d=S.day;const beats=st.beats||[];HUDSTATE.objs=beats.map((b,i)=>({t:b[2],done:i<d.sub}));if(st.exit)HUDSTATE.objs.push({t:st.exit,exit:true});hud();}

/* Beats */
function runBeat(id,who,done){const d=S.day,c=CC();const sc=c.scenes.find(s=>s.id===id);if(!sc){done({});return;}
  const snapD=clone(Object.assign({},d,{snaps:{}}));d.snaps[id]={d:snapD,seq:d.seq++};
  if(sc.time)advanceTo(sc.time);hud();
  openDlg({who:who||"",title:`${sc.time} · ${sc.place}`,text:sc.text(d),choices:sc.choices,onChoose:k=>{const r=applyChoice(sc,k);
    const ds=[];if(r.earn)ds.push(`Earned ${fmtS(r.earn)}`);if(r.spend)ds.push(`Spent ${fmt(r.spend)}`);if(r.energy)ds.push(`Energy ${r.energy>0?"+":"−"}${Math.abs(r.energy)}`);if(r.wait)ds.push(`${r.wait} min unpaid waiting`);if(r.minutes)ds.push(`+${r.minutes} min`);
    blip(520);openDlg({who:"You chose",title:r.label,text:r.text,html:`${r.tired?`<p class="small" style="color:var(--warn)">You're tired: those orders paid about a quarter less.</p>`:""}${ds.length?`<div class="deltas">${ds.map(x=>`<span class="delta">${x}</span>`).join("")}</div>`:""}`,btn:"Continue",onOk:()=>{hud();done(r);}});}});}
function applyChoice(sc,k){const d=S.day;const ch=sc.choices[k];const e=ch.fx(d)||{};const tired=d.energy<30&&(e.earn||0)>0;const earn=Math.round((e.earn||0)*(tired?.75:1));
  d.earned+=earn;d.spent+=e.spend||0;d.energy=clamp(d.energy+(e.energy||0));d.wait+=e.wait||0;d.worked+=e.worked||0;if(e.minutes)d.min+=e.minutes;Object.assign(d.flags,e.flags||{});
  if(e.commit&&d.commits[e.commit[0]])d.commits[e.commit[0]].status=e.commit[1];
  d.log.push({id:sc.id,time:sc.time,label:ch.label});const r={label:ch.label,text:e.text,earn,spend:e.spend||0,energy:e.energy||0,wait:e.wait||0,minutes:e.minutes||0,tired,addGoals:e.addGoals};return r;}

/* Replay */
function replayFrom(id){const d=S.day;const sn=d.snaps[id];if(!sn)return;const keep={};for(const [k,v] of Object.entries(d.snaps))if(v.seq<sn.seq)keep[k]=v;
  S.day=Object.assign(clone(sn.d),{snaps:keep,seq:sn.seq,done:false});if(S.day.goals&&S.day.goals[S.day.sub])S.day.goals[S.day.sub]._started=false;
  S.screen="play";layout();WX.kind=S.day.wx;toast("Replaying from "+hhmm(S.day.min));runStep(true);}

/* ---------- Travel ---------- */
const MODE_NAME={walk:"Walk",shareauto:"Shared auto",auto:"Auto",cab:"App cab",taxi:"Taxi",crewcab:"Crew cab",van:"Production van",bus:"BEST bus",train:"Local train",actrain:"AC local",metro:"Metro",scooter:"Scooter"};
const ROAD=["shareauto","auto","cab","taxi","crewcab","van","scooter"];
function rushAt(m){const h=((m/60)%24+24)%24;return (h>=7.5&&h<10.5)||(h>=17.5&&h<20.5);}
function nightAt(m){const h=((m/60)%24+24)%24;return h>=22.5||h<5.5;}
function computeRoute(opt,start,st){const d=S.day;const rain=d.wx==="monsoon";let t=start,fare=0;
  const legs=opt.legs.map(l=>{const rush=rushAt(t);let f=1;if(ROAD.includes(l.m)||l.m==="bus")f*=(rain?1.35:1)*(rush?1.25:1);if(l.m==="walk")f*=rain?1.15:1;if(l.m==="train"||l.m==="actrain")f*=rain?1.08:1;
    const wait=(l.wait||0)+((l.m==="train"&&rain)?3:0);const min=Math.round(l.min*f);
    let crowd=null;if(l.m==="train")crowd=nightAt(t)?"night":rush?"crush":"busy";if(l.m==="actrain"||l.m==="metro")crowd=nightAt(t)?"night":rush?"busy":"seats";if(l.m==="bus")crowd=rush?"busy":"seats";
    let lf=l.fare;if(opt.reimbursedAfter){const hm=((t%1440)+1440)%1440;if(hm>=toMin(opt.reimbursedAfter)||hm<300)lf=0;}
    const o=Object.assign({},l,{minAdj:min,waitAdj:wait,crowd,fareAdj:lf,start:t});t+=min+wait;fare+=lf;return o;});
  let late=0;if(st&&st.deadline){let dl=toMin(st.deadline);while(dl<start-120)dl+=1440;late=Math.round(t-dl);}
  return {opt,legs,total:Math.round(t-start),fare,arrive:t,late};}
const CROWD={crush:"Crush load",busy:"Busy",seats:"Seats likely",night:"Nearly empty"};
function openPlanner(st){const d=S.day,c=CC();const R=c.routes[st.travel];
  if(st.leaveFlag&&d.flags[st.leaveFlag]&&st.lateLeave)advanceTo(st.lateLeave);else if(st.time)advanceTo(st.time);
  const P=bStreet(ctxNow(),{len:50,seed:c.id.length*7+d.step});setPlace(P);placePlayer(lookFor(c),18,3.2,Math.PI/2);MODE=ViewMode;ViewMode.target=V(18,0,3.2);ViewMode.av=PLAYER;ViewMode.spin=false;CAM.yaw=Math.PI/4;
  HUDSTATE.place="Leaving";HUDSTATE.objs=[{t:"Choose how to get to "+R.to}];hud();setHint("");
  const opts=R.options.map(o=>computeRoute(o,d.min,st));
  if(S.settings.quick){finishTravel(opts[0],st,true);return;}
  let selI=0;const draw=()=>{const over=document.getElementById("over");
    over.innerHTML=`<div class="ov modal" style="position:absolute;pointer-events:auto"><div class="sheet" role="dialog" aria-label="Plan the journey">
     <div class="stack-s"><span class="eyebrow">${hhmm(d.min)} · ${WXL[d.wx]}${rushAt(d.min)?" · rush hour":""}${nightAt(d.min)?" · late night":""}</span><h2>Getting to ${esc(R.to)}</h2>
     ${st.deadline?`<p class="small muted">${c.short} needs to be there by <b class="num">${st.deadline}</b>. Times change with rain and rush hour.</p>`:`<p class="small muted">Times change with rain and rush hour.</p>`}</div>
     <div class="routes">${opts.map((r,i)=>`<button class="route" aria-pressed="${i===selI}" data-route="${i}">
       <span class="big"><span><b>${r.total}</b> min</span><span class="num">${fmt(r.fare)}</span></span>
       <span><b>${esc(r.opt.label)}</b></span>
       <ul class="legs">${r.legs.map(l=>`<li><span class="mode">${MODE_NAME[l.m]}</span><span>${esc(l.from)} → ${esc(l.to)}${l.crowd?` · <i>${CROWD[l.crowd]}</i>`:""}</span><span class="num">${l.minAdj+l.waitAdj}m</span></li>`).join("")}</ul>
       <span class="small">Arrive <b class="num">${hhmm(r.arrive)}</b> ${st.deadline?(r.late>0?`<span class="late">${r.late} min late</span>`:`<span class="ontime">on time</span>`):""}</span>
       <span class="tiny muted">${r.opt.monthly!=null&&st.travel!=="home"?`Every working day: about ${fmt(r.opt.monthly)} a month`:""}${r.opt.note?` · ${esc(r.opt.note)}`:""}</span></button>`).join("")}</div>
     <div class="row"><button class="btn terra" data-act="routePlay">Play the journey</button><button class="btn ghost" data-act="routeSkip">Skip the journey</button></div>
     <p class="tiny muted">Fares and times are illustrative assumptions. Playing shows the trip; skipping applies the same time and fare.</p></div></div>`;
    over.querySelector(`[data-route="${selI}"]`).focus({preventScroll:true});};
  draw();INPUT_LOCK=true;
  PLAN={opts,st,pick:i=>{selI=i;draw();},sel:()=>opts[selI]};}
let PLAN=null;
function clearOver(){document.getElementById("over").innerHTML="";PLAN=null;}
function finishTravel(r,st,skip){const d=S.day,c=CC();clearOver();INPUT_LOCK=false;
  if(st.travel!=="home")d.flags.commute={label:r.opt.label,monthly:r.opt.monthly||0};Object.assign(d.flags,r.opt.flags||{});
  if(skip){d.min=r.arrive;d.spent+=r.fare;d.log.push({time:hhmm(d.min),label:`${r.opt.label}: ${r.total} min, ${fmt(r.fare)}`});arrive(st,r);return;}
  let i=0;const next=()=>{if(i>=r.legs.length){arrive(st,r);return;}const l=r.legs[i++];playLeg(l,i,r.legs.length,next);};next();}
function arrive(st,r){const d=S.day;if(st.deadline){let dl=toMin(st.deadline);while(dl<d.min-600)dl+=1440;const late=Math.round(d.min-dl);
    if(late>0){d.flags.late=Math.max(d.flags.late||0,late);d.log.push({time:hhmm(d.min),label:`Arrived ${late} min late`});toast(`Late by ${late} minutes`);}else toast("On time");}
  nextStep();}
function legDone(l,start,cb){const d=S.day;d.min=start+l.minAdj+l.waitAdj;d.spent+=l.fareAdj;cb();}
function playLeg(l,i,n,cb){const d=S.day,c=CC();const start=d.min;toast(`${i}/${n} · ${MODE_NAME[l.m]}: ${l.from} → ${l.to}`);
  const skipBtn=lbl=>{document.getElementById("over").innerHTML=`<div class="ov" style="right:10px;bottom:${document.getElementById("mini").hidden?10:170}px;pointer-events:auto"><button class="btn ghost sm" data-act="skipLeg">${lbl}</button></div>`;};
  SKIPLEG=()=>{clearOver();MODE=ViewMode;legDone(l,start,cb);};
  if(l.m==="walk"){const P=bStreet(ctxNow(),{len:Math.max(30,Math.min(64,l.min*4)),seed:i*31+c.id.length,destSign:l.to});setPlace(P);placePlayer(lookFor(c),P.spawn[0],P.spawn[1],P.spawn[2]);CAM.yaw=Math.PI/4;MODE=WalkMode;camFollow(V(PS.x,0,PS.z),1,P.camDist,P.pitch,true);
    const [x,z]=P.anchors.dest;const mk=addMarker(P,"exit",x,z,{label:l.to});mk.auto=true;HUDSTATE.place="Walking";HUDSTATE.objs=[{t:"Walk to "+l.to,exit:true}];hud();
    HOOK.interact=()=>{SKIPLEG=null;clearOver();legDone(l,start,cb);};skipBtn("Skip this walk");return;}
  if(l.m==="train"||l.m==="actrain"||l.m==="metro"){const P=bStation(ctxNow(),{name:l.from,kind:l.m,crowd:l.crowd});setPlace(P);placePlayer(lookFor(c),P.spawn[0],P.spawn[1],P.spawn[2]);CAM.yaw=Math.PI/4;MODE=PlatformMode;PlatformMode.t=0;PlatformMode.state="wait";PlatformMode.arriveAt=S.settings.quick?.5:2.5;camFollow(V(PS.x,0,PS.z),1,P.camDist,P.pitch,true);
    HUDSTATE.place=l.from+" station";HUDSTATE.objs=[{t:`Wait for the ${MODE_NAME[l.m].toLowerCase()} to ${l.to}`},{t:"Board at the glowing door",exit:true}];hud();
    HOOK.trainStopped=()=>{d.min+=l.waitAdj;const [x,z]=P.anchors.door;addMarker(P,"board",x,z,{label:"the train to "+l.to});hud();};
    HOOK.interact=mk=>{if(mk.kind!=="board")return;mk.on=false;const go=()=>rideLeg(l,start,cb,true);
      if(l.beat&&!d.snaps[l.beat]){runBeat(l.beat,"Platform",r=>{go();});}
      else if(l.crowd==="crush"){openDlg({who:"Platform",title:"The train is packed",text:"People hang from the doors. The next one is four minutes behind.",choices:[{label:"Push in",detail:"Energy −8"},{label:"Wait for the next one",detail:"+4 minutes"}],onChoose:k=>{if(k===0)d.energy=clamp(d.energy-8);else{d.min+=4;l.waitAdj+=4;}go();}});}
      else go();};
    skipBtn("Skip this ride");return;}
  rideLeg(l,start,cb,l.m==="bus");}
let SKIPLEG=null;
function rideLeg(l,start,cb,interior){const d=S.day,c=CC();const rail=l.m==="train"||l.m==="actrain"||l.m==="metro";
  const st=l.st&&l.st.length>1?l.st:[l.from,l.to];const n=rail||l.m==="bus"?st.length-1:1;const seg=rail?150:l.m==="bus"?90:170;const Lc=l.m==="bus"?11:20;
  let P;if(interior){P=bCarInterior(ctxNow(),{kind:l.m==="bus"?"bus":l.m,crowd:l.crowd||"busy"});buildOutside(P,{len:n*seg,rail:rail?(l.m==="metro"?"metro":"train"):false,W:l.m==="bus"?2.6:3.4,seed:start|0,
      stops:rail?st.map((s,k)=>({x:k*seg+Lc/2,name:s,crowd:k===0||k===n?8:5})):[]});
    setPlace(P);placePlayer(lookFor(c),P.spawn[0],P.spawn[1],P.spawn[2]);CAM.yaw=Math.PI/2.6;}
  else{P=bRoadRide(ctxNow(),{vehicle:l.m,look:lookFor(c)});buildOutside(P,{len:seg,rail:false,seed:start|0});setPlace(P);CAM.yaw=Math.PI*.3;}
  const dur=S.settings.quick?3:Math.max(8,Math.min(20,6+n*4));
  Object.assign(RideMode,{t:0,dur,pos:ridePos(n,seg),interior,done:false,onDone:()=>{SKIPLEG=null;clearOver();legDone(l,start,cb);}});MODE=RideMode;camFollow(RideMode.focus(),1,P.camDist,P.pitch,true);
  HUDSTATE.place=MODE_NAME[l.m];HUDSTATE.objs=[];
  document.getElementById("over").innerHTML=`<div class="ov card-g" id="ridehud" style="left:50%;top:12px;transform:translateX(-50%);pointer-events:auto;max-width:min(560px,92%)"></div><div class="ov" style="right:10px;bottom:10px;pointer-events:auto"><button class="btn ghost sm" data-act="skipRide">Skip ride · Space</button></div>`;
  SKIPLEG=()=>{RideMode.t=RideMode.dur;};
  let lastK=-1;HOOK.rideHud=(u,s)=>{d.min=start+l.waitAdj+u*l.minAdj;const k=Math.min(n,Math.round(s/seg));const el=document.getElementById("ridehud");if(!el)return;
    if(k!==lastK||Math.random()<.1){lastK=k;el.innerHTML=`<div class="small"><b>${esc(l.line||MODE_NAME[l.m])}</b> · ${esc(l.from)} → ${esc(l.to)} · <span class="num">${fmt(l.fareAdj)}</span>${l.crowd?` · ${CROWD[l.crowd]}`:""}</div>
      ${rail||l.m==="bus"?`<div class="tiny" style="margin-top:4px;display:flex;gap:6px;flex-wrap:wrap">${st.map((s,i)=>`<span style="${i===k?"font-weight:700;color:var(--terra)":i<k?"color:var(--ink2);text-decoration:line-through":""}">${esc(s)}</span>`).join(" · ")}</div>`:`<div class="tiny muted" style="margin-top:2px">${interior?"Walk around the carriage.":"Drag to look around."} ${Math.round(u*l.minAdj)} of ${l.minAdj} min</div>`}`;}};
  hud();}

/* ---------- Driving ---------- */
function enterDrive(st,resume){const d=S.day,c=CC();const P=buildPlace(st.drive,ctxNow());setPlace(P);
  const veh=st.vehicle==="bike"?makeBike("#2C3E5A","#C8553A"):makeTaxi();const rider=makeAvatar(lookFor(c,st.vehicle==="bike"?{}:{}));setPose(rider,"sit");
  if(st.vehicle==="bike")rider.position.set(0,.5,-.05);else rider.position.set(.4,.35,.2);veh.add(rider);P.add(veh);
  const h=P.anchors.home;PS.x=h[0]+2;PS.z=h[1];PS.h=Math.PI/2;PS.v=0;veh.position.set(PS.x,0,PS.z);
  DriveMode.veh=veh;DriveMode.kind=st.vehicle;DriveMode.bumps=0;MODE=DriveMode;CAM.yaw=PS.h+Math.PI;CAM.user=0;camFollow(V(PS.x,0,PS.z),1,P.camDist*.62,.5,true);
  if(!resume||!d.goals){d.goals=clone(st.goals);d.sub=0;}
  HUDSTATE.place=st.vehicle==="bike"?"On the bike":"In the taxi";setHint("W accelerate · S brake · A/D steer · drag to look · Esc menu");
  HOOK.goal=onGoal;activateGoal();}
let GOALMK=null;
function nextDrop(){const d=S.day;const ds=CUR.drops;const p=ds[d.dropIdx%ds.length];d.dropIdx++;return p;}
function setGoalMarker(g,pos,label){if(GOALMK){GOALMK.on=false;GOALMK.g.visible=false;}GOALMK=addMarker(CUR,"goal",pos[0],pos[1],{big:true,label});GOALMK.data=g;}
function updDriveObjs(){const d=S.day;const g=d.goals[d.sub];HUDSTATE.objs=d.goals.slice(d.sub,d.sub+3).filter(x=>x.k!=="event").map((x,i)=>({t:(i===0&&g._stage==="drop"?"Drop off: ":"")+x.label,exit:i===0}));hud();}
function activateGoal(){const d=S.day;const g=d.goals[d.sub];if(!g){nextStep();return;}
  if(g.k==="event"){runBeat(g.beat,"Your phone",r=>{addGoals(r);d.sub++;activateGoal();});return;}
  if(g.beatStart&&!g._started){g._started=true;if(g.heavyRain&&d.wx==="monsoon")WX.target=1;runBeat(g.beatStart,"On the road",r=>{addGoals(r);placeGoal(g);});return;}
  placeGoal(g);}
function addGoals(r){const d=S.day;if(r&&r.addGoals){d.goals.splice(d.sub+1,0,...r.addGoals.map(x=>Object.assign({},x)));}}
function placeGoal(g){const d=S.day;let pos;if(g.at)pos=CUR.anchors[g.at];else{g._pos=g._pos||nextDrop();pos=g._pos;}
  if(g.k==="fare"&&!g._stage){g._stage="pickup";g._from=g._from||nextDrop();g._to=g._to||nextDrop();}
  if(g.k==="fare")pos=g._stage==="pickup"?g._from:g._to;
  setGoalMarker(g,pos,g.k==="fare"?(g._stage==="pickup"?"Pick up: ":"Drop: ")+g.label.replace("Fare: ",""):g.label);updDriveObjs();setWeatherFor(d.min,WX.target===1&&g.heavyRain);save();}
function onGoal(mk){const d=S.day,c=CC();const g=mk.data;if(!g||mk!==GOALMK||!mk.on)return;mk.on=false;mk.g.visible=false;
  const pay=x=>{const tired=d.energy<30;const surge=(WX.rain>.4&&c.id==="rohit")?25:0;const e=Math.round((x+surge)*(tired?.75:1));d.earned+=e;return e;};
  if(g.k==="drop"){const e=pay(g.pay);d.min+=18;d.worked+=18;d.energy=clamp(d.energy-2);toast(`Delivered · +${fmt(e)}`);blip(880,.08);d.sub++;activateGoal();}
  else if(g.k==="fare"){if(g._stage==="pickup"){g._stage="drop";d.min+=6;toast("Passenger in. Meter running.");placeGoal(g);}else{const e=pay(g.pay);d.min+=24;d.worked+=24;d.energy=clamp(d.energy-3);toast(`Fare paid · +${fmt(e)}`);blip(880,.08);d.sub++;activateGoal();}}
  else if(g.k==="pickup"){d.min+=12;toast(c.id==="rohit"?"Sana climbs on. She talks about her chemistry practical all the way.":"Zoya hops out at tuition. 'Bye, Abbu!'");d.sub++;activateGoal();}
  else if(g.k==="beat"){PS.v=0;runBeat(g.beat,g.label,r=>{addGoals(r);d.sub++;activateGoal();});}
  else if(g.k==="home"){if(g.time)advanceTo(g.time);nextStep();}
  hud();}

/* ---------- End of day ---------- */
function endDay(){const d=S.day,c=CC();d.done=true;S.played[c.id]={flags:clone(d.flags)};save();MODE=ViewMode;INPUT_LOCK=true;
  if(PLAYER){ViewMode.target=V(PS.x,0,PS.z);ViewMode.av=PLAYER;}
  const hrs=(d.worked/60).toFixed(1);document.getElementById("over").innerHTML=`<div class="ov modal" style="position:absolute;pointer-events:auto"><div class="sheet"><div class="stack-s"><span class="eyebrow">End of the day · ${hhmm(d.min)}</span><h1>${esc(c.short)}'s day, as you lived it</h1></div>
   <div class="cols2"><div class="line"><span class="l">${c.payMode==="salary"?"Day's share of pay":"Earned"}</span><span class="a">${fmt(c.payMode==="salary"?c.dayPay:d.earned)}</span></div><div class="line"><span class="l">Spent, including fares</span><span class="a">${fmt(d.spent)}</span></div>
   ${d.wait?`<div class="line"><span class="l">Unpaid waiting</span><span class="a">${d.wait} min</span></div>`:""}${d.flags.late?`<div class="line"><span class="l">Late</span><span class="a">${d.flags.late} min</span></div>`:""}<div class="line"><span class="l">Energy left</span><span class="a">${d.energy}/100</span></div>${DriveMode.bumps?`<div class="line"><span class="l">Bumps on the road</span><span class="a">${DriveMode.bumps}</span></div>`:""}</div>
   <div class="commits">${Object.values(d.commits).map(k=>`<span class="commit ${k.status}">${k.status==="kept"?"✓ Kept: ":k.status==="missed"?"✗ Missed: ":"○ Pending: "}${esc(k.label)}</span>`).join("")}</div>
   <div class="stack-s"><h3>Your choices · replay any of them</h3><ol class="log">${d.log.map(l=>`<li><span class="tm">${esc(l.time||"")}</span><span class="small">${esc(l.label)}</span>${l.id&&d.snaps[l.id]?`<button class="btn ghost sm" data-act="replay" data-id="${l.id}">Replay</button>`:"<span></span>"}</li>`).join("")}</ol></div>
   <div class="row"><button class="btn terra" data-act="toSettle">The 1st of the month</button><button class="btn ghost" data-act="select">Choose another life</button></div></div></div>`;}

/* Pause menu */
function openPause(){if(S.screen!=="play"||DLG)return;INPUT_LOCK=true;const c=CC();
  openDlg({who:"Paused",title:c.name,text:"Your progress is saved on this device.",html:`<p class="small muted">W A S D or arrows to move · Shift to run · E to interact · drag to look · scroll to zoom. Driving: W accelerate, S brake, A/D steer.</p>`,btn:"Resume",btn2:"Back to character select",onOk:()=>{},onOk2:()=>go("select")});
  $dlg.querySelector(".row").insertAdjacentHTML("beforeend",`<button class="btn ghost" data-act="meet" data-id="${c.id}">Open ${esc(c.short)}'s profile</button>`);}
addEventListener("keydown",e=>{if(e.key==="Escape"&&S.screen==="play"){if(DLG&&DLG.who==="Paused"){closeDlg();}else if(!DLG&&!PLAN)openPause();}
  if(PLAN&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){const n=PLAN.opts.length;const cur=PLAN.opts.indexOf(PLAN.sel());PLAN.pick((cur+(e.key==="ArrowRight"?1:n-1))%n);e.preventDefault();}});
