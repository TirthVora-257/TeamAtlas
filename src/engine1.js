/* ============================================================
   ENGINE 1: renderer, materials, avatars, vehicles, places
   ============================================================ */
const REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const stageEl=document.getElementById("stage"), cv=document.getElementById("gl");
let renderer=null;
try{renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true});renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;}
catch(e){const d=document.createElement("div");d.className="nogl";d.innerHTML="<p>This game needs WebGL, which isn't available in this browser. Try a recent Chrome, Edge, Firefox or Safari.</p>";stageEl.appendChild(d);}
const scene=new THREE.Scene();
scene.fog=new THREE.Fog(0xcfd8dc,40,150);
scene.background=new THREE.Color(0xcfd8dc);
const camera=new THREE.PerspectiveCamera(45,1,.1,600);
const hemi=new THREE.HemisphereLight(0xfff6e8,0x7a6a58,.75);scene.add(hemi);
const amb=new THREE.AmbientLight(0xffffff,.18);scene.add(amb);
const sun=new THREE.DirectionalLight(0xfff1dc,.85);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-34,right:34,top:34,bottom:-34,near:1,far:160});sun.shadow.bias=-.0006;
scene.add(sun);scene.add(sun.target);
function resize(){if(!renderer)return;const r=stageEl.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(stageEl);

const V=(x,y,z)=>new THREE.Vector3(x,y,z);
function rng(seed){let s=seed>>>0||1;return()=>((s=Math.imul(s^(s>>>15),2246822507)^Math.imul(s^(s>>>13),3266489909),(s^=s>>>16)>>>0)/4294967296);}
function shade(hex,t){const c=new THREE.Color(hex);if(t<0)c.lerp(new THREE.Color(0),-t);else c.lerp(new THREE.Color(0xffffff),t);return "#"+c.getHexString();}

/* Materials */
const MATS=new Map(), GLOW=[];
function M(hex,o){o=o||{};const k=hex+"|"+(o.glow?"g":"")+(o.op??"")+(o.em||"")+(o.ei??"")+(o.basic?"b":"");let m=MATS.get(k);if(m)return m;
  m=o.basic?new THREE.MeshBasicMaterial({color:hex}):new THREE.MeshLambertMaterial({color:hex});
  if(o.glow&&!o.basic){m.emissive=new THREE.Color(o.em||hex);m.emissiveIntensity=0;m.userData.glow=o.gi??1;GLOW.push(m);}
  else if(o.em&&!o.basic){m.emissive=new THREE.Color(o.em);m.emissiveIntensity=o.ei??.6;}
  if(o.op!=null){m.transparent=true;m.opacity=o.op;m.depthWrite=false;}
  MATS.set(k,m);return m;}
function winTex(lit){const c=document.createElement("canvas");c.width=c.height=256;const g=c.getContext("2d");
  g.fillStyle=lit?"#000":"#fff";g.fillRect(0,0,256,256);const r=rng(9);
  for(let i=0;i<8;i++)for(let j=0;j<8;j++){const on=r()<.62;
    if(lit){g.fillStyle=on?(r()<.5?"#ffd690":"#ffe9b8"):"#000";g.fillRect(i*32+7,j*32+8,18,15);}
    else{g.fillStyle="#5a6573";g.fillRect(i*32+7,j*32+8,18,15);g.fillStyle="#d8cfbf";g.fillRect(i*32+5,j*32+24,22,3);}}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
const WIN_MAP=winTex(false),WIN_EM=winTex(true);
const WMATS=new Map();
function WM(hex){let m=WMATS.get(hex);if(m)return m;m=new THREE.MeshLambertMaterial({color:hex,map:WIN_MAP,emissive:0xffffff,emissiveMap:WIN_EM,emissiveIntensity:0});m.userData.glow=.95;GLOW.push(m);WMATS.set(hex,m);return m;}
function winGeo(w,h,d){const g=new THREE.BoxGeometry(w,h,d);g.translate(w/2,h/2,d/2);const uv=g.attributes.uv;
  for(let f=0;f<6;f++){let su,sv;if(f===2||f===3){su=0;sv=0;}else{su=((f<2)?d:w)/1.8/8;sv=h/1.5/8;}
    for(let v=0;v<4;v++){const i=f*4+v;uv.setXY(i,uv.getX(i)*su,uv.getY(i)*sv);}}
  uv.needsUpdate=true;return g;}
const G_MIN=new THREE.BoxGeometry(1,1,1);G_MIN.translate(.5,.5,.5);
const G_C=new THREE.BoxGeometry(1,1,1);

/* Text textures */
const TEX=new Map();
function textTex(text,o){o=o||{};const k=text+"|"+(o.bg||"")+(o.fg||"")+(o.fs||"");if(TEX.has(k))return TEX.get(k);
  const c=document.createElement("canvas"),g=c.getContext("2d");const fs=o.fs||48;g.font=`700 ${fs}px Figtree, Arial, sans-serif`;
  c.width=Math.max(64,Math.ceil(g.measureText(text).width+fs*1.1));c.height=Math.ceil(fs*1.55);
  g.fillStyle=o.bg||"#F2D24B";g.fillRect(0,0,c.width,c.height);g.font=`700 ${fs}px Figtree, Arial, sans-serif`;g.fillStyle=o.fg||"#1d1d1d";g.textAlign="center";g.textBaseline="middle";g.fillText(text,c.width/2,c.height/2+2);
  const t=new THREE.CanvasTexture(c);const r={t,ar:c.width/c.height};TEX.set(k,r);return r;}
function makeLabel(text,strong){const {t,ar}=textTex(text,{bg:strong?"#24242A":"#FBF8F1",fg:strong?"#FBF8F1":"#24242A",fs:40});
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false}));s.scale.set(ar*1.1,1.1,1);s.renderOrder=10;return s;}

