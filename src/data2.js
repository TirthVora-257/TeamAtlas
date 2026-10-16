/* ---------------- ANANYA ---------------- */
CH.ananya = {
  id:"ananya",name:"Dr. Ananya Rao",short:"Ananya",age:27,pronouns:"she/her",role:"Resident doctor",place:"Parel",
  look:{shirt:"#F2EEE6",pants:"#3E5A86",skin:"#8F5C3E",hair:"#1A1512",long:true,steth:true},outfits:["#F2EEE6","#7FB3AE","#3E5A86"],
  intro:"Second-year resident in General Medicine. Thirty-hour duties. Nine years of study behind her, three more to go.",
  payMode:"salary",income:"Monthly stipend",dayPay:4545,startEnergy:68,defaultWx:"monsoon",
  homeLabel:"Resident hostel, Parel",workLabel:"Government hospital, Parel",commuteText:"A 6-minute walk",commuteMin:6,
  commits:{amma:{label:"Call Amma before she sleeps",status:"pending"}},
  profile:{
    today:[["Role","Second-year resident, MD General Medicine, at a government teaching hospital in Parel. Paid a stipend, not a salary."],["Lives in","The resident doctors' hostel next to the hospital, sharing a room with Dr. Farah."],["Housing","Hostel room about ₹3,000 a month; mess food ₹4,500."],["Commute","Six minutes on foot. Some weeks she never leaves campus."],["From","Hyderabad. Amma teaches at a government school; Nanna retired from a bank."],["Interests","Carnatic music on long nights, badminton, cooking on a hostel induction stove."],["Wants","A super-speciality seat in cardiology. Eight hours of sleep."],["Enjoys","When a patient she admitted walks out. Teaching interns."],["Finds hard","Shifts past 24 hours. Angry relatives. Studying after duty."]],
    education:[{when:"2014–2016",what:"HSC Science, Hyderabad, plus two-year entrance coaching",detail:"Coaching about ₹2.4 lakh, from her parents' savings."},{when:"2016–2017",what:"Drop year in Kota",detail:"About ₹2.8 lakh with hostel. Her second attempt got a government medical college seat."},{when:"2017–2023",what:"MBBS, government medical college",detail:"Vidarbha Government Medical College (fictional). About ₹1 lakh a year including hostel. A year of compulsory internship."},{when:"2023–2024",what:"Preparing for the PG entrance",detail:"Locum night shifts by night, studying by day."},{when:"2024–now",what:"MD General Medicine",detail:"Parel Government Medical College (fictional). Three years."}],
    eduNotes:[["Who paid","Her parents paid for coaching and the drop year, partly through a gold loan. MBBS fees were state-subsidised."],["Bond","A year of government service after PG is required (illustrative)."],["Changed plans","Wanted surgery. Her rank decided medicine."]],
    work:[{when:"2022–2023",what:"Intern",pay:"₹18,000 a month stipend",detail:"Rotations across every department.",skills:"Everything, quickly"},{when:"2023–2024",what:"Locum night doctor, small nursing homes",pay:"₹1,500 a night",detail:"About ten nights a month.",skills:"Working alone"},{when:"2024–now",what:"Resident",pay:"About ₹1,00,000 a month gross",detail:"Paid stipend while training.",skills:""}],
    start:[["Support when starting","About ₹5 lakh from her parents for coaching and Kota."],["Dependants","None, but she sends ₹10,000 home to repay the family gold loan."],["Debt","Family gold loan, about ₹1.5 lakh left."],["Access","A doctor cousin who guided her. A laptop. Quiet study rooms."],["Could she afford unpaid training?","The drop year, yes, because her parents could pay."]],
    moments:[{yr:"2016",title:"The drop year",place:"hostel_ananya",happened:"Her first rank only qualified for private colleges charging over ₹15 lakh a year.",options:["Private MBBS on a loan","Dental or ayurveda seats","A drop year in Kota","A B.Sc"],outOfReach:["₹70 lakh+ for private MBBS"],chose:"A drop year.",depended:"Her parents' savings, a gold loan, and passing the second time. Many don't."},{yr:"2023",title:"The PG rank",place:"ward_parel",happened:"Her rank allowed Medicine in Mumbai or Surgery in a smaller town.",options:["Medicine, Mumbai","Surgery, smaller town","Wait another year"],outOfReach:[],chose:"Medicine in Mumbai.",depended:"Rank, which is partly luck on the day."},{yr:"2025",title:"The duty-hours petition",place:"ward_parel",happened:"Residents petitioned for shorter shifts.",options:["Sign it","Stay out of it"],outOfReach:[],chose:"She signed.",depended:"Seniors who protected the juniors."}]
  },
  scenes:[
    {id:"a1",time:"07:15",place:"Hostel room",text:()=>"Your 30-hour duty starts at eight. Farah is asleep after a night shift. The mess serves idli until 7:45.",
     choices:[{label:"Breakfast at the mess",detail:"Sit down and eat.",fx:()=>({energy:12,text:"Hot idli, too much chutney. Two residents argue about cricket."})},{label:"Eat a banana and read overnight reports",detail:"Be ready for the round.",fx:()=>({energy:-2,flags:{prepped:true},text:"You know which three patients worry you before you reach the ward."})}]},
    {id:"a2",time:"10:30",place:"Ward 12 · medicine",text:d=>"Fifty-eight patients on forty beds; some on floor mattresses."+(d.flags.prepped?" You already know bed 14 needs a review. ":" ")+"A patient's son is shouting at the nurse about waiting two days for a scan.",
     choices:[{label:"Talk to him first",detail:"Delay your round 20 minutes.",fx:()=>({energy:-4,flags:{calm:true},text:"You explain the scan queue and write the request again with 'urgent'. He sits down. He brings you tea at four."})},{label:"Finish the round; ask security to stand by",detail:"58 patients are waiting.",fx:()=>({energy:-8,text:"The round finishes on time. He complains to the dean's office. You'll write a reply after duty."})}]},
    {id:"a3",time:"02:40",place:"Ward 12 · night",text:()=>"Hour nineteen. An intern asks you to explain a confusing ECG. Three admissions wait in casualty.",
     choices:[{label:"Teach for ten minutes",detail:"Slower tonight.",fx:()=>({energy:-8,flags:{taught:true},text:"She gets it on the second strip. She'll teach the next intern."})},{label:"Take the admissions; explain at sunrise",detail:"Keep moving.",fx:()=>({energy:-5,text:"By sunrise she's asleep on the bench. You leave a sketch of the ECG in her notebook."})}]},
    {id:"a4",time:"14:30",place:"Hostel room · post-duty",text:()=>"Thirty hours done. Thesis data is due Friday; the super-speciality entrance is in seven months. A crash course costs ₹45,000.",
     choices:[{label:"Join the crash course",detail:"₹45,000 and every evening off.",fx:()=>({flags:{dm:true},commit:["amma","kept"],text:"You pay from your savings. Amma is thrilled; Nanna asks if you'll ever sleep."})},{label:"Sleep, then thesis tonight",detail:"Decide on super-speciality later.",fx:()=>({energy:20,commit:["amma","kept"],text:"Eleven hours of sleep. Amma calls at nine; you tell her about the ECG."})},{label:"Take a locum shift tonight",detail:"₹2,000 for a night at a nursing home.",fx:()=>({earn:2000,energy:-20,flags:{locum:true},commit:["amma","missed"],text:"₹2,000 and no sleep. Amma's call goes to voicemail."})}]}
  ],
  day:[
    {place:"hostel_ananya",time:"07:15",beats:[["a1","desk","Your desk"]],talks:[["farah","Farah","(asleep) Five more minutes… the ICU called twice…"]],exit:"Walk to the ward"},
    {travel:"work",time:"07:50",deadline:"08:00"},
    {place:"ward_parel",beats:[["a2","relative","A patient's son"],["a3","intern","The intern"]],talks:[["nurse","Sister Mary","Bed 22's family brought biryani again. Tell them gently."]],exit:"Walk back to the hostel"},
    {travel:"home",time:"14:15"},
    {place:"hostel_ananya",time:"14:30",beats:[["a4","desk","Your desk"]],exit:null}
  ],
  routes:{
    work:{to:"Ward 12",options:[{id:"walk",label:"Walk across campus",monthly:0,legs:[leg("walk","Hostel","Hospital gate",6,0)]}]},
    home:{to:"Hostel",options:[{id:"walk",label:"Walk across campus",monthly:0,legs:[leg("walk","Hospital gate","Hostel",6,0)]}]}
  },
  month(f){const L=[];
    L.push({g:"Stipend",label:"Gross stipend",amt:100000,note:"Resident stipend (illustrative)."});
    L.push({g:"Stipend",label:"Income tax (TDS)",amt:-4500,note:"Illustrative."});
    L.push({g:"Stipend",label:"Professional tax",amt:-200,note:""});
    L.push({sub:"Take-home"});
    if(f.locum) L.push({g:"Extra",label:"Locum nights (four this month)",amt:8000,note:"₹2,000 a night at small nursing homes."});
    L.push({g:"Living on campus",label:"Hostel room",amt:-3000,note:""});
    L.push({g:"Living on campus",label:"Mess food",amt:-4500,note:""});
    L.push({g:"Living on campus",label:"Books and question banks",amt:-2500,note:""});
    L.push({g:"Living on campus",label:"Phone plan",amt:-500,note:""});
    L.push({g:"Family and self",label:"Sent home for the gold loan",amt:-10000,note:"Repaying what Kota cost."});
    L.push({g:"Family and self",label:"Personal",amt:-4000,note:"Clothes, rare outings."});
    if(f.dm) L.push({g:"Family and self",label:"Super-speciality crash course",amt:-45000,note:"Paid from savings this month."});
    return {kind:"A stipend, taxed at source. She lives on campus, so housing is cheap; time is what's expensive.",lines:L,owed:[{label:"Family gold loan",amt:150000,note:"Taken for coaching and Kota."},{label:"Government-service bond",amt:null,note:"A year of required service after PG (illustrative)."}]};},
  available:85300,availableNote:"Take-home minus the family gold-loan repayment. Residency lasts three years.",
  hours:{work:84,commute:1,label:"About 84 hours a week including one 30-hour duty"},
  entryCost:{amt:1000000,note:"Coaching, a drop year in Kota, MBBS and hostel fees over seven years."},
  pivot:"a4",
  branches:[
    {id:"dm",cond:f=>!!f.dm,title:"The specialist",
     y5:{age:32,role:"Junior consultant cardiologist, private hospital",place:"ward_parel",available:180000,availableNote:"After tax, today's rupees.",hours:"70 hours a week with on-call nights",changed:"Cleared the super-speciality entrance on her second try, three more years of residency.",enabled:"The course, her teaching habit, and parents who didn't need her income.",cost:"Three more years of residency at a stipend. Her early thirties went to training.",uncertain:"Super-speciality seats are very limited. Many strong residents never get one."},
     y15:{age:42,role:"Interventional cardiologist",place:"ward_parel",available:600000,availableNote:"Varies with referrals.",hours:"72 hours, on call most weekends",changed:"Consultant at two hospitals.",enabled:"Skill, reputation, referrals.",cost:"Time with family; constant call.",uncertain:"Private practice depends on referrals; burnout is common."}},
    {id:"md",cond:()=>true,title:"The physician",
     y5:{age:32,role:"Consultant physician, government hospital, plus an evening clinic",place:"ward_parel",available:140000,availableNote:"Salary plus clinic.",hours:"60 hours a week",changed:"Finished MD, served the bond, joined a district hospital, then Mumbai.",enabled:"Steady government post.",cost:"Evening clinic means late nights.",uncertain:"Government postings and transfers."},
     y15:{age:42,role:"Own clinic in Thane, visiting physician at two hospitals",place:"ward_parel",available:300000,availableNote:"Varies.",hours:"58 hours a week",changed:"Built a neighbourhood practice.",enabled:"Patients who stayed with her.",cost:"Running a clinic is running a business.",uncertain:"Rent and competition."}}
  ]
};

