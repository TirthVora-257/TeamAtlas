/* ============================================================
   ENGINE 2b: streets, stations, city maps, rides, showcases
   ============================================================ */
const BCOL=["#D9906F","#E6D7B8","#C7B79A","#B9C7C0","#CFC4AE","#E3C9A8","#A9B9C2","#D7B4A0"];
const SK=["#8D5A3B","#A8704A","#7A4E33","#B07A55","#9A6748","#6E4630"];
const SH=["#4C7EA8","#C7694A","#E2B53C","#5E9A4E","#8E4C6B","#E8E2D6","#3E5A86","#B39B6B"];
function crowdLook(r){return NL(SH[(r()*SH.length)|0],SK[(r()*SK.length)|0],r()<.12?"#9A9590":"#1A1512",{long:r()<.4,bag:r()<.25?"#2F3540":null});}
function ground(P,x0,z0,x1,z1,c){P.box(x0,z0,x1-x0,z1-z0,.3,c||"#CDBFA4",{y:-.3,solid:false,map:false,cast:false});}
function roadX(P,x0,z,len,w){P.box(x0,z,len,w,.03,"#5F5E63",{solid:false,cast:false,map:true});for(let x=x0+1;x<x0+len;x+=4)P.box(x,z+w/2-.07,2,.14,.01,"#E8E1D2",{y:.03,solid:false,cast:false,map:false});}
function roadZ(P,x,z0,len,w){P.box(x,z0,w,len,.03,"#5F5E63",{solid:false,cast:false,map:true});for(let z=z0+1;z<z0+len;z+=4)P.box(x+w/2-.07,z,.14,2,.01,"#E8E1D2",{y:.03,solid:false,cast:false,map:false});}
function puddles(P,r,x0,z0,x1,z1,n){if(WX.kind!=="monsoon")return;for(let i=0;i<n;i++)P.box(x0+r()*(x1-x0),z0+r()*(z1-z0),1+r()*2.5,.8+r()*1.6,.02,"#6C99C2",{op:.6,y:.03,solid:false,map:false,cast:false});}
function lampPost(P,x,z){P.box(x,z,.14,.14,4,"#4A4A50",{solid:false});P.box(x-.1,z-.1,.34,.34,.16,"#F6D77E",{y:4,glow:true,solid:false});}
function tree(P,x,z,s){s=s||1;P.box(x+.25*s,z+.25*s,.25*s,.25*s,1.4*s,"#7A5534");P.box(x,z,.75*s,.75*s,.9*s,"#5E9A4E",{y:1.3*s,solid:false});P.box(x+.15*s,z+.15*s,.45*s,.45*s,.45*s,"#7DB46B",{y:2.2*s,solid:false});}
function traffic(P,lanes,x0,x1,n,seed){const r=rng(seed||3);for(let i=0;i<n;i++){const lane=lanes[i%lanes.length];const k=r();
    const v=k<.35?makeAuto():k<.55?makeTaxi():k<.68?makeBus():k<.85?makeCar(BCOL[(r()*8)|0]):makeBike(SH[(r()*8)|0],false);
    v.rotation.y=lane.dir>0?Math.PI/2:-Math.PI/2;const pos={x:x0+r()*(x1-x0)};v.position.set(pos.x,0,lane.z);P.add(v);const sp=(4+r()*5)*(WX.rain>.4?.7:1);
    P.anim.push(dt=>{pos.x+=lane.dir*sp*dt;if(pos.x>x1)pos.x=x0;if(pos.x<x0)pos.x=x1;v.position.x=pos.x;});}}
function walkers(P,n,x0,x1,z0,z1,seed){const r=rng(seed||5);for(let i=0;i<n;i++){const z=z0+r()*(z1-z0);const a=P.person(crowdLook(r),x0+r()*(x1-x0),z,0,{wander:[x0,x1],speed:.8+r()*.7,noCol:true});}}