/* Avatars */
function makeAvatar(L){L=Object.assign({shirt:"#C7694A",pants:"#3B4150",skin:"#A8704A",hair:"#1E1915"},L||{});
  const g=new THREE.Group();const P=(w,h,d,c,x,y,z,par)=>{const m=new THREE.Mesh(G_C,M(c));m.scale.set(w,h,d);m.position.set(x,y,z);m.castShadow=true;(par||g).add(m);return m;};
  const hipL=new THREE.Group();hipL.position.set(-.12,.82,0);g.add(hipL);P(.19,.8,.22,L.pants,0,-.4,0,hipL);P(.2,.1,.3,L.shoe||"#2a2522",0,-.78,.04,hipL);
  const hipR=new THREE.Group();hipR.position.set(.12,.82,0);g.add(hipR);P(.19,.8,.22,L.pants,0,-.4,0,hipR);P(.2,.1,.3,L.shoe||"#2a2522",0,-.78,.04,hipR);
  P(.52,.62,.3,L.shirt,0,1.13,0);
  if(L.steth)P(.05,.32,.02,"#2a2d34",.08,1.2,.16);
  const armL=new THREE.Group();armL.position.set(-.34,1.4,0);g.add(armL);P(.16,.58,.19,L.shirt,0,-.27,0,armL);P(.14,.14,.16,L.skin,0,-.62,0,armL);
  const armR=new THREE.Group();armR.position.set(.34,1.4,0);g.add(armR);P(.16,.58,.19,L.shirt,0,-.27,0,armR);P(.14,.14,.16,L.skin,0,-.62,0,armR);
  P(.36,.36,.34,L.skin,0,1.63,0);P(.06,.06,.02,"#1a1512",-.08,1.66,.172);P(.06,.06,.02,"#1a1512",.08,1.66,.172);
  const hair=L.grey?"#B9B3AA":L.hair;
  if(L.helmet){P(.44,.26,.44,L.helmet,0,1.82,0);P(.36,.06,.08,"#9FB5C2",0,1.71,.2);}
  else if(L.cap){P(.4,.12,.4,L.cap,0,1.86,0);P(.4,.04,.18,L.cap,0,1.81,.26);}
  else P(.38,.1,.36,hair,0,1.85,0);
  if(L.long&&!L.helmet)P(.38,.44,.1,hair,0,1.57,-.17);
  if(L.bag)P(.36,.42,.16,L.bag,0,1.12,-.24);
  g.userData={hipL,hipR,armL,armR,phase:Math.random()*6,pose:null,look:L};
  return g;}
