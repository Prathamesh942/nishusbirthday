import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Great+Vibes&family=Lato:wght@300;400&display=swap');`;

const CSS = `
* { margin:0; padding:0; box-sizing:border-box; }
:root {
  --lavender:#b89fd4; --lavender-light:#d8c8ee; --lavender-pale:#f0e8f8;
  --purple-deep:#7c5fa0; --purple-soft:#9b7bbf;
  --petal-pink:#dbb8df; --cream:#fdfaf8;
  --text-mid:#7a5a9a; --text-soft:#a885c0;
}
html, body, #root {
  width:100%; height:100%;
  background:var(--cream);
  overflow:hidden;
}
.screen {
  position:fixed; inset:0;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  padding:clamp(1rem,4vw,2.5rem);
  text-align:center;
  overflow-y:auto; overflow-x:hidden;
  scrollbar-width:none;
  z-index:10;
  animation:fadeUp 0.7s ease both;
}
.screen::-webkit-scrollbar { display:none; }
@keyframes fadeUp {
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes bloomIn {
  from { opacity:0; transform:translateY(14px) scale(0.96); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}
@keyframes pulse {
  0%,100% { box-shadow:0 4px 28px rgba(140,90,190,0.35),0 0 0 0 rgba(180,130,220,0.4); }
  50%     { box-shadow:0 4px 28px rgba(140,90,190,0.35),0 0 0 10px rgba(180,130,220,0); }
}
@keyframes glowRing {
  0%,100% { opacity:0.6; transform:scale(1); }
  50%     { opacity:1;   transform:scale(1.08); }
}
@keyframes floatDown {
  0%   { transform:translateY(-60px) rotate(0deg); opacity:0; }
  10%  { opacity:0.65; }
  90%  { opacity:0.45; }
  100% { transform:translateY(110vh) rotate(700deg); opacity:0; }
}
@keyframes flutter {
  0%,100% { transform:rotate(-8deg) scaleX(1); }
  25%     { transform:rotate(8deg)  scaleX(0.7); }
  50%     { transform:rotate(-8deg) scaleX(1); }
  75%     { transform:rotate(8deg)  scaleX(0.7); }
}
@keyframes drift {
  0%   { top:20%; left:10%; }
  25%  { top:10%; left:80%; }
  50%  { top:70%; left:85%; }
  75%  { top:80%; left:15%; }
  100% { top:20%; left:10%; }
}
@keyframes memReveal {
  from { opacity:0; transform:translateY(24px); }
  to   { opacity:1; transform:translateY(0); }
}
.petal {
  position:fixed; top:-40px;
  border-radius:50% 0 50% 0;
  animation:floatDown linear infinite;
  opacity:0; pointer-events:none; z-index:0;
}
.butterfly {
  position:fixed; font-size:1.1rem;
  animation:flutter 0.8s ease-in-out infinite, drift 22s linear infinite;
  pointer-events:none; z-index:2; opacity:0.25;
}
.corner {
  position:fixed; width:clamp(100px,15vw,170px); height:clamp(100px,15vw,170px);
  pointer-events:none; z-index:1; opacity:0.32;
}
`;

const PETALS = [
  {l:"5%",  w:10,h:14,bg:"#c9a8e0",dur:"9s",  del:"0s"   },
  {l:"15%", w:7, h:10,bg:"#e0c8f0",dur:"11s", del:"1.5s" },
  {l:"25%", w:12,h:16,bg:"#b89fd4",dur:"8s",  del:"3s"   },
  {l:"35%", w:8, h:11,bg:"#d8b8e8",dur:"13s", del:"0.5s" },
  {l:"50%", w:11,h:15,bg:"#c8a0d8",dur:"10s", del:"2s"   },
  {l:"62%", w:7, h:9, bg:"#ddc8f0",dur:"7s",  del:"4s"   },
  {l:"73%", w:13,h:17,bg:"#b890cc",dur:"12s", del:"1s"   },
  {l:"84%", w:9, h:12,bg:"#e8d0f4",dur:"9.5s",del:"2.8s" },
  {l:"92%", w:10,h:13,bg:"#c0a0d8",dur:"8.5s",del:"0.2s" },
  {l:"45%", w:6, h:8, bg:"#d4b8e8",dur:"14s", del:"3.5s" },
  {l:"8%",  w:8, h:12,bg:"#9b78bc",dur:"10.5s",del:"5s"  },
  {l:"58%", w:11,h:14,bg:"#e0c4f0",dur:"7.5s",del:"1.8s" },
];

