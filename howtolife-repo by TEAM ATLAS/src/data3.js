/* ---------------- KAVYA ---------------- */
CH.kavya = {
  id:"kavya",name:"Kavya Nair",short:"Kavya",age:26,pronouns:"she/her",role:"Staff nurse",place:"Malad West",
  look:{shirt:"#7FB3AE",pants:"#7FB3AE",skin:"#7C5038",hair:"#1A1512",long:true},outfits:["#7FB3AE","#E8E2D6","#9C7FB0"],
  intro:"Ruth's flatmate. Rotating nights at a private hospital. Quietly preparing to work abroad.",
  payMode:"salary",income:"Monthly salary",dayPay:1180,startEnergy:66,defaultWx:"monsoon",
  homeLabel:"Malad West (with Ruth)",workLabel:"Private hospital, Andheri West",commuteText:"Local train plus auto",commuteMin:30,
  commits:{amma:{label:"Video call Amma on her break",status:"pending"}},
  profile:{
    today:[["Role","Staff nurse, surgical ward, a private multi-speciality hospital in Andheri West. Night rotations."],["Lives in","Malad West, sharing a 1BHK with Ruth Fernandes."],["Housing","Rent share ₹11,000."],["Commute","Local train Malad to Andheri, then a shared auto."],["From","Kottayam, Kerala. Her father drives an auto; her mother tailors; her sister studies nursing."],["Interests","Malayalam films, Sunday fish curry, reels about nursing in the UK."],["Wants","A job in the UK or Ireland. Her education loan cleared. Her sister's fees paid."],["Enjoys","When a frightened patient finally sleeps. Being good in an emergency."],["Finds hard","One nurse for 14 patients at night. Pay that doesn't match the skill."]],
    education:[{when:"2015–2017",what:"HSC Science, Kottayam",detail:"86%."},{when:"2017–2021",what:"B.Sc Nursing",detail:"Karavali College of Nursing, Mangaluru (fictional). About ₹1.1 lakh a year with hostel. Education loan ₹4 lakh."},{when:"2021–2022",what:"Registration",detail:"State nursing council, then Maharashtra."}],
    eduNotes:[["Who paid","A ₹4 lakh education loan, and her parents."],["Internship","Six months at ₹5,000 a month."],["Why nursing","Jobs abroad, and a course her family could just afford."]],
    work:[{when:"2021–2022",what:"Staff nurse, small hospital, Kottayam",pay:"₹12,000 a month",detail:"",skills:"Wards, injections, everything"},{when:"2022–2024",what:"Staff nurse, Mumbai",pay:"₹20,000 a month",detail:"A college senior's referral.",skills:"Surgical care"},{when:"2024 – now",what:"Staff nurse, Andheri West",pay:"₹26,000 a month gross",detail:"",skills:"Post-op, ICU step-down"}],
    start:[["Support when starting","None financial."],["Dependants","Part of her sister's fees."],["Debt","Education loan, about ₹2.6 lakh left."],["Access","A strong network of Kerala nurses in Mumbai and abroad."],["Could she afford unpaid training?","No."]],
    moments:[{yr:"2017",title:"Nursing or engineering",place:"ward_andheri",happened:"She had the marks for either.",options:["Engineering on a bigger loan","Nursing"],outOfReach:[],chose:"Nursing.",depended:"Cost, and the stories of nurses who'd gone abroad."},{yr:"2022",title:"Moving to Mumbai",place:"flat_kavya",happened:"Kottayam paid ₹12,000; Mumbai paid ₹20,000.",options:["Stay home","Move"],outOfReach:[],chose:"Move.",depended:"A senior's referral."},{yr:"2025",title:"The agency fee",place:"flat_kavya",happened:"An agency asked ₹3 lakh to place her abroad.",options:["Pay","Refuse and look for employer-paid routes"],outOfReach:["₹3 lakh"],chose:"She refused.",depended:"A friend who knew agencies shouldn't charge that."}]
  },
  scenes:[
    {id:"v1",time:"18:20",place:"Malad West · flat",text:()=>"Ruth is back from tuitions and has made extra dal. Your shift starts at eight.",
     choices:[{label:"Eat with Ruth",detail:"Twenty minutes.",fx:()=>({energy:12,text:"Ruth tells you about a boy called Aarav and cricket ratios."})},{label:"Pack it and leave early",detail:"Beat the rush.",fx:()=>({energy:4,text:"You eat it in the staff room at 2 a.m., cold."})}]},
    {id:"v2",time:"23:30",place:"Surgical ward · night",text:()=>"Two nurses for 28 patients. A post-surgery patient's family asks for updates every fifteen minutes.",
     choices:[{label:"Stop and explain properly",detail:"Rounds run 20 minutes late.",fx:()=>({energy:-6,flags:{explained:true},text:"They stop asking. At 3 a.m. the son brings you tea."})},{label:"Promise an update after rounds",detail:"Stay on time.",fx:()=>({energy:-4,text:"They complain to the administrator in the morning. Your supervisor backs you."})}]},
    {id:"v3",time:"04:10",place:"Nurses' station",text:()=>"A senior who moved to the UK messages: her hospital is hiring directly. You'd need an English test (about ₹30,000) and the UK nursing exam.",
     choices:[{label:"Book the English test",detail:"Save ₹10,000 a month for three months.",fx:()=>({flags:{abroad:true},commit:["amma","kept"],text:"You tell Amma on video. She cries a little."})},{label:"Do the critical-care certificate here",detail:"₹15,000, a raise in Mumbai.",fx:()=>({flags:{icu:true},commit:["amma","kept"],text:"Amma says that's sensible. She sounds relieved."})}]}
  ],
  day:[
    {place:"flat_kavya",time:"18:20",beats:[["v1","ruth","Ruth"]],talks:[["window","The window","Malad at dusk: trains, hawkers, a hundred pressure cookers."]],exit:"Leave for the night shift"},
    {travel:"work",time:"19:00",deadline:"20:00"},
    {place:"ward_andheri",time:"23:30",beats:[["v2","relative","A patient's family"],["v3","station","Your phone"]],talks:[["nurse","Sister Lata","Bed 6 wants water again. Bed 9 asked for you by name."]],exit:"Go home"},
    {travel:"home",time:"08:10"},
    {place:"flat_kavya_morning",beats:[],talks:[["ruth","Ruth","Night shift? Sleep. I'll lock the door."]],exit:"Sleep"}
  ],
  routes:{
    work:{to:"Hospital, Andheri West",options:[
      {id:"local",label:"Local train + shared auto",monthly:700,note:"Pass + autos",legs:[leg("walk","Flat","Malad station",6,0),leg("train","Malad","Andheri",10,5,{st:["Malad","Goregaon","Jogeshwari","Andheri"],wait:4,line:"Western line, slow"}),leg("shareauto","Andheri station","Hospital",10,25,{wait:3})]},
      {id:"auto",label:"Auto all the way",monthly:7000,legs:[leg("auto","Flat","Hospital",35,160)]},
      {id:"bus",label:"BEST bus",monthly:660,legs:[leg("walk","Flat","Bus stop",5,0),leg("bus","Malad","Andheri West",45,15,{wait:8,st:["Malad","Goregaon","Oshiwara","Andheri West"]})]}]},
    home:{to:"Flat, Malad West",options:[
      {id:"local",label:"Local train + shared auto",monthly:700,legs:[leg("shareauto","Hospital","Andheri station",10,25),leg("train","Andheri","Malad",10,5,{st:["Andheri","Jogeshwari","Goregaon","Malad"],wait:4}),leg("walk","Malad station","Flat",6,0)]},
      {id:"auto",label:"Auto",monthly:7000,legs:[leg("auto","Hospital","Flat",30,150)]}]}
  },
  month(f){const L=[];
    L.push({g:"Salary",label:"Gross monthly salary",amt:26000,note:""});
    L.push({g:"Salary",label:"Night allowance",amt:1500,note:""});
    L.push({g:"Salary",label:"Employee PF",amt:-1800,note:""});
    L.push({g:"Salary",label:"Professional tax",amt:-200,note:""});
    L.push({sub:"Take-home pay"});
    L.push({g:"Home",label:"Rent share",amt:-11000,note:"With Ruth."});
    L.push({g:"Home",label:"Utilities and groceries",amt:-4700,note:""});
    L.push({g:"Home",label:"Commute: "+(f.commute?f.commute.label:"local train"),amt:-(f.commute?f.commute.monthly:700),note:""});
    L.push({g:"Home",label:"Phone",amt:-400,note:""});
    L.push({g:"Family and loans",label:"Education loan EMI",amt:-4500,note:"About five years left."});
    L.push({g:"Family and loans",label:"Sent home",amt:-5000,note:"For her sister's fees."});
    L.push({g:"Family and loans",label:"Personal",amt:-1000,note:""});
    if(f.abroad) L.push({g:"Plans",label:"Saving for the English test",amt:-10000,note:"₹30,000 over three months."});
    if(f.icu) L.push({g:"Plans",label:"Critical-care certificate, first instalment",amt:-5000,note:""});
    return {kind:"Salaried, with an education loan and a sister to support.",lines:L,owed:[{label:"Education loan",amt:260000,note:""}]};},
  available:21000,availableNote:"Take-home minus the education-loan EMI.",
  hours:{work:48,commute:4,label:"Four 12-hour nights a week"},
  entryCost:{amt:440000,note:"Four years of B.Sc Nursing with hostel, mostly a loan."},
  pivot:"v3",
  branches:[
    {id:"abroad",cond:f=>!!f.abroad,title:"Abroad",
     y5:{age:31,role:"Staff nurse, NHS hospital, UK",place:"ward_andheri",available:90000,availableNote:"What she can save or send each month after UK rent and costs, converted. Not comparable to a Mumbai budget.",hours:"37.5 hours a week",changed:"Passed both exams; an employer paid her visa and flights.",enabled:"Kerala nurses' network; a direct-hire route.",cost:"Far from family; Amma's knee surgery happened without her.",uncertain:"Visa rules change. Experience abroad isn't always recognised back home."},
     y15:{age:41,role:"Ward manager, UK",place:"ward_andheri",available:200000,availableNote:"Savings capacity, converted.",hours:"40 hours a week",changed:"Promoted twice.",enabled:"Years of experience.",cost:"Two countries, never fully home in either.",uncertain:"Whether she returns."}},
    {id:"icu",cond:()=>true,title:"Critical care, Mumbai",
     y5:{age:31,role:"ICU nurse, Mumbai",place:"ward_andheri",available:38000,availableNote:"Today's rupees.",hours:"48 hours a week",changed:"Certificate, then an ICU post.",enabled:"Skill and steady nights.",cost:"Pay still trails the work.",uncertain:"Private hospital pay varies."},
     y15:{age:41,role:"Nursing superintendent",place:"ward_andheri",available:75000,availableNote:"Today's rupees.",hours:"48 hours a week",changed:"Moved into management.",enabled:"Experience.",cost:"Less bedside time.",uncertain:"Few posts."}}
  ]
};