function animAv(a,speed,dt){const u=a.userData;if(u.pose==="sit"||u.pose==="lie")return;u.phase+=dt*(3+speed*2.4);
  const k=Math.min(1,speed/2.6),s=Math.sin(u.phase)*.75*k;
  u.hipL.rotation.x=s;u.hipR.rotation.x=-s;
  if(u.pose==="phone"){u.armR.rotation.x=-1.3;u.armL.rotation.x=-s*.6;}
  else{u.armL.rotation.x=-s*.8;u.armR.rotation.x=s*.8;u.armL.rotation.z=speed<.1?Math.sin(u.phase*.3)*.04:0;}}
function setPose(a,p){const u=a.userData;u.pose=p;
  if(p==="sit"){u.hipL.rotation.x=u.hipR.rotation.x=-Math.PI/2;u.armL.rotation.x=u.armR.rotation.x=-.5;}
  if(p==="lie"){a.rotation.x=-Math.PI/2;}
  if(p==="phone"){u.armR.rotation.x=-1.3;}}

/* Vehicles (forward = +z) */
function vGroup(){return new THREE.Group();}
function vb(g,w,h,d,c,x,y,z,o){const m=new THREE.Mesh(G_C,M(c,o));m.scale.set(w,h,d);m.position.set(x,y,z);m.castShadow=true;g.add(m);return m;}
function makeBike(color,box){const g=vGroup();vb(g,.14,.62,.62,"#1F1F24",0,.31,.62);vb(g,.14,.62,.62,"#1F1F24",0,.31,-.62);
  vb(g,.3,.32,1.3,color||"#2C3E5A",0,.62,0);vb(g,.32,.12,.6,"#1B1B1F",0,.84,-.1);vb(g,.64,.08,.1,"#1B1B1F",0,1.06,.55);vb(g,.16,.12,.08,"#FFF4C2",0,.84,.72,{em:"#FFF4C2",ei:.8});
  if(box!==false)vb(g,.58,.56,.56,box||"#C8553A",0,1.12,-.55);return g;}
function makeAuto(){const g=vGroup();vb(g,.2,.5,.5,"#1F1F24",-.6,.25,-.6);vb(g,.2,.5,.5,"#1F1F24",.6,.25,-.6);vb(g,.2,.5,.5,"#1F1F24",0,.25,.85);
  vb(g,1.3,.45,1.9,"#26262B",0,.62,0);vb(g,1.3,.12,1.95,"#E2B53C",0,1.95,0);vb(g,1.2,1,.08,"#9FB5C2",0,1.35,.7,{op:.55});vb(g,.08,1.1,.08,"#26262B",-.62,1.35,.7);vb(g,.08,1.1,.08,"#26262B",.62,1.35,.7);vb(g,1.3,1.2,.1,"#E2B53C",0,1.35,-.95);return g;}
function makeCar(c,top){const g=vGroup();for(const [x,z] of [[-.8,1.05],[.8,1.05],[-.8,-1.05],[.8,-1.05]])vb(g,.22,.56,.56,"#1F1F24",x,.28,z);
  vb(g,1.7,.58,3.8,c,0,.62,0);vb(g,1.55,.55,2,top||shade(c,.15),0,1.18,-.2);vb(g,1.45,.42,.06,"#9DB7C8",0,1.18,.81);vb(g,.06,.4,1.7,"#9DB7C8",.79,1.18,-.2);vb(g,.06,.4,1.7,"#9DB7C8",-.79,1.18,-.2);
  vb(g,.3,.12,.06,"#FFF4C2",-.55,.75,1.91,{em:"#FFF4C2",ei:.7});vb(g,.3,.12,.06,"#FFF4C2",.55,.75,1.91,{em:"#FFF4C2",ei:.7});vb(g,.3,.12,.06,"#C0302A",-.55,.75,-1.91,{em:"#C0302A",ei:.5});vb(g,.3,.12,.06,"#C0302A",.55,.75,-1.91,{em:"#C0302A",ei:.5});return g;}
