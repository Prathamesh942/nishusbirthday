import { useState, useRef, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Dancing+Script:wght@500;700&family=Jost:wght@300;400&display=swap');`;

const CSS = `
* { margin:0; padding:0; box-sizing:border-box; }
:root {
  --rose:#e8537a;
  --rose-deep:#c03060;
  --rose-soft:#f07898;
  --blush:#fce8ef;
  --cream:#fffaf9;
  --text-mid:#a0345a;
  --text-soft:#d0708a;
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
  animation:riseIn 0.75s cubic-bezier(0.22,1,0.36,1) both;
}
.screen::-webkit-scrollbar { display:none; }
.screen-top {
  position:fixed; inset:0;
  display:flex; flex-direction:column;
  align-items:center; justify-content:flex-start;
  padding:clamp(1rem,4vw,2rem);
  text-align:center;
  overflow-y:auto; overflow-x:hidden;
  scrollbar-width:none;
  z-index:10;
  animation:riseIn 0.75s cubic-bezier(0.22,1,0.36,1) both;
}
.screen-top::-webkit-scrollbar { display:none; }

@keyframes riseIn {
  from { opacity:0; transform:translateY(22px) scale(0.98); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}
@keyframes heartBeat {
  0%,100% { transform:scale(1); }
  14%     { transform:scale(1.22); }
  28%     { transform:scale(1); }
  42%     { transform:scale(1.12); }
  56%     { transform:scale(1); }
}
@keyframes pulse {
  0%,100% { box-shadow:0 4px 24px rgba(220,60,100,0.3),0 0 0 0 rgba(240,120,152,0.4); }
  50%     { box-shadow:0 4px 24px rgba(220,60,100,0.3),0 0 0 10px rgba(240,120,152,0); }
}
@keyframes shimmer {
  0%,100% { opacity:0.18; transform:scale(1); }
  50%     { opacity:0.26; transform:scale(1.05); }
}

/* BUG FIX: heart float animation uses named classes per timing variant
   instead of CSS custom properties (which React inline styles don't
   reliably forward to the DOM for use inside @keyframes) */
@keyframes hf-a { 0%{opacity:0;transform:translateY(0) rotate(-15deg) scale(0.9);} 8%{opacity:0.5;} 88%{opacity:0.5;} 100%{opacity:0;transform:translateY(-105vh) rotate(45deg) scale(0.9);} }
@keyframes hf-b { 0%{opacity:0;transform:translateY(0) rotate(10deg) scale(1.1);}  8%{opacity:0.45;}88%{opacity:0.45;}100%{opacity:0;transform:translateY(-105vh) rotate(70deg) scale(1.1);} }
@keyframes hf-c { 0%{opacity:0;transform:translateY(0) rotate(-8deg) scale(0.8);}  8%{opacity:0.55;}88%{opacity:0.55;}100%{opacity:0;transform:translateY(-105vh) rotate(52deg) scale(0.8);} }
@keyframes hf-d { 0%{opacity:0;transform:translateY(0) rotate(20deg) scale(1);}    8%{opacity:0.5;} 88%{opacity:0.5;} 100%{opacity:0;transform:translateY(-105vh) rotate(80deg) scale(1);} }
@keyframes hf-e { 0%{opacity:0;transform:translateY(0) rotate(-12deg) scale(1.2);} 8%{opacity:0.38;}88%{opacity:0.38;}100%{opacity:0;transform:translateY(-105vh) rotate(48deg) scale(1.2);} }
@keyframes hf-f { 0%{opacity:0;transform:translateY(0) rotate(5deg) scale(0.9);}   8%{opacity:0.6;} 88%{opacity:0.6;} 100%{opacity:0;transform:translateY(-105vh) rotate(65deg) scale(0.9);} }
@keyframes hf-g { 0%{opacity:0;transform:translateY(0) rotate(-20deg) scale(1);}   8%{opacity:0.48;}88%{opacity:0.48;}100%{opacity:0;transform:translateY(-105vh) rotate(40deg) scale(1);} }
@keyframes hf-h { 0%{opacity:0;transform:translateY(0) rotate(15deg) scale(0.7);}  8%{opacity:0.55;}88%{opacity:0.55;}100%{opacity:0;transform:translateY(-105vh) rotate(75deg) scale(0.7);} }
@keyframes hf-i { 0%{opacity:0;transform:translateY(0) rotate(-5deg) scale(1.1);}  8%{opacity:0.4;} 88%{opacity:0.4;} 100%{opacity:0;transform:translateY(-105vh) rotate(55deg) scale(1.1);} }
@keyframes hf-j { 0%{opacity:0;transform:translateY(0) rotate(25deg) scale(0.9);}  8%{opacity:0.5;} 88%{opacity:0.5;} 100%{opacity:0;transform:translateY(-105vh) rotate(85deg) scale(0.9);} }

.float-heart {
  position:fixed; bottom:-60px;
  pointer-events:none; z-index:0;
  animation-timing-function:linear;
  animation-iteration-count:infinite;
}
.corner-heart {
  position:fixed;
  pointer-events:none; z-index:1;
  animation:shimmer 4s ease-in-out infinite;
}
.mute-btn {
  position:fixed; bottom:1.2rem; right:1.2rem;
  z-index:100;
  width:2.6rem; height:2.6rem;
  border-radius:50%;
  border:1px solid rgba(220,100,140,0.35);
  background:rgba(255,248,251,0.88);
  backdrop-filter:blur(10px);
  cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  font-size:1rem;
  box-shadow:0 2px 14px rgba(200,80,120,0.15);
  transition:transform 0.2s, box-shadow 0.2s;
}
.mute-btn:hover {
  transform:scale(1.12);
  box-shadow:0 4px 20px rgba(200,80,120,0.25);
}
`;

/* Each heart gets its own keyframe name, size, left, duration, delay */
const HEARTS = [
  {l:"4%",  fs:"0.9rem", kf:"hf-a", dur:"9s",  del:"0s"  },
  {l:"11%", fs:"1.4rem", kf:"hf-b", dur:"13s", del:"1.2s"},
  {l:"19%", fs:"0.7rem", kf:"hf-c", dur:"8s",  del:"2.8s"},
  {l:"27%", fs:"1.1rem", kf:"hf-d", dur:"11s", del:"0.4s"},
  {l:"35%", fs:"1.6rem", kf:"hf-e", dur:"15s", del:"3.5s"},
  {l:"43%", fs:"0.8rem", kf:"hf-f", dur:"7s",  del:"1.8s"},
  {l:"51%", fs:"1.2rem", kf:"hf-g", dur:"12s", del:"0.8s"},
  {l:"59%", fs:"0.6rem", kf:"hf-h", dur:"10s", del:"4.1s"},
  {l:"67%", fs:"1.5rem", kf:"hf-i", dur:"14s", del:"2.2s"},
  {l:"74%", fs:"0.9rem", kf:"hf-j", dur:"9s",  del:"0.6s"},
  {l:"82%", fs:"1.3rem", kf:"hf-a", dur:"11s", del:"3s"  },
  {l:"89%", fs:"0.7rem", kf:"hf-c", dur:"8s",  del:"1.5s"},
  {l:"95%", fs:"1.1rem", kf:"hf-d", dur:"13s", del:"5s"  },
  {l:"22%", fs:"1.8rem", kf:"hf-e", dur:"17s", del:"6s"  },
  {l:"63%", fs:"0.5rem", kf:"hf-f", dur:"6s",  del:"2.5s"},
  {l:"47%", fs:"2rem",   kf:"hf-b", dur:"18s", del:"7s"  },
];

const HEART_CHARS = ["♥","❤","💕","💗","💓","💝","♡"];

function CornerHearts() {
  const corners = [
    {top:0,    left:0,                          delay:"0s"  },
    {top:0,    right:0,  transform:"scaleX(-1)",delay:"0.9s"},
    {bottom:0, left:0,   transform:"scaleY(-1)",delay:"1.8s"},
    {bottom:0, right:0,  transform:"scale(-1,-1)",delay:"2.7s"},
  ];
  const size = "clamp(90px,17vw,190px)";
  return (
    <>
      {corners.map((pos,i) => (
        <div key={i} className="corner-heart"
          style={{...pos, width:size, height:size, animationDelay:pos.delay}}>
          <svg viewBox="0 0 200 200" fill="none" style={{width:"100%",height:"100%"}}>
            <path d="M60 80C60 60,40 50,30 60C20 70,20 90,40 105L60 120L80 105C100 90,100 70,90 60C80 50,60 60,60 80Z" fill="#f48fb1" opacity="0.65"/>
            <path d="M110 50C110 36,96 28,88 36C80 44,80 60,96 72L110 82L124 72C140 60,140 44,132 36C124 28,110 36,110 50Z" fill="#e8537a" opacity="0.55"/>
            <path d="M35 140C35 130,26 124,20 130C14 136,14 148,24 156L35 164L46 156C56 148,56 136,50 130C44 124,35 130,35 140Z" fill="#f9a8c4" opacity="0.6"/>
            <path d="M155 110C155 98,144 92,137 98C130 104,130 118,140 126L155 136L170 126C180 118,180 104,173 98C166 92,155 98,155 110Z" fill="#e8537a" opacity="0.45"/>
            {/* BUG FIX: was opacity:"0.5" (JS colon in JSX attr) — fixed to opacity="0.5" */}
            <path d="M80 30C80 23,73 19,69 23C65 27,65 35,71 41L80 48L89 41C95 35,95 27,91 23C87 19,80 23,80 30Z" fill="#f48fb1" opacity="0.5"/>
            <circle cx="130" cy="40"  r="3"   fill="#f48fb1" opacity="0.5"/>
            <circle cx="20"  cy="100" r="2"   fill="#e8537a" opacity="0.45"/>
            <circle cx="170" cy="70"  r="2.5" fill="#f9a8c4" opacity="0.5"/>
            <circle cx="50"  cy="165" r="2"   fill="#f48fb1" opacity="0.4"/>
          </svg>
        </div>
      ))}
    </>
  );
}

function HeartDivider({ label }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"0.6rem",margin:"clamp(0.6rem,2vh,1.3rem) auto",color:"var(--rose-soft)",fontSize:"1rem",justifyContent:"center",opacity:0.8}}>
      ♥
      {label && <span style={{fontSize:"clamp(0.62rem,1.4vw,0.8rem)",fontFamily:"'Jost',sans-serif",fontWeight:300,color:"var(--text-soft)",letterSpacing:"0.14em",textTransform:"uppercase"}}>{label}</span>}
      ♥
    </div>
  );
}

