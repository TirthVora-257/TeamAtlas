/* ============================================================
   ENGINE 2a: furniture, rooms and workplaces
   ============================================================ */
const NL=(shirt,skin,hair,o)=>Object.assign({shirt,skin,hair},o||{});
const F={
  bed:(P,x,z,c)=>{P.box(x,z,2,1.3,.45,"#8D6A4A");P.box(x+.05,z+.05,1.9,1.2,.18,c||"#5D7FA3",{y:.45,solid:false});P.box(x+.1,z+.15,.45,1,.12,"#F2EEE6",{y:.63,solid:false});},
  mattress:(P,x,z,c)=>P.box(x,z,1.9,1,.2,c||"#C9A27A",{solid:false}),
  counter:(P,x,z,w)=>{w=w||2.6;P.box(x,z,w,.7,.9,"#B98A5E");P.box(x+.3,z+.1,.8,.5,.1,"#3A3A40",{y:.9,solid:false});P.box(x+.5,z+.2,.35,.3,.3,"#B8BCC2",{y:1,solid:false});P.box(x+w-.6,z+.2,.3,.3,.35,"#C7694A",{y:.9,solid:false});},
  table:(P,x,z,w,d,c)=>P.box(x,z,w||1.4,d||.9,.74,c||"#A9774A"),
  chair:(P,x,z)=>{P.box(x,z,.5,.5,.45,"#7A5534");P.box(x,z,.5,.08,1,"#7A5534",{solid:false});},
  cupboard:(P,x,z,c,w)=>P.box(x,z,w||1,.6,2,c||"#8D7155"),
  sewing:(P,x,z)=>{P.box(x,z,1,.6,.74,"#A9774A");P.box(x+.2,z+.15,.5,.3,.3,"#2A2D34",{y:.74,solid:false});},
  laptop:(P,x,z)=>{P.box(x,z,.42,.3,.03,"#2A2D34",{y:.74,solid:false});P.box(x,z,.42,.03,.28,"#7FB3D8",{y:.77,em:"#7FB3D8",ei:.8,solid:false});},
  desk:(P,x,z,c)=>{P.box(x,z,1.5,.75,.74,c||"#EAE6DD");P.box(x+.45,z+.05,.6,.06,.4,"#2A2D34",{y:.78,solid:false});P.box(x+.48,z+.12,.54,.01,.34,"#8EC3E6",{y:.81,em:"#8EC3E6",ei:.9,solid:false});},
  sofa:(P,x,z,c,w)=>{w=w||2.2;P.box(x,z,w,.9,.45,c||"#7A8C6E");P.box(x,z,w,.25,.95,c||"#7A8C6E");},
  tv:(P,x,z)=>P.box(x,z,1.2,.08,.7,"#1A1A1E",{y:.9,em:"#36506a",ei:.5,solid:false}),
  fridge:(P,x,z)=>P.box(x,z,.7,.7,1.7,"#DCDCDC"),
  bunk:(P,x,z,c)=>{P.box(x,z,1.9,.95,.35,"#6E7076");P.box(x+.05,z+.05,1.8,.85,.15,c||"#5D7FA3",{y:.35,solid:false});P.box(x,z,1.9,.95,.08,"#6E7076",{y:1.45,solid:false});P.box(x+.05,z+.05,1.8,.85,.15,"#C7694A",{y:1.53,solid:false});for(const dx of [0,1.82])P.box(x+dx,z,.08,.95,1.8,"#6E7076",{solid:false});},
  plant:(P,x,z)=>{P.box(x,z,.4,.4,.4,"#B4553A");P.box(x-.1,z-.1,.6,.6,.7,"#5E9A4E",{y:.4,solid:false});},
  shelf:(P,x,z,w)=>{w=w||1.4;P.box(x,z,w,.35,1.8,"#8D7155");const cs=["#3E6C9E","#C7694A","#4E8C86","#E2B53C","#8E4C6B"];for(let i=0;i<5;i++)P.box(x+.1+i*(w-.2)/5,z+.03,(w-.2)/5-.03,.25,.35,cs[i],{y:1.1,solid:false});},
  ring:(P,x,z)=>{P.box(x,z,.1,.1,1.7,"#3A3A40");P.box(x-.3,z-.04,.7,.12,.7,"#FFF4D6",{y:1.7,em:"#FFF4D6",ei:1,solid:false});},
  rug:(P,x,z,w,d,c)=>P.box(x,z,w,d,.02,c||"#B4553A",{solid:false,map:false,cast:false}),
  trunk:(P,x,z)=>P.box(x,z,.9,.5,.5,"#4C6E8A"),
  stack:(P,x,z,n)=>{for(let i=0;i<(n||5);i++)P.box(x,z,.5,.38,.06,["#3E6C9E","#C7694A","#4E8C86"][i%3],{y:.74+i*.065,solid:false});},
  board:(P,x,w,c)=>P.box(x,0,w,.05,1.4,c||"#2F4F44",{y:.95,solid:false,map:false}),
  screen:(P,x,w)=>P.box(x,0,w,.05,1.1,"#1A2230",{y:1,em:"#4E8CC2",ei:.6,solid:false,map:false}),
  bag:(P,x,z)=>{P.box(x,z,.45,.3,.6,"#2A2D34");P.box(x+.15,z+.1,.12,.1,.4,"#555",{y:.6,solid:false});},
  rail:(P,x,z,w)=>{P.box(x,z,w,.06,1,"#4A4A50");}
};