/* Generic street: footpath along the north side, road, low shops south */
function bStreet(ctx,o){o=o||{};const L=o.len||60;const r=rng(o.seed||11);
  const P=new Place({bounds:[1,.6,L-1,15.4],spawn:[3,3.2,Math.PI/2],camDist:17,pitch:.78});
  ground(P,-40,-40,L+40,50,"#CDBFA4");
  let x=-12;while(x<L+12){const w=5+r()*5,h=(o.low?3:5)+r()*(o.low?6:14);P.bldg(x,-9,w,8.6,h,BCOL[(r()*8)|0]);
    if(r()<.55){P.box(x+.4,-.42,w-.8,.5,.12,["#B4553A","#2C6B66","#3E6C9E","#D9A441"][(r()*4)|0],{y:2.6,solid:false,map:false});}x+=w+.3;}
  (o.shops||[]).forEach(s=>{P.box(s.x,-1.2,s.w||6,1,3,s.c||"#2C6B66");P.sign(s.name,s.x+(s.w||6)/2,3.3,-.15,.8,0,{bg:s.bg||"#FBF8F1",fg:"#24242A",fs:40});});
  P.box(-40,-.4,L+80,6.4,.14,"#C9BFAE",{solid:false,map:true});
  roadX(P,-40,6,L+80,7);
  P.box(-40,13,L+80,3,.14,"#C9BFAE",{solid:false,map:true});
  for(let x2=-8;x2<L+8;x2+=r()*5+6){P.box(x2,16.4,4+r()*3,4,3+r()*1.5,BCOL[(r()*8)|0]);}
  for(let x2=4;x2<L;x2+=12){lampPost(P,x2,5.6);tree(P,x2+5,14.2,.9);}
  puddles(P,r,0,6,L,13,8);
  traffic(P,[{z:7.2,dir:1},{z:10.8,dir:-1}],-30,L+30,o.traffic??8,o.seed);
  walkers(P,o.walkers??7,2,L-2,.8,4.8,o.seed);
  if(o.busStop){const bx=o.busStop;P.box(bx,4.6,3,.2,.1,"#4A4A50",{y:2.4,solid:false});P.box(bx,4.6,.12,.12,2.4,"#4A4A50");P.box(bx+2.9,4.6,.12,.12,2.4,"#4A4A50");P.box(bx,4.5,3,.12,.06,"#B84A3A",{y:2.5,solid:false});}
  P.anchor("dest",o.destX??L-5,3.2);
  if(o.destSign)P.sign(o.destSign,(o.destX??L-5),3.6,-.3,.9,0,{bg:"#24242A",fg:"#FBF8F1",fs:40});
  P.anchor("exit",o.destX??L-5,3.2);return P;}

function bBandobast(ctx){const P=bStreet(ctx,{len:56,seed:23,traffic:0,walkers:4,shops:[{x:20,name:"Sai Snacks",c:"#B4553A"}]});const r=rng(4);
  for(let x=4;x<52;x+=2.2)P.box(x,5.8,1.8,.25,1,x%4<2?"#F2EEE6":"#C7694A");
  for(let i=0;i<26;i++){const z=7+r()*5.5;P.person(crowdLook(r),r()*56,z,Math.PI/2,{wander:[0,56],speed:.45+r()*.3,noCol:true});}
  P.box(30,2.4,1.6,.9,.9,"#7A5534");P.box(30.1,2.45,1.4,.8,.15,"#D9A441",{y:.9,solid:false});P.person(NL("#E8E2D6","#7A4E33","#1A1512"),31.2,3.6,Math.PI);P.anchor("vendor",31.2,3.6);
  P.person(NL("#B39B6B","#8D5A3B","#1A1512",{cap:"#2E3B5A",pants:"#B39B6B"}),12,3.4,Math.PI/2);P.anchor("colleague",12,3.4);
  P.box(46,1,2,1.6,2.3,"#3E5A86");P.anchor("exit",50,3.2);P.spawn=[8,3.2,Math.PI/2];return P;}

