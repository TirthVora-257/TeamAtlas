/* ============================================================
   ENGINE 3: modes (view, walk, drive, platform, ride) + loop
   ============================================================ */
let CUR=null,MODE=null,PLAYER=null;
const PS={x:0,z:0,ry:0,v:0,h:0};
const HOOK={};
function setPlace(P){if(CUR)disposePlace(CUR);CUR=P;scene.add(P.g);document.getElementById("mini").hidden=true;}
function placePlayer(look,x,z,ry){PLAYER=makeAvatar(look);CUR.g.add(PLAYER);PS.x=x;PS.z=z;PS.ry=ry||0;PS.v=0;PLAYER.position.set(x,0,z);PLAYER.rotation.y=PS.ry;}
function updNpc(n,dt){if(!n.a)return;if(n.wander){const p=n.a.position;p.x+=n.dir*n.speed*dt;if(p.x>n.wander[1]){n.dir=-1;}if(p.x<n.wander[0]){n.dir=1;}n.a.rotation.y=n.dir>0?Math.PI/2:-Math.PI/2;animAv(n.a,n.speed,dt);}else animAv(n.a,0,dt);}
const PROMPT={mk:null,html:""};
function setPrompt(mk,verb){const el=document.getElementById("prompt");const html=mk?`<button class="pbtn" data-act="interact"><span class="keycap">E</span>${esc(verb||"")} ${esc(mk.label)}</button>`:"";if(html!==PROMPT.html){el.innerHTML=html;PROMPT.html=html;}PROMPT.mk=mk;}
function nearestMark(x,z,kinds){let best=null,bd=1e9;if(!CUR)return null;for(const m of CUR.marks){if(!m.on||(kinds&&!kinds.includes(m.kind)))continue;const d=Math.hypot(m.x-x,m.z-z);if(d<m.r&&d<bd){bd=d;best=m;}}return best;}
let ePrev=false;function ePressed(){const e=!!(KEYS.KeyE||KEYS.Enter&&false);const r=e&&!ePrev;ePrev=e;return r;}
const VERB={beat:"",talk:"Talk:",exit:"",board:"Board:",goal:"",drop:""};

const ViewMode={target:V(0,1,0),av:null,update(dt){if(!CAM.drag&&(!CAM.user||performance.now()-CAM.user>2500))CAM.yaw+=dt*(REDUCED?0:.12);if(this.av)animAv(this.av,0,dt);if(this.spin&&this.av)this.av.rotation.y+=dt*(REDUCED?0:.6);camFollow(this.target,dt,(CUR?CUR.camDist:12),CUR?CUR.pitch:.6);fadeWalls(CUR);},center(){return this.target;}};

function walkPhysics(dt,speedMul){const ax=axis();const locked=INPUT_LOCK;const sy=Math.sin(CAM.yaw),cy=Math.cos(CAM.yaw);
  let vx=cy*ax.x-sy*ax.y,vz=-sy*ax.x-cy*ax.y;if(locked){vx=vz=0;}
  const run=(KEYS.ShiftLeft||KEYS.ShiftRight)?1.7:1;const sp=3.1*run*(speedMul||1);const mag=Math.hypot(vx,vz);
  if(mag>.01){let nx=PS.x+vx*sp*dt,nz=PS.z+vz*sp*dt;[nx,nz]=collide(CUR,nx,nz,.3);PS.x=nx;PS.z=nz;const tr=Math.atan2(vx,vz);let d=tr-PS.ry;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;PS.ry+=d*Math.min(1,dt*12);}
  PLAYER.position.set(PS.x,PLAYER.position.y,PS.z);PLAYER.rotation.y=PS.ry;animAv(PLAYER,mag>.01?sp:0,dt);return mag>.01;}

const WalkMode={update(dt){walkPhysics(dt,HOOK.speedMul?HOOK.speedMul():1);camFollow(V(PS.x,0,PS.z),dt,CUR.camDist,CUR.pitch);fadeWalls(CUR);
    const mk=INPUT_LOCK?null:nearestMark(PS.x,PS.z);setPrompt(mk,mk&&VERB[mk.kind]);
    if(mk&&(ePressed()||mk.auto))HOOK.interact&&HOOK.interact(mk);else ePressed();
    if(HOOK.tick&&!INPUT_LOCK)HOOK.tick(dt);drawMini();},center(){return V(PS.x,0,PS.z);}};