function bRoom(o,ctx){const w=o.w,d=o.d,door=o.door??1;const night=((ctx.min/60)%24+24)%24;const dark=night<6||night>19.3;
  const P=new Place({indoor:true,bounds:[.35,.35,w-.35,d-.35],spawn:o.spawn||[door+.6,d-1,Math.PI],camDist:o.cam||12,name:o.name});
  P.box(-.2,-.2,w+.4,d+.4,.2,o.floor||"#D9C3A1",{y:-.2,solid:false,map:false});
  P.wall(-.2,-.2,w+.4,.2,2.8,o.wall||"#EADFCB",[0,-1]);P.wall(-.2,0,.2,d,2.8,o.wall2||o.wall||"#E0D4BE",[-1,0]);P.wall(w,0,.2,d,2.8,o.wall2||o.wall||"#E0D4BE",[1,0]);
  P.wall(-.2,d,door+.2,.2,2.8,o.wall||"#EADFCB",[0,1]);P.wall(door+1.2,d,w-door-1,.2,2.8,o.wall||"#EADFCB",[0,1]);
  const wx=o.winX??w*.55;P.box(wx,0,1.7,.05,1.15,dark?"#2B3556":(ctx.wx==="monsoon"?"#9AA9B4":"#C4DCE6"),{y:1.1,solid:false,map:false,em:dark?"#1C2340":"#C4DCE6",ei:dark?.2:.35});
  P.box(w/2-.35,.01,.7,.1,.12,"#FFF4C2",{y:2.5,solid:false,map:false,em:"#FFF4C2",ei:dark?1:.3});
  if(dark){const pl=new THREE.PointLight(0xffe2b0,.7,14);pl.position.set(w/2,2.3,d/2);P.add(pl);}
  (o.items||[]).forEach(it=>F[it[0]](P,...it.slice(1)));
  (o.npcs||[]).forEach(n=>{P.person(n[1],n[2],n[3],n[4]||0,{pose:n[5]});P.anchor(n[0],n[2],n[3]);});
  Object.entries(o.anchors||{}).forEach(([k,v])=>P.anchor(k,v[0],v[1]));
  P.anchor("door",door+.6,d-.55);
  return P;}

