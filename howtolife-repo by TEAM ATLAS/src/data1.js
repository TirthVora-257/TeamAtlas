"use strict";
/* ============================================================
   DATA. Every number is an illustrative assumption in 2026
   rupees, monthly unless stated. Edit freely.
   ============================================================ */
const BASIS = "Illustrative assumption · 2026 rupees · not independently verified";
const DREAM_OPTS = {
  hood:{label:"Neighbourhood",opts:[["bandra","Bandra West"],["andheri","Andheri West"],["powai","Powai"],["thane","Thane"],["virar","Virar"]]},
  arrange:{label:"Living with",opts:[["family","Family"],["flatmates","Flatmates"],["alone","On my own"]]},
  transport:{label:"Getting around",opts:[["train","Local train + autos"],["scooter","Two-wheeler"],["car","Car"]]},
  eat:{label:"Eating out",opts:[["rare","Twice a month"],["weekly","Every week"],["often","Most days"]]},
  leisure:{label:"Weekends and fun",opts:[["low","Simple"],["mid","Movies, cafés, gym"],["high","Concerts, shopping, nights out"]]},
  travel:{label:"Travel",opts:[["none","No trips"],["domestic","One trip in India a year"],["abroad","One trip abroad a year"]]},
  family:{label:"Sending money home",opts:[["0","Nothing"],["5000","₹5,000"],["15000","₹15,000"],["25000","₹25,000"]]},
  save:{label:"Saving every month",opts:[["0","Nothing yet"],["5000","₹5,000"],["15000","₹15,000"],["30000","₹30,000"]]}
};
const RENT = {bandra:{alone:75000,flatmates:32000},andheri:{alone:45000,flatmates:20000},powai:{alone:50000,flatmates:22000},thane:{alone:25000,flatmates:12000},virar:{alone:11000,flatmates:6000}};
const HOOD_NAME = Object.fromEntries(DREAM_OPTS.hood.opts);
function dreamBudget(dr){
  const g={monthly:[],fund:[],family:[],upfront:[]};const name=HOOD_NAME[dr.hood];
  if(dr.arrange==="family"){
    g.monthly.push({label:"Rent",amt:0,note:`You live in your family's home in ${name}. This assumes they own it or already pay the rent.`});
    g.monthly.push({label:"Your share of food at home",amt:4000,note:"Groceries and cooking gas you'd reasonably chip in for."});
  } else {
    const r=RENT[dr.hood][dr.arrange];
    g.monthly.push({label:dr.arrange==="alone"?"Rent, 1BHK":"Rent, your room in a shared 2BHK",amt:r,note:`Typical asking rent in ${name}. Society maintenance sometimes extra.`});
    g.monthly.push({label:"Electricity, gas, Wi-Fi, water",amt:dr.arrange==="alone"?3500:1800,note:dr.arrange==="alone"?"Yours alone. AC in summer pushes it up.":"Your share, split with flatmates."});
    g.monthly.push({label:"Groceries and cooking",amt:dr.arrange==="alone"?7000:5500,note:"Cooking most dinners at home."});
  }
  if(dr.transport==="train") g.monthly.push({label:"Train pass and autos",amt:1500,note:"A monthly second-class pass plus autos to and from the station."});
  if(dr.transport==="scooter"){g.monthly.push({label:"Two-wheeler EMI",amt:3000,note:"Loan on a ₹1 lakh scooter after the down payment."});g.monthly.push({label:"Petrol, service, insurance",amt:2500,note:"About 40 km a day."});}
  if(dr.transport==="car"){g.monthly.push({label:"Car EMI",amt:14000,note:"Loan on an ₹8 lakh hatchback after the down payment."});g.monthly.push({label:"Fuel, parking, insurance, service",amt:8000,note:"Society parking is often extra in Mumbai."});}
  g.monthly.push({label:"Eating out and ordering in",amt:{rare:1500,weekly:5000,often:12000}[dr.eat],note:"Cafés, takeaway and delivery apps."});
  g.monthly.push({label:"Weekends and fun",amt:{low:2000,mid:6000,high:15000}[dr.leisure],note:{low:"A movie, a beach walk, street food.",mid:"Gym, films, cafés with friends.",high:"Concerts, shopping, nights out, subscriptions."}[dr.leisure]});
  g.monthly.push({label:"Phone plan",amt:700,note:"Unlimited data plan."});
  g.monthly.push({label:"Clothes and personal care",amt:2500,note:"Haircuts, toiletries, a few clothes a year."});
  g.monthly.push({label:"Health insurance",amt:1100,note:"Your own cover. Many first jobs don't include it."});
  if(dr.travel!=="none") g.fund.push({label:dr.travel==="abroad"?"Travel fund: one trip abroad":"Travel fund: one trip in India",amt:dr.travel==="abroad"?12500:2500,note:dr.travel==="abroad"?"₹1.5 lakh a year, put aside monthly.":"₹30,000 a year, put aside monthly."});
  if(+dr.save>0) g.fund.push({label:"Savings",amt:+dr.save,note:"An emergency fund first, then long-term savings."});
  if(+dr.family>0) g.family.push({label:"Sent home",amt:+dr.family,note:"Money for parents, siblings or a family loan."});
  if(dr.arrange!=="family"){const r=RENT[dr.hood][dr.arrange];
    g.upfront.push({label:"Security deposit",amt:r*3,note:"Usually three to six months of rent. Returned when you leave, if all goes well."});
    g.upfront.push({label:"Broker's fee",amt:r,note:"Typically one month's rent."});
    g.upfront.push({label:"Furniture and setting up",amt:dr.arrange==="alone"?60000:25000,note:"Bed, mattress, fridge share, kitchen basics."});}
  if(dr.transport==="scooter") g.upfront.push({label:"Scooter down payment",amt:20000,note:"Plus registration and first insurance."});
  if(dr.transport==="car") g.upfront.push({label:"Car down payment",amt:150000,note:"Plus registration and first insurance."});
  const sum=a=>a.reduce((s,l)=>s+l.amt,0);
  return {g,monthly:sum(g.monthly)+sum(g.fund)+sum(g.family),upfront:sum(g.upfront)};
}

/* Shorthand for route legs: m = mode, min = minutes, fare in ₹, st = stations, wait = minutes waiting */
const leg=(m,from,to,min,fare,o)=>Object.assign({m,from,to,min,fare:fare||0},o||{});
const CH = {};