/* Stations: platform at y=0, tracks below */
function bStation(ctx,o){o=o||{};const L=80;const metro=o.kind==="metro";const r=rng((o.name||"x").length*13);
  const P=new Place({bounds:[2,.7,L-2,6.2],spawn:[6,3.4,Math.PI/2],camDist:15,pitch:.72});
  ground(P,-60,-30,L+60,40,"#8C8378");P.box(-60,-7,L+120,6,.3,"#6B635A",{y:-1.3,solid:false,map:false,cast:false});P.box(-60,7,L+120,6,.3,"#6B635A",{y:-1.3,solid:false,map:false,cast:false});
  for(const z of [-4.2,-1.6,8.4,11])P.box(-60,z,L+120,.15,.15,"#9A9A9A",{y:-1,solid:false,map:false,cast:false});
  P.box(0,0,L,7,1,"#CFC6B4",{y:-1,solid:false,map:true});P.box(0,.05,L,.25,.02,"#E2B53C",{solid:false,map:false});P.box(0,6.7,L,.25,.02,"#E2B53C",{solid:false,map:false});
  for(let x=6;x<L;x+=11){P.box(x,3.2,.4,.4,4.2,"#8F8F94");}
  P.box(0,.6,L,5.8,.15,metro?"#C9D2D8":"#B9B2A6",{y:4.2,op:.18,solid:false,map:false,cast:false});
  const signBg=metro?"#2C8C86":"#F2D24B",signFg=metro?"#FFFFFF":"#1D1D1D";
  for(let x=14;x<L;x+=24){P.sign((o.name||"STATION").toUpperCase(),x,3.3,3.4,.75,0,{bg:signBg,fg:signFg,fs:44});}
  if(metro){for(let x=0;x<L;x+=4){if(Math.abs(x-30)<3||Math.abs(x-50)<3)continue;P.box(x,.15,3.4,.12,1.6,"#BFD7E2",{op:.45,solid:true});}}
  P.box(L-8,2,3,2.6,2.2,"#B4553A");P.sign("Tea",L-6.5,2.6,4.65,.5,0,{bg:"#FBF8F1"});
  for(let x=10;x<L-10;x+=14)P.box(x,5.3,2.2,.5,.45,"#6E7076");
  const crowd=o.crowd==="crush"?42:o.crowd==="busy"?22:o.crowd==="night"?4:10;
  for(let i=0;i<crowd;i++)P.person(crowdLook(r),4+r()*(L-8),1.2+r()*4.8,r()*6.28,{wander:r()<.3?[4,L-4]:null,speed:.6,noCol:true});
  const train=new THREE.Group();for(let i=0;i<4;i++){const c=makeTrainCar(o.kind);c.rotation.y=Math.PI/2;c.position.set(10+i*20,-1,-2.9);train.add(c);}
  train.position.x=140;P.add(train);P.train=train;P.anchor("door",30,.9);return P;}