/* Character homes */
const RL={aai:NL("#8E4C6B","#7E5036","#1A1512",{long:true}),sana:NL("#E3C76A","#8D5A3B","#1A1512",{long:true})};
const HOMES={
  home_rohit:ctx=>bRoom({w:8,d:6,winX:4.6,door:1,items:[["counter",.3,.3],["table",2.8,2.4,1.4,.9],["stack",3.2,2.6,2],["bed",5.6,.4,"#5D7FA3"],["mattress",5.7,3.6,"#C9A27A"],["chair",2.2,4.0],["cupboard",7,4.6]],
    npcs:[["aai",RL.aai,1.4,1.4,0],["sana",RL.sana,6.6,4.1,Math.PI/2,"lie"]],anchors:{chair:[2.45,4.6]}},ctx),
  home_rohit_night:ctx=>bRoom({w:8,d:6,winX:4.6,door:1,items:[["counter",.3,.3],["table",2.8,2.4,1.4,.9],["stack",3.2,2.6,3],["bed",5.6,.4,"#5D7FA3"],["cupboard",7,4.6]],
    npcs:[["aai",RL.aai,3.5,3.6,Math.PI,"sit"],["sana",RL.sana,6.2,1.2,0,"sit"]]},ctx),
  home_faizan:ctx=>bRoom({w:8,d:6,winX:4.2,items:[["sewing",.4,.4],["bed",5.6,.4,"#9C7FB0"],["table",2.8,2.8,1.6,.9],["laptop",3.3,3.1],["cupboard",.4,4.4,"#7A8C9E"],["rug",2.4,1.6,2,1.2,"#4E8C86"]],
    npcs:[["ammi",NL("#7A4E8C","#A8704A","#1A1512",{long:true}),.9,1.3,0,"sit"],["dadi",NL("#E8E2D6","#9A6748","#C9C2B8",{long:true}),6.5,1.2,0,"sit"]],anchors:{laptop:[3.5,4]}},ctx),
  home_faizan_night:ctx=>bRoom({w:8,d:6,winX:4.2,items:[["sewing",.4,.4],["bed",5.6,.4,"#9C7FB0"],["table",2.8,2.8,1.6,.9],["laptop",3.3,3.1],["mattress",.5,3.8,"#C9A27A"]],npcs:[["dadi",NL("#E8E2D6","#9A6748","#C9C2B8",{long:true}),6.6,1,Math.PI/2,"lie"]],anchors:{laptop:[3.5,4]}},ctx),
  flat_ruth:ctx=>bRoom({w:9,d:7,winX:5,wall:"#EDE0CE",items:[["counter",.3,.3],["bed",6.6,.4,"#E2B53C"],["bed",6.6,4.8,"#7FB3AE"],["table",3,2.8,1.6,1],["stack",3.3,3,6],["shelf",.3,5.6,1.6]],
    npcs:[["kavya",NL("#7FB3AE","#7C5038","#1A1512",{long:true,pants:"#7FB3AE"}),1.6,1.4,0]],anchors:{table:[3.8,4.2]}},ctx),
  flat_ruth_night:ctx=>{const P=bRoom({w:9,d:7,winX:5,wall:"#EDE0CE",items:[["counter",.3,.3],["bed",6.6,4.8,"#7FB3AE"],["table",3,2.8,1.6,1],["stack",3.3,3,3],["plant",7.8,.5],["plant",8.2,1.6]]},ctx);F.rail(P,6,2.4,2.8);P.anchor("balcony",7.4,1.4);return P;},
  flat_kavya:ctx=>bRoom({w:9,d:7,winX:5,wall:"#EDE0CE",items:[["counter",.3,.3],["bed",6.6,.4,"#E2B53C"],["bed",6.6,4.8,"#7FB3AE"],["table",3,2.8,1.6,1],["stack",3.3,3,6]],
    npcs:[["ruth",NL("#5E9A4E","#9A6748","#1C1612",{long:true}),1.6,1.4,0]],anchors:{window:[5.8,.8]}},ctx),
  flat_kavya_morning:ctx=>bRoom({w:9,d:7,winX:5,wall:"#EDE0CE",items:[["counter",.3,.3],["bed",6.6,.4,"#E2B53C"],["bed",6.6,4.8,"#7FB3AE"],["table",3,2.8,1.6,1]],npcs:[["ruth",NL("#5E9A4E","#9A6748","#1C1612",{long:true,bag:"#3E5A86"}),2,4.8,Math.PI]],anchors:{}},ctx),
  hostel_ananya:ctx=>bRoom({w:7,d:6,winX:3.2,wall:"#E4E8E2",floor:"#C9C6BC",items:[["bed",.3,.3,"#7FB3AE"],["bed",4.7,.3,"#E2B53C"],["table",2.6,3.4,1.6,.8],["shelf",.3,4.8,1.4],["stack",2.8,3.5,7]],
    npcs:[["farah",NL("#7FB3AE","#9A6748","#1A1512",{long:true}),5.7,1,Math.PI/2,"lie"]],anchors:{desk:[3.4,4.6]}},ctx),
  home_kunal:ctx=>bRoom({w:10,d:7,winX:5,wall:"#EFE4D2",floor:"#D7C9AF",items:[["sofa",.4,4,"#7A5C8E",2.4],["tv",4,.3],["table",6.2,2.8,2,1.1,"#8D6A4A"],["chair",6.4,4.1],["counter",.3,.3,2.4],["fridge",3,.3],["rug",3.6,3.2,2.2,1.6,"#B4553A"]],
    npcs:[["papa",NL("#E8E2D6","#B07A55","#9A9590"),7,2.4,Math.PI,"sit"],["mummy",NL("#C7694A","#B07A55","#2A211B",{long:true}),1.4,1.3,0],["isha",NL("#E2B53C","#B07A55","#2A211B",{long:true}),1.2,4.7,0,"sit"]],anchors:{}},ctx),
  home_kunal_night:ctx=>bRoom({w:10,d:7,winX:5,wall:"#EFE4D2",floor:"#D7C9AF",items:[["sofa",.4,4,"#7A5C8E",2.4],["tv",4,.3],["table",6.2,2.8,2,1.1,"#8D6A4A"],["laptop",6.6,3]],npcs:[],anchors:{papa:[7,4.3]}},ctx),
  flat_tanvi:ctx=>bRoom({w:10,d:7,winX:5.5,wall:"#F2F0EA",floor:"#BFA98A",items:[["sofa",.4,4.2,"#3E5A86",2.6],["counter",.3,.3,3],["table",5.8,2.6,1.8,1,"#2A2D34"],["laptop",6.2,2.8],["plant",9,.5],["plant",9,5.8],["rug",3.6,3.4,2.4,1.8,"#D9A441"]],
    npcs:[["flatmate",NL("#8E4C6B","#B07A55","#1A1512",{long:true}),1.6,4.9,0,"sit"]],anchors:{phone:[6.6,4]}},ctx),
  quarters_santosh:ctx=>bRoom({w:7,d:5.5,winX:3.6,wall:"#DCE6E2",floor:"#CFC4AE",items:[["bed",.3,.3,"#C7694A"],["cupboard",5.6,.3,"#7A8C9E"],["counter",2.6,.3,2],["tv",5.6,3.6],["trunk",.3,4.4]],
    npcs:[["sangeeta",NL("#B4553A","#7A4E33","#1A1512",{long:true}),3.4,1.4,0],["om",NL("#F2EEE6","#7A4E33","#1A1512",{s:.8,pants:"#3E5A86"}),1.6,3.4,0]],anchors:{}},ctx),
  quarters_santosh_night:ctx=>bRoom({w:7,d:5.5,winX:3.6,wall:"#DCE6E2",floor:"#CFC4AE",items:[["bed",.3,.3,"#C7694A"],["cupboard",5.6,.3,"#7A8C9E"],["table",2.8,2.6,1.2,.8]],
    npcs:[["sangeeta",NL("#B4553A","#7A4E33","#1A1512",{long:true}),3.4,3.8,Math.PI,"sit"]],anchors:{}},ctx),
  home_iqbal:ctx=>bRoom({w:7,d:5,winX:3.6,wall:"#D8CDB8",floor:"#BDA98A",items:[["mattress",.3,.3,"#C7694A"],["mattress",.3,1.4,"#3E6C9E"],["trunk",5.8,.3],["counter",3,.3,1.8],["sewing",5.2,3.8]],
    npcs:[["shabana",NL("#4E8C86","#8A5A3C","#1A1512",{long:true}),3.8,1.3,0],["ammi",NL("#E8E2D6","#8A5A3C","#C9C2B8",{long:true}),5.6,1.6,0,"sit"],["zoya",NL("#E3C76A","#8A5A3C","#1A1512",{long:true}),1.2,.9,Math.PI/2,"lie"]],anchors:{}},ctx),
  home_riya:ctx=>bRoom({w:8,d:6,winX:4.4,wall:"#F0DCE2",items:[["sofa",.4,4,"#4E8C86",2.2],["ring",6.4,1],["table",3,2.6,1.4,.9],["laptop",3.4,2.8],["tv",5,.3],["counter",.3,.3,2]],
    npcs:[["aai",NL("#B4553A","#A06C4A","#1C1611",{long:true}),3.8,2.1,0],["sahil",NL("#2C6B66","#A06C4A","#1C1611"),1.2,4.6,0,"sit"]],anchors:{}},ctx),
  home_riya_night:ctx=>bRoom({w:8,d:6,winX:4.4,wall:"#F0DCE2",items:[["sofa",.4,4,"#4E8C86",2.2],["ring",6.4,1],["table",3,2.6,1.4,.9],["laptop",3.4,2.8]],npcs:[["aai",NL("#B4553A","#A06C4A","#1C1611",{long:true}),1.4,4.6,0,"sit"]],anchors:{}},ctx),
  pg_aman:ctx=>bRoom({w:7,d:5.5,winX:3.4,wall:"#D9D5CC",floor:"#B9B2A2",items:[["bunk",.3,.3,"#5D7FA3"],["bunk",4.8,.3,"#8A3B3B"],["table",2.6,3.6,1.4,.8],["laptop",3,3.8],["bag",.4,4.6]],
    npcs:[["varun",NL("#E2B53C","#B5835E","#1A1512"),3.2,2,0],["roommate",NL("#4E8C86","#8D5A3B","#1A1512"),5.4,.8,Math.PI/2,"lie"]],anchors:{desk:[3.3,4.8]}},ctx),
  pg_aman_night:ctx=>bRoom({w:7,d:5.5,winX:3.4,wall:"#D9D5CC",floor:"#B9B2A2",items:[["bunk",.3,.3,"#5D7FA3"],["bunk",4.8,.3,"#8A3B3B"],["table",2.6,3.6,1.4,.8]],npcs:[["varun",NL("#E2B53C","#B5835E","#1A1512"),1.2,1.2,Math.PI/2,"sit"]],anchors:{}},ctx),
  flat_meher:ctx=>bRoom({w:8,d:6,winX:4.6,wall:"#EEF0F2",floor:"#B79F80",items:[["bed",5.6,.4,"#2E3A4E"],["counter",.3,.3,2.4],["table",3,2.8,1.4,.9,"#2A2D34"],["laptop",3.4,3],["bag",6.8,4.6],["plant",.4,5]],
    npcs:[],anchors:{phone:[3.7,4.1],bag:[6.6,4.2]}},ctx),
  tuition:ctx=>bRoom({w:8,d:6,winX:4.4,wall:"#F0E2C9",items:[["sofa",5.2,.4,"#7A8C6E"],["table",2.2,2.4,2.4,1.2,"#A9774A"],["shelf",.3,4.6,1.4]],
    npcs:[["kid1",NL("#E2B53C","#A8704A","#1A1512",{s:.75}),2.4,2.0,0,"sit"],["kid2",NL("#C7694A","#8D5A3B","#1A1512",{long:true}),3.6,2.0,0,"sit"],["parent",NL("#9C7FB0","#B07A55","#1A1512",{long:true}),6,2.4,Math.PI]],anchors:{}},ctx),
  crewroom:ctx=>bRoom({w:9,d:7,winX:4.6,wall:"#E6E9EC",floor:"#9AA3AB",items:[["sofa",.4,4.8,"#2E3A4E",2.6],["sofa",4,4.8,"#2E3A4E",2.6],["table",3,2.6,2,1],["fridge",8,.3],["screen",1,2.4]],
    npcs:[["captain",NL("#F4F1EA","#B07A55","#55504A",{cap:"#22242C",pants:"#22242C"}),3.4,3.8,Math.PI,"sit"],["roster",NL("#2E3A4E","#8D5A3B","#1A1512"),2.2,.9,0]],anchors:{}},ctx),
  police_desk:ctx=>bRoom({w:10,d:7,winX:5,wall:"#E2DDC8",floor:"#BFB49C",items:[["table",3.2,1.6,2.4,1,"#7A5534"],["desk",3.4,.4,"#7A5534"],["cupboard",.3,.3,"#7A8C9E",1.4],["cupboard",8.4,.3,"#7A8C9E"],["sofa",.4,4.6,"#6E7076",3]],
    npcs:[["officer",NL("#B39B6B","#8D5A3B","#1A1512",{cap:"#2E3B5A",pants:"#B39B6B"}),4,.9,0,"sit"],["woman",NL("#C7694A","#A8704A","#1A1512",{long:true}),4.6,3.4,Math.PI]],anchors:{}},ctx),
  office_small:ctx=>bRoom({w:8,d:6,winX:4.8,wall:"#E6DDC8",items:[["shelf",.3,.3,1.6],["desk",2.6,2.2,"#B98A5E"],["table",5.6,3.4,1.6,.9],["stack",5.9,3.6,4]],npcs:[["owner",NL("#4E8C86","#8A5A3C","#55504A"),6,1.4,0]],anchors:{}},ctx)
};