/* ---------------- ROHIT ---------------- */
CH.rohit = {
  id:"rohit",name:"Rohit Jadhav",short:"Rohit",age:23,pronouns:"he/him",role:"Delivery rider",place:"Virar East",
  look:{shirt:"#D9632F",pants:"#2F3440",skin:"#8D5A3B",hair:"#1E1915",helmet:"#2A2D34"},outfits:["#D9632F","#2C6B66","#3E5A86"],
  intro:"Rides 80 km a day across Vasai and Virar. Knows every lane that floods first.",
  payMode:"orders",income:"Per order, self-employed",startEnergy:78,defaultWx:"monsoon",
  homeLabel:"Virar East",workLabel:"Vasai–Virar delivery zone",commuteText:"None. Rides all day.",commuteMin:0,
  commits:{sana:{label:"Pick up Sana from coaching, 8:15 p.m.",status:"pending"}},
  profile:{
    today:[["Role","Food and grocery delivery rider on two apps, Vasai–Virar zone. Self-employed: paid per order, no salary."],["Lives in","Virar East, with Aai (Sunita, 46, cooks in two homes), Baba (Vijay, 51, security guard on night shifts) and his sister Sana (16, Class 11 science)."],["Housing","A rented 1BHK in a four-storey building, ₹8,500 a month, shared by the family."],["Commute","None to start. He rides 70–90 km a day inside his zone."],["Interests","Sunday box cricket, Marathi rap, fixing friends' phones."],["Wants","A desk job with Sundays off. Sana's engineering coaching paid for. One day, a flat the family owns."],["Carries","₹8,000 a month to the household, the bike EMI, ₹6,000 owed to his uncle."],["Enjoys","Knowing every shortcut. Regulars who ask for him by name. Deciding his own hours."],["Finds hard","Unpaid waiting at restaurants. Ratings he can't control. Monsoon. No paid leave when he's ill."]],
    education:[{when:"2008–2019",what:"Municipal primary, then a Marathi-medium secondary school in Virar",detail:"Vartak Marg Vidyalaya (fictional). SSC 2019, 71%."},{when:"2019–2021",what:"HSC Commerce",detail:"Saket Junior College, Virar (fictional). 64%. Fees about ₹6,000 a year, paid by his parents."},{when:"2021–2022",what:"B.Com, year one finished, left in year two",detail:"Saket College of Commerce (fictional). Fees about ₹14,000 a year. Admission on HSC marks."},{when:"Outside class",what:"Skills learned elsewhere",detail:"Phone repair at his uncle's shop. Basic Excel from YouTube."}],
    eduNotes:[["Who paid","His parents. He missed the deadline for a fee concession form."],["Work while studying","Evening data entry in 2021, ₹6,000 a month."],["Not finished","B.Com, years two and three."]],
    work:[{when:"2018, summers",what:"Helper, uncle's mobile repair shop",pay:"₹3,000 a month",detail:"Learned soldering and screen replacement.",skills:"Repair, customer talk"},{when:"2021",what:"Part-time data entry, courier franchise",pay:"₹6,000 a month",detail:"Evenings after college.",skills:"Typing, Excel basics"},{when:"Jun 2022 – Mar 2023",what:"Warehouse picker, Bhiwandi",pay:"₹13,500 a month gross",detail:"Agency contract. 1 hr 45 min each way by shared van. Not renewed after the festive season.",skills:"Scanning, inventory"},{when:"Apr – Jun 2023",what:"Gap: looking for work",pay:"Nothing",detail:"Applied to three warehouses. Helped at the shop."},{when:"Jul 2023 – now",what:"Delivery rider",pay:"₹1,000–1,200 a day before costs",detail:"Seven months on a rented bike at ₹1,400 a week, then his own bike on a loan.",skills:"Zone knowledge, speed, patience"},{when:"2025",what:"Interview: accounts assistant (cousin's referral)",pay:"Would have paid ₹18,000",detail:"Not selected. The job went to someone with a Tally certificate.",skills:""}],
    start:[["Support when starting","A roof at home. From 2022 the family needed his income."],["Dependants","Contributes to a household of four, and to Sana's studies."],["Debt","Bike loan, 9 EMIs left. ₹6,000 owed to his uncle."],["Access","Shared home, a second-hand phone, no laptop. Cousins in small businesses."],["Could he afford unpaid training?","Hardly. Every day off costs ₹900–1,100."]],
    moments:[{yr:"2022",title:"Year two of B.Com",place:"home_rohit",happened:"Baba's agency cut his night shifts from 26 to 18 a month. The household lost about ₹6,000 a month.",options:["Stay in college and do evening data entry","Switch to a correspondence B.Com","Leave college and work full time"],outOfReach:["A full-time course with no earnings"],chose:"He left college and took the warehouse contract.",depended:"Timing: the cut came the month fees were due. Nobody told him about fee waivers."},{yr:"2024",title:"Renting or buying the bike",place:"city_virar",happened:"Weekly bike rent was eating ₹5,600 a month.",options:["Keep renting","Buy used for ₹35,000 cash","Buy new on a loan, ₹10,000 down"],outOfReach:["₹35,000 in cash","An electric bike with no charging point at home"],chose:"A loan. His uncle lent the down payment.",depended:"His uncle, and a lender who accepted app payouts as proof of income."},{yr:"2025",title:"The interview he didn't get",place:"home_rohit",happened:"A wholesaler needed an accounts assistant at ₹18,000. He knew the work from his uncle's books.",options:["Keep riding","Learn Tally from free videos","Pay for a certificate course"],outOfReach:["A full-time course with no earnings"],chose:"Nothing yet. The bike EMI had a year to run.",depended:"A referral, which was luck. A certificate, which he didn't have."}]
  },
  scenes:[
    {id:"r1",time:"04:40",place:"Virar East · home",text:()=>"The alarm goes before the first train. Aai is already up; she cooks at two homes in Vasai before eight. On the table: Sana's practical-exam fee slip. ₹1,800, due Friday. The dark store opens its morning slot at 5:30. Riders who log in first get a small bonus.",
     choices:[{label:"Eat poha with Aai, leave at 5:20",detail:"Breakfast and ten minutes with her.",fx:()=>({energy:10,text:"Aai asks about the fee. You say you'll cover half. You'll reach the store after the bonus slots go, but steady."})},
              {label:"Chai standing up, leave now",detail:"First in the queue gets the early bonus.",fx:()=>({earn:60,energy:-6,text:"You'll be first in. The early bonus is yours: ₹60. Your stomach reminds you by seven."})}]},
    {id:"r2",time:"06:30",place:"Vasai West · dark store",text:()=>"Milk, bread, eggs. Ten-minute delivery promises. Seven orders done. On the last turn the rear brake squealed and grabbed late. The mechanic near the station charges about ₹450 for new brake shoes.",
     choices:[{label:"Fix the brakes now",detail:"₹450 and about 40 minutes off the app.",fx:()=>({earn:380,spend:450,worked:110,flags:{brakes:"fixed"},text:"Forty minutes in a plastic chair. You lose the morning rush, but the brake bites clean."})},
              {label:"Keep riding. Fix it Sunday",detail:"The rush pays best right now.",fx:()=>({earn:520,worked:150,flags:{brakes:"deferred"},text:"Twelve orders by nine. The squeal is louder on the slope by the station."})}]},
    {id:"r3",time:"09:40",place:"Nalasopara · highway service road",text:d=>(d.wx==="monsoon"?"The sky turns dark in five minutes. Water rises over the road near the station. The app turns on a rain surge: ₹25 extra on every order.":d.wx==="haze"?"Smog hangs over the highway. Traffic crawls. The app offers a peak bonus: ₹20 extra on every order.":"It's 34°C at ten in the morning. The app offers a heat bonus: ₹20 extra per order. The tar is soft at the junctions.")+(d.flags.brakes==="deferred"?" Your rear brake is still squealing.":""),
     choices:[{label:"Keep taking orders",detail:"Slower, harder, better paid.",fx:d=>d.flags.brakes==="deferred"?({earn:150,spend:1200,energy:-25,worked:60,flags:{skid:true},text:d.wx==="monsoon"?"On the slope by the bridge the rear wheel locks. You go down slowly, in ankle-deep water. A scraped elbow and a cracked phone screen. Repair: ₹1,200. You'll need two days off.":"A tempo stops dead. The rear brake fades and you go down at the divider. A scraped elbow, a cracked phone screen: ₹1,200, and two days off."}):({earn:420,energy:-15,worked:90,text:"Slow and careful. Six orders with the bonus."})},
              {label:"Take a break under the flyover",detail:"Lose the bonus. Rest with other riders.",fx:()=>({energy:10,worked:50,flags:{metImran:true},text:"Twelve riders, one tea stall. Imran rode for three years and now keeps accounts for a hardware wholesaler. He did a Tally and GST course in evening batches. \"The pay was less at first,\" he says. \"But I got my Sundays back.\""})}]},
    {id:"r4",time:"12:30",place:"Vasai · restaurant pickup",text:()=>"Lunch peak. The restaurant said ten minutes. It's been twenty-five. The app doesn't pay for waiting. The customer is calling: the food is late, and your face is on the app.",
     choices:[{label:"Wait it out and apologise",detail:"Take the hit on rating.",fx:()=>({earn:65,wait:25,worked:45,flags:{lowRating:true},text:"She cuts you off mid-sentence. Three stars. The weekly incentive needs a 4.7 average."})},
              {label:"Unassign it, take another order",detail:"Faster money now.",fx:()=>({earn:90,wait:10,worked:40,flags:{lostStreak:true},text:"Two quick orders instead. But unassigning breaks your streak. This week's full incentive is gone."})},
              {label:"Call rider support",detail:"Protect your rating.",fx:()=>({earn:65,wait:36,worked:55,text:"Eleven minutes of hold music. Support marks it as the restaurant's delay. Your rating is safe. Your time isn't."})}]},
    {id:"r5",time:"15:00",place:"Vasai station · khanawal",text:d=>"The lunch rush is over. "+(d.flags.skid?"Your elbow stings.":"Your knee aches from braking all morning.")+" The khanawal by the station does a dal-rice thali for ₹80.",
     choices:[{label:"Proper lunch and 30 minutes off",detail:"₹80 thali, phone face-down.",fx:()=>({spend:80,energy:25,worked:30,text:"Hot rice, dal, a small sabzi. The owner refills the dal without asking."})},
              {label:"Thali, and a free Tally video",detail:"Eat and learn.",fx:()=>({spend:80,energy:15,worked:30,flags:{studied:true},text:"Lesson one: ledgers and vouchers. You know half of it already."})},
              {label:"Vada pav and straight back on",detail:"Catch tea-time orders.",fx:()=>({spend:25,earn:210,energy:-12,worked:90,text:"Four quick orders. By five you're running on fumes."})}]},
    {id:"r6",time:"18:30",place:"Vasai · evening peak",text:()=>"Dinner orders are surging. A peak bonus kicks in after six more orders. Aai texts: Sana's coaching ends at 8:15 and the road to the bus stop floods. You said you'd pick her up.",
     choices:[{label:"Pick up Sana at 8:15",detail:"Keep the promise.",fx:()=>({earn:260,worked:75,commit:["sana","kept"],addGoals:[{k:"pickup",at:"coaching",label:"Pick up Sana from coaching"}],text:"One more order, then Sana."})},
              {label:"Stay on until 10 for the bonus",detail:"₹300 bonus after six more orders.",fx:()=>({earn:760,energy:-15,worked:210,commit:["sana","missed"],addGoals:[{k:"drop",label:"Dinner order: thali",pay:70},{k:"drop",label:"Dinner order: pizza",pay:70}],text:"Sana will wait forty minutes, then walk home through the water with a friend."})}]},
    {id:"r7",time:"22:30",place:"Virar East · home",text:()=>"Aai counts the fee money. A training centre near Virar station runs a Tally and GST course: ₹2,499 for three months, Sundays and two evenings a week. Fewer evening orders.",
     choices:[{label:"Enrol this month",detail:"Pay ₹2,499.",fx:()=>({flags:{course:true},text:"You fill the form on your phone. Sunday cricket is over for three months."})},
              {label:"Ask your uncle to split the fee",detail:"Half each.",fx:()=>({flags:{course:true,uncleHelp:true},text:"He says yes, and reminds you he's owed ₹6,000 for the bike."})},
              {label:"Not this month",detail:"Maybe after the bike loan ends.",fx:()=>({flags:{course:false},text:"Nine more EMIs. Then you'll think about it."})}]}
  ],
  day:[
    {place:"home_rohit",time:"04:40",beats:[["r1","aai","Aai"]],talks:[["sana","Sana","(asleep) …the practical is on Friday, Dada…"],["chair","Baba's chair","Empty. Baba is still on his night shift at the society gate."]],exit:"Take the bike out"},
    {drive:"city_virar",vehicle:"bike",time:"05:20",goals:[{k:"beat",at:"store",beat:"r2",label:"Dark store, Vasai West"},{k:"drop",label:"Order: eggs and bread",pay:45},{k:"drop",label:"Order: milk and curd",pay:45,beatStart:"r3",heavyRain:true},{k:"drop",label:"Order: phone charger",pay:55},{k:"beat",at:"rest",beat:"r4",label:"Restaurant pickup"},{k:"beat",at:"khan",beat:"r5",label:"Khanawal by the station"},{k:"event",beat:"r6"},{k:"drop",label:"Dinner order: biryani",pay:60},{k:"home",at:"home",label:"Home, Virar East",time:"22:30"}]},
    {place:"home_rohit_night",time:"22:30",beats:[["r7","aai","Aai"]],exit:null}
  ],
  routes:{},
  month(f){const L=[];
    L.push({g:"Earnings from the apps",label:"Order payouts, 26 working days",amt:25100,note:"What the apps paid after commission, in a typical month."});
    L.push({g:"Earnings from the apps",label:f.lostStreak||f.lowRating?"Weekly incentives (one week missed)":"Weekly incentives",amt:f.lostStreak||f.lowRating?1600:2400,note:"Only when acceptance and rating targets are met."});
    if(f.skid) L.push({g:"Earnings from the apps",label:"Two days off after the fall",amt:-2000,note:"No orders, no pay. No paid sick leave."});
    L.push({sub:"Gross earnings"});
    L.push({g:"Costs of doing the job",label:"Petrol",amt:-4300,note:"About 80 km a day."});
    L.push({g:"Costs of doing the job",label:"Bike EMI",amt:-3100,note:"Nine of 24 instalments left."});
    L.push({g:"Costs of doing the job",label:"Mobile data",amt:-350,note:"The apps don't work without it."});
    L.push({g:"Costs of doing the job",label:f.brakes==="fixed"?"Maintenance, incl. brakes":"Maintenance",amt:f.brakes==="fixed"?-1050:-600,note:f.brakes==="fixed"?"Oil, chain, tyres, plus ₹450 brake shoes.":"Oil, chain, tyres. Brakes not done."});
    if(f.skid) L.push({g:"Costs of doing the job",label:"Phone screen repair",amt:-1200,note:"From the fall."});
    L.push({sub:"Earnings after work costs"});
    L.push({g:"Home and life",label:"To the household",amt:-8000,note:"Share of rent, groceries and electricity for four."});
    L.push({g:"Home and life",label:"Sana's exam fee",amt:-1800,note:"One-off this month."});
    L.push({g:"Home and life",label:"Food on shift",amt:-1800,note:"Today's thali or vada pav is inside this line, not added again."});
    L.push({g:"Home and life",label:"Personal",amt:-1000,note:"Haircut, cricket share, a recharge for Aai."});
    if(f.course) L.push({g:"Home and life",label:f.uncleHelp?"Tally course, his half":"Tally and GST course",amt:f.uncleHelp?-1250:-2499,note:"Three months, evenings and Sundays."});
    const owed=[{label:"Bike loan",amt:27900,note:"9 more EMIs of ₹3,100."},{label:"Owed to his uncle",amt:f.uncleHelp?7250:6000,note:f.uncleHelp?"Bike down payment plus ₹1,250 for the course.":"The bike down payment."}];
    if(f.brakes==="deferred"&&!f.skid) owed.push({label:"Brake shoes",amt:450,note:"Still squealing."});
    owed.push({label:"Health cover",amt:null,note:"None. One hospital stay could cost more than a month's earnings."});
    return {kind:"Self-employed: what the apps pay, minus what the job costs, minus life.",lines:L,owed};},
  available:19150,availableNote:"Earnings after work costs. The bike and petrol are costs of the job.",
  hours:{work:72,commute:0,label:"72 hours on the app across 6 days"},
  entryCost:{amt:0,note:"No formal qualification. A bike and a smartphone are the entry ticket."},
  pivot:"r7",
  branches:[
    {id:"desk",cond:f=>!!f.course,title:"The desk",
     y5:{age:28,role:"Accounts assistant, hardware wholesaler, Vasai",place:"office_small",available:26500,availableNote:"₹22,000 take-home plus about ₹6,000 filing GST for small shops, minus travel.",hours:"54 hours a week, Sundays mostly off",changed:"He finished the course over three months of Sundays, then filed GST returns for two shops for free to build a record.",enabled:f=>(f.metImran?"Imran, from the flyover, forwarded his CV. ":"A cousin forwarded his CV again. ")+"The bike loan had ended, so a lower first salary was survivable.",cost:"Eight months earning a little less than riding. He sold the bike to clear his uncle's loan.",uncertain:"Small firms close or cut staff. Raises depend on the owner."},
     y15:{age:38,role:"GST practitioner with a small office near Virar station",place:"office_small",available:52000,availableNote:"Varies from about ₹40,000 to ₹65,000 by season.",hours:"55 hours a week, more near deadlines",changed:"About 30 small-shop clients. Sana, now an engineer, set up his billing software.",enabled:"Steady clients, and a practitioner exam he passed on his second attempt.",cost:"Filing deadlines mean 14-hour days. No employer pension.",uncertain:"Tax rules and software change. Clients can switch to cheaper apps."}},
    {id:"road",cond:()=>true,title:"The road",
     y5:{age:28,role:"Delivery rider on a rented electric bike",place:"city_virar",available:22000,availableNote:"After rental and charging, in today's rupees.",hours:"70 hours a week",changed:"The apps changed incentive rules three times. He switched to a rented EV to cut fuel costs.",enabled:"Strong ratings and zone knowledge.",cost:"Back pain most evenings. No PF, no paid leave, no health cover.",uncertain:"Earnings depend on rules he doesn't control."},
     y15:{age:38,role:"Fleet supervisor for a rider-rental company",place:"city_virar",available:30000,availableNote:"A salary with PF, in today's rupees.",hours:"60 hours a week",changed:"The fleet he rented from hired him to run a team of 25.",enabled:"His reputation, and a manager who noticed him.",cost:"Without a degree, moving past supervisor is hard.",uncertain:"Many riders his age don't get this offer."}}
  ]
};