/* ---------------- IQBAL ---------------- */
CH.iqbal = {
  id:"iqbal",name:"Iqbal Khan",short:"Iqbal",age:41,pronouns:"he/him",role:"Taxi driver",place:"Kurla West",
  look:{shirt:"#EDE6D8",pants:"#5A5048",skin:"#8A5A3C",hair:"#55504A"},outfits:["#EDE6D8","#B39B6B","#5A6E8C"],
  intro:"Drives a rented kaali-peeli and takes app rides. The meter only runs when someone's in the seat.",
  payMode:"orders",income:"Per ride, self-employed",startEnergy:70,defaultWx:"haze",
  homeLabel:"Kurla West (chawl room)",workLabel:"Anywhere the fares are",commuteText:"None. Drives all day.",commuteMin:0,
  commits:{zoya:{label:"Pay Zoya's tuition fee today",status:"pending"}},
  profile:{
    today:[["Role","Drives a black-and-yellow taxi rented from an owner, and takes app rides. Self-employed."],["Lives in","Kurla West, one rented room in a chawl, with his wife Shabana (38, tailors), children Zoya (15), Ayaan (12), Sara (8), and his mother."],["Housing","₹6,500 a month."],["Commute","None. He picks the taxi up near home."],["Interests","Old Hindi film songs, Friday prayers with friends, cricket on the radio."],["Wants","Zoya to become a pharmacist. His own taxi permit. A second room."],["Enjoys","Knowing the city's shortcuts. Regular airport customers. Passengers' stories."],["Finds hard","CNG queues, traffic, app commission, his back."]],
    education:[{when:"1991–1999",what:"Municipal Urdu school, Kurla",detail:"Left after Class 8."},{when:"2003",what:"Driving licence and taxi badge",detail:""},{when:"Outside class",what:"Skills learned elsewhere",detail:"English from passengers. Every road from Colaba to Dahisar."}],
    eduNotes:[["Why he left","His father lost his mill job; the family needed money."],["Who paid","Nobody. He started work at 14."]],
    work:[{when:"1999",what:"Garage helper",pay:"₹800 a month",detail:"",skills:"Engines"},{when:"2003",what:"Tempo driver",pay:"₹3,500 a month",detail:"",skills:""},{when:"2008",what:"Taxi on daily rent",pay:"",detail:"",skills:""},{when:"2018",what:"Joined an app as well",pay:"",detail:"More rides, less per ride.",skills:""}],
    start:[["Support when starting","None. Work from 14."],["Dependants","Six people."],["Debt","₹25,000 left from a moneylender loan for his mother's surgery, at high interest."],["Access","Other drivers. The taxi union."],["Could he afford unpaid training?","Never."]],
    moments:[{yr:"1999",title:"Leaving school",place:"home_iqbal",happened:"His father's mill closed.",options:["Stay in school","Work"],outOfReach:["Both"],chose:"Work.",depended:"There was no other income."},{yr:"2008",title:"Renting a taxi",place:"city_kurla",happened:"A tempo owner sold his vehicle.",options:["Find another tempo job","Rent a taxi daily"],outOfReach:["Buying a taxi permit"],chose:"Rent a taxi.",depended:"An owner who trusted him."},{yr:"2018",title:"Joining the app",place:"city_kurla",happened:"Street fares were falling.",options:["Stay with the meter","Join the app too"],outOfReach:[],chose:"Both.",depended:"A smartphone his son set up."}]
  },
  scenes:[
    {id:"i1",time:"04:50",place:"Kurla West · home",text:()=>"Shabana says Zoya's tuition fee is due today: ₹2,000. The airport queue builds after five.",
     choices:[{label:"Leave now for the early fares",detail:"Pay the fee tonight.",fx:()=>({flags:{early:true},commit:["zoya","missed"],text:"Zoya will ask the teacher for one more day."})},{label:"Drop Zoya at tuition at 7 and pay",detail:"Lose the early rush.",fx:()=>({spend:2000,commit:["zoya","kept"],addGoals:[{k:"pickup",at:"tuition",label:"Drop Zoya at tuition"}],text:"Zoya will sit in the front seat and practise chemistry formulas out loud."})}]},
    {id:"i2",time:"10:30",place:"Airport · taxi holding area",text:()=>"The airport queue: 70 taxis ahead, about two hours. An airport fare to South Mumbai pays about ₹650.",
     choices:[{label:"Wait in the queue",detail:"Two hours unpaid, a big fare.",fx:()=>({earn:650,minutes:120,wait:120,energy:5,text:"Chai, an old song on the radio, a nap in the back seat. Then a family to Colaba."})},{label:"Leave and take app rides nearby",detail:"Smaller fares, no waiting.",fx:()=>({earn:520,energy:-8,text:"Four short rides around Andheri East."})}]},
    {id:"i3",time:"16:00",place:"CNG pump",text:()=>"The CNG queue is forty minutes. The front-left tyre is nearly bald: ₹3,200 to replace.",
     choices:[{label:"Replace it now",detail:"₹3,200.",fx:()=>({spend:3200,flags:{tyre:"fixed"},minutes:30,text:"That's two days of profit. The car grips again."})},{label:"Next week",detail:"Keep driving.",fx:d=>d.wx==="monsoon"?({flags:{tyre:"deferred",skid:true},spend:1500,earn:-300,text:"On the wet Kurla flyover the taxi slides into a divider. Nobody's hurt. A dented bumper: ₹1,500, and a fare lost."}):({flags:{tyre:"deferred"},text:"It holds. This time."})}]},
    {id:"i4",time:"22:30",place:"Kurla West · home",text:()=>"A fleet company offers an electric cab on lease: ₹750 a day, insurance and charging included, app rides only. Or keep the kaali-peeli at ₹600 a day.",
     choices:[{label:"Take the electric lease",detail:"No CNG queues.",fx:()=>({flags:{ev:true},text:"Shabana asks what happens if the app changes its rules. You don't know."})},{label:"Keep the kaali-peeli",detail:"Your street fares, your rules.",fx:()=>({flags:{kaali:true},text:"You start saving for a permit. Very slowly."})}]}
  ],
  day:[
    {place:"home_iqbal",time:"04:50",beats:[["i1","shabana","Shabana"]],talks:[["ammi","Ammi","Drive slowly. And eat something at noon."],["zoya","Zoya","(half asleep) Abbu, the chemistry test is Monday…"]],exit:"Take the taxi out"},
    {drive:"city_kurla",vehicle:"taxi",time:"05:10",goals:[{k:"fare",label:"Fare: Kurla to Andheri station",pay:240},{k:"fare",label:"Fare: Andheri to Powai office",pay:210},{k:"beat",at:"airport",beat:"i2",label:"Airport taxi holding area"},{k:"fare",label:"Fare: airport to Bandra",pay:430},{k:"beat",at:"pump",beat:"i3",label:"CNG pump"},{k:"fare",label:"Fare: Sion to Kurla market",pay:150},{k:"fare",label:"Fare: Kurla to Ghatkopar",pay:180},{k:"home",at:"home",label:"Home, Kurla West",time:"22:30"}]},
    {place:"home_iqbal",time:"22:30",beats:[["i4","shabana","Shabana"]],exit:null}
  ],
  routes:{},
  month(f){const L=[];
    L.push({g:"Fares",label:"Fares collected, 26 days",amt:58000,note:"Meter fares and app payouts."});
    L.push({sub:"Gross fares"});
    L.push({g:"Costs of the taxi",label:"Daily rent to the owner",amt:-15600,note:"₹600 a day."});
    L.push({g:"Costs of the taxi",label:"CNG",amt:-14000,note:""});
    L.push({g:"Costs of the taxi",label:"App commission",amt:-3500,note:"On app rides only."});
    L.push({g:"Costs of the taxi",label:"Cleaning and small repairs",amt:-1200,note:""});
    if(f.tyre==="fixed") L.push({g:"Costs of the taxi",label:"New tyre",amt:-3200,note:""});
    if(f.skid) L.push({g:"Costs of the taxi",label:"Bumper repair",amt:-1500,note:"From the slide on the flyover."});
    L.push({sub:"Earnings after the taxi"});
    L.push({g:"Household",label:"Shabana's tailoring",amt:6000,note:""});
    L.push({g:"Household",label:"Room rent",amt:-6500,note:""});
    L.push({g:"Household",label:"Groceries for seven",amt:-10000,note:""});
    L.push({g:"Household",label:"Electricity and water",amt:-1000,note:""});
    L.push({g:"Household",label:"School and tuition fees",amt:-4500,note:"Three children."});
    L.push({g:"Household",label:"Zoya's extra tuition fee",amt:-2000,note:"Paid today or later; it's the same month."});
    L.push({g:"Household",label:"Ammi's medicines",amt:-1500,note:""});
    L.push({g:"Household",label:"Moneylender repayment",amt:-3000,note:"Mostly interest."});
    L.push({g:"Household",label:"Phone",amt:-400,note:""});
    return {kind:"Self-employed: fares, minus the taxi's costs, then a household of seven.",lines:L,owed:[{label:"Moneylender loan",amt:25000,note:"High interest."},{label:"Savings",amt:null,note:"None."}]};},
  available:23700,availableNote:"Fares after taxi rent, CNG and commission.",
  hours:{work:78,commute:0,label:"13 hours a day, six days"},
  entryCost:{amt:5000,note:"A licence and a taxi badge."},
  pivot:"i4",
  branches:[
    {id:"ev",cond:f=>!!f.ev,title:"The electric lease",
     y5:{age:46,role:"Electric cab driver, fleet lease",place:"city_kurla",available:26000,availableNote:"Today's rupees.",hours:"72 hours a week",changed:"No CNG queues; app rules decide his income.",enabled:"The lease.",cost:"Less freedom over which rides to take.",uncertain:"Lease terms and app rules can change."},
     y15:{age:56,role:"Drives fewer hours; Zoya, a pharmacist, supports the household",place:"home_iqbal",available:18000,availableNote:"His own earnings.",hours:"45 hours a week",changed:"Zoya's degree came through a scholarship.",enabled:"Zoya's marks, and a scholarship.",cost:"His back.",uncertain:"Health."}},
    {id:"kaali",cond:()=>true,title:"The kaali-peeli",
     y5:{age:46,role:"Owns a used taxi with a permit, on a loan",place:"city_kurla",available:30000,availableNote:"After loan EMI.",hours:"72 hours a week",changed:"Bought a permit and a used car.",enabled:"Savings and a union loan.",cost:"EMIs for years.",uncertain:"Old taxis are being phased out."},
     y15:{age:56,role:"Owns two taxis, rents one out",place:"city_kurla",available:40000,availableNote:"Today's rupees.",hours:"50 hours a week",changed:"Rents the second taxi to a younger driver.",enabled:"Years of saving.",cost:"Everything went into the cars.",uncertain:"Rules on vehicle age."}}
  ]
};