/* City map for driving */
const CITY={
  city_virar:{n:5,low:true,seed:5,lm:{home:[0,4,3,"Home","#D9906F"],store:[2,3,0,"Dark store","#2C6B66"],rest:[3,1,1,"Hotel Annapurna","#E2B53C"],khan:[1,1,2,"Khanawal","#B4553A"],coaching:[4,2,2,"Coaching classes","#3E6C9E"]}},
  city_kurla:{n:5,low:false,seed:9,lm:{home:[0,4,3,"Kurla chawl","#D9906F"],airport:[4,0,0,"Airport taxi stand","#3E6C9E"],pump:[2,2,1,"CNG pump","#5E9A4E"],tuition:[1,3,0,"Tuition classes","#E2B53C"]}}
};
function bCity(ctx,key){const cfg=CITY[key];const N=cfg.n,PP=26,R=7,size=N*PP;const r=rng(cfg.seed);
  const P=new Place({bounds:[-3,-3,size+3,size+3],spawn:[3.5,size-26,0],camDist:22,pitch:.62});P.city=true;P.drops=[];
  ground(P,-80,-80,size+80,size+80,"#BDB49F");
  for(let k=0;k<=N;k++){roadX(P,-3.5,k*PP-3.5,size+7,R);roadZ(P,k*PP-3.5,-3.5,size+7,R);}
  const slots=[[0,0],[10.5,0],[0,10.5],[10.5,10.5]];const lmAt={};
  for(const [id,v] of Object.entries(cfg.lm))lmAt[v[0]+","+v[1]+","+v[2]]=[id,...v.slice(3)];
  for(let bi=0;bi<N;bi++)for(let bj=0;bj<N;bj++){const bx=bi*PP+3.5,bz=bj*PP+3.5;
    P.box(bx,bz,19,19,.12,"#C9BFAE",{solid:false,map:false,cast:false});
    slots.forEach((s,si)=>{const x=bx+s[0]+.5,z=bz+s[1]+.5;const lm=lmAt[bi+","+bj+","+si];const south=si>1;const cz=south?bz+19+1.6:bz-1.6;const cx=x+4;
      if(lm){P.box(x,z,7.5,7.5,3.6,lm[2]);P.box(x,south?z+7.5:z-.5,7.5,.5,.15,"#FBF8F1",{y:3,solid:false});P.sign(lm[1],x+3.75,4.4,south?z+7.6:z-.1,1.1,south?0:Math.PI,{bg:"#FBF8F1",fs:44});P.anchor(lm[0],cx,cz);P.label(lm[1],x+3.75,6.4,z+3.75,true);}
      else if(r()<.12){tree(P,x+1,z+1,1.2);tree(P,x+4,z+4,1);}
      else{const h=(cfg.low?3:5)+r()*(cfg.low?7:16);P.bldg(x,z,7.5,7.5,h,BCOL[(r()*8)|0]);P.drops.push([cx,cz]);}});}
  for(let k=0;k<=N;k++)for(let j=0;j<N;j++)if(r()<.5)lampPost(P,k*PP-4,j*PP+8+r()*8);
  puddles(P,r,0,0,size,size,30);
  const lanes=[];for(let k=1;k<N;k++){lanes.push({z:k*PP-1.8,dir:1},{z:k*PP+1.8,dir:-1});}traffic(P,lanes,-10,size+10,14,cfg.seed);
  P.spawn=[P.anchors.home[0],P.anchors.home[1],0];P.drops.sort(()=>r()-.5);return P;}

/* Outdoor work places */
function bApron(ctx){const P=new Place({bounds:[-30,-20,30,20],spawn:[-14,12,Math.PI],camDist:24,pitch:.7});
  ground(P,-90,-90,90,90,"#8E8D8A");for(let x=-30;x<30;x+=6)P.box(x,8,3,.2,.01,"#E2B53C",{y:.01,solid:false,map:false});
  const pl=makePlane();pl.rotation.y=Math.PI/2;pl.position.set(0,0,0);P.add(pl);P.col.push([-16,-1.8,16,1.8]);P.mini.push([-16,-1.8,32,3.6,"#F4F1EA"],[-2,-16,4,32,"#E6E3DC"]);
  P.bldg(-40,-46,80,16,14,"#A9B9C2");P.box(18,-16,4,18,2.4,"#C9CDD2",{y:3.5});
  P.box(-12,6,3,1.6,1.1,"#E2B53C");P.box(8,7,4,2,1.2,"#5E6C78");for(const x of [-18,-6,6,18])P.box(x,4,.4,.4,.7,"#E2702A");
  P.person(NL("#E2702A","#7A4E33","#1A1512"),-8,5,Math.PI);P.person(NL("#E2702A","#8D5A3B","#1A1512"),10,6,Math.PI);
  P.person(NL("#3E5A86","#8D5A3B","#55504A",{cap:"#E2B53C"}),-17,3.4,Math.PI/2);P.anchor("engineer",-17,3.4);
  P.anchor("cargo",-11,2.6);P.anchor("exit",13,3);P.anchor("door",13,3);return P;}