function PinkBtn({ onClick, children, anim=true }) {
  return (
    <button onClick={onClick} style={{
      fontFamily:"'Playfair Display',serif",
      fontSize:"clamp(0.88rem,1.9vw,1.05rem)",
      fontStyle:"italic",
      letterSpacing:"0.06em",
      color:"#fff",
      background:"linear-gradient(135deg,#f07898 0%,#c03060 100%)",
      border:"none",
      borderRadius:"50px",
      padding:"clamp(0.55rem,1.5vh,0.82rem) clamp(1.4rem,4vw,2.4rem)",
      cursor:"pointer",
      boxShadow:"0 4px 22px rgba(200,50,90,0.32)",
      transition:"transform 0.22s,box-shadow 0.22s",
      animation: anim ? "pulse 2.8s ease 1.5s infinite" : "none",
      position:"relative", overflow:"hidden", flexShrink:0,
    }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px) scale(1.04)";e.currentTarget.style.boxShadow="0 8px 32px rgba(200,50,90,0.45)";}}
    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 22px rgba(200,50,90,0.32)";}}>
      <span style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 0%,rgba(255,255,255,0.2) 0%,transparent 68%)",borderRadius:"inherit",pointerEvents:"none"}}/>
      {children}
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      fontFamily:"'Jost',sans-serif",fontSize:"0.68rem",letterSpacing:"0.22em",
      textTransform:"uppercase",color:"var(--text-soft)",background:"transparent",
      border:"1px solid rgba(220,100,140,0.28)",borderRadius:"50px",
      padding:"0.38rem 1.2rem",cursor:"pointer",transition:"all 0.2s",marginTop:"0.9rem",flexShrink:0,
    }}
    onMouseEnter={e=>{e.currentTarget.style.background="var(--blush)";e.currentTarget.style.color="var(--text-mid)";}}
    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--text-soft)";}}>
      {children}
    </button>
  );
}