const BloomSVG = () => (
  <svg viewBox="0 0 180 180" fill="none" style={{width:"100%",height:"100%"}}>
    <ellipse cx="30" cy="50" rx="18" ry="28" fill="#c8a8e0" transform="rotate(-30 30 50)"/>
    <ellipse cx="60" cy="25" rx="14" ry="22" fill="#ddb8f0" transform="rotate(10 60 25)"/>
    <ellipse cx="90" cy="18" rx="12" ry="18" fill="#b890cc" transform="rotate(30 90 18)"/>
    <ellipse cx="15" cy="80" rx="16" ry="24" fill="#e0c8f4" transform="rotate(-50 15 80)"/>
    <ellipse cx="50" cy="65" rx="20" ry="14" fill="#c0a0d8" transform="rotate(15 50 65)"/>
    <circle  cx="55" cy="55" r="8" fill="#a878c0"/>
    <ellipse cx="20" cy="120" rx="13" ry="20" fill="#d4b0e8" transform="rotate(-40 20 120)"/>
    <ellipse cx="110" cy="30" rx="10" ry="16" fill="#cca8e0" transform="rotate(20 110 30)"/>
    <line x1="55" y1="55" x2="20" y2="90" stroke="#8a9e7a" strokeWidth="1.5"/>
    <line x1="55" y1="55" x2="80" y2="20" stroke="#8a9e7a" strokeWidth="1.5"/>
    <line x1="55" y1="55" x2="90" y2="60" stroke="#b3c49f" strokeWidth="1"/>
    <circle cx="28" cy="92" r="3" fill="#8a9e7a"/>
    <circle cx="82" cy="18" r="3" fill="#b3c49f"/>
  </svg>
);

function Divider({ label }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"0.7rem",margin:"clamp(0.6rem,2vh,1.4rem) auto",color:"var(--lavender)",fontSize:"1.2rem",opacity:0.75,justifyContent:"center"}}>
      ✿
      {label && <span style={{fontSize:"clamp(0.68rem,1.5vw,0.86rem)",fontFamily:"'Lato',sans-serif",fontWeight:300,color:"var(--text-soft)",letterSpacing:"0.1em"}}>{label}</span>}
      ✿
    </div>
  );
}

function Btn({ onClick, children, anim=true }) {
  return (
    <button onClick={onClick} style={{
      fontFamily:"'Cormorant Garamond',serif",
      fontSize:"clamp(0.9rem,2vw,1.1rem)",
      letterSpacing:"0.12em", color:"#fff",
      background:"linear-gradient(135deg,#9b7bbf,#7c5fa0)",
      border:"none", borderRadius:"50px",
      padding:"clamp(0.55rem,1.5vh,0.85rem) clamp(1.3rem,4vw,2.3rem)",
      cursor:"pointer",
      boxShadow:"0 4px 24px rgba(140,90,190,0.35)",
      transition:"transform 0.22s,box-shadow 0.22s",
      animation: anim ? "pulse 3s ease 2s infinite" : "none",
      position:"relative", overflow:"hidden", flexShrink:0,
    }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px) scale(1.04)";e.currentTarget.style.boxShadow="0 8px 36px rgba(140,90,190,0.5)";}}
    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 24px rgba(140,90,190,0.35)";}}>
      <span style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 0%,rgba(255,255,255,0.22) 0%,transparent 70%)",borderRadius:"inherit",pointerEvents:"none"}}/>
      {children}
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      fontFamily:"'Lato',sans-serif",fontSize:"0.7rem",letterSpacing:"0.2em",
      textTransform:"uppercase",color:"var(--text-soft)",background:"transparent",
      border:"1px solid rgba(180,130,220,0.28)",borderRadius:"50px",
      padding:"0.4rem 1.2rem",cursor:"pointer",transition:"all 0.2s",marginTop:"1rem",flexShrink:0,
    }}
    onMouseEnter={e=>{e.currentTarget.style.background="var(--lavender-pale)";e.currentTarget.style.color="var(--text-mid)";}}
    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--text-soft)";}}>
      {children}
    </button>
  );
}