function bPromenade(ctx){const P=new Place({bounds:[1,-1.8,58,9],spawn:[4,5,Math.PI/2],camDist:18,pitch:.75});
  ground(P,-40,-10,100,60,"#CDBFA4");P.box(-40,-60,140,54,.3,"#4F84B0",{y:-.9,solid:false,map:false,cast:false});
  const waves=[];for(let i=0;i<14;i++){const w=P.box(-10+i*7,-10-(i%3)*4,5,.4,.08,"#9CC4DE",{y:-.6,solid:false,map:false,cast:false});waves.push(w);}
  P.anim.push((dt,t)=>{waves.forEach((w,i)=>{w.position.y=-.65+Math.sin(t*1.3+i)*.08;});});
  for(let i=0;i<20;i++)P.box(-6+i*3.4,-5.4+(i%2)*.6,2,1.4,.6+(i%3)*.3,"#6E655B",{y:-.4,solid:false});
  P.box(-40,-2.2,140,.12,1,"#4A4A50",{solid:true});P.box(-40,-2,140,11,.12,"#D8CCB3",{solid:false,map:true});
  for(let x=4;x<58;x+=10){lampPost(P,x,-1.4);P.box(x+3,6.8,2.2,.5,.45,"#6E7076");}
  for(let x=-10;x<70;x+=8)P.bldg(x,14,6,6,5+((x*7)%9),BCOL[((x+20)/8|0)%8]);
  P.box(40,3,1.6,1,1,"#7A5534");P.box(40.2,3.1,1.2,.8,.12,"#E2702A",{y:1,glow:true,solid:false});P.person(NL("#E8E2D6","#7A4E33","#55504A"),40.8,4.6,Math.PI);P.anchor("vendor",40.8,4.6);
  P.person(NL("#2C6B66","#A8704A","#1A1512",{long:true}),18,1.4,Math.PI);P.box(17,0,.1,.1,1.5,"#3A3A40");P.anchor("collab",18,1.4);
  P.person(NL("#2E3A4E","#B07A55","#2A211B"),30,6.6,Math.PI);P.anchor("manager",30,6.6);
  const r=rng(31);walkers(P,10,2,56,0,8,31);P.anchor("exit",56,4);P.anchor("door",56,4);return P;}

