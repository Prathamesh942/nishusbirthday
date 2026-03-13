import { useState, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Dancing+Script:wght@500;700&family=Jost:wght@300;400&display=swap');`;

const CSS = `
* { margin:0; padding:0; box-sizing:border-box; }
:root {
  --rose:#e8537a;
  --rose-deep:#c03060;
  --rose-soft:#f07898;
  --blush:#fce8ef;
  --blush-mid:#f9d0de;
  --blush-pale:#fef5f8;
  --pink-warm:#f4a0b8;
  --cream:#fffaf9;
  --text-deep:#6b1a35;
  --text-mid:#a0345a;
  --text-soft:#d0708a;
  --heart-1:#f48fb1;
  --heart-2:#e8537a;
  --heart-3:#fce4ec;
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
@keyframes heartFloat {
  0%   { transform:translateY(0) rotate(var(--r)) scale(var(--s)); opacity:0; }
  8%   { opacity:var(--op); }
  88%  { opacity:var(--op); }
  100% { transform:translateY(-105vh) rotate(calc(var(--r) + 60deg)) scale(var(--s)); opacity:0; }
}
@keyframes heartBeat {
  0%,100% { transform:scale(1); }
  14%     { transform:scale(1.22); }
  28%     { transform:scale(1); }
  42%     { transform:scale(1.12); }
  56%     { transform:scale(1); }
}
@keyframes shimmer {
  0%,100% { opacity:0.7; transform:scale(1); }
  50%     { opacity:1;   transform:scale(1.06); }
}
@keyframes pulse {
  0%,100% { box-shadow:0 4px 24px rgba(220,60,100,0.3), 0 0 0 0 rgba(240,120,152,0.4); }
  50%     { box-shadow:0 4px 24px rgba(220,60,100,0.3), 0 0 0 10px rgba(240,120,152,0); }
}
@keyframes memReveal {
  from { opacity:0; transform:translateY(22px) scale(0.97); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}
@keyframes sparkle {
  0%,100% { opacity:0; transform:scale(0) rotate(0deg); }
  50%     { opacity:1; transform:scale(1) rotate(180deg); }
}
.float-heart {
  position:fixed;
  bottom:-60px;
  animation:heartFloat linear infinite;
  pointer-events:none;
  z-index:0;
  font-size:var(--fs);
  --r:0deg; --s:1; --op:0.55;
}
.corner-heart {
  position:fixed;
  pointer-events:none;
  z-index:1;
  opacity:0.18;
  animation:shimmer 4s ease-in-out infinite;
}
`;

/* ── Floating hearts config ── */
const HEARTS = [
  {l:"4%",  fs:"0.9rem", dur:"9s",  del:"0s",   r:"-15deg", s:"0.9", op:"0.5"},
  {l:"11%", fs:"1.4rem", dur:"13s", del:"1.2s",  r:"10deg",  s:"1.1", op:"0.45"},
  {l:"19%", fs:"0.7rem", dur:"8s",  del:"2.8s",  r:"-8deg",  s:"0.8", op:"0.55"},
  {l:"27%", fs:"1.1rem", dur:"11s", del:"0.4s",  r:"20deg",  s:"1",   op:"0.5"},
  {l:"35%", fs:"1.6rem", dur:"15s", del:"3.5s",  r:"-12deg", s:"1.2", op:"0.38"},
  {l:"43%", fs:"0.8rem", dur:"7s",  del:"1.8s",  r:"5deg",   s:"0.9", op:"0.6"},
  {l:"51%", fs:"1.2rem", dur:"12s", del:"0.8s",  r:"-20deg", s:"1",   op:"0.48"},
  {l:"59%", fs:"0.6rem", dur:"10s", del:"4.1s",  r:"15deg",  s:"0.7", op:"0.55"},
  {l:"67%", fs:"1.5rem", dur:"14s", del:"2.2s",  r:"-5deg",  s:"1.1", op:"0.4"},
  {l:"74%", fs:"0.9rem", dur:"9s",  del:"0.6s",  r:"25deg",  s:"0.9", op:"0.5"},
  {l:"82%", fs:"1.3rem", dur:"11s", del:"3s",    r:"-18deg", s:"1",   op:"0.46"},
  {l:"89%", fs:"0.7rem", dur:"8s",  del:"1.5s",  r:"8deg",   s:"0.8", op:"0.55"},
  {l:"95%", fs:"1.1rem", dur:"13s", del:"5s",    r:"-10deg", s:"1",   op:"0.42"},
  {l:"22%", fs:"1.8rem", dur:"17s", del:"6s",    r:"12deg",  s:"1.3", op:"0.3"},
  {l:"63%", fs:"0.5rem", dur:"6s",  del:"2.5s",  r:"-22deg", s:"0.7", op:"0.6"},
  {l:"47%", fs:"2rem",   dur:"18s", del:"7s",    r:"18deg",  s:"1.4", op:"0.25"},
];

const HEART_CHARS = ["♥","❤","💕","💗","💓","💝","♡"];

/* ── Corner heart SVGs ── */
function CornerHearts() {
  const positions = [
    {style:{top:0,left:0},size:"clamp(90px,18vw,200px)"},
    {style:{top:0,right:0,transform:"scaleX(-1)"},size:"clamp(90px,18vw,200px)"},
    {style:{bottom:0,left:0,transform:"scaleY(-1)"},size:"clamp(80px,14vw,160px)"},
    {style:{bottom:0,right:0,transform:"scale(-1,-1)"},size:"clamp(80px,14vw,160px)"},
  ];
  return (
    <>
      {positions.map((p,i) => (
        <div key={i} className="corner-heart" style={{...p.style,width:p.size,height:p.size,animationDelay:`${i*0.9}s`}}>
          <svg viewBox="0 0 200 200" fill="none" style={{width:"100%",height:"100%"}}>
            {/* cluster of hearts */}
            <path d="M60 80 C60 60,40 50,30 60 C20 70,20 90,40 105 L60 120 L80 105 C100 90,100 70,90 60 C80 50,60 60,60 80Z" fill="#f48fb1" opacity="0.6"/>
            <path d="M110 50 C110 36,96 28,88 36 C80 44,80 60,96 72 L110 82 L124 72 C140 60,140 44,132 36 C124 28,110 36,110 50Z" fill="#e8537a" opacity="0.5"/>
            <path d="M35 140 C35 130,26 124,20 130 C14 136,14 148,24 156 L35 164 L46 156 C56 148,56 136,50 130 C44 124,35 130,35 140Z" fill="#f9a8c4" opacity="0.55"/>
            <path d="M155 110 C155 98,144 92,137 98 C130 104,130 118,140 126 L155 136 L170 126 C180 118,180 104,173 98 C166 92,155 98,155 110Z" fill="#e8537a" opacity="0.4"/>
            <path d="M80 30 C80 23,73 19,69 23 C65 27,65 35,71 41 L80 48 L89 41 C95 35,95 27,91 23 C87 19,80 23,80 30Z" fill="#f48fb1" opacity="0.45"/>
            {/* sparkle dots */}
            <circle cx="130" cy="40" r="3" fill="#f48fb1" opacity="0.5"/>
            <circle cx="20"  cy="100" r="2" fill="#e8537a" opacity="0.45"/>
            <circle cx="170" cy="70"  r="2.5" fill="#f9a8c4" opacity="0.5"/>
            <circle cx="50"  cy="165" r="2" fill="#f48fb1" opacity="0.4"/>
          </svg>
        </div>
      ))}
    </>
  );
}

/* ── Shared components ── */
function HeartDivider({ label }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"0.6rem",margin:"clamp(0.6rem,2vh,1.3rem) auto",color:"var(--rose-soft)",fontSize:"1rem",justifyContent:"center",opacity:0.8}}>
      ♥
      {label && <span style={{fontSize:"clamp(0.65rem,1.4vw,0.82rem)",fontFamily:"'Jost',sans-serif",fontWeight:300,color:"var(--text-soft)",letterSpacing:"0.12em",textTransform:"uppercase"}}>{label}</span>}
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