function makeTaxi(){return makeCar("#26262B","#E2B53C");}
function makeBus(){const g=vGroup();vb(g,2.5,2.4,10,"#B84A3A",0,1.55,0);vb(g,2.52,.6,9,"#AFC6D3",0,2.2,-.2,{});vb(g,2.3,.7,.06,"#AFC6D3",0,2.1,5.01);for(const z of [-3.3,3.3])for(const x of [-1.1,1.1])vb(g,.3,.8,.8,"#1F1F24",x,.4,z);return g;}
function makeTrainCar(kind){const g=vGroup();const body=kind==="metro"?"#D9DEE2":kind==="actrain"?"#E9EEF2":"#EFE6D4",band=kind==="metro"?"#2C8C86":kind==="actrain"?"#2F5E9E":"#8A3B3B";
  vb(g,3.3,3.5,19.6,body,0,.85,0);vb(g,3.32,.5,19.62,band,0,.05,0);vb(g,3.34,.9,17,"#3E4652",0,1.55,0);
  for(const z of [-6,0,6])for(const s of [-1,1])vb(g,.05,2.3,1.4,"#2A2F38",s*1.66,.6,z);
  vb(g,3,.2,19,"#9A9A9A",0,2.7,0);return g;}
function makePlane(){const g=vGroup();vb(g,3.6,3.6,30,"#F4F1EA",0,3.4,0);vb(g,3,3,4,"#F4F1EA",0,3.4,16.5);vb(g,2.2,2.2,2.5,"#E6E3DC",0,3.6,19.5);vb(g,2.4,.6,1,"#3E4652",0,4.4,18.2);
  vb(g,32,.4,5,"#E6E3DC",0,2.8,1);vb(g,10,.3,3,"#E6E3DC",0,4.6,-14);vb(g,.4,5,4,"#B4553A",0,6.9,-14.5);
  for(const x of [-6,6]){vb(g,1.9,1.9,3.5,"#C9CDD2",x,1.6,3);}
  vb(g,.3,1.6,.3,"#3A3A40",0,.8,12);for(const x of [-2.5,2.5])vb(g,.3,1.6,.3,"#3A3A40",x,.8,0);
  vb(g,3.62,.9,22,"#3E4652",0,4.1,1,{});return g;}