/* Ride interiors and the moving world outside */
function bCarInterior(ctx,o){const bus=o.kind==="bus";const L=bus?11:20,W=bus?2.6:3.4;const metro=o.kind==="metro",ac=o.kind==="actrain";
  const P=new Place({indoor:true,bounds:[.5,.45,L-.5,W-.45],spawn:[L/2,W/2,Math.PI/2],camDist:8.5,pitch:.9});
  const fl=metro?"#9AA3AB":ac?"#A7B4BF":bus?"#5A5F66":"#7D7A72",wl=metro?"#DDE3E8":ac?"#E6ECF0":bus?"#B84A3A":"#E8DFC9",seat=metro?"#2C8C86":ac?"#2F5E9E":bus?"#3E5A86":"#7D8A96";
  P.box(-.1,-.1,L+.2,W+.2,.15,fl,{y:-.15,solid:false,map:false});
  for(const [z,n] of [[-.15,[0,-1]],[W,[0,1]]]){const doors=bus?[2,8]:[3,10,17];
    for(let x=0;x<L;x+=.5){const isDoor=doors.some(dx=>x>=dx&&x<dx+1.5);if(isDoor)continue;const m1=P.wall(x,z,.5,.15,1,wl,n);}
    for(let x=0;x<L;x+=2.5)P.wall(x,z,.25,.15,1.05,wl,n).position.y=1;
    P.wall(0,z,L,.15,.55,wl,n).position.y=2.05;}
  P.wall(-.15,0,.15,W,2.6,wl,[-1,0]);P.wall(L,0,.15,W,2.6,wl,[1,0]);
  P.box(0,.3,L,.06,.08,"#FFF4C2",{y:2.5,solid:false,em:"#FFF4C2",ei:1,map:false});P.box(0,W-.36,L,.06,.08,"#FFF4C2",{y:2.5,solid:false,em:"#FFF4C2",ei:1,map:false});
  const pl=new THREE.PointLight(0xfff0d8,.5,18);pl.position.set(L/2,2.3,W/2);P.add(pl);
  const r=rng(7);const seated=[];
  if(bus){for(let x=1;x<L-1;x+=1.4){P.box(x,.1,.9,.8,.45,seat);P.box(x,W-.9,.9,.8,.45,seat);seated.push([x+.45,.5],[x+.45,W-.5]);}}
  else{for(const z of [.1,W-.6])for(let x=.2;x<L;x+=6.5){P.box(x,z,2.6,.5,.45,seat);for(let k=0;k<4;k++)seated.push([x+.3+k*.6,z+.25]);}}
  for(let x=2;x<L;x+=3){P.box(x,W/2-.05,.08,.08,2.4,"#C9CDD2",{solid:false});}
  P.box(0,.55,L,.04,.04,"#C9CDD2",{y:2.15,solid:false,map:false});P.box(0,W-.6,L,.04,.04,"#C9CDD2",{y:2.15,solid:false,map:false});
  seated.forEach(([x,z])=>{if(r()<.85)P.person(crowdLook(r),x,z,z<W/2?0:Math.PI,{pose:"sit",y:.1,noCol:true});});
  const stand=o.crowd==="crush"?32:o.crowd==="busy"?14:o.crowd==="night"?1:5;
  for(let i=0;i<stand;i++){let x,z,t=0;do{x=.8+r()*(L-1.6);z=.75+r()*(W-1.5);t++;}while(Math.abs(x-L/2)<1&&Math.abs(z-W/2)<.8&&t<10);P.person(crowdLook(r),x,z,r()*6.28);}
  if(bus)P.person(NL("#B39B6B","#7A4E33","#1A1512"),L-.8,.6,0,{pose:"sit"});
  const out=new THREE.Group();P.add(out);P.outside=out;
  return P;}
function buildOutside(P,o){const g=P.outside;const total=o.len;const r=rng(o.seed||3);const W=o.W||3.4;const rail=o.rail;
  const gy=rail?-1.4:-.05;
  const groundM=new THREE.Mesh(G_MIN,M(rail?"#8C8378":"#5F5E63"));groundM.scale.set(total+200,.1,rail?14:12);groundM.position.set(-100,gy-.1,rail?-5:-4);g.add(groundM);
  for(let x=-60;x<total+80;x+=r()*6+7){for(const side of [-1,1]){const h=4+r()*16,w=4+r()*4,d=4+r()*4;const z=side<0?-8-d-r()*6:W+8+r()*6;
      const geo=winGeo(w,h,d);P.disp.push(geo);const m=new THREE.Mesh(geo,[WM(BCOL[(r()*8)|0]),WM(BCOL[(r()*8)|0]),M("#8C8378"),M("#8C8378"),WM(BCOL[(r()*8)|0]),WM(BCOL[(r()*8)|0])]);m.position.set(x,gy,z);g.add(m);}
    if(r()<.6){const p=new THREE.Mesh(G_MIN,M("#4A4A50"));p.scale.set(.15,4.5,.15);p.position.set(x,gy,-1.2);g.add(p);}}
  if(!rail){for(let x=-60;x<total+80;x+=4){const d=new THREE.Mesh(G_MIN,M("#E8E1D2"));d.scale.set(2,.02,.14);d.position.set(x,0,1.7);g.add(d);}
    for(let i=0;i<Math.floor(total/12);i++){const k=r();const v=k<.4?makeAuto():k<.6?makeTaxi():k<.75?makeBus():makeCar(BCOL[(r()*8)|0]);v.rotation.y=k<.5?Math.PI/2:-Math.PI/2;v.position.set(r()*total,0,k<.5?-1.8:4.4);g.add(v);}}
  (o.stops||[]).forEach(s=>{const plat=new THREE.Mesh(G_MIN,M("#CFC6B4"));plat.scale.set(70,1,5);plat.position.set(s.x-35,-1,-5.6);g.add(plat);
    const {t,ar}=textTex(s.name.toUpperCase(),{bg:rail==="metro"?"#2C8C86":"#F2D24B",fg:rail==="metro"?"#fff":"#1d1d1d",fs:44});for(const dx of [-20,0,20]){const sgn=new THREE.Mesh(new THREE.PlaneGeometry(.8*ar,.8),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}));P.disp.push(sgn.geometry,sgn.material);sgn.position.set(s.x+dx,2.6,-3.2);g.add(sgn);}
    for(let i=0;i<s.crowd;i++){const a=makeAvatar(crowdLook(r));a.position.set(s.x-30+r()*60,0,-5.2+r()*4);a.rotation.y=Math.PI;g.add(a);}});}