/* ---------------- KUNAL ---------------- */
CH.kunal = {
  id:"kunal",name:"Kunal Mehta",short:"Kunal",age:25,pronouns:"he/him",role:"Audit associate (new CA)",place:"Borivali West",
  look:{shirt:"#E8E2D6",pants:"#2C3442",skin:"#B07A55",hair:"#2A211B",bag:"#3A2E28"},outfits:["#E8E2D6","#9FB8D0","#2C3442"],
  intro:"Newly qualified chartered accountant. Busy season means trains after midnight.",
  payMode:"salary",income:"Monthly salary",dayPay:4090,startEnergy:72,defaultWx:"haze",
  homeLabel:"Borivali West",workLabel:"Client office, Lower Parel",commuteText:"Western line, one hour",commuteMin:73,
  commits:{isha:{label:"Transfer Isha's fees before midnight",status:"pending"}},
  profile:{
    today:[["Role","Audit associate at Sterling & Rao (fictional), a large audit firm. This month, at a client's office in Lower Parel."],["Lives in","Borivali West, with Papa (Paresh, 56, sells textiles on commission since his shop closed in 2020), Mummy (Meena, 52) and sister Isha (19, B.Com)."],["Housing","Family-owned 2BHK, bought in 1998."],["Commute","Western line slow train to Lower Parel. About an hour each way."],["Interests","Cricket statistics, the gym, Gujarati theatre."],["Wants","Manager by 28. A bigger flat for his parents."],["Carries","₹20,000 a month to the household, Isha's college fees."],["Enjoys","Finding the number that doesn't tie. The team in busy season."],["Finds hard","Fourteen-hour days from January to May. Clients who delay."]],
    education:[{when:"2016",what:"SSC, Borivali",detail:"92%."},{when:"2016–2018",what:"HSC Commerce and CA Foundation",detail:"Foundation coaching about ₹45,000."},{when:"2018–2021",what:"B.Com alongside CA Intermediate",detail:"A Borivali college (fictional), about ₹12,000 a year. Failed one Intermediate group once."},{when:"2020–2023",what:"Articleship (three years of training)",detail:"At a mid-size firm. Stipend ₹7,000 rising to ₹12,000."},{when:"2024",what:"CA Final cleared",detail:"Second attempt for one group."}],
    eduNotes:[["Who paid","Papa paid until 2020. Then Kunal's stipend, savings, and Mummy's gold."],["Total cost","Coaching about ₹1.6 lakh, institute fees about ₹80,000."],["Six months off","Study leave before the Final. Possible because he lived at home."]],
    work:[{when:"2019",what:"Summer data entry at his uncle's firm",pay:"₹5,000",detail:"",skills:"Tally"},{when:"2020–2023",what:"Articled assistant",pay:"₹7,000–12,000 a month",detail:"Audits of small companies and trusts.",skills:"Audit, GST, patience"},{when:"2023–2024",what:"Study leave",pay:"Nothing",detail:"Six months.",skills:""},{when:"Jan 2025 – now",what:"Audit associate",pay:"₹90,000 a month gross",detail:"",skills:""}],
    start:[["Support when starting","A family home; father's income fell in 2020."],["Dependants","His sister's studies."],["Debt","None now. He repaid ₹2 lakh the family borrowed in 2020."],["Access","Papa's business contacts. A quiet corner to study."],["Could he afford unpaid training?","Six months, living at home."]],
    moments:[{yr:"2020",title:"Papa's shop closes",place:"home_kunal",happened:"The lockdown ended his father's shop.",options:["Drop CA and take a job","Continue on the articleship stipend","Switch to MBA prep"],outOfReach:["Coaching without a stipend"],chose:"Continue.",depended:"Mummy's gold and living at home."},{yr:"2021",title:"Failing Group II",place:"home_kunal",happened:"He failed one Intermediate group.",options:["Retry in six months","Give up on CA"],outOfReach:[],chose:"Retry.",depended:"Not losing the articleship."},{yr:"2024",title:"Big firm or family contact",place:"office_lowerparel",happened:"Two offers: a mid-size firm at ₹70,000, a big firm at ₹90,000 with longer hours.",options:["Mid-size firm","Big firm"],outOfReach:[],chose:"The big firm.",depended:"Clearing the Final in time for campus hiring."}]
  },
  scenes:[
    {id:"k1",time:"07:10",place:"Borivali West · home",text:()=>"Papa is sitting with the newspaper. He hasn't had a commission this month. Mummy has packed your dabba.",
     choices:[{label:"Sit with Papa for chai",detail:"Ten minutes.",fx:()=>({energy:8,flags:{papa:true},text:"He talks about cricket, not money. You know what he isn't saying."})},{label:"Leave now",detail:"Catch an emptier train.",fx:()=>({energy:-2,text:"Papa waves without looking up."})}]},
    {id:"k2",time:"10:00",place:"Client office · Lower Parel",text:d=>(d.flags.late>10?"Your manager notices you came in late. ":"")+"The client's accountant has postponed the inventory files three times. Your manager wants the reconciliation by six.",
     choices:[{label:"Escalate politely to the client's finance head",detail:"Uncomfortable, by the book.",fx:()=>({energy:-4,flags:{escalated:true},text:"The files arrive in an hour. Your manager says, 'Good. That's the job.'"})},{label:"Rebuild it yourself from the ledger",detail:"No conflict, all evening.",fx:()=>({energy:-14,text:"It ties at 8:40 p.m. The client's accountant thanks you. Nobody else notices."})}]},
    {id:"k3",time:"21:50",place:"Client office · conference room",text:()=>"Partner review at ten. If you stay, the firm reimburses a cab after 10 p.m. If you leave at 9:15 you'll catch an easy train.",
     choices:[{label:"Stay for the review",detail:"Visible to the partner.",fx:()=>({energy:-10,flags:{stayed:true},text:"The partner asks one question about inventory. You know the answer."})},{label:"Leave at 9:15, send notes",detail:"Get home before eleven.",fx:()=>({energy:4,text:"Your manager covers the review. Your notes are good."})}]},
    {id:"k4",time:"23:40",place:"Borivali West · home",text:()=>"A mid-size company in Andheri offers you an in-house finance role: ₹1,10,000 a month, 9 to 7, Saturdays off. You'd leave audit.",
     choices:[{label:"Take the in-house role",detail:"More money, more evenings.",fx:()=>({flags:{industry:true},commit:["isha","kept"],text:"You accept by email at midnight, then transfer Isha's fees."})},{label:"Stay on the manager track",detail:"Two more busy seasons.",fx:()=>({flags:{stayFirm:true},commit:["isha","kept"],text:"You decline politely and transfer Isha's fees."})}]}
  ],
  day:[
    {place:"home_kunal",time:"07:10",beats:[["k1","papa","Papa"]],talks:[["mummy","Mummy","The theplas are for you, not your manager."],["isha","Isha","Bhai, the college sent a fee reminder."]],exit:"Leave for the client office"},
    {travel:"work",time:"07:45",deadline:"09:30"},
    {place:"office_lowerparel",beats:[["k2","lead","Your manager"],["k3","partner","Partner review"]],talks:[["colleague","Client's accountant","The inventory files? Tomorrow. Definitely tomorrow."]],exit:"Head home"},
    {travel:"home",time:"21:15",leaveFlag:"stayed",lateLeave:"22:45",reimburseAfter:"22:00"},
    {place:"home_kunal_night",time:"23:40",beats:[["k4","papa","Your phone"]],exit:null}
  ],
  routes:{
    work:{to:"Client office, Lower Parel",options:[
      {id:"slow",label:"Slow local",monthly:400,note:"Pass about ₹300 + walks",legs:[leg("walk","Home","Borivali station",8,0),leg("train","Borivali","Lower Parel",58,15,{st:["Borivali","Malad","Goregaon","Andheri","Bandra","Dadar","Lower Parel"],wait:5,line:"Western line, slow"}),leg("walk","Lower Parel station","Client office",7,0)]},
      {id:"ac",label:"AC local",monthly:1450,note:"AC pass about ₹1,350",legs:[leg("walk","Home","Borivali station",8,0),leg("actrain","Borivali","Lower Parel",55,95,{st:["Borivali","Andheri","Bandra","Dadar","Lower Parel"],wait:11,line:"Western line, AC"}),leg("walk","Lower Parel station","Client office",7,0)]},
      {id:"cab",label:"App cab",monthly:29900,note:"₹680 each way",legs:[leg("cab","Home","Client office",75,680)]}]},
    home:{to:"Home, Borivali West",options:[
      {id:"slow",label:"Slow local",monthly:400,legs:[leg("walk","Client office","Lower Parel station",7,0),leg("train","Lower Parel","Borivali",58,15,{st:["Lower Parel","Dadar","Bandra","Andheri","Goregaon","Malad","Borivali"],wait:6}),leg("walk","Borivali station","Home",8,0)]},
      {id:"cab",label:"Cab (reimbursed after 10 p.m.)",monthly:0,reimbursedAfter:"22:00",legs:[leg("cab","Client office","Home",55,720)]}]}
  },
  month(f){const L=[];
    L.push({g:"Salary",label:"Gross monthly salary",amt:90000,note:"About ₹10.8 lakh a year."});
    L.push({g:"Salary",label:"Employee PF",amt:-1800,note:"Retirement savings."});
    L.push({g:"Salary",label:"Professional tax",amt:-200,note:""});
    L.push({g:"Salary",label:"Income tax",amt:0,note:"Covered by the rebate at this income (illustrative)."});
    L.push({sub:"Take-home pay"});
    L.push({g:"Work",label:"Commute: "+(f.commute?f.commute.label:"Slow local"),amt:-(f.commute?f.commute.monthly:400),note:"A month of travelling the way you did today."});
    L.push({g:"Work",label:"Lunches out",amt:-3000,note:""});
    L.push({g:"Home",label:"To the household",amt:-20000,note:"Papa's income is irregular now."});
    L.push({g:"Home",label:"Isha's college fees",amt:-5000,note:"About ₹60,000 a year, averaged."});
    L.push({g:"Home",label:"Phone and gym",amt:-2100,note:""});
    L.push({g:"Home",label:"Personal",amt:-5000,note:""});
    L.push({g:"Savings",label:"Monthly SIP",amt:-15000,note:"Mutual fund. He started in his second month."});
    return {kind:"Salaried, at home: the family's main earner since 2020.",lines:L,owed:[{label:"Debt",amt:null,note:"None. He cleared the family's 2020 borrowing."}]};},
  available:85000,availableNote:"Take-home minus lunches.",
  hours:{work:60,commute:10,label:"60 hours (70 in busy season) plus 10 on trains"},
  entryCost:{amt:400000,note:"Coaching, institute fees, and three years on a low stipend."},
  pivot:"k4",
  branches:[
    {id:"industry",cond:f=>!!f.industry,title:"In-house finance",
     y5:{age:30,role:"Finance controller, mid-size manufacturer",place:"office_lowerparel",available:160000,availableNote:"Today's rupees.",hours:"50 hours a week",changed:"Moved from audit to running the books he used to check.",enabled:"Audit training and a good first boss.",cost:"Slower title growth; fewer people to learn from.",uncertain:"Mid-size companies can be sold or shut."},
     y15:{age:40,role:"CFO of a mid-size company",place:"office_bkc",available:450000,availableNote:"Today's rupees.",hours:"55 hours a week",changed:"Took a company through a fundraise.",enabled:"Trust of a founder.",cost:"Responsibility for every number.",uncertain:"Few controllers become CFOs."}},
    {id:"firm",cond:()=>true,title:"The firm",
     y5:{age:30,role:"Audit manager",place:"office_lowerparel",available:170000,availableNote:"Today's rupees.",hours:"65 hours a week in busy season",changed:"Two promotions.",enabled:"Busy seasons survived.",cost:"Every January to May.",uncertain:"Many managers leave before senior manager."},
     y15:{age:40,role:"Partner",place:"office_bkc",available:600000,availableNote:"Varies with the firm's year.",hours:"60 hours a week",changed:"Made partner on the third attempt.",enabled:"Clients who followed him.",cost:"Sales, people, risk.",uncertain:"Very few associates make partner."}}
  ]
};