/* Offices */
function bOffice(ctx,o){o=o||{};const st=o.style||"airoli";const w=18,d=12;const night=((ctx.min/60)%24+24)%24;const dark=night<6||night>19;
  const pal={airoli:{floor:"#9AA6AF",wall:"#E4E6E4"},lowerparel:{floor:"#A88B69",wall:"#EDE6D8"},bkc:{floor:"#5E646C",wall:"#DADDE0"}}[st];
  const P=new Place({indoor:true,bounds:[.4,.4,w-.4,d-.4],spawn:[2.2,d-1.2,Math.PI],camDist:15,name:o.name});
  P.box(-.2,-.2,w+.4,d+.4,.2,pal.floor,{y:-.2,solid:false,map:false});
  P.box(0,-.15,w,.1,2.9,dark?"#2E3A5E":"#B9D3DE",{op:.35,solid:true,map:true});
  const r=rng(st.length*7);for(let i=0;i<8;i++){P.bldg(-2+i*3.1,-14-r()*6,2.4,3,8+r()*18,["#93A9B8","#A9B9C2","#7F98AC","#C7B79A"][i%4]);}
  P.wall(-.2,0,.2,d,2.9,pal.wall,[-1,0]);P.wall(w,0,.2,d,2.9,pal.wall,[1,0]);P.wall(-.2,d,1.4,.2,2.9,pal.wall,[0,1]);P.wall(2.4,d,w-2.2,.2,2.9,pal.wall,[0,1]);
  if(dark){const pl=new THREE.PointLight(0xfff0d0,.8,30);pl.position.set(w/2,2.6,d/2);P.add(pl);}
  const cols=["#E8E2D6","#4E8C86","#C7694A","#E2B53C","#8E4C6B","#5A6E8C","#B39B6B","#9A6748"];let k=0;
  for(const z0 of [2.2,5.4])for(let i=0;i<4;i++){const x=2+i*2.3;F.desk(P,x,z0,st==="bkc"?"#3A3F48":"#EAE6DD");
    const here=dark?(k===2||k===5):(k!==1);if(here)P.person(NL(cols[k],["#A8704A","#8D5A3B","#B07A55","#9A6748"][k%4],"#1A1512",{long:k%3===0}),x+.75,z0+1.1,Math.PI,{pose:"sit"});k++;}
  P.anchor("desk",4.3,3.3+.1+3.2);
  P.person(NL(st==="bkc"?"#2E3A4E":"#B4553A","#B07A55",st==="bkc"?"#2A211B":"#1A1512",{long:st!=="bkc"}),3.2,8.6,0);P.anchor("lead",3.2,8.6);
  P.box(1.2,8.6-.6,.06,1.2,1.4,"#F4F4F4",{y:.7,solid:false});
  P.box(12,.3,5.6,.8,1,"#C7694A");for(const [x,z] of [[12.4,2.4],[14.8,2.4]]){F.table(P,x,z,1.8,1,"#EAE6DD");}
  P.person(NL("#4E8C86","#8D5A3B","#1A1512"),13.2,3.7,Math.PI,{pose:"sit"});P.person(NL("#E2B53C","#B07A55","#1A1512",{long:true}),15.6,3.7,Math.PI,{pose:"sit"});P.anchor("canteen",14.2,4.4);
  P.box(12,6.4,5.6,.08,2.4,"#BFD7E2",{op:.4});P.box(12,6.4,.08,5,2.4,"#BFD7E2",{op:.4,solid:false});F.table(P,13.4,8,2.6,1.2,"#3A3F48");
  P.person(NL("#2E3A4E","#B07A55","#9A9590"),15.6,8.5,-Math.PI/2,{pose:"sit"});P.anchor("partner",14.6,10.6);
  P.person(NL("#5A6E8C","#9A6748","#1A1512"),8.6,9,0);P.anchor("colleague",8.6,9);
  F.plant(P,.6,.6);F.plant(P,10.8,10.8);
  P.anchor("door",1.9,d-.6);return P;}