/* ══════════════════════════════════════════
   SCREEN 1 — WELCOME / LOCK
══════════════════════════════════════════ */
function WelcomeScreen({ onNext }) {
  const [beating, setBeating] = useState(false);
  useEffect(() => {
    const t = setInterval(() => { setBeating(true); setTimeout(()=>setBeating(false),600); }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="screen">
      {/* big pulsing heart */}
      <div style={{
        fontSize:"clamp(4rem,18vw,9rem)",
        lineHeight:1,
        marginBottom:"clamp(0.6rem,2vh,1.2rem)",
        animation:"heartBeat 2.2s ease-in-out infinite",
        filter:"drop-shadow(0 4px 18px rgba(220,60,100,0.35))",
        position:"relative", zIndex:1,
      }}>❤️</div>

      <p style={{fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:"clamp(0.7rem,1.8vw,0.9rem)",color:"var(--text-soft)",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"0.4rem",animation:"riseIn 1.2s ease 0.2s both"}}>
        just for you, my love
      </p>
      <h1 style={{fontFamily:"'Dancing Script',cursive",fontWeight:700,fontSize:"clamp(2.6rem,11vw,5.8rem)",color:"var(--rose-deep)",lineHeight:1.08,textShadow:"0 2px 22px rgba(200,50,90,0.2)",animation:"riseIn 1.2s ease both",marginBottom:"0.1rem"}}>
        My Darling,
      </h1>
      <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:"clamp(0.9rem,2.2vw,1.15rem)",color:"var(--text-soft)",marginBottom:"clamp(0.8rem,2.5vh,1.4rem)",animation:"riseIn 1.2s ease 0.4s both"}}>
        I wrote something for you ♥
      </p>
      <HeartDivider/>
      <PinkBtn onClick={onNext}>Open with Love ❤</PinkBtn>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN 2 — LONG LOVE LETTER
══════════════════════════════════════════ */
function LetterScreen({ onNext }) {
  return (
    <div className="screen-top" style={{paddingTop:"clamp(1.2rem,4vh,2.2rem)"}}>
      <div style={card}>
        {/* header */}
        <div style={{fontFamily:"'Dancing Script',cursive",fontWeight:700,fontSize:"clamp(1.8rem,5.5vw,2.8rem)",color:"var(--rose-deep)",marginBottom:"0.5rem",lineHeight:1.1}}>
          To the one who has my whole heart
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:"0.4rem",color:"var(--rose-soft)",fontSize:"1rem",opacity:0.8,marginBottom:"clamp(0.8rem,2vh,1.2rem)"}}>
          ♥ ♥ ♥
        </div>

        {/* letter body */}
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(0.88rem,2.1vw,1.06rem)",lineHeight:1.92,color:"var(--text-mid)",textAlign:"left"}}>
          <p style={{marginBottom:"1em"}}>
            Dear Nishu,
            Happiest Birthday to you!!!!
            I Love You so muchhhhhh.
            You are the most beautiful girl I've seen, and I'm not being poetic. You mean a lot to me. You are mine, ony mine! I just want to see you happy, always. I want to be reason for your beautiful smile on face everytime. You are to me as what Ironman's arc reactor is to his heart, reason to keep going, reason to be happy. I love you so muchhh. Lot of love and hugs to you 💗
          </p>
        </div>

        <div style={{textAlign:"right",marginTop:"clamp(0.8rem,2.5vh,1.4rem)"}}>
          <span style={{fontFamily:"'Dancing Script',cursive",fontWeight:700,fontSize:"clamp(1.3rem,4vw,1.9rem)",color:"var(--rose)",display:"block"}}>
            Yours, completely ❤ Prathamesh
          </span>
        </div>
      </div>

      <HeartDivider label="our favourite moments"/>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN 3 — MEMORIES
══════════════════════════════════════════ */
const MEMORIES = [
  {
    label:"Memory One", emoji:"🌅",
    title:"The first time I knew",
    text:`It was such a small moment. You were telling me about something that made you happy — your eyes lit up mid-sentence and you grabbed my arm without thinking. I remember feeling like the whole world had just gone still. That was the moment I knew I was in serious, serious trouble with you.`,
  },
  {
    label:"Memory Two", emoji:"🌧️",
    title:"The rainy night",
    text:`We got caught in that sudden downpour on the walk back and instead of running you just... stopped. Tilted your face up to the rain and laughed. I stood there completely soaked watching you and thought: I never want to be anywhere else. I want to be right here, in every storm, watching you laugh.`,
  },
  {
    label:"Memory Three", emoji:"🍕",
    title:"Nothing nights",
    text:`The nights where we do absolutely nothing — takeout boxes, terrible reality TV, you stealing all the blanket — are somehow my favourite nights. No plans, no pressure. Just you and me and the embarrassing amount of comfort I feel just knowing you're there beside me.`,
  },
  {
    label:"Memory Four", emoji:"✨",
    title:"When you held my hand",
    text:`You reached over and held my hand without saying a word. No reason. Just because. I don't think you noticed how much that mattered. I think about it more than I should. Those small, unprompted gestures of yours — they undo me completely every single time.`,
  },
];

const MEM_LABELS = [
  "♥ reveal first memory ♥",
  "♥ next memory ♥",
  "♥ one more ♥",
  "♥ last one ♥",
];

function MemCard({ mem, visible }) {
  return (
    <div style={{
      width:"100%",
      background:"rgba(255,248,251,0.9)",
      borderRadius:"clamp(12px,2.5vw,20px)",
      boxShadow:"0 4px 28px rgba(200,80,120,0.1), 0 0 0 1px rgba(240,160,185,0.18)",
      padding:"clamp(0.9rem,2.5vw,1.6rem) clamp(0.9rem,2.5vw,1.8rem)",
      marginBottom:"clamp(0.5rem,1.5vh,0.85rem)",
      textAlign:"left", position:"relative", overflow:"hidden",
      animation: visible ? "memReveal 0.6s cubic-bezier(0.22,1,0.36,1) both" : "none",
      opacity: visible ? 1 : 0,
    }}>
      {/* left accent bar */}
      <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:"linear-gradient(180deg,var(--rose-soft),var(--blush-mid))",borderRadius:"3px 0 0 3px"}}/>
      {/* label row */}
      <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.3rem"}}>
        <span style={{fontSize:"0.65rem",fontFamily:"'Jost',sans-serif",fontWeight:300,color:"var(--text-soft)",letterSpacing:"0.18em",textTransform:"uppercase"}}>{mem.label}</span>
        <span style={{fontSize:"0.9rem",opacity:0.6}}>{mem.emoji}</span>
      </div>
      {/* title */}
      <div style={{fontFamily:"'Dancing Script',cursive",fontWeight:500,fontSize:"clamp(1.1rem,3vw,1.4rem)",color:"var(--rose-deep)",marginBottom:"0.35rem",lineHeight:1.2}}>
        {mem.title}
      </div>
      {/* body */}
      <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:"clamp(0.85rem,2vw,1rem)",color:"var(--text-mid)",lineHeight:1.8}}>
        {mem.text}
      </p>
      {/* faint watermark heart */}
      <div style={{position:"absolute",bottom:"-0.5rem",right:"0.8rem",fontSize:"3.5rem",opacity:0.04,lineHeight:1,pointerEvents:"none",color:"var(--rose)"}}>♥</div>
    </div>
  );
}