const card = {
  width:"100%", maxWidth:560,
  background:"rgba(255,250,252,0.88)",
  backdropFilter:"blur(16px)",
  borderRadius:"clamp(14px,3vw,24px)",
  boxShadow:"0 8px 40px rgba(200,80,120,0.12), 0 0 0 1px rgba(240,160,185,0.2)",
  padding:"clamp(1.2rem,4vw,2.4rem) clamp(1.1rem,4vw,2.2rem)",
};

/* ══ SCREEN 1 — WELCOME ══ */
function WelcomeScreen({ onNext }) {
  return (
    <div className="screen">
      {/* BUG FIX: added display:block + width:fit-content + mx:auto so
          heartBeat scale() animates from true center, not left edge */}
      <div style={{
        fontSize:"clamp(4rem,18vw,9rem)", lineHeight:1,
        marginBottom:"clamp(0.5rem,2vh,1.1rem)",
        display:"block", width:"fit-content", margin:"0 auto clamp(0.5rem,2vh,1.1rem)",
        animation:"heartBeat 2.2s ease-in-out infinite",
        filter:"drop-shadow(0 4px 18px rgba(220,60,100,0.35))",
      }}>
        ❤️
      </div>
      <p style={{fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:"clamp(0.65rem,1.7vw,0.88rem)",color:"var(--text-soft)",letterSpacing:"0.22em",textTransform:"uppercase",marginBottom:"0.35rem",animation:"riseIn 1.2s ease 0.2s both"}}>
        just for you, my love
      </p>
      <h1 style={{fontFamily:"'Dancing Script',cursive",fontWeight:700,fontSize:"clamp(2.6rem,11vw,5.8rem)",color:"var(--rose-deep)",lineHeight:1.08,textShadow:"0 2px 22px rgba(200,50,90,0.2)",animation:"riseIn 1.2s ease both",marginBottom:"0.1rem"}}>
        My Darling,
      </h1>
      <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:"clamp(0.88rem,2.1vw,1.1rem)",color:"var(--text-soft)",marginBottom:"clamp(0.8rem,2.5vh,1.4rem)",animation:"riseIn 1.2s ease 0.4s both"}}>
        I wrote something for you ♥
      </p>
      <HeartDivider/>
      <PinkBtn onClick={onNext}>Open with Love ❤</PinkBtn>
    </div>
  );
}

