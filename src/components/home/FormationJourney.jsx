import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, RotateCcw } from "lucide-react";
import SolarSystem3D from "@/components/home/SolarSystem3D";
import SystemExplorerFlat from "@/components/home/SystemExplorerFlat";

const FORMATION_SCREENS = 1.3;
const CHAPTERS = [
  { label:"FROM DUST TO WORLDS", title:<>Small pieces.<br/><span>Endless possibility.</span></>, text:"Our solar system began as a cloud of gas and dust." },
  { label:"GRAVITY GETS TO WORK", title:<>A little pull.<br/><span>A whole new shape.</span></>, text:"Gravity drew the cloud together into a spinning disk." },
  { label:"A STAR. THEN WORLDS.", title:<>Dust becomes<br/><span>something more.</span></>, text:"The Sun formed at the center. Around it, the planets grew." },
];
export default function FormationJourney() {
  const section = useRef(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [fallback, setFallback] = useState(false);
  const handleFallback = useCallback(() => setFallback(true), []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => setReduced(media.matches);
    preference();
    media.addEventListener("change", preference);
    let frame = 0;
    function measure() {
      frame = 0;
      if (!section.current) return;
      const distance = 64 - section.current.getBoundingClientRect().top;
      const next = Math.max(0, Math.min(1, distance / (window.innerHeight * FORMATION_SCREENS)));
      setProgress(next > 0.995 ? 1 : next);
    }
    const request = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", request, {passive:true});
    window.addEventListener("resize", request);
    return () => {cancelAnimationFrame(frame); media.removeEventListener("change", preference); window.removeEventListener("scroll", request); window.removeEventListener("resize", request);};
  }, []);
  const p = reduced || fallback ? 1 : progress;
  const formed = p >= 1;
  const chapter = CHAPTERS[p < 0.32 ? 0 : p < 0.60 ? 1 : 2];
  const textOpacity = Math.max(0, Math.min(1, (0.98-p)/0.16));
  function jump(toSystem) {
    if (!section.current) return;
    const top = window.scrollY + section.current.getBoundingClientRect().top - 64;
    window.scrollTo({top:top+(toSystem ? window.innerHeight*FORMATION_SCREENS : 0),behavior:reduced ? "instant" : "smooth"});
  }
  return <section ref={section} id="explorer" className={`scroll-origin ${reduced || fallback ? "scroll-origin--static" : ""}`} aria-label="Scroll to form and explore the solar system">
    <div className="scroll-origin-stage">
      <div className="origin-scene" aria-hidden={!formed}>
        {fallback ? <div className="pt-32"><SystemExplorerFlat/></div> : <SolarSystem3D onFallback={handleFallback} formationProgress={p} reducedMotion={reduced} cinematic showControls={formed} />}
      </div>
      {!formed && <>
        <div className="scroll-origin-shade" style={{opacity:textOpacity}} />
        <div className="scroll-origin-copy" style={{opacity:textOpacity}} key={chapter.label}>
          <p className="mono-label">{chapter.label}</p>
          <h1>{chapter.title}</h1>
          <p className="scroll-origin-sentence">{chapter.text}</p>
          {p < 0.12 && <p className="scroll-origin-instruction"><ArrowDown size={13}/> Scroll to form the solar system</p>}
        </div>
      </>}
      <button className="origin-replay" onClick={()=>jump(!formed)}>{formed ? <><RotateCcw size={12}/> Replay the beginning</> : "Skip to the planets ↗"}</button>
      <p className="sr-only">Scroll down to watch particles form a cloud, a disk, and the solar system. Scroll up to reverse it. After formation, the solar system remains visible for several screens of scrolling. Select a planet or the Sun to open its information panel. Continue down for the field guide.</p>
    </div>
  </section>;
}