/* ---------------- Place ---------------- */
class Place{
  constructor(o){o=o||{};this.g=new THREE.Group();this.col=[];this.marks=[];this.npcs=[];this.anim=[];this.walls=[];this.anchors={};this.disp=[];this.mini=[];
    this.bounds=o.bounds||[-30,-30,30,30];this.spawn=o.spawn||[0,0,0];this.indoor=!!o.indoor;this.camDist=o.camDist||(this.indoor?11:17);this.pitch=o.pitch||(this.indoor?.95:.82);this.name=o.name||"";}
  box(x,z,w,d,h,c,o){o=o||{};const m=new THREE.Mesh(G_MIN,o.mat||M(c,o));m.scale.set(w,h,d);m.position.set(x,o.y||0,z);m.castShadow=o.cast!==false&&h>.12;m.receiveShadow=true;this.g.add(m);
    const y=o.y||0;if(o.solid===true||(o.solid!==false&&h>.3&&y<1.3&&y+h>.3))this.col.push([x,z,x+w,z+d]);
    if(o.map!==false&&(o.map||(h>.25&&y<1.2)))this.mini.push([x,z,w,d,c]);return m;}
  bldg(x,z,w,d,h,c){const g=winGeo(w,h,d);this.disp.push(g);const roof=M(shade(c,-.15));const m=new THREE.Mesh(g,[WM(c),WM(c),roof,roof,WM(c),WM(c)]);m.position.set(x,0,z);m.castShadow=m.receiveShadow=true;this.g.add(m);this.col.push([x,z,x+w,z+d]);this.mini.push([x,z,w,d,c]);return m;}
  wall(x,z,w,d,h,c,n){const mt=new THREE.MeshLambertMaterial({color:c,transparent:true,opacity:1});this.disp.push(mt);const m=this.box(x,z,w,d,h,c,{mat:mt,map:true});m.userData.n=n;this.walls.push(m);return m;}
  person(look,x,z,ry,o){o=o||{};const a=makeAvatar(look);if(look&&look.s)a.scale.setScalar(look.s);a.position.set(x,(o.y||0)+(o.pose==="sit"?-.36:0)+(o.pose==="lie"?.75:0),z);a.rotation.y=ry||0;if(o.pose)setPose(a,o.pose);this.g.add(a);
    const n={a,wander:o.wander,speed:o.speed||1.1,t:Math.random()*10,dir:1};this.npcs.push(n);if(!o.noCol&&!o.wander)this.col.push([x-.28,z-.28,x+.28,z+.28]);return a;}
  sign(text,x,y,z,h,ry,o){const {t,ar}=textTex(text,o);const geo=new THREE.PlaneGeometry(h*ar,h),mat=new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide});this.disp.push(geo,mat);const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.rotation.y=ry||0;this.g.add(m);return m;}
  label(text,x,y,z,strong){const s=makeLabel(text,strong);s.position.set(x,y,z);this.disp.push(s.material);this.g.add(s);return s;}
  add(o){this.g.add(o);return o;}
  anchor(k,x,z){this.anchors[k]=[x,z];}
}
function disposePlace(P){if(!P)return;scene.remove(P.g);P.disp.forEach(d=>d.dispose&&d.dispose());P.marks.forEach(m=>{m.g.traverse(o=>{if(o.geometry&&o.geometry!==G_C&&o.geometry!==G_MIN)o.geometry.dispose();});});}

/* Markers */
const MK_COL={beat:0xC0603F,talk:0x2C8C86,exit:0xE0B040,goal:0xE0B040,drop:0x3E7CC0,board:0x3E7CC0};
const MK_GEO={gem:new THREE.OctahedronGeometry(.3),ring:new THREE.RingGeometry(.55,.78,32),beam:new THREE.CylinderGeometry(1.4,1.4,14,20,1,true),bring:new THREE.RingGeometry(1.6,2.1,40)};
function addMarker(P,kind,x,z,o){o=o||{};const g=new THREE.Group();const col=MK_COL[kind]||0xC0603F;
  if(o.big){const b=new THREE.Mesh(MK_GEO.beam,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.28,side:THREE.DoubleSide,depthWrite:false}));b.position.y=7;g.add(b);
    const r=new THREE.Mesh(MK_GEO.bring,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.85,side:THREE.DoubleSide}));r.rotation.x=-Math.PI/2;r.position.y=.08;g.add(r);g.userData.spin=r;}
  else{const gem=new THREE.Mesh(MK_GEO.gem,new THREE.MeshLambertMaterial({color:col,emissive:col,emissiveIntensity:.6}));gem.position.y=o.y||2.45;g.add(gem);g.userData.gem=gem;
    const r=new THREE.Mesh(MK_GEO.ring,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.8,side:THREE.DoubleSide}));r.rotation.x=-Math.PI/2;r.position.y=.04;g.add(r);}
  g.position.set(x,0,z);P.g.add(g);const mk={g,kind,x,z,r:o.r||(o.big?3.2:1.7),label:o.label||"",on:o.on!==false,data:o.data,id:o.id};g.visible=mk.on;P.marks.push(mk);return mk;}