/* ══ SCREEN 2 — LETTER ══ */
function LetterScreen({ onNext }) {
  return (
    <div className="screen-top" style={{paddingTop:"clamp(1.2rem,4vh,2.2rem)"}}>
      <div style={card}>
        <div style={{fontFamily:"'Dancing Script',cursive",fontWeight:700,fontSize:"clamp(1.7rem,5.2vw,2.7rem)",color:"var(--rose-deep)",marginBottom:"0.4rem",lineHeight:1.1}}>
          To the one who has my whole heart
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:"0.5rem",color:"var(--rose-soft)",fontSize:"1rem",opacity:0.8,marginBottom:"clamp(0.7rem,2vh,1.1rem)"}}>
          ♥ ♥ ♥
        </div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(0.88rem,2.1vw,1.06rem)",lineHeight:1.92,color:"var(--text-mid)",textAlign:"left"}}>
          <p style={{marginBottom:"1em"}}>
            Dear Nishu,
            Happiest Birthday to you!!!!
            I Love You so muchhhhhh.
            You are the most beautiful girl I've seen, and I'm not being poetic. You mean a lot to me. You are mine, ony mine! I just want to see you happy, always. I want to be reason for your beautiful smile on face everytime. You are to me as what Ironman's arc reactor is to his heart, reason to keep going, reason to be happy. I love you so muchhh. Lot of love and hugs to you 💗
          </p>
        </div>
        <div style={{textAlign:"right",marginTop:"clamp(0.8rem,2.5vh,1.3rem)"}}>
          <span style={{fontFamily:"'Dancing Script',cursive",fontWeight:700,fontSize:"clamp(1.2rem,3.8vw,1.8rem)",color:"var(--rose)"}}>
            Yours, completely ❤ Prathamesh
          </span>
        </div>
      </div>
      <HeartDivider/>
      <PinkBtn onClick={onNext} anim={false}>Continue ♥</PinkBtn>
    </div>
  );
}