function bRoadRide(ctx,o){const P=new Place({bounds:[-1,-1,1,1],spawn:[0,0,0],camDist:12,pitch:.5});
  const v=o.vehicle==="auto"||o.vehicle==="shareauto"?makeAuto():o.vehicle==="scooter"?makeBike("#2C6B66",false):o.vehicle==="van"?makeBus():o.vehicle==="taxi"?makeTaxi():makeCar(o.vehicle==="crewcab"?"#E8E2D6":"#3E5A86");
  v.rotation.y=Math.PI/2;P.add(v);P.vehicle=v;const p=makeAvatar(o.look);setPose(p,"sit");p.rotation.y=Math.PI/2;
  if(o.vehicle==="scooter"){p.position.set(-.05,.45,0);}else if(o.vehicle==="auto"||o.vehicle==="shareauto"){p.position.set(-.5,.35,0);const d=makeAvatar(NL("#E8E2D6","#7A4E33","#1A1512"));setPose(d,"sit");d.rotation.y=Math.PI/2;d.position.set(.5,.35,0);v.add(d);d.rotation.y=0;}
  else{p.position.set(-.6,.35,.4);}
  if(o.vehicle==="scooter")v.add(p),p.rotation.y=0;else{v.add(p);p.rotation.y=0;}
  P.add(new THREE.Group());P.outside=P.g.children[P.g.children.length-1];return P;}

/* Showcases */
function bPodium(ctx,c){const P=new Place({bounds:[-3,-3,3,3],spawn:[0,0,0],camDist:7,pitch:.22});
  ground(P,-80,-80,80,80,"#CDBFA4");
  const disc=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.6,.5,8),M("#B4553A"));disc.position.y=-.25;disc.receiveShadow=true;P.add(disc);P.disp.push(disc.geometry);
  const r=rng(c?c.id.length*17:3);for(let i=0;i<14;i++){const a=i/14*Math.PI*2+.3,d=16+r()*14;P.bldg(Math.cos(a)*d-3,Math.sin(a)*d-3,6,6,4+r()*16,BCOL[i%8]);}
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;tree(P,Math.cos(a)*8,Math.sin(a)*8,1.1);}
  return P;}