/* ---------------- RIYA ---------------- */
CH.riya = {
  id:"riya",name:"Riya Sawant",short:"Riya",age:21,pronouns:"she/her",role:"Content creator",place:"Dombivli East",
  look:{shirt:"#D9A441",pants:"#3E5A86",skin:"#A06C4A",hair:"#1C1611",long:true,bag:"#B4553A"},outfits:["#D9A441","#C7694A","#8E4C6B"],
  intro:"Month eight. 11,000 followers. A brand deal that might come through.",
  payMode:"orders",income:"Brand deals and gigs",startEnergy:76,defaultWx:"sunny",
  homeLabel:"Dombivli East",workLabel:"Shoots across Mumbai",commuteText:"1 hr 40 min to Bandra",commuteMin:100,
  commits:{reel:{label:"Post today's reel by 9 p.m.",status:"pending"}},
  profile:{
    today:[["Role","Comedy and lifestyle reels in Marathi and English, plus video editing for others. Final-year BMM student."],["Lives in","Dombivli East, with her parents (father a clerk at a cooperative bank, mother runs a snack business) and her brother Sahil (17)."],["Housing","Family-owned 1BHK."],["Commute","Two trains and an auto to shoot in Bandra."],["Interests","Stand-up, thrifting, editing at 2 a.m."],["Wants","100,000 followers. Income she can live on. A room in Andheri."],["Enjoys","Making people laugh. Messages from strangers."],["Finds hard","The algorithm. Irregular money. Comments. Her parents' worry."]],
    education:[{when:"2020",what:"SSC, Dombivli",detail:"82%."},{when:"2022",what:"HSC Commerce",detail:""},{when:"2022–2025",what:"BMM (Bachelor of Mass Media)",detail:"Dombivli College of Mass Media (fictional). About ₹42,000 a year, paid by her parents."},{when:"2023",what:"Online editing course",detail:"₹3,500."}],
    eduNotes:[["Who paid","Her parents."],["Kit","Phone ₹45,000 on EMI, ring light, a small mic."]],
    work:[{when:"2021",what:"Tutoring kids",pay:"₹2,000 a month",detail:"",skills:""},{when:"2023",what:"Social-media intern, a café",pay:"₹5,000 a month",detail:"",skills:"Short video"},{when:"2024",what:"Freelance editor",pay:"₹3,000–8,000 a month",detail:"",skills:"Editing"},{when:"2025",what:"Full-time creator",pay:"Irregular",detail:"",skills:""}],
    start:[["Support when starting","A home, food, and her father's steady income."],["Dependants","None."],["Debt","Phone EMI."],["Access","No media contacts. Collabs come from DMs."],["Could she afford unpaid work?","For a year, by agreement with her parents."]],
    moments:[{yr:"2023",title:"The first viral reel",place:"home_riya",happened:"480,000 views. Followers went from 900 to 6,000.",options:["Treat it as luck","Post every day"],outOfReach:[],chose:"Post every day.",depended:"Luck, then work."},{yr:"2024",title:"The unpaid internship",place:"promenade",happened:"An agency in Lower Parel offered an unpaid internship, two hours each way.",options:["Take it","Freelance instead"],outOfReach:[],chose:"Freelance.",depended:"Paying gigs from her DMs."},{yr:"2025",title:"Telling her parents",place:"home_riya",happened:"She'd skip campus placements.",options:["Take a placement job","Ask for one year"],outOfReach:[],chose:"One year.",depended:"Parents who agreed."}]
  },
  scenes:[
    {id:"c1",time:"08:30",place:"Dombivli · home",text:()=>"Aai has the bank-exam form open on the laptop. Deadline tonight. Fee ₹850.",
     choices:[{label:"Fill the form",detail:"A backup.",fx:()=>({spend:850,flags:{bankForm:true},text:"Aai stops worrying for a day."})},{label:"Skip it",detail:"Focus.",fx:()=>({energy:-4,text:"Aai closes the laptop gently."})}]},
    {id:"c2",time:"12:15",place:"Bandstand · shoot",text:()=>"A skincare brand offers ₹5,000 for a reel about a cream you haven't used. Or free products instead of money.",
     choices:[{label:"Ask to try it first, label it as an ad",detail:"Slower money.",fx:()=>({flags:{honest:true},text:"They agree: a week's trial. Your followers trust the labelled ones more."})},{label:"Take the ₹5,000 today",detail:"Rent money.",fx:()=>({earn:5000,flags:{quickDeal:true},text:"The cream gives a commenter a rash. You post an apology."})},{label:"Decline",detail:"Not your thing.",fx:()=>({energy:4,text:"You shoot a sketch about Dombivli trains instead."})}]},
    {id:"c3",time:"17:10",place:"Bandstand · sunset",text:()=>"Your collaborator's manager offers a salaried editor job for a big creator: ₹22,000 a month, six days a week, in Andheri.",
     choices:[{label:"Take the job",detail:"Steady money.",fx:()=>({flags:{job:true},commit:["reel","kept"],text:"You start Monday. You'll still post on Sundays."})},{label:"Stay independent for a year",detail:"Your own channel.",fx:()=>({flags:{indie:true},commit:["reel","kept"],text:"Your reel goes up at 8:55. 2,000 views by midnight."})}]}
  ],
  day:[
    {place:"home_riya",time:"08:30",beats:[["c1","aai","Aai"]],talks:[["sahil","Sahil","Didi, can I be in the next reel? I'll do the dance."]],exit:"Leave for the Bandra shoot"},
    {travel:"work",time:"10:00",deadline:"12:00"},
    {place:"promenade",beats:[["c2","collab","A brand email"],["c3","manager","A manager"]],talks:[["vendor","Bhutta seller","Rain or sun, bhutta is ₹40."]],exit:"Head home"},
    {travel:"home",time:"18:00"},
    {place:"home_riya_night",beats:[],talks:[["aai","Aai","Eat first. Then edit."]],exit:"Edit till 2 a.m."}
  ],
  routes:{
    work:{to:"Bandstand, Bandra",options:[
      {id:"local",label:"Local trains + auto",monthly:1800,note:"About ₹100 a shoot day",legs:[leg("shareauto","Home","Dombivli station",8,20),leg("train","Dombivli","Dadar",52,15,{st:["Dombivli","Thane","Ghatkopar","Kurla","Dadar"],wait:6,line:"Central line, fast"}),leg("train","Dadar","Bandra",10,5,{st:["Dadar","Mahim","Bandra"],wait:4,line:"Western line"}),leg("auto","Bandra station","Bandstand",14,60)]},
      {id:"ac",label:"AC local + auto",monthly:3000,legs:[leg("shareauto","Home","Dombivli station",8,20),leg("actrain","Dombivli","Dadar",50,110,{st:["Dombivli","Thane","Dadar"],wait:14}),leg("train","Dadar","Bandra",10,5,{st:["Dadar","Mahim","Bandra"],wait:4}),leg("auto","Bandra station","Bandstand",14,60)]},
      {id:"cab",label:"App cab",monthly:20700,legs:[leg("cab","Home","Bandstand",105,1150)]}]},
    home:{to:"Home, Dombivli",options:[
      {id:"local",label:"Local trains + auto",monthly:1800,legs:[leg("auto","Bandstand","Bandra station",14,60),leg("train","Bandra","Dadar",10,5,{st:["Bandra","Mahim","Dadar"],wait:4}),leg("train","Dadar","Dombivli",55,15,{st:["Dadar","Kurla","Ghatkopar","Thane","Dombivli"],wait:6}),leg("shareauto","Dombivli station","Home",8,20)]},
      {id:"cab",label:"App cab",monthly:20700,legs:[leg("cab","Bandstand","Home",110,1200)]}]}
  },
  month(f){const L=[];
    L.push({g:"Income",label:"Paid reel this month",amt:8000,note:"One brand."});
    if(f.quickDeal) L.push({g:"Income",label:"Skincare reel",amt:5000,note:""});
    L.push({g:"Income",label:"Editing gigs",amt:6000,note:"Two clients."});
    L.push({g:"Income",label:"Affiliate links",amt:700,note:""});
    L.push({sub:"Total income"});
    L.push({g:"Costs of the work",label:"Phone EMI",amt:-2500,note:""});
    L.push({g:"Costs of the work",label:"Data plan",amt:-600,note:""});
    L.push({g:"Costs of the work",label:"Travel to shoots: "+(f.commute?f.commute.label:"local trains"),amt:-(f.commute?f.commute.monthly:1800),note:"About nine shoot days."});
    L.push({g:"Costs of the work",label:"Props and outfits",amt:-2000,note:""});
    L.push({g:"Costs of the work",label:"Editing app",amt:-500,note:""});
    L.push({sub:"Income after work costs"});
    L.push({g:"Home",label:"To Aai for the house",amt:-2000,note:"She lives at home."});
    L.push({g:"Home",label:"Personal",amt:-1500,note:""});
    if(f.bankForm) L.push({g:"Home",label:"Bank exam form",amt:-850,note:""});
    return {kind:"Irregular income from deals and gigs; work costs first. Living at home makes it possible.",lines:L,owed:[{label:"Phone EMI",amt:15000,note:"Six months left."}]};},
  available:8100,availableNote:"Income after work costs, in an average month. Some months are zero.",
  hours:{work:55,commute:8,label:"Shooting, editing, college"},
  entryCost:{amt:180000,note:"BMM fees, a phone, a ring light and a mic."},
  pivot:"c3",
  branches:[
    {id:"job",cond:f=>!!f.job,title:"Behind the camera",
     y5:{age:26,role:"Senior editor and producer, creator studio, Andheri",place:"office_bkc",available:55000,availableNote:"Today's rupees.",hours:"54 hours a week",changed:"Editor, then producer.",enabled:"Speed and taste.",cost:"Her own channel slowed.",uncertain:"Studios depend on a few big creators."},
     y15:{age:36,role:"Runs a small video production agency",place:"office_bkc",available:140000,availableNote:"Varies.",hours:"55 hours a week",changed:"Started an agency with two editors.",enabled:"Clients from her studio years.",cost:"Running a business.",uncertain:"Agencies come and go."}},
    {id:"indie",cond:()=>true,title:"Independent",
     y5:{age:26,role:"Creator with 180,000 followers",place:"promenade",available:45000,availableNote:"Average; some months nothing.",hours:"60 hours a week",changed:"Grew steadily, then fast after one series.",enabled:"Posting every day, and luck.",cost:"No salary, no PF, constant output.",uncertain:"Most creators never reach this."},
     y15:{age:36,role:"Either a media business or a career change",place:"promenade",available:70000,availableNote:"Varies widely.",hours:"Varies",changed:"Platforms changed twice.",enabled:"Skills that transfer.",cost:"Starting over, maybe.",uncertain:"Very uncertain."}}
  ]
};