function bSchool(ctx){const P=new Place({indoor:true,bounds:[.4,.4,19,8.6],spawn:[1.8,8,Math.PI],camDist:15});
  P.box(-.2,-.2,20,9.4,.2,"#CDBA98",{y:-.2,solid:false,map:false});
  P.wall(-.2,-.2,20,.2,2.9,"#E9E1C9",[0,-1]);P.wall(-.2,0,.2,9,2.9,"#E3DAC0",[-1,0]);P.wall(19.6,0,.2,9,2.9,"#E3DAC0",[1,0]);
  P.wall(-.2,9,1.4,.2,2.9,"#E9E1C9",[0,1]);P.wall(2.4,9,17.4,.2,2.9,"#E9E1C9",[0,1]);
  P.wall(12.2,0,.2,4,2.9,"#E3DAC0",[1,0]);P.wall(12.2,5.4,.2,3.6,2.9,"#E3DAC0",[1,0]);
  F.board(P,2.5,5.5);P.box(2.5,.05,5.5,.02,.3,"#C8BFA8",{y:.85,solid:false,map:false});
  F.table(P,1.4,1.2,1.6,.8,"#8D6A4A");
  let k=0;const sk=["#8D5A3B","#A8704A","#7A4E33","#B07A55","#9A6748"];
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){const x=1.6+c*2.6,z=3+r*1.4;P.box(x,z,1.6,.55,.62,"#B98A5E");
    for(let s=0;s<2;s++)P.person(NL("#F2EEE6",sk[(k+s)%5],"#1A1512",{pants:"#3E5A86",long:(k+s)%3===0}),x+.35+s*.85,z+.75,Math.PI,{pose:"sit",noCol:true});k++;}
  P.anchor("aarav",2.4,4.3);
  P.box(13.4,2,4.4,1.8,.74,"#8D6A4A");F.cupboard(P,18.6,.4,"#7A8C9E");F.cupboard(P,13,.4,"#7A8C9E",1.4);
  P.person(NL("#7A4E8C","#B07A55","#C9C2B8",{long:true}),15.6,4.4,Math.PI);P.anchor("principal",15.6,4.4);
  P.person(NL("#B4553A","#A8704A","#55504A",{long:true}),14.2,4.1,Math.PI,{pose:"sit"});
  P.person(NL("#E8E2D6","#7A4E33","#55504A"),17.8,7.6,Math.PI);P.anchor("peon",17.8,7.6);
  P.anchor("door",1.9,8.4);return P;}