const ZONES={bandra:{x:5,z:.8,h:[6.5,4.5,7.2,3.8]},andheri:{x:5,z:5.2,h:[4,5,3.2,4.6]},powai:{x:12,z:.8,h:[6.2,5,4,5.5]},thane:{x:12,z:5.2,h:[3.6,4.2,3,3.4]},virar:{x:12,z:9.6,h:[2.4,2,2.8,2.2]}};
function bDream(ctx,dr){const P=new Place({bounds:[0,0,17,13],spawn:[8.5,6.5,0],camDist:24,pitch:.72});
  ground(P,-40,-40,60,60,"#D8CCB3");P.box(-40,-40,43,90,.05,"#5A8DB8",{solid:false,map:false});P.box(3,-40,.8,90,.1,"#E9DCC0",{solid:false,map:false});
  P.box(10,-40,1.3,90,.08,"#6E6C71",{solid:false,map:false});
  const tr=new THREE.Group();for(let i=0;i<3;i++){const c=makeTrainCar("train");c.scale.set(.35,.35,.2);c.position.set(10.65,.3,i*4);tr.add(c);}P.add(tr);P.anim.push((dt,t)=>{tr.position.z=((t*2.5)%40)-20;});
  for(const [id,z] of Object.entries(ZONES)){const sel=dr.hood===id;P.box(z.x-.25,z.z-.25,4.6,4,.08,sel?"#E6D3B3":"#CFC3AB",{solid:false});
    z.h.forEach((h,i)=>{P.bldg(z.x+(i%2)*2.2,z.z+Math.floor(i/2)*1.8,1.8,1.45,h,sel?["#C7694A","#E6D7B8","#D9906F","#B9C7C0"][i%4]:"#CEC3AF");});
    P.label(HOOD_NAME[id],z.x+2,Math.max(...z.h)+1.2,z.z+1.6,sel);}
  const z=ZONES[dr.hood];const n={alone:1,flatmates:3,family:4}[dr.arrange];const hh=z.h[2];
  for(let i=0;i<n;i++){const a=makeAvatar(NL(["#2C6B66","#E2B53C","#8E4C6B","#5A6E8C"][i],SK[i],i===3?"#C9C2B8":"#1A1512",{long:i%2===1}));a.scale.setScalar(.7);a.position.set(z.x+.3+i*.4,hh,z.z+2.4);P.add(a);P.npcs.push({a});}
  if(dr.transport==="scooter"){const b=makeBike("#2C6B66",false);b.scale.setScalar(.8);b.position.set(z.x+1,0,z.z+3.9);P.add(b);}
  if(dr.transport==="car"){const cr=makeCar("#2C6B66");cr.scale.setScalar(.6);cr.rotation.y=Math.PI/2;cr.position.set(z.x+1.8,0,z.z+3.9);P.add(cr);}
  if(dr.travel!=="none"){const pl=makePlane();pl.scale.setScalar(.12);pl.rotation.y=Math.PI/2;P.add(pl);P.anim.push((dt,t)=>{pl.position.set(((t*2)%40)-12,10,3);});}
  for(const [x,zz] of [[9,2],[9,8],[4,11],[16.6,4]])tree(P,x,zz,.8);
  return P;}
function bSettle(ctx){const P=new Place({bounds:[-1,-1,7,7],spawn:[3,3,0],camDist:15,pitch:.62});ground(P,-60,-60,60,60,"#D8CCB3");P.box(-.4,-.4,6.8,6.8,.15,"#A9774A",{solid:false});P.cubes=[];P.fly=[];return P;}

/* Registry */
const PLACES=Object.assign({},HOMES,{
  office_airoli:ctx=>bOffice(ctx,{style:"airoli"}),office_lowerparel:ctx=>bOffice(ctx,{style:"lowerparel"}),office_bkc:ctx=>bOffice(ctx,{style:"bkc"}),
  school:ctx=>bSchool(ctx),ward_parel:ctx=>bWard(ctx,{crowded:true}),ward_andheri:ctx=>bWard(ctx,{}),set:ctx=>bSet(ctx),apron:ctx=>bApron(ctx),promenade:ctx=>bPromenade(ctx),
  bandobast:ctx=>bBandobast(ctx),city_virar:ctx=>bCity(ctx,"city_virar"),city_kurla:ctx=>bCity(ctx,"city_kurla")
});
function buildPlace(key,ctx){const f=PLACES[key];if(!f){console.warn("no place",key);return bStreet(ctx,{});}return f(ctx);}