function MemoriesScreen({ onNext }) {
  const [revealed, setRevealed] = useState(0);
  const done = revealed >= MEMORIES.length;

  return (
    <div className="screen-top" style={{paddingTop:"clamp(1.2rem,4vh,2rem)"}}>
      <h2 style={{fontFamily:"'Dancing Script',cursive",fontWeight:700,fontSize:"clamp(2rem,7.5vw,3.4rem)",color:"var(--rose-deep)",marginBottom:"0.1rem",lineHeight:1.1}}>
        Us, in moments
      </h2>
      <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:"clamp(0.75rem,1.7vw,0.9rem)",color:"var(--text-soft)",marginBottom:"clamp(0.8rem,2.5vh,1.4rem)",letterSpacing:"0.04em"}}>
        little pieces of us I never want to forget
      </p>

      <div style={{width:"100%",maxWidth:560}}>
        {MEMORIES.map((m,i) => <MemCard key={i} mem={m} visible={i < revealed}/>)}

        <div style={{display:"flex",justifyContent:"center",marginTop:"0.5rem"}}>
          {!done
            ? <button
                onClick={()=>setRevealed(r=>r+1)}
                style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:"clamp(0.82rem,1.9vw,0.95rem)",color:"var(--rose-deep)",background:"rgba(255,248,251,0.85)",border:"1px solid rgba(220,100,140,0.35)",borderRadius:50,padding:"0.48rem 1.7rem",cursor:"pointer",transition:"all 0.22s",boxShadow:"0 2px 14px rgba(200,80,120,0.1)"}}
                onMouseEnter={e=>{e.currentTarget.style.background="var(--blush)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,248,251,0.85)";e.currentTarget.style.transform="none";}}>
                {MEM_LABELS[revealed] || "♥ one more ♥"}
              </button>
            : <div style={{animation:"riseIn 0.6s ease both",textAlign:"center",marginTop:"0.3rem"}}>
                <div style={{fontFamily:"'Dancing Script',cursive",fontSize:"clamp(1.1rem,3.5vw,1.5rem)",color:"var(--rose)",marginBottom:"0.8rem",opacity:0.9}}>
                  and there are so many more to come ♥
                </div>
                <PinkBtn onClick={onNext} anim={false}>I love you ❤</PinkBtn>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN 4 — CLOSING