/* ---------------- Weather + light ---------------- */
const WX={kind:"sunny",rain:0,target:0,flash:0,min:720};
const RAIN_N=1800;
const rainGeo=new THREE.BufferGeometry();const rainPos=new Float32Array(RAIN_N*6);
for(let i=0;i<RAIN_N;i++){const x=(Math.random()-.5)*60,y=Math.random()*24,z=(Math.random()-.5)*60;rainPos.set([x,y,z,x-.05,y-.7,z],i*6);}
rainGeo.setAttribute("position",new THREE.BufferAttribute(rainPos,3));
const rainLines=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xcfdce8,transparent:true,opacity:.5}));rainLines.frustumCulled=false;rainLines.visible=false;scene.add(rainLines);
const lerp=(a,b,t)=>a+(b-a)*t;
function nightAmt(h){if(h<5)return 1;if(h<6.8)return 1-(h-5)/1.8;if(h<17.8)return 0;if(h<19.8)return (h-17.8)/2;return 1;}
function applyLight(min,center){const h=((min/60)%24+24)%24;const n=nightAmt(h);const r=WX.rain,haze=WX.kind==="haze";
  const day=new THREE.Color(haze?0xD8CDB8:0xBFD6E2),dusk=new THREE.Color(0xE7A979),night=new THREE.Color(0x1C2340),grey=new THREE.Color(0x8C98A3);
  let sky=day.clone();const duskK=(h>5&&h<7.2)?1-Math.abs(h-6.1)/1.1:(h>17.3&&h<19.6)?1-Math.abs(h-18.4)/1.2:0;
  sky.lerp(dusk,Math.max(0,duskK)*.7);sky.lerp(night,n);sky.lerp(grey.clone().lerp(night,n*.8),r*.65);
  if(WX.flash>0)sky.lerp(new THREE.Color(0xffffff),WX.flash);
  scene.background.copy(sky);scene.fog.color.copy(sky);
  scene.fog.near=haze?14:lerp(45,22,r);scene.fog.far=haze?95:lerp(170,95,r);
  const dayI=(1-n)*(1-r*.55);sun.intensity=.1+dayI*.72;hemi.intensity=.28+(1-n)*.38*(1-r*.3)+WX.flash*1.5;amb.intensity=.1+n*.1;
  sun.color.set(n>.5?0x9fb2d8:(duskK>.2?0xffc79a:(haze?0xffe2c0:0xfff1dc)));
  const az=((h-6)/12)*Math.PI;const el=Math.max(.25,Math.sin(Math.min(Math.PI,Math.max(0,az))));
  const c=center||V(0,0,0);sun.position.set(c.x+Math.cos(az)*30+8,c.y+12+el*36,c.z+18);sun.target.position.copy(c);
  for(const m of GLOW)m.emissiveIntensity=Math.max(n,r*.35)*m.userData.glow;
}
function updateWeather(dt,center){WX.rain=lerp(WX.rain,WX.target,1-Math.exp(-dt*1.5));
  rainLines.visible=WX.rain>.03&&!(typeof CUR!=='undefined'&&CUR&&CUR.indoor&&!CUR.outside);rainLines.material.opacity=.2+WX.rain*.45;
  if(rainLines.visible){rainLines.position.set(center.x,center.y,center.z);const p=rainPos,sp=(REDUCED?6:22)*dt;
    for(let i=0;i<RAIN_N;i++){const o=i*6;p[o+1]-=sp;p[o+4]-=sp;if(p[o+1]<-1){const y=22+Math.random()*3;p[o+1]=y;p[o+4]=y-.7;}}rainGeo.attributes.position.needsUpdate=true;}
  if(WX.flash>0)WX.flash=Math.max(0,WX.flash-dt*3);
  if(WX.rain>.8&&!REDUCED&&Math.random()<dt*.06){WX.flash=.5;setTimeout(()=>blip(55,.6,"sawtooth"),400);}}
function setWeatherFor(min,heavy){const h=((min/60)%24+24)%24;
  if(WX.kind==="monsoon")WX.target=heavy?1:(h>9&&h<13?.85:h>17&&h<21?.55:.35);else WX.target=0;}