const PlatformMode={t:0,state:"wait",arriveAt:3,update(dt){this.t+=dt;const tr=CUR.train;
    if(this.state==="wait"&&this.t>this.arriveAt)this.state="arriving",this.t0=this.t;
    if(this.state==="arriving"){const k=Math.min(1,(this.t-this.t0)/4.5);const e=1-Math.pow(1-k,3);tr.position.x=140*(1-e);if(k>=1){this.state="stopped";HOOK.trainStopped&&HOOK.trainStopped();blip(220,.2,"triangle");}}
    WalkMode.update(dt);},center(){return V(PS.x,0,PS.z);}};

const DriveMode={veh:null,bumps:0,update(dt){const ax=axis();const rain=WX.rain>.4;const tired=HOOK.speedMul?HOOK.speedMul():1;
    const maxV=(this.kind==="bike"?14:15)*(rain?.72:1)*tired;const acc=rain?5:7;
    if(INPUT_LOCK){PS.v*=1-dt*4;}else{if(ax.y>0)PS.v+=acc*ax.y*dt;else if(ax.y<0)PS.v+=(PS.v>0?14:5)*ax.y*dt;else PS.v*=1-dt*.9;}
    PS.v=Math.max(-4,Math.min(maxV,PS.v));const turn=(rain?1.6:2)*Math.min(1,Math.abs(PS.v)/4)*(PS.v<0?-1:1);if(!INPUT_LOCK)PS.h-=ax.x*turn*dt;
    const nx=PS.x+Math.sin(PS.h)*PS.v*dt,nz=PS.z+Math.cos(PS.h)*PS.v*dt;
    if(hits(CUR,nx,nz,.9)){if(Math.abs(PS.v)>3){this.bumps++;blip(90,.15,"sawtooth");}PS.v*=-.3;}else{PS.x=nx;PS.z=nz;}
    this.veh.position.set(PS.x,0,PS.z);this.veh.rotation.y=PS.h;
    const user=CAM.user&&performance.now()-CAM.user<2500;if(!user){let d=(PS.h+Math.PI)-CAM.yaw;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;CAM.yaw+=d*Math.min(1,dt*2.5);}
    camFollow(V(PS.x,0,PS.z),dt,CUR.camDist*.62,.5);
    const mk=INPUT_LOCK?null:nearestMark(PS.x,PS.z,["goal","drop"]);if(mk&&Math.abs(PS.v)<9){PS.v*=.9;HOOK.goal&&HOOK.goal(mk);}
    if(HOOK.tick&&!INPUT_LOCK)HOOK.tick(dt*.7);drawMini();},center(){return V(PS.x,0,PS.z);}};

const RideMode={t:0,update(dt){if(INPUT_LOCK){camFollow(this.focus(),dt,CUR.camDist,CUR.pitch);return;}this.t+=dt;const u=Math.min(1,this.t/this.dur);const s=this.pos(u);CUR.outside.position.x=-s;
    if(this.interior){walkPhysics(dt,.6);const j=REDUCED?0:Math.sin(this.t*17)*.015;camFollow(V(PS.x,0,PS.z),dt,CUR.camDist,CUR.pitch);camera.position.y+=j;fadeWalls(CUR);}
    else{if(!CAM.drag&&(!CAM.user||performance.now()-CAM.user>2500))CAM.yaw+=dt*(REDUCED?0:.18);camFollow(V(0,.5,0),dt,CUR.camDist,CUR.pitch);if(CUR.vehicle)CUR.vehicle.position.y=REDUCED?0:Math.abs(Math.sin(this.t*9))*.03;}
    HOOK.rideHud&&HOOK.rideHud(u,s);if(KEYS.Space){KEYS.Space=false;u<1&&(this.t=this.dur);}if(u>=1&&!this.done){this.done=true;setTimeout(()=>this.onDone(),REDUCED?50:600);}},
  focus(){return this.interior?V(PS.x,0,PS.z):V(0,.5,0);},center(){return this.focus();}};