const cardStyle = {
  width:"100%", maxWidth:540,
  background:"rgba(255,255,255,0.82)",
  backdropFilter:"blur(14px)",
  borderRadius:"clamp(14px,3vw,24px)",
  boxShadow:"0 6px 36px rgba(160,110,210,0.12)",
  padding:"clamp(1.2rem,4vw,2.4rem) clamp(1.1rem,4vw,2.2rem)",
};

/* ══ SCREEN 1 — WELCOME ══ */
function WelcomeScreen({ onNext }) {
  return (
    <div className="screen">
      <div style={{position:"absolute",width:"min(55vw,240px)",height:"min(55vw,240px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(200,158,240,0.15) 0%,transparent 68%)",pointerEvents:"none",animation:"glowRing 4s ease-in-out infinite"}}/>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(0.85rem,2.3vw,1.25rem)",fontStyle:"italic",color:"var(--text-soft)",letterSpacing:"0.08em",marginBottom:"0.3rem",animation:"bloomIn 1.4s ease 0.3s both",position:"relative"}}>
        a little something for you ✦
      </p>
      <h1 style={{fontFamily:"'Great Vibes',cursive",fontSize:"clamp(2.8rem,12vw,6.2rem)",color:"var(--purple-deep)",lineHeight:1.1,textShadow:"0 2px 26px rgba(180,130,220,0.2)",animation:"bloomIn 1.4s ease both",position:"relative"}}>
        Happy Birthday,<br/>My Dearest Pradnya
      </h1>
      <Divider label="a garden of love awaits inside"/>
      <Btn onClick={onNext}>Open Your Gift ✦</Btn>
    </div>
  );
}

/* ══ SCREEN 2 — MESSAGE ══ */
function MessageScreen({ onNext }) {
  return (
    <div className="screen" style={{justifyContent:"flex-start",paddingTop:"clamp(1.2rem,4vh,2.5rem)"}}>
      <div style={cardStyle}>
        <div style={{fontFamily:"'Great Vibes',cursive",fontSize:"clamp(1.7rem,5.5vw,2.6rem)",color:"var(--purple-deep)",marginBottom:"0.7rem"}}>
          My Dearest Friend
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:"0.5rem",color:"var(--lavender)",fontSize:"1rem",opacity:0.7,marginBottom:"0.9rem"}}>✿ ✿ ✿</div>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(0.9rem,2.1vw,1.1rem)",lineHeight:1.85,color:"var(--text-mid)"}}>
          Happiest Birthday pradnya... You are my bestie from past 5 years or more but all those years we created a lot of memories we laughed together we cried together we even faught a lot of times but in the end we were together and we will be together forever i promise i will be always with you in your high and lows in your mood swings in your overthinking i will be there when ever you need me just like you were there for me and i love you 3000💜
        </p>
      </div>
      <Divider label="shall we walk down memory lane?"/>
      <Btn onClick={onNext}>Our Memories ✦</Btn>
    </div>
  );
}