function bWard(ctx,o){o=o||{};const crowded=o.crowded;const w=16,d=10;
  const P=new Place({indoor:true,bounds:[.4,.4,w-.4,d-.4],spawn:[2,d-1.2,Math.PI],camDist:14});
  P.box(-.2,-.2,w+.4,d+.4,.2,"#C9CFC9",{y:-.2,solid:false,map:false});
  P.wall(-.2,-.2,w+.4,.2,2.9,"#E4ECE6",[0,-1]);P.wall(-.2,0,.2,d,2.9,"#DCE6DE",[-1,0]);P.wall(w,0,.2,d,2.9,"#DCE6DE",[1,0]);P.wall(-.2,d,1.4,.2,2.9,"#E4ECE6",[0,1]);P.wall(2.4,d,w-2.2,.2,2.9,"#E4ECE6",[0,1]);
  const pl=new THREE.PointLight(0xf0fff4,.6,30);pl.position.set(w/2,2.6,d/2);P.add(pl);
  const sk=["#8D5A3B","#A8704A","#7A4E33","#B07A55","#9A6748"];
  for(let i=0;i<6;i++){for(const z of [.4,6.4]){const x=1+i*2.4;P.box(x,z,1,2.1,.6,"#D6DADD");P.box(x+.05,z+.05,.9,2,.12,"#F2F4F2",{y:.6,solid:false});
    P.person(NL("#9FB8D0",sk[(i+z|0)%5],"#1A1512"),x+.5,z+1.2,0,{pose:"lie",y:-.1,noCol:true});}}
  if(crowded)for(let i=0;i<4;i++){P.box(2+i*3,3.6,1.8,.8,.12,"#C9A27A",{solid:false});P.person(NL("#9FB8D0",sk[i],"#1A1512"),2.9+i*3,4,Math.PI/2,{pose:"lie",y:-.55,noCol:true});}
  P.box(12.6,4.6,3,.8,1,"#4E8C86");F.laptop(P,13.6,4.8);P.anchor("station",14,5.8);
  P.person(NL("#7FB3AE","#7C5038","#1A1512",{long:true,pants:"#7FB3AE"}),15,5.6,-Math.PI/2);P.anchor("nurse",15,5.6);
  P.person(NL("#E8E2D6","#8D5A3B","#1A1512"),6.6,3.4,0);P.anchor("relative",6.6,3.4);
  P.person(NL("#F2EEE6","#B07A55","#1A1512",{long:true,steth:true,pants:"#3E5A86"}),10.2,5.2,-Math.PI/2);P.anchor("intern",10.2,5.2);
  P.anchor("door",1.9,d-.6);return P;}