/* ---------------- Input ---------------- */
const KEYS={};const JOY={x:0,y:0,on:false};
let INPUT_LOCK=false;
addEventListener("keydown",e=>{if(e.target.closest&&e.target.closest("input,textarea,select"))return;KEYS[e.code]=true;
  if(S&&(S.screen==="play"||S.screen==="select")&&["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code)&&!e.target.closest("button"))e.preventDefault();});
addEventListener("keyup",e=>{KEYS[e.code]=false;});
addEventListener("blur",()=>{for(const k in KEYS)KEYS[k]=false;});
function axis(){let x=0,y=0;if(KEYS.KeyA||KEYS.ArrowLeft)x-=1;if(KEYS.KeyD||KEYS.ArrowRight)x+=1;if(KEYS.KeyW||KEYS.ArrowUp)y+=1;if(KEYS.KeyS||KEYS.ArrowDown)y-=1;
  if(JOY.on){x+=JOY.x;y+=JOY.y;}const l=Math.hypot(x,y);if(l>1){x/=l;y/=l;}return {x,y};}
const CAM={yaw:Math.PI/4,dist:16,pitch:.85,drag:false,lx:0,auto:true};
stageEl.addEventListener("pointerdown",e=>{if(e.target!==cv)return;CAM.drag=true;CAM.lx=e.clientX;cv.setPointerCapture(e.pointerId);cv.focus({preventScroll:true});});
stageEl.addEventListener("pointermove",e=>{if(!CAM.drag)return;CAM.yaw-=(e.clientX-CAM.lx)*.008;CAM.lx=e.clientX;CAM.user=performance.now();});
stageEl.addEventListener("pointerup",()=>{CAM.drag=false;});
stageEl.addEventListener("wheel",e=>{if(e.target!==cv)return;e.preventDefault();CAM.zoom=Math.max(.55,Math.min(1.6,(CAM.zoom||1)*(e.deltaY>0?1.08:.93)));},{passive:false});
const tmpV=V(0,0,0);
function camFollow(t,dt,dist,pitch,snap){const d=dist*(CAM.zoom||1);const hd=d*Math.cos(pitch),h=d*Math.sin(pitch);
  tmpV.set(t.x+Math.sin(CAM.yaw)*hd,t.y+h,t.z+Math.cos(CAM.yaw)*hd);
  if(snap)camera.position.copy(tmpV);else camera.position.lerp(tmpV,1-Math.exp(-dt*7));camera.lookAt(t.x,t.y+1,t.z);}
function fadeWalls(P){if(!P||!P.walls.length)return;const cx=Math.sin(CAM.yaw),cz=Math.cos(CAM.yaw);
  for(const w of P.walls){const n=w.userData.n;const k=n[0]*cx+n[1]*cz;const target=k>.25?.12:1;w.material.opacity=lerp(w.material.opacity,target,.2);w.material.depthWrite=w.material.opacity>.9;w.castShadow=w.material.opacity>.9;}}
function collide(P,x,z,r){for(const c of P.col){const nx=Math.max(c[0],Math.min(x,c[2])),nz=Math.max(c[1],Math.min(z,c[3]));const dx=x-nx,dz=z-nz,d2=dx*dx+dz*dz;
    if(d2<r*r){if(d2>1e-8){const d=Math.sqrt(d2);x=nx+dx/d*r;z=nz+dz/d*r;}else{const l=x-c[0],rr=c[2]-x,t=z-c[1],b=c[3]-z,m=Math.min(l,rr,t,b);if(m===l)x=c[0]-r;else if(m===rr)x=c[2]+r;else if(m===t)z=c[1]-r;else z=c[3]+r;}}}
  const b=P.bounds;x=Math.max(b[0],Math.min(b[2],x));z=Math.max(b[1],Math.min(b[3],z));return [x,z];}
function hits(P,x,z,r){for(const c of P.col){const nx=Math.max(c[0],Math.min(x,c[2])),nz=Math.max(c[1],Math.min(z,c[3]));if((x-nx)**2+(z-nz)**2<r*r)return true;}const b=P.bounds;return x<b[0]||x>b[2]||z<b[1]||z>b[3];}

/* Sound */
let AC=null;function blip(f,d,type){if(!S||!S.settings.sound)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type||"square";o.frequency.value=f||440;g.gain.value=.035;g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+(d||.09));o.connect(g).connect(AC.destination);o.start();o.stop(AC.currentTime+(d||.09));}catch(e){}}