function ridePos(n,seg){/* n segments of length seg with eased stops and short dwells */return u=>{if(n<=0)return 0;const per=1/n,k=Math.min(n-1,Math.floor(u/per)),f=(u-k*per)/per;const move=Math.min(1,f/.85);const e=(1-Math.cos(Math.PI*move))/2;return (k+e)*seg;};}

/* Minimap */
let miniTick=0;function drawMini(){const c=document.getElementById("mini");if(!CUR||!CUR.mini.length){c.hidden=true;return;}c.hidden=false;if((miniTick++)%6)return;
  const g=c.getContext("2d"),W=c.width,H=c.height;g.clearRect(0,0,W,H);const b=CUR.bounds;const pad=CUR.city?8:4;const x0=b[0]-pad,z0=b[1]-pad,x1=b[2]+pad,z1=b[3]+pad;const s=Math.min(W/(x1-x0),H/(z1-z0));
  const ox=(W-(x1-x0)*s)/2,oz=(H-(z1-z0)*s)/2;const T=(x,z)=>[ox+(x-x0)*s,oz+(z-z0)*s];
  for(const m of CUR.mini){const [x,z]=T(m[0],m[1]);g.fillStyle=m[4]==="#5F5E63"?"#6d6c72":"rgba(240,232,216,.85)";g.fillRect(x,z,Math.max(1,m[2]*s),Math.max(1,m[3]*s));}
  for(const m of CUR.marks){if(!m.on)continue;const [x,z]=T(m.x,m.z);g.fillStyle="#"+(MK_COL[m.kind]||0xC0603F).toString(16).padStart(6,"0");g.beginPath();g.arc(x,z,CUR.city?7:6,0,Math.PI*2);g.fill();g.strokeStyle="#fff";g.lineWidth=2;g.stroke();}
  const [px,pz]=T(PS.x,PS.z);const h=MODE===DriveMode?PS.h:PS.ry;g.save();g.translate(px,pz);g.rotate(-h+Math.PI);g.fillStyle="#fff";g.beginPath();g.moveTo(0,-9);g.lineTo(6,7);g.lineTo(-6,7);g.closePath();g.fill();g.restore();}

/* Touch joystick */
(function(){const joy=document.getElementById("joy");if(!joy)return;let id=null,cx=0,cy=0;const knob=joy.querySelector("i");
  joy.addEventListener("pointerdown",e=>{id=e.pointerId;const r=joy.getBoundingClientRect();cx=r.left+r.width/2;cy=r.top+r.height/2;joy.setPointerCapture(id);JOY.on=true;mv(e);});
  const mv=e=>{if(e.pointerId!==id)return;let dx=(e.clientX-cx)/50,dy=(e.clientY-cy)/50;const l=Math.hypot(dx,dy);if(l>1){dx/=l;dy/=l;}JOY.x=dx;JOY.y=-dy;knob.style.transform=`translate(${dx*36}px,${dy*36}px)`;};
  joy.addEventListener("pointermove",mv);const end=()=>{id=null;JOY.on=false;JOY.x=JOY.y=0;knob.style.transform="";};joy.addEventListener("pointerup",end);joy.addEventListener("pointercancel",end);
  if(window.matchMedia&&matchMedia("(pointer: coarse)").matches)document.getElementById("touch").dataset.coarse="1";})();

/* Main loop */
let lastT=performance.now();
function frame(now){const dt=Math.min(.05,(now-lastT)/1000);lastT=now;const t=now/1000;
  try{if(MODE&&MODE.update)MODE.update(dt,t);
    if(CUR){for(const a of CUR.anim)a(dt,t);for(const n of CUR.npcs)updNpc(n,dt);for(const mk of CUR.marks){if(!mk.g.visible)continue;const u=mk.g.userData;if(u.gem){u.gem.rotation.y+=dt*2;u.gem.position.y=2.45+Math.sin(t*3)*.08;}if(u.spin)u.spin.rotation.z+=dt;}
      if(HOOK.frame)HOOK.frame(dt,t);}
    const c=MODE&&MODE.center?MODE.center():V(0,0,0);updateWeather(dt,c);applyLight(HOOK.clock?HOOK.clock():720,c);
    if(renderer)renderer.render(scene,camera);}catch(e){console.error(e);}
  requestAnimationFrame(frame);}
requestAnimationFrame(frame);