/* ---------------- TANVI ---------------- */
CH.tanvi = {
  id:"tanvi",name:"Tanvi Shah",short:"Tanvi",age:23,pronouns:"she/her",role:"Investment banking analyst",place:"Bandra West",
  look:{shirt:"#2E3A4E",pants:"#22242C",skin:"#B98663",hair:"#1E1813",long:true,bag:"#26262B"},outfits:["#2E3A4E","#E8E2D6","#8A3B3B"],
  intro:"The pay everyone talks about. The 90-hour weeks nobody does.",
  payMode:"salary",income:"Salary plus bonus",dayPay:7500,startEnergy:60,defaultWx:"sunny",
  homeLabel:"Bandra West (shared flat)",workLabel:"BKC tower",commuteText:"A 20-minute auto",commuteMin:20,
  commits:{dinner:{label:"Mira's birthday dinner, 8 p.m.",status:"pending"}},
  profile:{
    today:[["Role","Analyst at Meridian Capital (fictional), an investment bank in BKC. Builds valuation models and pitch books."],["Lives in","Bandra West, a 3BHK shared with two other analysts."],["Housing","Rent share ₹38,000 a month."],["Commute","An auto, 15–25 minutes. A company cab home after midnight."],["Family","Ahmedabad. Her father is a chartered accountant with his own practice; her mother is an architect."],["Interests","Bouldering, Gujarati food, true-crime podcasts."],["Wants","Private equity or business school abroad. Her own flat by 30."],["Enjoys","Steep learning, deal closings, smart colleagues."],["Finds hard","90-hour weeks, cancelled weekends, feeling she can't complain because the pay is high."]],
    education:[{when:"2016–2018",what:"HSC Commerce, Ahmedabad",detail:"97%."},{when:"2018–2021",what:"B.Com (Hons), Mumbai",detail:"Churchgate College of Commerce (fictional). Fees about ₹25,000 a year plus a ₹1.8 lakh-a-year hostel, paid by her parents."},{when:"2021–2023",what:"Master's in Management",detail:"Western Institute of Management (fictional). About ₹20 lakh, paid by her parents."},{when:"2023",what:"CFA Level 1",detail:"Cleared on the first attempt."}],
    eduNotes:[["Who paid","Her parents, fully."],["Internships","Her first came through a client of her father's."],["Unpaid time","She could take unpaid research internships in college."]],
    work:[{when:"2019",what:"Unpaid research intern, wealth firm",pay:"Nothing",detail:"A family friend's firm.",skills:"Excel"},{when:"2022",what:"Summer analyst, Meridian",pay:"₹1,25,000 for two months",detail:"Converted to a full-time offer.",skills:"Modelling"},{when:"Jul 2023 – now",what:"Analyst",pay:"About ₹1,65,000 a month gross plus bonus",detail:"",skills:""}],
    start:[["Support when starting","Full. Her parents paid for both degrees and still pay her health insurance."],["Dependants","None."],["Debt","None."],["Access","A strong network, a laptop, a quiet room, time."],["Could she afford unpaid training?","Yes, more than once."]],
    moments:[{yr:"2018",title:"Moving to Mumbai",place:"flat_tanvi",happened:"She could study in Ahmedabad or Mumbai.",options:["Stay home","Move to Mumbai"],outOfReach:[],chose:"Mumbai, with a paid hostel.",depended:"Her parents covering ₹1.8 lakh a year in hostel fees."},{yr:"2022",title:"The internship that converted",place:"office_bkc",happened:"Her summer internship turned into a job offer.",options:["Accept","Hold out for a bigger bank"],outOfReach:[],chose:"Accept.",depended:"Her work, and an introduction through her father."},{yr:"2024",title:"The 110-hour week",place:"office_bkc",happened:"She logged 110 hours in one week.",options:["Say nothing","Tell her staffer she needed a weekend"],outOfReach:[],chose:"She spoke up. She got the weekend.",depended:"A decent VP. Not every analyst has one."}]
  },
  scenes:[
    {id:"n1",time:"09:20",place:"Bandra West · flat",text:()=>"Mummy calls: your cousin's wedding in Ahmedabad is this Saturday. The deal is live; leave is 'not encouraged'.",
     choices:[{label:"Promise to come for one day",detail:"Fly Saturday, back Sunday.",fx:()=>({energy:4,flags:{wedding:true},text:"Mummy is happy. You'll answer emails from the mandap."})},{label:"Say you can't make it",detail:"The deal comes first.",fx:()=>({energy:-6,text:"Mummy says she understands. She says it slowly."})}]},
    {id:"n2",time:"11:30",place:"BKC · deal floor",text:()=>"Your VP needs the valuation model rebuilt for a 9 a.m. pitch. Mira's birthday dinner is at 8 in Bandra.",
     choices:[{label:"Go for an hour, come back",detail:"Work until 4 a.m.",fx:()=>({energy:6,commit:["dinner","kept"],text:"Cake, one song, a cab back. Mira says you look tired. You are."})},{label:"Skip dinner, order in",detail:"₹450 delivery.",fx:()=>({spend:450,energy:-8,commit:["dinner","missed"],text:"You send a voice note at 8:15. She replies with a heart."})}]},
    {id:"n3",time:"03:10",place:"BKC · deal floor",text:()=>"You find an error: one revenue line is double-counted. Fixing it lowers the valuation. The VP is asleep.",
     choices:[{label:"Fix it and email the VP now",detail:"He'll see the change.",fx:()=>({energy:-4,flags:{flagged:true},text:"He replies at 6:40: 'Good catch. Thank you.' He mentions it to the MD."})},{label:"Fix it quietly",detail:"He probably won't notice.",fx:()=>({text:"He notices the number moved in the meeting. He asks why. You explain. It's fine, but he double-checks your work for a month."})}]},
    {id:"n4",time:"11:00",place:"Bandra West · Saturday",text:()=>"A headhunter calls: a private equity fund wants analysts after two years. Separately, a fintech founder offers you a strategy role: ₹1,10,000, normal hours, some equity.",
     choices:[{label:"Stay two years, aim for PE",detail:"More money, same hours.",fx:()=>({flags:{pe:true},text:"You set a calendar reminder for 18 months from now."})},{label:"Join the startup",detail:"Less pay, your weekends back.",fx:()=>({flags:{startup:true},text:"Your father asks about the equity terms. Twice."})}]}
  ],
  day:[
    {place:"flat_tanvi",time:"09:20",beats:[["n1","phone","Mummy on the phone"]],talks:[["flatmate","Aditi","Fourth coffee. The MD wants 'one more scenario'."]],exit:"Leave for BKC"},
    {travel:"work",time:"10:20",deadline:"11:00"},
    {place:"office_bkc",beats:[["n2","lead","Your VP"],["n3","desk","Your model"]],talks:[["colleague","Kabir","The vending machine takes UPI now. Life-changing."]],exit:"Cab home"},
    {travel:"home",time:"03:40"},
    {place:"flat_tanvi",time:"11:00",beats:[["n4","phone","Your phone"]],exit:null}
  ],
  routes:{
    work:{to:"BKC",options:[
      {id:"auto",label:"Auto",monthly:3100,legs:[leg("auto","Flat","BKC tower",20,70)]},
      {id:"cab",label:"App cab",monthly:8400,legs:[leg("cab","Flat","BKC tower",22,190)]},
      {id:"bus",label:"BEST bus",monthly:530,legs:[leg("walk","Flat","Bus stop",6,0),leg("bus","Bandra Talao","BKC",22,12,{wait:8,st:["Bandra Talao","Kala Nagar","BKC"]}),leg("walk","Bus stop","Tower",8,0)]}]},
    home:{to:"Flat, Bandra West",options:[
      {id:"cab",label:"Company cab (paid by the bank)",monthly:0,legs:[leg("cab","BKC tower","Flat",14,0)]},
      {id:"auto",label:"Night auto",monthly:0,legs:[leg("auto","BKC tower","Flat",14,110)]}]}
  },
  month(f){const L=[];
    L.push({g:"Salary",label:"Gross monthly salary",amt:165000,note:"Bonus not included."});
    L.push({g:"Salary",label:"Employee PF",amt:-1800,note:""});
    L.push({g:"Salary",label:"Professional tax",amt:-200,note:""});
    L.push({g:"Salary",label:"Income tax",amt:-30000,note:"Illustrative."});
    L.push({sub:"Take-home pay"});
    L.push({g:"Home",label:"Rent share, Bandra West",amt:-38000,note:"3BHK split three ways."});
    L.push({g:"Home",label:"Utilities and house help",amt:-5000,note:""});
    L.push({g:"Home",label:"Food and late-night orders",amt:-16000,note:"Dinners after 9 p.m. are reimbursed; the rest aren't."});
    L.push({g:"Home",label:"Getting around: "+(f.commute?f.commute.label:"auto"),amt:-(f.commute?f.commute.monthly:3100),note:"Night cabs are paid by the bank."});
    L.push({g:"Life",label:"Bouldering gym",amt:-3500,note:""});
    L.push({g:"Life",label:"Clothes and personal",amt:-12000,note:""});
    if(f.wedding) L.push({g:"Life",label:"Flight to Ahmedabad",amt:-7000,note:"For the wedding."});
    L.push({g:"Savings",label:"Monthly SIP",amt:-30000,note:""});
    L.push({g:"Savings",label:"Travel fund",amt:-10000,note:""});
    return {kind:"High salary, high tax, high rent. No family obligations.",lines:L,owed:[{label:"Debt",amt:null,note:"None. Her parents paid for her degrees."}]};},
  available:129000,availableNote:"Take-home minus food she wouldn't otherwise eat out.",
  hours:{work:90,commute:3,label:"About 90 hours a week"},
  entryCost:{amt:2500000,note:"Undergraduate fees and hostel plus a master's, all paid by her parents."},
  pivot:"n4",
  branches:[
    {id:"pe",cond:f=>!!f.pe,title:"Private equity",
     y5:{age:28,role:"Vice president, private equity fund",place:"office_bkc",available:320000,availableNote:"Before carry.",hours:"70 hours a week",changed:"Moved to a fund after two analyst years.",enabled:"Her models, her network, and a strong reference.",cost:"Weekends rarely hers.",uncertain:"Fund performance decides careers."},
     y15:{age:38,role:"Partner, mid-size fund",place:"office_bkc",available:1200000,availableNote:"Varies a lot.",hours:"65 hours a week",changed:"Raised a fund with two partners.",enabled:"A track record.",cost:"Risk is personal now.",uncertain:"Few reach partner."}},
    {id:"startup",cond:()=>true,title:"The startup",
     y5:{age:28,role:"Head of strategy at a fintech (her second startup)",place:"office_bkc",available:160000,availableNote:"Equity not counted.",hours:"55 hours a week",changed:"The first startup folded; the second didn't.",enabled:"Savings that covered the gap.",cost:"Less money than banking, more uncertainty.",uncertain:"Equity is worth nothing until it isn't."},
     y15:{age:38,role:"Co-founder of her own company",place:"office_bkc",available:250000,availableNote:"Varies from ₹80,000 to ₹5 lakh.",hours:"60 hours a week",changed:"Started her own company.",enabled:"A safety net most founders don't have.",cost:"Everything is on her.",uncertain:"Most startups fail."}}
  ]
};