/* ══ SCREEN 3 — MEMORIES ══ */
const MEMORIES = [
  { num:"Memory One",   icon:"🌸", text:`still remember sitting on the last bench of our 10th class` },
  { num:"Memory Two",   icon:"🌙", text:`clicking photos of back side of my house  💜` },
  { num:"Memory Three", icon:"🤍", text:`gossiping about teachers 🤍` },
];
const LABELS = ["✦ reveal first memory ✦","✦ next memory ✦","✦ one more memory ✦"];

function MemCard({ mem, visible }) {
  return (
    <div style={{
      width:"100%",
      background:"rgba(255,255,255,0.85)",
      borderRadius:"clamp(10px,2.5vw,18px)",
      boxShadow:"0 4px 28px rgba(160,110,210,0.1)",
      padding:"clamp(0.9rem,2.5vw,1.6rem) clamp(0.9rem,2.5vw,1.8rem)",
      marginBottom:"clamp(0.5rem,1.5vh,0.9rem)",
      textAlign:"left", position:"relative", overflow:"hidden",
      animation: visible ? "memReveal 0.55s ease both" : "none",
      opacity: visible ? 1 : 0,
    }}>
      <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:"linear-gradient(180deg,var(--lavender),var(--petal-pink))",borderRadius:"3px 0 0 3px"}}/>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.7rem",fontStyle:"italic",color:"var(--text-soft)",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"0.35rem"}}>
        {mem.num}
      </div>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(0.88rem,2.1vw,1.05rem)",color:"var(--text-mid)",lineHeight:1.78}}>
        {mem.text}
      </p>
      <span style={{position:"absolute",top:"0.9rem",right:"1rem",fontSize:"1.1rem",opacity:0.45}}>{mem.icon}</span>
    </div>
  );
}