function bSet(ctx){const P=new Place({indoor:true,bounds:[.4,.4,21.6,15.6],spawn:[2,14.6,Math.PI],camDist:17});
  P.box(-.2,-.2,22.4,16.4,.2,"#3A3A40",{y:-.2,solid:false,map:false});
  P.wall(-.2,-.2,22.4,.2,5,"#2E2E34",[0,-1]);P.wall(-.2,0,.2,16,5,"#2E2E34",[-1,0]);P.wall(22,0,.2,16,5,"#2E2E34",[1,0]);
  P.box(2,1,8,.2,3,"#D9906F");P.box(2,1.2,.2,5,3,"#E6D7B8");F.sofa(P,4,2,"#4E8C86",3);F.table(P,5,3.6,1.6,.8);F.plant(P,8.6,1.6);
  for(const [x,z] of [[11,3],[3,8.4],[9.6,9]]){P.box(x,z,.15,.15,2.6,"#3A3A40");const l=P.box(x-.4,z-.3,.9,.6,.6,"#FFF4D6",{y:2.6,em:"#FFF4D6",ei:1.2,solid:false});}
  const sl=new THREE.SpotLight(0xfff0d8,1.2,30,.6,.5);sl.position.set(11,5,8);sl.target.position.set(5,0,3);P.add(sl);P.add(sl.target);
  P.box(6.4,8,.3,.3,1.3,"#3A3A40");P.box(6,7.6,1.1,1,.7,"#26262B",{y:1.3,solid:false});
  P.box(13,8,4,3,.06,"#26262B",{y:2.4,solid:false});for(const [x,z] of [[13,8],[16.9,8],[13,10.9],[16.9,10.9]])P.box(x,z,.1,.1,2.4,"#3A3A40");
  F.table(P,13.6,8.6,2.6,.8,"#26262B");P.box(14,8.7,.8,.08,.5,"#1A2230",{y:.74,em:"#7FB3D8",ei:.8,solid:false});P.box(15.2,8.7,.8,.08,.5,"#1A2230",{y:.74,em:"#7FB3D8",ei:.8,solid:false});
  P.person(NL("#3D3D44","#B07A55","#55504A"),15,10,Math.PI);P.anchor("director",15,10);
  P.person(NL("#5A6E8C","#7A4E33","#1A1512",{cap:"#26262B"}),7.6,8.4,-Math.PI/2);P.anchor("dop",7.6,8.4);
  P.person(NL("#B4553A","#8D5A3B","#1A1512",{long:true}),5,4.7,0);P.person(NL("#E2B53C","#A8704A","#1A1512"),6.4,4.6,0);
  P.person(NL("#8E4C6B","#B5835E","#1A1512",{long:true}),18.4,12.6,Math.PI);
  P.anchor("gate",20,14.4);P.anchor("door",2,15);
  for(let i=0;i<6;i++)P.box(18+(i%3)*1.1,1+(i>2?1.1:0),1,1,1,"#555B66");
  return P;}