/* ══ SCREEN 3 — CLOSING ══ */
function ClosingScreen({ onRestart }) {
  return (
    <div className="screen">
      {/* BUG FIX: same centering fix for closing emoji */}
      <div style={{
        fontSize:"clamp(3rem,14vw,7rem)", lineHeight:1,
        display:"block", width:"fit-content", margin:"0 auto clamp(0.5rem,1.5vh,1rem)",
        animation:"heartBeat 2s ease-in-out infinite",
        filter:"drop-shadow(0 4px 16px rgba(220,60,100,0.3))",
      }}>
        💕
      </div>
      
      <GhostBtn onClick={onRestart}>↩ read again from the start</GhostBtn>
    </div>
  );
}

/* ══ ROOT ══ */
export default function Love() {
  const [screen, setScreen] = useState("welcome");
  const [key, setKey] = useState(0);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef(null);

  // ── Replace "./your-song.mp3" with your actual audio file path ──
  const SONG_SRC = "./chfil.mp3";

  // Start music on first user interaction (welcome button click)
  const startMusic = () => {
    if (!started && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
      setStarted(true);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(m => !m);
    }
  };

  const goTo = s => {
    setScreen(s);
    setKey(k => k + 1);
    if (s === "letter") startMusic();
  };

  return (
    <>
      <style>{FONTS}{CSS}</style>

      {/* ── Audio player ── replace src with your song file ── */}
      <audio ref={audioRef} src={SONG_SRC} loop preload="auto" />

      {/* Floating mute/unmute button — only visible after music starts */}
      {started && (
        <button className="mute-btn" onClick={toggleMute} title={muted ? "Unmute" : "Mute"}>
          {muted ? "🔇" : "🎵"}
        </button>
      )}

      {/* Floating hearts — BUG FIX: animation name set directly via animationName,
          font size via fontSize in style object (no CSS custom properties needed) */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        {HEARTS.map((h,i) => (
          <div key={i} className="float-heart" style={{
            left: h.l,
            fontSize: h.fs,
            animationName: h.kf,
            animationDuration: h.dur,
            animationDelay: h.del,
          }}>
            {HEART_CHARS[i % HEART_CHARS.length]}
          </div>
        ))}
      </div>

      <CornerHearts/>

      <div key={key}>
        {screen==="welcome" && <WelcomeScreen onNext={()=>goTo("letter")}/>}
        {screen==="letter"  && <LetterScreen  onNext={()=>goTo("closing")}/>}
        {screen==="closing" && <ClosingScreen onRestart={()=>goTo("welcome")}/>}
      </div>
    </>
  );
}