function MemoriesScreen({ onNext }) {
  const [revealed, setRevealed] = useState(0);
  return (
    <div className="screen" style={{justifyContent:"flex-start",paddingTop:"clamp(1.2rem,4vh,2rem)"}}>
      <h2 style={{fontFamily:"'Great Vibes',cursive",fontSize:"clamp(2rem,7.5vw,3.3rem)",color:"var(--purple-deep)",marginBottom:"0.1rem"}}>Our Story</h2>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(0.75rem,1.7vw,0.9rem)",color:"var(--text-soft)",marginBottom:"clamp(0.8rem,2.5vh,1.5rem)",letterSpacing:"0.07em"}}>
        three petals from our garden of memories
      </p>
      <div style={{width:"100%",maxWidth:540}}>
        {MEMORIES.map((m,i) => <MemCard key={i} mem={m} visible={i < revealed}/>)}
        <div style={{display:"flex",justifyContent:"center",marginTop:"0.5rem"}}>
          {revealed < MEMORIES.length
            ? <button
                onClick={()=>setRevealed(r=>r+1)}
                style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(0.82rem,1.9vw,0.96rem)",fontStyle:"italic",color:"var(--purple-deep)",background:"rgba(255,255,255,0.75)",border:"1px solid rgba(180,130,220,0.4)",borderRadius:50,padding:"0.48rem 1.7rem",cursor:"pointer",transition:"all 0.22s",boxShadow:"0 2px 14px rgba(160,110,210,0.1)"}}
                onMouseEnter={e=>{e.currentTarget.style.background="var(--lavender-pale)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.75)";e.currentTarget.style.transform="none";}}>
                {LABELS[revealed]}
              </button>
            : <div style={{animation:"bloomIn 0.6s ease both",marginTop:"0.3rem"}}>
                <Btn onClick={onNext} anim={false}>One last thing for you ✦</Btn>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

/* ══ SCREEN 4 — POEM ══ */
const POEM = `Mazi sakhi tu Mazi man dharni tu 
Maza prashn tu Maz uttar hi tu

Tuch hotis mazya ekantat Tuch rahilis mazya gondhalat 
Tuch hotis mazya hasnyat Tuch hotis mazya dukhat 

Tu ubha rahilis mazya sathi jevha jag hot mazya virodhat 
Tuch jinkalis shariyat maz aapla honyat 

Tuzyat sapdal mala maz aaple pn tuzyach mule milal mla jagnyach navin swarup 
Tu hotis mhanun hote me tu aahes mhnaun aahe me ani tu rahshil mhanun rahin mi 
`;

function PoemScreen({ onRestart }) {
  return (
    <div className="screen" style={{justifyContent:"flex-start",paddingTop:"clamp(1.2rem,4vh,2rem)"}}>
      <div style={{...cardStyle, position:"relative", overflow:"hidden"}}>
        <span style={{position:"absolute",top:"-0.3rem",left:"0.3rem",color:"var(--lavender-light)",fontSize:"clamp(2.5rem,7vw,4.5rem)",opacity:0.3,lineHeight:1,pointerEvents:"none"}}>✿</span>
        <span style={{position:"absolute",bottom:"-0.3rem",right:"0.3rem",color:"var(--lavender-light)",fontSize:"clamp(2.5rem,7vw,4.5rem)",opacity:0.3,lineHeight:1,transform:"scaleX(-1)",pointerEvents:"none"}}>✿</span>
        <div style={{fontFamily:"'Great Vibes',cursive",fontSize:"clamp(1.7rem,5vw,2.4rem)",color:"var(--purple-deep)",marginBottom:"1rem",position:"relative"}}>
          For You
        </div>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(0.85rem,2vw,1.05rem)",color:"var(--text-mid)",lineHeight:1.95,fontStyle:"italic",whiteSpace:"pre-line",margin:0,position:"relative"}}>
          {POEM}
        </p>
        <span style={{fontFamily:"'Great Vibes',cursive",fontSize:"clamp(1.1rem,3.2vw,1.4rem)",color:"var(--purple-soft)",marginTop:"1rem",display:"block",position:"relative"}}>
          — with all my love 💜
        </span>
      </div>
      <GhostBtn onClick={onRestart}>↩ back to the garden</GhostBtn>
    </div>
  );
}

/* ══ ROOT ══ */
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [key, setKey] = useState(0);
  const goTo = s => { setScreen(s); setKey(k=>k+1); };

  return (
    <>
      <style>{FONTS}{CSS}</style>

      {/* Petals */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        {PETALS.map((p,i)=>(
          <div key={i} className="petal" style={{left:p.l,width:p.w,height:p.h,background:p.bg,animationDuration:p.dur,animationDelay:p.del}}/>
        ))}
      </div>

      {/* Butterflies */}
      {[{d:"0s,0s"},{d:"-7s,-5s"},{d:"-13s,-9s"}].map((b,i)=>(
        <div key={i} className="butterfly" style={{animationDelay:b.d,opacity:0.26-i*0.05,fontSize:`${1.1-i*0.12}rem`}}>🦋</div>
      ))}

      {/* Corner blooms */}
      <div className="corner" style={{top:0,left:0}}><BloomSVG/></div>
      <div className="corner" style={{top:0,right:0,transform:"scaleX(-1)"}}><BloomSVG/></div>
      <div className="corner" style={{bottom:0,left:0,transform:"scaleY(-1)"}}><BloomSVG/></div>
      <div className="corner" style={{bottom:0,right:0,transform:"scale(-1,-1)"}}><BloomSVG/></div>

      <div key={key}>
        {screen==="welcome"  && <WelcomeScreen  onNext={()=>goTo("message")}/>}
        {screen==="message"  && <MessageScreen  onNext={()=>goTo("memories")}/>}
        {screen==="memories" && <MemoriesScreen onNext={()=>goTo("poem")}/>}
        {screen==="poem"     && <PoemScreen     onRestart={()=>goTo("welcome")}/>}
      </div>
    </>
  );
}