/* ---------------- AMAN ---------------- */
CH.aman = {
  id:"aman",name:"Aman Gill",short:"Aman",age:26,pronouns:"he/him",role:"Assistant director, films",place:"Goregaon West",
  look:{shirt:"#3D3D44",pants:"#4A4F5C",skin:"#B5835E",hair:"#1A1512",bag:"#5A4632"},outfits:["#3D3D44","#8A3B3B","#5A6E8C"],
  intro:"Eighteen-hour shoot days, then nothing for six weeks.",
  payMode:"orders",income:"Per project, paid late",startEnergy:64,defaultWx:"monsoon",
  homeLabel:"PG room, Goregaon West",workLabel:"Film City, Goregaon East",commuteText:"A 25-minute auto",commuteMin:25,
  commits:{mom:{label:"Call Mom back",status:"pending"}},
  profile:{
    today:[["Role","Third assistant director on a web series shooting at Film City."],["Lives in","A paying-guest room in Goregaon West, shared with two others."],["Housing","₹11,000 a month with two meals."],["Commute","Auto, bus, or the production van."],["From","Chandigarh. His father runs a hardware shop; his mother teaches."],["Interests","World cinema, writing scripts at night, football."],["Wants","To direct a feature by 35."],["Enjoys","When a shot works. The crew. Learning from cinematographers."],["Finds hard","Eighteen-hour days, payments 75 days late, weeks without work."]],
    education:[{when:"2018–2021",what:"B.A. Mass Communication, Chandigarh",detail:"About ₹60,000 a year, paid by his parents."},{when:"2022",what:"Six-month filmmaking diploma, Mumbai",detail:"Fictional institute. ₹2.4 lakh, a loan his father took."}],
    eduNotes:[["Who paid","His parents, including a ₹2.4 lakh loan."],["Unpaid work","An indie-film internship, possible because his parents sent money."]],
    work:[{when:"2021",what:"Wedding videographer's assistant",pay:"₹10,000 a month",detail:"",skills:"Cameras"},{when:"2022",what:"Unpaid intern, indie film",pay:"Nothing",detail:"",skills:"Sets"},{when:"2023",what:"Fourth AD, ad films",pay:"₹1,500 a day",detail:"",skills:"Call sheets"},{when:"2024 – now",what:"Third AD, web series",pay:"₹35,000 a month during shoots",detail:"Paid 60–90 days late.",skills:"Scheduling"}],
    start:[["Support when starting","Parents send ₹5,000 some months."],["Dependants","None."],["Debt","His father's ₹2.4 lakh loan; a laptop EMI."],["Access","No film family. Every job came from the last one."],["Could he afford unpaid work?","Yes, with his parents' help."]],
    moments:[{yr:"2021",title:"Telling his father",place:"pg_aman",happened:"His father wanted him in the shop.",options:["The shop","Mumbai"],outOfReach:[],chose:"Mumbai.",depended:"His father, who took the loan anyway."},{yr:"2022",title:"The unpaid internship",place:"set",happened:"An indie film needed a runner, unpaid.",options:["Take it","Look for paid work"],outOfReach:[],chose:"Take it.",depended:"Money from home."},{yr:"2025",title:"The money that didn't come",place:"set",happened:"A producer delayed payment 75 days.",options:["Push","Wait"],outOfReach:[],chose:"Wait.",depended:"Not wanting to lose the next job."}]
  },
  scenes:[
    {id:"m1",time:"05:40",place:"Goregaon West · PG",text:()=>"Your roommate Varun, an actor, asks to borrow ₹2,000 for audition photos. You have ₹6,000 until payday, whenever that is.",
     choices:[{label:"Lend it",detail:"₹2,000.",fx:()=>({spend:2000,flags:{lent:true},text:"He hugs you. He says next week."})},{label:"Say no",detail:"You can't.",fx:()=>({energy:-4,text:"He understands. It's quiet in the room."})}]},
    {id:"m2",time:"11:00",place:"Film City · set",text:()=>"The director is shouting: an actor's call time was wrong on the call sheet. You made the sheet. The second AD looks at you.",
     choices:[{label:"Own it and fix the schedule",detail:"In front of everyone.",fx:()=>({energy:-6,flags:{owned:true},text:"The director stops shouting. The DOP nods at you later."})},{label:"Stay quiet",detail:"The second AD takes it.",fx:()=>({text:"She takes it. She stops sharing her notes with you."})}]},
    {id:"m3",time:"00:30",place:"Film City · night",text:()=>"Wrap is at 2 a.m. An ad-film production house texts: a salaried coordinator job, ₹45,000 a month, paid on time, but away from films.",
     choices:[{label:"Take the ad job",detail:"Paid on time.",fx:()=>({flags:{ads:true},commit:["mom","kept"],text:"You call Mom at 2:30 a.m. She's awake."})},{label:"Stay on films; write your short",detail:"Keep the dream close.",fx:()=>({flags:{films:true},commit:["mom","kept"],text:"Mom says 'okay, beta'. You write three pages on the ride home."})}]}
  ],
  day:[
    {place:"pg_aman",time:"05:40",beats:[["m1","varun","Varun"]],talks:[["roommate","Joseph","(asleep) …cut… print… cut…"]],exit:"Leave for Film City"},
    {travel:"work",time:"06:15",deadline:"07:00"},
    {place:"set",beats:[["m2","director","The director"],["m3","gate","Your phone"]],talks:[["dop","DOP Bose","Never stand in my light, Aman. Everything else I forgive."]],exit:"Head back to the PG"},
    {travel:"home",time:"02:20"},
    {place:"pg_aman_night",beats:[],talks:[["varun","Varun","It's 3 a.m. Your mom called the landline."]],exit:"Sleep"}
  ],
  routes:{
    work:{to:"Film City",options:[
      {id:"auto",label:"Auto",monthly:2300,legs:[leg("auto","PG","Film City gate",25,95)]},
      {id:"bus",label:"BEST bus + walk",monthly:300,legs:[leg("walk","PG","Bus stop",6,0),leg("bus","Goregaon","Film City",30,12,{wait:10,st:["Goregaon Stn (E)","Aarey","Film City"]}),leg("walk","Gate","Set",12,0)]},
      {id:"van",label:"Production van",monthly:0,note:"Free, leaves 6:30 sharp",legs:[leg("walk","PG","Goregaon station",10,0),leg("van","Goregaon station","Set",25,0,{wait:5})]}]},
    home:{to:"PG, Goregaon West",options:[
      {id:"auto",label:"Night auto",monthly:0,legs:[leg("auto","Film City","PG",22,130)]},
      {id:"van",label:"Production van (waits 40 min)",monthly:0,legs:[leg("van","Set","Goregaon station",25,0,{wait:40}),leg("walk","Station","PG",10,0)]}]}
  },
  month(f){const L=[];
    L.push({g:"Income",label:"Fee for last project (75 days late)",amt:30000,note:"This project's fee is still pending."});
    L.push({g:"Income",label:"From home",amt:5000,note:"His parents."});
    L.push({sub:"Money in"});
    L.push({g:"Costs of the work",label:"Travel to sets: "+(f.commute?f.commute.label:"auto"),amt:-(f.commute?f.commute.monthly:2300),note:""});
    L.push({g:"Costs of the work",label:"Phone and data",amt:-600,note:""});
    L.push({g:"Costs of the work",label:"Laptop EMI",amt:-2200,note:""});
    L.push({g:"Living",label:"PG room with two meals",amt:-11000,note:""});
    L.push({g:"Living",label:"Personal",amt:-2000,note:""});
    if(f.lent) L.push({g:"Living",label:"Lent to Varun",amt:-2000,note:"'Next week.'"});
    return {kind:"Project money, paid late, plus help from home.",lines:L,owed:[{label:"This project's fee",amt:35000,note:"Owed to him, due in 60–90 days."},{label:"Father's diploma loan",amt:240000,note:""}]};},
  available:24800,availableNote:"Average monthly fee after work costs. Gaps between projects pay nothing.",
  hours:{work:84,commute:5,label:"84 hours during a shoot, none between"},
  entryCost:{amt:420000,note:"Degree, diploma and an unpaid internship year."},
  pivot:"m3",
  branches:[
    {id:"ads",cond:f=>!!f.ads,title:"Ad films",
     y5:{age:31,role:"Producer, ad-film house",place:"set",available:85000,availableNote:"Salary.",hours:"60 hours a week",changed:"Coordinator, then producer.",enabled:"Reliability.",cost:"His script sits in a drawer.",uncertain:"Ad budgets swing with the economy."},
     y15:{age:41,role:"Runs his own ad production company",place:"set",available:200000,availableNote:"Varies.",hours:"60 hours a week",changed:"Went independent.",enabled:"Clients who trusted him.",cost:"All the risk.",uncertain:"Clients come and go."}},
    {id:"films",cond:()=>true,title:"Films",
     y5:{age:31,role:"First AD on series; a short film at festivals",place:"set",available:50000,availableNote:"Averaged; irregular.",hours:"80 hours during shoots",changed:"Moved up to first AD; made a short on weekends.",enabled:"His owning-it reputation.",cost:"No savings.",uncertain:"Festival selections don't pay rent."},
     y15:{age:41,role:"Directed one feature; between projects",place:"set",available:60000,availableNote:"Very irregular.",hours:"Varies",changed:"Directed a feature on a small budget.",enabled:"A producer who believed him.",cost:"Years of uncertainty.",uncertain:"Most assistants never direct."}}
  ]
};