/* ---------------- FAIZAN ---------------- */
CH.faizan = {
  id:"faizan",name:"Faizan Shaikh",short:"Faizan",age:22,pronouns:"he/him",role:"IT services fresher",place:"Kalyan West",
  look:{shirt:"#4C7EA8",pants:"#2E3440",skin:"#A8704A",hair:"#16120F",bag:"#2F3540"},outfits:["#4C7EA8","#E8E2D6","#5E9A4E"],
  intro:"First engineer in his family. Spends 2 hrs 40 min a day on trains to write SQL for a UK insurer.",
  payMode:"salary",income:"Monthly salary",dayPay:1364,startEnergy:70,defaultWx:"sunny",
  homeLabel:"Kalyan West",workLabel:"Airoli (Navi Mumbai)",commuteText:"Auto, two trains and a walk",commuteMin:76,
  commits:{dadi:{label:"Take Dadi to her eye check-up, 7:00 p.m.",status:"pending"}},
  profile:{
    today:[["Role","Associate software engineer at Tatvik Infotech (fictional), an IT services company. Fixes reports for a UK insurer's reconciliation system."],["Lives in","Kalyan West, with Ammi (Rukhsana, 49, tailors from home), Abbu (Salim, 54, accounts clerk) and Dadi (78)."],["Housing","Family-owned 1BHK. He sleeps in the living room."],["Commute","Auto, train to Thane, Trans-Harbour train to Airoli, a walk. About 1 hr 20 min each way."],["Interests","Saturday football, competitive programming (paused), Thane biryani."],["Wants","A product-company job. A 2BHK so Dadi gets her own room."],["Carries","An education-loan EMI, ₹7,000 a month to Ammi, Dadi's appointments."],["Enjoys","When the tests go green. Leads who explain. Being the family's first engineer."],["Finds hard","The commute. Feeling slower than batchmates. Late calls with the UK team."]],
    education:[{when:"2006–2018",what:"Urdu-medium primary, then English-medium secondary",detail:"Al-Barkaat High School, Kalyan (fictional). SSC 84%."},{when:"2018–2020",what:"HSC Science, plus weekend entrance coaching",detail:"71%. Coaching about ₹45,000, paid by Abbu partly through a gold loan. State CET 86th percentile."},{when:"2020–2024",what:"B.E. Computer Engineering",detail:"Sahyadri Institute of Technology, Kalyan (fictional, private). About ₹1,10,000 a year. CGPA 7.4, one backlog cleared."},{when:"Outside class",what:"Skills learned elsewhere",detail:"Python, SQL and cloud basics from free courses."}],
    eduNotes:[["Who paid","A state scholarship (about ₹40,000 a year from year two) and a ₹4.5 lakh education loan co-signed by Abbu."],["Work while studying","Tutoring, ₹3,000 a month. An unpaid internship."],["Changed plans","Paused competitive programming to clear a backlog."]],
    work:[{when:"2021–2023",what:"Home tutor, Class 10 maths",pay:"₹3,000 a month",detail:"Two students.",skills:"Explaining simply"},{when:"Summer 2023",what:"Unpaid intern, web agency, Dombivli",pay:"Nothing",detail:"Possible only because he lived at home.",skills:"PHP"},{when:"Jan 2024",what:"Campus offer, Tatvik Infotech",pay:"₹3.6 lakh a year",detail:"Joining pushed back five months.",skills:""},{when:"Jun – Nov 2024",what:"Gap: waiting to join",pay:"₹12,000 total, freelance",detail:"Sites for two shops. Loan repayments began.",skills:"SQL"},{when:"Dec 2024 – now",what:"Associate software engineer",pay:"₹30,000 a month gross",detail:"Training in Pune, then a client project. His lead Preeti mentors him.",skills:"Java, SQL, debugging"}],
    start:[["Support when starting","A home with no rent. No money for a drop year."],["Dependants","Shares Dadi's care with Ammi."],["Debt","Education loan, about ₹4.1 lakh to go."],["Access","A laptop bought on EMI. No engineers in the family."],["Could he afford unpaid training?","Two months, once, living at home."]],
    moments:[{yr:"2020",title:"The entrance rank",place:"home_faizan",happened:"86th percentile. Not enough for a government seat in his branch.",options:["Private B.E. with a loan","B.Sc IT at about ₹35,000 a year","Diploma, then lateral entry"],outOfReach:["A drop year to retake JEE"],chose:"Private B.E., funded by a scholarship and a loan.",depended:"The scholarship being approved, and Abbu co-signing."},{yr:"2024",title:"The mass-recruiter offer",place:"office_airoli",happened:"A services company offered ₹3.6 lakh a year.",options:["Accept and wait","Turn it down and prepare for product-company interviews"],outOfReach:["Months of unpaid preparation once loan repayments began"],chose:"He accepted.",depended:"Timing. The loan moratorium was ending."},{yr:"2025",title:"Asking for help",place:"office_airoli",happened:"He spent three days stuck on one bug before asking anyone.",options:["Keep trying alone","Ask the team chat","Ask Preeti"],outOfReach:[],chose:"He asked Preeti. She showed him how to read the logs in twenty minutes.",depended:"A patient lead. Not every team has one."}]
  },
  scenes:[
    {id:"f1",time:"06:15",place:"Kalyan West · home",text:()=>"Ammi is already at the sewing machine. Dadi's eye check-up is at seven this evening; you said you'd take her. You could do twenty minutes of practice problems before leaving.",
     choices:[{label:"Twenty minutes of practice",detail:"One problem a day adds up.",fx:()=>({energy:-6,flags:{dsa:true},text:"One solved, one stuck. You'll think about it on the train."})},{label:"Twenty more minutes of sleep",detail:"Last night's call ran late.",fx:()=>({energy:10,text:"Ammi says your name for the third time. Rested, at least."})}]},
    {id:"f2",time:"07:22",place:"Kalyan station · platform 4",text:()=>"The fast train to Thane pulls in already packed. The slow one behind it will have space at the door, maybe a seat after Dombivli, but reaches 18 minutes later. Standup is at 9:45.",
     choices:[{label:"Push into the fast train",detail:"On time, crushed.",fx:()=>({energy:-12,text:"Forty minutes holding the overhead bar with a backpack in your ribs."})},{label:"Take the slow train and study",detail:"A seat, a cloud course video.",fx:()=>({energy:-2,minutes:18,flags:{trainStudy:true},text:"A window seat after Dombivli. Two lessons of a free cloud course."})}]},
    {id:"f3",time:"09:45",place:"Airoli · standup",text:d=>(d.flags.late>10?"You walk into standup late. ":"")+"Your ticket: a report that crashes for one client. Two days on it. Preeti asks for an update in front of everyone.",
     choices:[{label:"Say you're stuck and ask for 15 minutes",detail:"Admit it in front of the team.",fx:()=>({energy:5,flags:{askedHelp:true},text:"Preeti sits with you after standup. A null date in one client's data. Fixed by eleven. She tells the team you found an edge case nobody had seen."})},{label:"Say it's almost done",detail:"Keep trying alone.",fx:()=>({energy:-12,text:"You find it at 4 p.m. The client noticed the delay. Preeti asks you, privately, to flag blockers earlier."})}]},
    {id:"f4",time:"13:15",place:"Airoli · lunch",text:()=>"The team is going to a café for a colleague's birthday. About ₹350 each. The canteen thali is ₹70.",
     choices:[{label:"Go with the team",detail:"₹350.",fx:()=>({spend:350,energy:8,flags:{cafe:true},text:"Rahul says he moved from support into a cloud role after one certification. He sends you the exam guide."})},{label:"Canteen thali, call Ammi",detail:"₹70.",fx:()=>({spend:70,energy:4,text:"Ammi reminds you about Dadi's appointment. Twice."})}]},
    {id:"f5",time:"18:40",place:"Airoli · release night",text:()=>"The client deploy is tonight. Preeti asks who can stay until ten. Dadi's appointment is at seven in Kalyan.",
     choices:[{label:"Stay for the release",detail:"Ask Abbu to take Dadi.",fx:()=>({energy:-15,flags:{stayed:true},commit:["dadi","missed"],text:"The release goes out at 9:50. Preeti thanks you in the client email. Abbu leaves work early, unpaid, to take Dadi."})},{label:"Leave at 6:45 for Dadi",detail:"Someone else stays.",fx:()=>({commit:["dadi","kept"],text:"Rahul stays and gets thanked in the client email. Dadi will tell the doctor you're an engineer."})}]},
    {id:"f6",time:"22:30",place:"Kalyan West · home",text:()=>"Everyone's asleep. A cloud certification exam costs about ₹8,000 and needs six to eight weeks of evening study. Free prep material is online.",
     choices:[{label:"Book the exam this month",detail:"₹8,000 from this salary.",fx:()=>({flags:{certBooked:true},text:"A date seven weeks away. Saturday football is on hold."})},{label:"Start the free prep, book later",detail:"Nothing to pay yet.",fx:()=>({flags:{freePrep:true},text:"A plan on paper: one hour on train days."})},{label:"Rest. This month is heavy",detail:"Loan EMI, Dadi's medicines.",fx:()=>({energy:10,text:"Half an episode of something, then sleep."})}]}
  ],
  day:[
    {place:"home_faizan",time:"06:15",beats:[["f1","laptop","Your laptop"]],talks:[["dadi","Dadi","Seven o'clock. And bring my old glasses, the doctor asked."],["ammi","Ammi","Your tiffin is by the door. Don't give it away again."]],exit:"Leave for work"},
    {travel:"work",time:"07:00",deadline:"09:45"},
    {place:"office_airoli",beats:[["f3","lead","Preeti, team lead"],["f4","canteen","The team"],["f5","lead","Preeti"]],talks:[["colleague","Rahul","The coffee machine is broken again. Third time this week."]],exit:"Head home"},
    {travel:"home",time:"18:45",leaveFlag:"stayed",lateLeave:"22:00"},
    {place:"home_faizan_night",time:"22:30",beats:[["f6","laptop","Your laptop"]],exit:null}
  ],
  routes:{
    work:{to:"Office, Airoli",options:[
      {id:"local",label:"Local train",monthly:1550,note:"Monthly pass ₹550 + autos",legs:[leg("shareauto","Home","Kalyan station",10,20),leg("train","Kalyan","Thane",32,10,{st:["Kalyan","Dombivli","Diva","Thane"],wait:6,beat:"f2",line:"Central line, fast"}),leg("train","Thane","Airoli",14,10,{st:["Thane","Airoli"],wait:5,line:"Trans-Harbour line"}),leg("walk","Airoli station","Office",10,0)]},
      {id:"ac",label:"AC local",monthly:2400,note:"AC pass ₹1,400 + autos",flags:{trainStudy:true},legs:[leg("shareauto","Home","Kalyan station",10,20),leg("actrain","Kalyan","Thane",34,105,{st:["Kalyan","Dombivli","Thane"],wait:12,line:"Central line, AC"}),leg("train","Thane","Airoli",14,10,{st:["Thane","Airoli"],wait:5,line:"Trans-Harbour line"}),leg("walk","Airoli station","Office",10,0)]},
      {id:"cab",label:"App cab",monthly:27300,note:"₹620 each way, 22 days",legs:[leg("cab","Home","Office, Airoli",65,620)]}]},
    home:{to:"Home, Kalyan West",options:[
      {id:"local",label:"Local train",monthly:1550,legs:[leg("walk","Office","Airoli station",10,0),leg("train","Airoli","Thane",14,10,{st:["Airoli","Thane"],wait:5,line:"Trans-Harbour line"}),leg("train","Thane","Kalyan",32,10,{st:["Thane","Diva","Dombivli","Kalyan"],wait:6,line:"Central line, fast"}),leg("shareauto","Kalyan station","Home",10,20)]},
      {id:"ac",label:"AC local",monthly:2400,legs:[leg("walk","Office","Airoli station",10,0),leg("train","Airoli","Thane",14,10,{st:["Airoli","Thane"],wait:5}),leg("actrain","Thane","Kalyan",34,105,{st:["Thane","Dombivli","Kalyan"],wait:12}),leg("shareauto","Kalyan station","Home",10,20)]},
      {id:"cab",label:"App cab",monthly:27300,legs:[leg("cab","Office","Home, Kalyan West",65,640)]}]}
  },
  month(f){const L=[];
    L.push({g:"Salary",label:"Gross monthly salary",amt:30000,note:"₹3.6 lakh a year CTC. Employer PF not included."});
    L.push({g:"Salary",label:"Employee PF",amt:-1800,note:"Into his retirement account. Savings he can't touch yet."});
    L.push({g:"Salary",label:"Professional tax",amt:-200,note:""});
    L.push({g:"Salary",label:"Income tax",amt:0,note:"Below the taxable limit after rebate (illustrative)."});
    L.push({sub:"Take-home pay"});
    L.push({g:"Getting to work",label:"Commute: "+(f.commute?f.commute.label:"Local train"),amt:-(f.commute?f.commute.monthly:1550),note:"A month of travelling the way you did today, both ways."});
    L.push({g:"Getting to work",label:f.cafe?"Lunches, incl. team outings":"Office lunches",amt:f.cafe?-2600:-1800,note:"Today's lunch is inside this line."});
    L.push({g:"Home and loans",label:"To Ammi for the household",amt:-7000,note:"Groceries, electricity, gas."});
    L.push({g:"Home and loans",label:"Education loan EMI",amt:-5600,note:"₹4.5 lakh loan. About seven years left."});
    L.push({g:"Home and loans",label:"Dadi's medicines, his share",amt:-1500,note:""});
    L.push({g:"Home and loans",label:"Phone plan",amt:-450,note:""});
    L.push({g:"Home and loans",label:"Personal",amt:-2000,note:"Clothes, football turf, a haircut."});
    if(f.certBooked) L.push({g:"Home and loans",label:"Cloud certification exam",amt:-8000,note:"One attempt."});
    const owed=[{label:"Education loan outstanding",amt:410000,note:"About seven more years of EMIs."}];
    if(f.freePrep) owed.push({label:"Certification exam, when booked",amt:8000,note:"Still to save for."});
    owed.push({label:"PF built up so far",amt:null,note:"About ₹20,000 including the employer's share. Locked for retirement."});
    return {kind:"Salaried: gross pay, minus deductions, gives take-home. Then the commute, the loan and home.",lines:L,owed};},
  available:22400,availableNote:"Take-home minus the education-loan EMI that comes with this path.",
  hours:{work:47,commute:13,label:"47 hours at work plus 13 on trains"},
  entryCost:{amt:440000,note:"Coaching, four years of private engineering fees, minus the scholarship. Mostly a loan."},
  pivot:"f6",
  branches:[
    {id:"grow",cond:f=>!!(f.certBooked||f.freePrep),title:"The switch",
     y5:{age:27,role:"Cloud engineer at a product company, Powai",place:"office_bkc",available:74000,availableNote:"About ₹80,000 take-home on ₹11 lakh, minus the loan EMI.",hours:"50 hours a week plus on-call weekends",changed:"Certification, an internal move to cloud support, then a product company.",enabled:f=>(f.askedHelp?"He asked for help early and learned fast. ":"")+(f.cafe?"Rahul's exam guide, then Rahul's referral. ":"A former colleague's referral. ")+"Projects built at night.",cost:"Eighteen months of evenings and Sundays. Two exam fees.",uncertain:"Tech hiring swings with the economy. Recent joiners are often let go first."},
     y15:{age:37,role:"Engineering manager",place:"office_bkc",available:180000,availableNote:"On ₹35 lakh, after tax, today's rupees.",hours:"55 hours a week",changed:"Led a platform team, then moved into management.",enabled:"Skills that stayed in demand, and timing.",cost:"More meetings, less code.",uncertain:"Several people who studied the same way were laid off twice."}},
    {id:"steady",cond:()=>true,title:"The ladder",
     y5:{age:27,role:"Senior software engineer, same services company",place:"office_airoli",available:36400,availableNote:"About ₹42,000 take-home on ₹5.5 lakh, minus the loan EMI.",hours:"47 hours plus 13 on trains",changed:"Two promotions and a bigger client.",enabled:"Reliable work and good reviews.",cost:"Raises of 6–8% a year. The commute stays.",uncertain:"Switching later gets harder without new skills."},
     y15:{age:37,role:"Project manager, services",place:"office_airoli",available:105000,availableNote:"On ₹16 lakh, loan repaid.",hours:"50 hours a week",changed:"Moved from code to managing delivery.",enabled:"Ten years of trust with one client.",cost:"Evening calls across time zones.",uncertain:"Services companies restructure; managers aren't immune."}}
  ]
};