/* ---------------- SANTOSH ---------------- */
CH.santosh = {
  id:"santosh",name:"Santosh Gaikwad",short:"Santosh",age:29,pronouns:"he/him",role:"Police constable",place:"Ghatkopar",
  look:{shirt:"#B39B6B",pants:"#B39B6B",skin:"#7A4E33",hair:"#1A1512",cap:"#2E3B5A"},outfits:["#B39B6B","#9E8A5E","#C7B184"],
  intro:"Twelve-hour shifts. Works every festival the city celebrates.",
  payMode:"salary",income:"Government salary",dayPay:1450,startEnergy:74,defaultWx:"monsoon",
  homeLabel:"Police quarters, Ghatkopar",workLabel:"Police station, Kurla",commuteText:"Two stops by local",commuteMin:20,
  commits:{pta:{label:"Om's parent-teacher meeting, 5 p.m.",status:"pending"}},
  profile:{
    today:[["Role","Constable, Maharashtra Police, posted at a police station in Kurla."],["Lives in","Police staff quarters in Ghatkopar, with his wife Sangeeta (27, beautician from home) and son Om (7)."],["Housing","One room and a kitchen. A small licence fee instead of rent: the biggest perk of the job."],["Commute","Two stops by local train, or his scooter."],["From","A village in Satara district. His mother still lives there."],["Interests","Wrestling, Marathi films, weekend cricket with colleagues."],["Wants","Sub-inspector rank. An English-medium school for Om."],["Enjoys","Getting someone's stolen phone back. Respect at home in the village. Job security."],["Finds hard","Twelve-hour shifts, cancelled weekly offs, public anger."]],
    education:[{when:"2008–2012",what:"Zilla Parishad school, Satara district",detail:"SSC 68%."},{when:"2012–2014",what:"HSC Arts",detail:"61%."},{when:"2014–2019",what:"B.A. by distance",detail:"Finished in 2019 while working."},{when:"2015–2017",what:"Police recruitment",detail:"Three attempts. A physical training academy cost ₹15,000."}],
    eduNotes:[["Who paid","His uncle lent the academy fee."],["Training","Nine months at a police training school."],["Missed by two marks","His first two written exams."]],
    work:[{when:"2012–2015",what:"Farm work and a seasonal sugar-factory job",pay:"₹6,000 a month",detail:"",skills:"Hard work"},{when:"2017",what:"Recruited",pay:"",detail:"Third attempt.",skills:""},{when:"2018",what:"Traffic duty, Mumbai",pay:"",detail:"",skills:""},{when:"2021 – now",what:"Constable, Kurla police station",pay:"About ₹38,000 a month gross",detail:"",skills:"Complaints, bandobast, patience"}],
    start:[["Support when starting","None. The quarters made Mumbai possible."],["Dependants","Wife, son, and his mother in Satara."],["Debt","Scooter loan."],["Access","Colleagues, a WhatsApp group of batchmates."],["Could he afford unpaid training?","Only by borrowing."]],
    moments:[{yr:"2015",title:"Factory or the physical test",place:"bandobast",happened:"The factory offered a permanent job; the police exam was a gamble.",options:["Take the factory job","Train for recruitment"],outOfReach:[],chose:"He trained.",depended:"His uncle's loan."},{yr:"2017",title:"The third attempt",place:"bandobast",happened:"Two failures by two marks each.",options:["Give up","One more try"],outOfReach:[],chose:"One more try.",depended:"Age limits; this was nearly his last chance."},{yr:"2023",title:"The quarters",place:"quarters_santosh",happened:"After four years on the waiting list, he got staff quarters.",options:["Keep renting in Kurla","Move into the quarters"],outOfReach:[],chose:"The quarters. Rent went from ₹9,000 to almost nothing.",depended:"A waiting list."}]
  },
  scenes:[
    {id:"s1",time:"06:40",place:"Ghatkopar · quarters",text:()=>"Sangeeta reminds you: Om's parent-teacher meeting is at five. You're on duty until eight.",
     choices:[{label:"Ask your senior for an hour off",detail:"He might say no.",fx:()=>({flags:{askedOff:true},text:"You'll ask at roll call."})},{label:"Ask Sangeeta's brother to go",detail:"Om wanted you.",fx:()=>({commit:["pta","missed"],text:"Om nods. He says it's fine. He's seven."})}]},
    {id:"s2",time:"11:00",place:"Kurla · procession bandobast",text:d=>"Procession day. Four hours at a barricade "+(d.wx==="monsoon"?"in the rain":"in the sun")+". A vendor offers you a cold drink and asks you to let his cart stay on the road.",
     choices:[{label:"Take the water, move the cart",detail:"Polite, firm.",fx:()=>({energy:6,text:"He grumbles and moves it a metre. The crowd flows."})},{label:"Refuse both, move the cart",detail:"No obligations.",fx:()=>({energy:-4,text:"He moves it. Pawar hands you his water bottle instead."})},{label:"Take the drink, let the cart stay",detail:"It's only a cart.",fx:()=>({energy:6,flags:{favour:true},text:"The road jams. The inspector walks past and looks at the cart, then at you."})}]},
    {id:"s3",time:"19:30",place:"Kurla police station · front desk",text:d=>"Your relief is late. A woman has come to report her phone stolen on the train. The duty officer is busy."+(d.flags.askedOff?" Your senior said yes to the hour off, but it's past five.":""),
     choices:[{label:"Stay and take her complaint",detail:"Unpaid overtime.",fx:d=>({energy:-8,commit:d.flags.askedOff?["pta","missed"]:null,text:"Forty minutes. She thanks you twice. You get home at ten."})},{label:"Hand over to the next shift",detail:"It's eight.",fx:d=>({energy:4,commit:d.flags.askedOff?["pta","kept"]:null,text:"The relief arrives at 8:10. "+(d.flags.askedOff?"You made it to the meeting at five; Om's teacher said he reads well.":"You're home by nine.")})}]},
    {id:"s4",time:"22:30",place:"Ghatkopar · quarters",text:()=>"The departmental exam for sub-inspector is in eight months. Coaching costs ₹12,000 and every free hour.",
     choices:[{label:"Join the coaching",detail:"₹12,000.",fx:()=>({flags:{psi:true},text:"Sangeeta says she'll take more bridal bookings to cover it."})},{label:"Not this year; take extra bandobast duty",detail:"More allowance.",fx:()=>({flags:{ot:true},text:"You sign up for festival duty. Om asks when your off day is."})}]}
  ],
  day:[
    {place:"quarters_santosh",time:"06:40",beats:[["s1","sangeeta","Sangeeta"]],talks:[["om","Om","Baba, will you wear the uniform to my school?"]],exit:"Leave for duty"},
    {travel:"work",time:"07:20",deadline:"08:00"},
    {place:"bandobast",time:"11:00",beats:[["s2","vendor","A vendor"]],talks:[["colleague","Pawar","Four more hours. Drink water, Gaikwad."]],exit:"Back to the police station"},
    {place:"police_desk",time:"19:30",beats:[["s3","woman","A woman at the desk"]],exit:"Head home"},
    {travel:"home",time:"20:20"},
    {place:"quarters_santosh_night",time:"22:30",beats:[["s4","sangeeta","The exam notice"]],exit:null}
  ],
  routes:{
    work:{to:"Kurla police station",options:[
      {id:"local",label:"Local train (duty pass)",monthly:0,note:"Free on duty (illustrative)",legs:[leg("walk","Quarters","Ghatkopar station",6,0),leg("train","Ghatkopar","Kurla",6,0,{st:["Ghatkopar","Vidyavihar","Kurla"],wait:5,line:"Central line, slow"}),leg("walk","Kurla station","Police station",8,0)]},
      {id:"scooter",label:"His scooter",monthly:1200,note:"Petrol",legs:[leg("scooter","Quarters","Police station",18,25)]},
      {id:"bus",label:"BEST bus",monthly:440,legs:[leg("walk","Quarters","Bus stop",4,0),leg("bus","Ghatkopar","Kurla",25,10,{wait:8,st:["Ghatkopar","Asalpha","Kurla"]})]}]},
    home:{to:"Quarters, Ghatkopar",options:[
      {id:"local",label:"Local train (duty pass)",monthly:0,legs:[leg("walk","Police station","Kurla station",8,0),leg("train","Kurla","Ghatkopar",6,0,{st:["Kurla","Vidyavihar","Ghatkopar"],wait:5}),leg("walk","Ghatkopar station","Quarters",6,0)]},
      {id:"scooter",label:"His scooter",monthly:1200,legs:[leg("scooter","Police station","Quarters",18,25)]}]}
  },
  month(f){const L=[];
    L.push({g:"Salary",label:"Gross pay, allowances included",amt:38000,note:"Illustrative."});
    L.push({g:"Salary",label:"Pension contribution (NPS)",amt:-3200,note:"His retirement savings."});
    L.push({g:"Salary",label:"Professional tax and insurance",amt:-260,note:""});
    L.push({sub:"Take-home pay"});
    if(f.ot) L.push({g:"Salary",label:"Festival bandobast allowance",amt:2500,note:""});
    L.push({g:"Household",label:"Sangeeta's parlour earnings",amt:6000,note:"Bridal makeup, threading, from home."});
    L.push({g:"Household",label:"Quarters licence fee",amt:-500,note:"In place of about ₹15,000 market rent."});
    L.push({g:"Household",label:"Electricity",amt:-700,note:""});
    L.push({g:"Household",label:"Groceries and household",amt:-12000,note:""});
    L.push({g:"Household",label:"Om's school and van",amt:-3000,note:""});
    L.push({g:"Household",label:"Sent to his mother, Satara",amt:-3000,note:""});
    L.push({g:"Household",label:"Scooter EMI",amt:-2600,note:""});
    L.push({g:"Household",label:"Travel: "+(f.commute?f.commute.label:"duty pass"),amt:-(f.commute?f.commute.monthly:0),note:""});
    L.push({g:"Household",label:"Phone and personal",amt:-1900,note:""});
    if(f.psi) L.push({g:"Household",label:"Sub-inspector exam coaching",amt:-12000,note:"One-time."});
    return {kind:"A government salary with a pension, and housing that's almost free. Two incomes keep it working.",lines:L,owed:[{label:"Scooter loan",amt:31200,note:"12 EMIs left."},{label:"Pension",amt:null,note:"Building every month."}]};},
  available:34500,availableNote:"Take-home pay. Subsidised quarters are worth about ₹15,000 a month more.",
  hours:{work:72,commute:3,label:"12-hour shifts, six days"},
  entryCost:{amt:40000,note:"Training academy, forms, travel for three attempts."},
  pivot:"s4",
  branches:[
    {id:"psi",cond:f=>!!f.psi,title:"Sub-inspector",
     y5:{age:34,role:"Police sub-inspector",place:"police_desk",available:60000,availableNote:"Today's rupees.",hours:"70 hours a week",changed:"Cleared the departmental exam on his first attempt.",enabled:"Eight months of evenings; Sangeeta's extra bookings.",cost:"Om's evenings, for a year.",uncertain:"Departmental exam seats are few."},
     y15:{age:44,role:"Assistant police inspector",place:"police_desk",available:85000,availableNote:"Today's rupees.",hours:"65 hours a week",changed:"Promoted on seniority.",enabled:"A clean record.",cost:"Transfers across the city.",uncertain:"Promotions can stall for years."}},
    {id:"ot",cond:()=>true,title:"On the beat",
     y5:{age:34,role:"Head constable",place:"bandobast",available:45000,availableNote:"Today's rupees.",hours:"72 hours a week",changed:"Promoted on seniority.",enabled:"Years of service.",cost:"The same shifts.",uncertain:"Postings change."},
     y15:{age:44,role:"Assistant sub-inspector",place:"police_desk",available:58000,availableNote:"Today's rupees.",hours:"70 hours a week",changed:"Promoted on seniority.",enabled:"Service.",cost:"Knees and back.",uncertain:"Retirement is ten years away; the pension is secure."}}
  ]
};