/* ---------------- MEHER ---------------- */
CH.meher = {
  id:"meher",name:"Meher Bhatt",short:"Meher",age:28,pronouns:"she/her",role:"Commercial pilot, first officer",place:"Andheri East",
  look:{shirt:"#F4F1EA",pants:"#22242C",skin:"#B07E5B",hair:"#1E1813",long:true,cap:"#22242C"},outfits:["#F4F1EA","#E6EEF4","#F2E8D2"],
  intro:"The salary arrived after a training bill of about a crore.",
  payMode:"salary",income:"Salary plus flying allowance",dayPay:10900,startEnergy:70,defaultWx:"haze",
  homeLabel:"Andheri East (1BHK)",workLabel:"Mumbai airport",commuteText:"A 20-minute crew cab",commuteMin:20,
  commits:{amma:{label:"Call Amma back after landing",status:"pending"}},
  profile:{
    today:[["Role","First officer (co-pilot) on narrow-body jets at a domestic airline."],["Lives in","Andheri East, a rented 1BHK on her own."],["Housing","₹42,000 a month."],["Commute","A crew cab at 4:45 a.m."],["From","Vadodara. Her father runs a pharmacy; her mother is a homemaker. The family borrowed against their house for her training."],["Interests","Running, baking, aviation videos."],["Wants","Command by 33. The loan cleared. Her parents on her flight."],["Enjoys","Sunrise from the cockpit. Precision. Crew friends."],["Finds hard","Roster changes, fatigue, loan pressure, comments about women pilots."]],
    education:[{when:"2016",what:"HSC Science",detail:"Physics and maths are required."},{when:"2016–2017",what:"Ground exams",detail:""},{when:"2017–2019",what:"Commercial pilot licence training abroad",detail:"Fictional flying school. About ₹55 lakh."},{when:"2021",what:"Type rating on the airline's aircraft",detail:"About ₹25 lakh."}],
    eduNotes:[["Who paid","An ₹80 lakh loan against the family home, plus savings."],["Waiting","Two years of a hiring freeze during the pandemic."],["Medical","A class-one medical every year, or she can't fly."]],
    work:[{when:"2019–2021",what:"Ground instructor at a flying school",pay:"₹25,000 a month",detail:"During the hiring freeze.",skills:"Teaching"},{when:"2022",what:"Joined as cadet first officer",pay:"₹1.5 lakh a month",detail:"",skills:""},{when:"Now",what:"First officer",pay:"About ₹2.4 lakh a month gross",detail:"",skills:""}],
    start:[["Support when starting","A family home to borrow against. Many families can't."],["Dependants","None."],["Debt","About ₹75 lakh outstanding."],["Access","A pilot cousin's advice."],["Could she afford unpaid training?","Two years of it, on family money."]],
    moments:[{yr:"2016",title:"Engineering or flying",place:"flat_meher",happened:"Flying school cost more than her parents' house was worth in cash.",options:["Engineering","Flying on a loan"],outOfReach:["Paying cash"],chose:"Flying.",depended:"A house to mortgage."},{yr:"2020",title:"Grounded",place:"crewroom",happened:"Airlines stopped hiring.",options:["Wait","Switch careers"],outOfReach:[],chose:"Wait, teaching ground school.",depended:"Her parents covering the EMI."},{yr:"2022",title:"The joining letter",place:"apron",happened:"An airline finally called.",options:["Accept"],outOfReach:[],chose:"Accept.",depended:"Timing."}]
  },
  scenes:[
    {id:"p1",time:"04:10",place:"Andheri East · flat",text:()=>"Crew pickup at 4:45. Amma calls: the bank raised the loan's interest rate again.",
     choices:[{label:"Talk for ten minutes",detail:"Calm her down.",fx:()=>({energy:4,commit:["amma","kept"],text:"You run the numbers together. It's ₹2,000 more a month. You can cover it."})},{label:"Promise to call after landing",detail:"Focus on the flight.",fx:()=>({text:"She says of course. Fly safe."})}]},
    {id:"p2",time:"05:40",place:"Apron · walkaround",text:()=>"On your walkaround you spot a small dent near the aft cargo door. Reporting it may delay departure. The captain cares about on-time performance.",
     choices:[{label:"Report it to the engineer formally",detail:"Delay about 25 minutes.",fx:()=>({minutes:25,flags:{reported:true},text:"The engineer inspects and signs it off as within limits. The captain says 'good catch' after the second sector."})},{label:"Ask the engineer to take a quick look first",detail:"He'll log it either way.",fx:()=>({minutes:12,text:"He checks, logs it, and clears it. Twelve minutes."})}]},
    {id:"p3",time:"15:40",place:"Crew room",text:()=>"Rostering asks if you'll fly an extra evening sector: +₹6,000 allowance, within legal duty limits. You've been up since four.",
     choices:[{label:"Decline: you're tired",detail:"Fatigue is a safety issue.",fx:()=>({energy:12,flags:{declined:true},text:"Rostering finds someone else. Nobody questions it."})},{label:"Accept the extra sector",detail:"₹6,000.",fx:()=>({earn:6000,energy:-15,text:"You land at 10:40 p.m. The money goes straight to the EMI."})}]},
    {id:"p4",time:"22:30",place:"Andheri East · flat",text:()=>"A Gulf airline is hiring first officers: about twice the pay, tax-free, but far from home and command takes longer. Your airline's command upgrade could come in four to five years.",
     choices:[{label:"Apply abroad",detail:"Pay off the loan faster.",fx:()=>({flags:{gulf:true},text:"You update your logbook summary at midnight."})},{label:"Stay for command",detail:"Captain sooner, at home.",fx:()=>({flags:{command:true},text:"You set a reminder to start command prep."})}]}
  ],
  day:[
    {place:"flat_meher",time:"04:10",beats:[["p1","phone","Amma on the phone"]],talks:[["bag","Flight bag","Licence, medical, ID, headset. Checked."]],exit:"Go down to the crew cab"},
    {travel:"work",time:"04:45",deadline:"05:30"},
    {place:"apron",beats:[["p2","cargo","Aft cargo door"]],talks:[["engineer","Engineer Thomas","Morning. Coffee after the walkaround?"]],exit:"Board and fly four sectors"},
    {place:"crewroom",time:"15:40",beats:[["p3","roster","Rostering"]],talks:[["captain","Captain Sinha","Four sectors, four smooth landings. Not bad for a Tuesday."]],exit:"Head home"},
    {travel:"home",time:"16:30"},
    {place:"flat_meher",time:"22:30",beats:[["p4","phone","Your laptop"]],exit:null}
  ],
  routes:{
    work:{to:"Airport",options:[
      {id:"crew",label:"Crew cab",monthly:0,note:"Provided by the airline",legs:[leg("crewcab","Flat","Airport",20,0)]},
      {id:"auto",label:"Auto",monthly:2600,legs:[leg("auto","Flat","Airport",15,60)]}]},
    home:{to:"Flat, Andheri East",options:[{id:"crew",label:"Crew cab",monthly:0,legs:[leg("crewcab","Airport","Flat",25,0)]}]}
  },
  month(f){const L=[];
    L.push({g:"Salary",label:"Gross pay with flying allowance",amt:240000,note:""});
    L.push({g:"Salary",label:"Employee PF",amt:-1800,note:""});
    L.push({g:"Salary",label:"Professional tax",amt:-200,note:""});
    L.push({g:"Salary",label:"Income tax",amt:-50000,note:"Illustrative."});
    L.push({sub:"Take-home pay"});
    L.push({g:"The loan",label:"Training loan EMI",amt:-85000,note:"About ₹75 lakh left."});
    L.push({g:"Home",label:"Rent, 1BHK",amt:-42000,note:""});
    L.push({g:"Home",label:"Utilities",amt:-3500,note:""});
    L.push({g:"Home",label:"Food",amt:-10000,note:""});
    L.push({g:"Home",label:"Medical and licence renewals",amt:-2500,note:"Averaged."});
    L.push({g:"Home",label:"Personal",amt:-8000,note:""});
    return {kind:"A high salary with a very large training loan.",lines:L,owed:[{label:"Training loan",amt:7500000,note:"About 12 years left."}]};},
  available:103000,availableNote:"Take-home minus the training-loan EMI.",
  hours:{work:60,commute:4,label:"About 60 hours of duty and standby"},
  entryCost:{amt:8200000,note:"Pilot training abroad plus a type rating, on a family loan."},
  pivot:"p4",
  branches:[
    {id:"command",cond:f=>!!f.command,title:"Command at home",
     y5:{age:33,role:"Captain at the same airline",place:"apron",available:220000,availableNote:"After the loan EMI.",hours:"60 hours a week",changed:"Command upgrade on schedule.",enabled:"A clean record and good timing.",cost:"The loan still runs.",uncertain:"Airlines' fortunes rise and fall."},
     y15:{age:43,role:"Senior captain and trainer",place:"apron",available:550000,availableNote:"Loan cleared.",hours:"55 hours a week",changed:"Trains new first officers.",enabled:"Experience.",cost:"A career lived by roster.",uncertain:"Medical fitness every year."}},
    {id:"gulf",cond:()=>true,title:"Abroad",
     y5:{age:33,role:"First officer, Gulf airline",place:"apron",available:340000,availableNote:"After costs abroad and the EMI, converted.",hours:"65 hours a week",changed:"Moved to Dubai.",enabled:"Hours logged and a type rating.",cost:"Far from her parents.",uncertain:"Visa and contract terms."},
     y15:{age:43,role:"Captain, Gulf airline",place:"apron",available:700000,availableNote:"Converted.",hours:"60 hours a week",changed:"Command, later than at home.",enabled:"Patience.",cost:"Years away.",uncertain:"Whether she moves back."}}
  ]
};

const ORDER=["rohit","faizan","ruth","ananya","kunal","tanvi","santosh","kavya","iqbal","riya","aman","meher"];
const ALL=()=>ORDER.map(k=>CH[k]);