/* ---------------- RUTH ---------------- */
CH.ruth = {
  id:"ruth",name:"Ruth Fernandes",short:"Ruth",age:27,pronouns:"she/her",role:"Private-school teacher",place:"Malad West",
  look:{shirt:"#5E9A4E",pants:"#3E3A48",skin:"#9A6748",hair:"#1C1612",long:true},outfits:["#5E9A4E","#B4553A","#7A4E8C"],
  intro:"Teaches maths to 42 twelve-year-olds a class. Tutors six more in the evening to make rent.",
  payMode:"salary",income:"Salary plus tuitions",dayPay:1091,startEnergy:72,defaultWx:"sunny",
  homeLabel:"Malad West",workLabel:"St. Agnes, Malad West",commuteText:"A 20-minute walk",commuteMin:22,
  commits:{call:{label:"Call home after Pappa's check-up",status:"pending"}},
  profile:{
    today:[["Role","Maths teacher, Classes 6–8, St. Agnes English High School, Malad West (fictional, private unaided)."],["Lives in","Malad West, with her flatmate Kavya Nair, a staff nurse who works nights."],["Housing","A rented 1BHK, ₹22,000 a month split two ways. Her half of the deposit, ₹50,000, was partly borrowed from her father."],["Commute","A 20-minute walk, or a shared auto when it rains."],["Family","In Ratnagiri: Pappa (retired bus conductor), Mummy, and her brother (19, training as an electrician)."],["Interests","Church choir, Konkani cooking, sudoku."],["Wants","A permanent post with a pension. An M.A. in Education."],["Enjoys","The moment a child gets it. Designing puzzles."],["Finds hard","42 students a class. Unpaid extra duties. Mumbai rent on a teacher's pay."]],
    education:[{when:"2007–2015",what:"School, Ratnagiri",detail:"Holy Cross Convent (fictional). SSC 88%."},{when:"2015–2017",what:"HSC Science",detail:"74%."},{when:"2017–2020",what:"B.Sc Mathematics",detail:"Konkan Arts & Science College (fictional). About ₹9,000 a year, covered by a merit scholarship."},{when:"2020",what:"M.Sc entrance, not selected",detail:"The pandemic year followed at home."},{when:"2021–2023",what:"B.Ed",detail:"Ratnagiri College of Education (fictional). About ₹55,000 a year from Pappa's savings and her tuitions."},{when:"2024",what:"Teacher-eligibility test passed",detail:"Second attempt."}],
    eduNotes:[["Who paid","Scholarship for the B.Sc. Her father and her tuitions for the B.Ed."],["Work while studying","Home tuitions from 2016. Night-shift doubt-solving for an ed-tech app."],["Changed plans","Engineering to maths. M.Sc to B.Ed."]],
    work:[{when:"2016–2020",what:"Home tuitions, Ratnagiri",pay:"₹2,000–4,000 a month",detail:"Classes 8 to 10.",skills:"One-to-one teaching"},{when:"2021–2022",what:"Online doubt-solver",pay:"₹8,000 a month, part-time",detail:"Nights.",skills:"Fast explanations"},{when:"2023–2024",what:"Teacher, small school, Ratnagiri",pay:"₹11,000 a month",detail:"Classes 5 to 7.",skills:"Classroom management"},{when:"Apr 2024 – now",what:"Maths teacher, St. Agnes",pay:"₹22,000, now ₹24,000",detail:"A professor's reference got her the interview.",skills:""},{when:"2024 – now",what:"Evening tuitions",pay:"₹1,500 per student",detail:"Six students.",skills:""}],
    start:[["Support when starting","Her father funded the B.Ed. Not the full Mumbai deposit."],["Dependants","Sends ₹3,000 home a month."],["Debt","About ₹20,000 owed to Pappa, informally."],["Access","An old laptop. A flat share through a cousin's friend."],["Could she afford unpaid training?","Only while living at home."]],
    moments:[{yr:"2020",title:"M.Sc or B.Ed",place:"flat_ruth",happened:"She wasn't selected for the M.Sc she wanted.",options:["Retake next year","A B.Ed to start teaching sooner","An M.Sc at a less preferred college"],outOfReach:["A year of coaching away from home"],chose:"A B.Ed, after a year of online tuitions.",depended:"Her father's savings."},{yr:"2024",title:"Ratnagiri or Mumbai",place:"flat_ruth",happened:"₹12,000 at home, or ₹22,000 in Mumbai with ₹11,000 rent.",options:["Stay home, no rent","Move for roughly the same money left over"],outOfReach:["A Mumbai room without a flatmate"],chose:"Mumbai, for the schools and the tuitions.",depended:"Kavya's spare room."},{yr:"2025",title:"The coaching offer",place:"school",happened:"A coaching institute offered ₹38,000 for evenings and Sundays, tied to results.",options:["Accept","Do both","Decline for now"],outOfReach:[],chose:"She declined for now.",depended:"Managing on the smaller income, just."}]
  },
  scenes:[
    {id:"t1",time:"06:05",place:"Malad West · flat",text:()=>"Forty unchecked notebooks on the table. Kavya walks in from her night shift, tired and starving.",
     choices:[{label:"Check twenty notebooks now",detail:"Fewer to carry home tonight.",fx:()=>({energy:-6,flags:{checked:true},text:"Twenty done. Aarav's notebook is empty since last Tuesday."})},{label:"Make breakfast with Kavya",detail:"Upma, chai, ten minutes of talk.",fx:()=>({energy:10,text:"Kavya tells you about a patient who thanked her in Konkani. You laugh about the rent increase notice. Then you don't."})}]},
    {id:"t2",time:"08:10",place:"St. Agnes · Class 7B",text:d=>(d.flags.late>5?"You slip in after the bell. ":"")+"Ratios. Half the class has it. Aarav hasn't written anything in a week. The unit test is in nine days and you're a chapter behind.",
     choices:[{label:"Ten more minutes, with cricket scores",detail:"Run rates and team shares.",fx:()=>({energy:4,flags:{slowDown:true},text:"Strike rates do it. Aarav answers out loud for the first time this term."})},{label:"Move on to keep pace",detail:"Note Aarav for later.",fx:()=>({energy:-4,text:"The syllabus stays on track. Aarav's head stays down."})}]},
    {id:"t3",time:"11:20",place:"St. Agnes · staff room",text:()=>"The principal needs someone to run annual-day costumes and take a substitution period. Neither is paid. Both are noticed.",
     choices:[{label:"Say yes to both",detail:"Lose your free period.",fx:()=>({energy:-12,flags:{yesBoth:true},text:"The principal thanks you warmly. Your notebook-checking period is gone."})},{label:"Costumes yes, substitution no",detail:"Protect the free period.",fx:()=>({energy:-4,text:"She pauses, then nods. Mrs. Pinto takes the substitution and mentions it twice at lunch."})}]},
    {id:"t4",time:"16:00",place:"Malad East · tuition",text:()=>"Two batches, ₹1,500 per student a month. A parent asks if you'll start a Saturday batch for two more students: ₹3,000 more, and your Saturdays.",
     choices:[{label:"Start the Saturday batch",detail:"+₹3,000 a month.",fx:()=>({energy:-6,flags:{saturday:true},text:"She pays the first month in advance. Choir practice is on Saturdays."})},{label:"Keep Saturdays free",detail:"Choir, laundry, sleep.",fx:()=>({energy:4,text:"She'll ask the coaching class down the road instead."})}]},
    {id:"t5",time:"21:15",place:"Malad West · balcony",text:()=>"Pappa's check-up went fine. He asks if you've applied for the state teacher recruitment test; aided schools pay on a government scale. The coaching institute in Andheri has messaged again: ₹38,000 a month, evenings and Sundays.",
     choices:[{label:"Prepare for the state test",detail:"Fee, books, evenings of study.",fx:()=>({flags:{prep:true},commit:["call","kept"],text:"Pappa goes quiet with happiness. Books and fee: ₹1,500."})},{label:"Try a week at the coaching institute",detail:"See what ₹38,000 costs.",fx:()=>({flags:{coach:true},commit:["call","kept"],text:"Pappa worries about Sundays. It's only a trial week."})},{label:"Stay where you are",detail:"You like your school.",fx:()=>({energy:6,commit:["call","kept"],text:"Pappa says that's fine. He says it twice."})}]}
  ],
  day:[
    {place:"flat_ruth",time:"06:05",beats:[["t1","table","Your notebooks"]],talks:[["kavya","Kavya","Twelve patients, one of me. Wake me if the landlord comes."]],exit:"Leave for school"},
    {travel:"school",time:"06:50",deadline:"07:30"},
    {place:"school",beats:[["t2","aarav","Class 7B"],["t3","principal","The principal"]],talks:[["peon","Shinde kaka","Chalk is finished again, madam. Third box this month."]],exit:"Leave for tuitions"},
    {travel:"tuition",time:"15:20",deadline:"16:00"},
    {place:"tuition",beats:[["t4","parent","A parent"]],exit:"Head home"},
    {travel:"home",time:"19:30"},
    {place:"flat_ruth_night",time:"21:15",beats:[["t5","balcony","Pappa on the phone"]],exit:null}
  ],
  routes:{
    school:{to:"St. Agnes",options:[
      {id:"walk",label:"Walk",monthly:0,note:"Free, 20 minutes",legs:[leg("walk","Flat","St. Agnes",22,0)]},
      {id:"share",label:"Shared auto",monthly:900,note:"₹20 a ride",legs:[leg("walk","Flat","Auto stand",4,0),leg("shareauto","Auto stand","School gate",8,20,{wait:4})]},
      {id:"bus",label:"BEST bus",monthly:440,note:"₹10 a ride",legs:[leg("walk","Flat","Bus stop",5,0),leg("bus","Malad West","School stop",12,10,{wait:7,st:["Malad Stn (W)","Evershine","School stop"]})]}]},
    tuition:{to:"Student's home, Malad East",options:[
      {id:"auto",label:"Auto",monthly:0,note:"₹70",legs:[leg("auto","School","Malad East",18,70)]},
      {id:"bus",label:"BEST bus",monthly:0,note:"₹10",legs:[leg("walk","School","Bus stop",5,0),leg("bus","Malad West","Malad East",26,10,{wait:8,st:["Malad Stn (W)","Subway","Malad East"]}),leg("walk","Bus stop","Student's home",6,0)]},
      {id:"walk",label:"Walk",monthly:0,note:"Free, under the subway",legs:[leg("walk","School","Malad East",40,0)]}]},
    home:{to:"Flat, Malad West",options:[
      {id:"walk",label:"Walk",monthly:0,legs:[leg("walk","Malad East","Flat",32,0)]},
      {id:"auto",label:"Auto",monthly:0,legs:[leg("auto","Malad East","Flat",12,50)]}]}
  },
  month(f){const L=[];
    L.push({g:"School salary",label:"Gross monthly salary",amt:24000,note:"Private unaided school, state board."});
    L.push({g:"School salary",label:"Professional tax",amt:-200,note:""});
    L.push({g:"School salary",label:"PF",amt:0,note:"No PF at this school (illustrative). Nothing saved for retirement automatically."});
    L.push({sub:"Take-home salary"});
    L.push({g:"Tuitions (self-employed)",label:"Six students",amt:9000,note:"₹1,500 each."});
    if(f.saturday) L.push({g:"Tuitions (self-employed)",label:"Saturday batch",amt:3000,note:"Two more students."});
    L.push({g:"Tuitions (self-employed)",label:"Printouts and supplies",amt:-500,note:""});
    L.push({sub:"Income after work costs"});
    L.push({g:"Home",label:"Rent, her half",amt:-11000,note:"1BHK shared with Kavya."});
    L.push({g:"Home",label:"Electricity, Wi-Fi, gas",amt:-1200,note:""});
    L.push({g:"Home",label:"Groceries, her half",amt:-3500,note:""});
    L.push({g:"Home",label:"Getting around: "+(f.commute?f.commute.label:"shared autos"),amt:-((f.commute?f.commute.monthly:900)+600),note:"School trips the way you went today, plus buses to tuitions."});
    L.push({g:"Home",label:"Phone plan",amt:-400,note:""});
    L.push({g:"Family and self",label:"Sent home",amt:-3000,note:""});
    L.push({g:"Family and self",label:"Personal",amt:-1500,note:"Choir dues, toiletries."});
    if(f.prep) L.push({g:"Family and self",label:"State test fee and books",amt:-1500,note:""});
    return {kind:"Two incomes: a salary with deductions, and tuition money she earns herself.",lines:L,owed:[{label:"Owed to Pappa",amt:20000,note:"Deposit share. Informal."},{label:"Deposit with the landlord",amt:null,note:"₹50,000 of hers she can't use."},{label:"Retirement savings",amt:null,note:"None through work."}]};},
  available:32300,availableNote:"School take-home plus tuitions, minus supplies.",
  hours:{work:53,commute:4,label:"38 at school, 9 tutoring, 6 checking notebooks, 4 commuting"},
  entryCost:{amt:140000,note:"B.Sc (mostly scholarship), two years of B.Ed, the eligibility test."},
  pivot:"t5",
  branches:[
    {id:"aided",cond:f=>!!f.prep,title:"The permanent post",
     y5:{age:32,role:"Maths teacher, government-aided school, Thane",place:"school",available:50000,availableNote:"On a state pay scale (illustrative).",hours:"40 hours a week",changed:"Cleared the state recruitment test on her second attempt.",enabled:"B.Ed, the eligibility test, months of evening study, and Kavya covering rent one month.",cost:"Two years of tired evenings; lost tuition income.",uncertain:"Recruitment rounds are irregular; placement can be far from home."},
     y15:{age:42,role:"Senior teacher and exam coordinator",place:"school",available:85000,availableNote:"Pension-linked post.",hours:"42 hours a week",changed:"Senior scale, an M.A. done part-time.",enabled:"Security of the post.",cost:"Paperwork eats teaching time.",uncertain:"Pay revisions and postings are outside her control."}},
    {id:"coach",cond:f=>!!f.coach,title:"The coaching floor",
     y5:{age:32,role:"Senior maths faculty, coaching institute, Andheri",place:"school",available:70000,availableNote:"Contract pay.",hours:"60 hours a week, Sundays included",changed:"The trial week became a contract.",enabled:"Clear explanations; parents talk.",cost:"No Sundays, no choir. Yearly contracts tied to ranks.",uncertain:"A bad results year can end a contract."},
     y15:{age:42,role:"Runs a small coaching centre in Malad",place:"school",available:110000,availableNote:"Varies widely.",hours:"65 hours in exam season",changed:"Opened her own centre with two teachers.",enabled:"Reputation and savings.",cost:"Rent, staff and marketing are all on her.",uncertain:"Many small centres close within a few years."}},
    {id:"school",cond:()=>true,title:"The same school",
     y5:{age:32,role:"Maths teacher and Class 8 coordinator",place:"school",available:38000,availableNote:"₹30,000 salary plus tuitions.",hours:"55 hours including tuitions",changed:"Small raises and a coordinator role.",enabled:"Results and goodwill.",cost:"Still no PF. Tuitions still pay the rent.",uncertain:"Private school pay depends on management."},
     y15:{age:42,role:"Middle-school supervisor",place:"school",available:55000,availableNote:"Today's rupees.",hours:"50 hours a week",changed:"Promoted when the supervisor retired.",enabled:"Fifteen years at one school.",cost:"No pension.",uncertain:"Moving got harder every year."}}
  ]
};