══════════════════════════════════════════ */
function ClosingScreen({ onRestart }) {
  return (
    <div className="screen">
      <div style={{fontSize:"clamp(3rem,14vw,7rem)",lineHeight:1,marginBottom:"clamp(0.5rem,1.5vh,1rem)",animation:"heartBeat 2s ease-in-out infinite",filter:"drop-shadow(0 4px 16px rgba(220,60,100,0.3))"}}>
        💕
      </div>
      <div style={{...card, position:"relative", overflow:"hidden", textAlign:"center"}}>
        {/* watermark */}
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(8rem,25vw,14rem)",opacity:0.03,pointerEvents:"none",color:"var(--rose)",lineHeight:1}}>♥</div>

        <div style={{fontFamily:"'Dancing Script',cursive",fontWeight:700,fontSize:"clamp(1.9rem,6vw,2.8rem)",color:"var(--rose-deep)",marginBottom:"0.7rem",position:"relative"}}>
          Always & forever
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:"0.5rem",color:"var(--rose-soft)",fontSize:"1.1rem",marginBottom:"clamp(0.8rem,2vh,1.2rem)",opacity:0.8}}>♥ ♥ ♥</div>
        <p style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(0.88rem,2.1vw,1.06rem)",lineHeight:1.88,color:"var(--text-mid)",position:"relative"}}>
          Thank you for being exactly who you are.<br/>
          Thank you for choosing me, every day.<br/>
          I promise to love you loudly on the good days<br/>
          and <em style={{color:"var(--rose-deep)"}}>quietly, deeply</em> on all the rest.<br/><br/>
          You are my favourite person on this entire earth.<br/>
          Don't ever forget that.
        </p>
        <span style={{fontFamily:"'Dancing Script',cursive",fontWeight:700,fontSize:"clamp(1.2rem,3.8vw,1.7rem)",color:"var(--rose)",display:"block",marginTop:"clamp(0.8rem,2vh,1.2rem)",position:"relative"}}>
          With everything I have ❤
        </span>
      </div>
      <GhostBtn onClick={onRestart}>↩ read again from the start</GhostBtn>
    </div>
  );
}

/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
export default function Love() {
  const [screen, setScreen] = useState("welcome");
  const [key, setKey]       = useState(0);
  const goTo = s => { setScreen(s); setKey(k=>k+1); };

  return (
    <>
      <style>{FONTS}{CSS}</style>

      {/* Floating hearts from bottom */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        {HEARTS.map((h,i) => (
          <div key={i} className="float-heart" style={{
            left:h.l,
            "--fs":h.fs, "--r":h.r, "--s":h.s, "--op":h.op,
            animationDuration:h.dur,
            animationDelay:h.del,
          }}>
            {HEART_CHARS[i % HEART_CHARS.length]}
          </div>
        ))}
      </div>

      {/* Corner clusters */}
      <CornerHearts/>

      {/* Screens */}
      <div key={key}>
        {screen==="welcome"  && <WelcomeScreen onNext={()=>goTo("letter")}/>}
        {screen==="letter"   && <LetterScreen  onNext={()=>goTo("memories")}/>}
        {screen==="memories" && <MemoriesScreen onNext={()=>goTo("closing")}/>}
        {screen==="closing"  && <ClosingScreen  onRestart={()=>goTo("welcome")}/>}
      </div>
    </>
  );
}
