import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, ArrowUpRight } from "lucide-react";
import { SPECIES_IMAGES } from "@/data/species-images";
import { PLANETS } from "@/data/solar-system";
const TABS = ["Overview", "Conditions", "Possible life"];
export default function PlanetFocusCard({ slug, onClose }) {
  const [tab, setTab] = useState(0);
  const panel = useRef(null);
  const previousFocus = useRef(null);
  const isNine = slug === "nine";
  const isSun = slug === "sun";
  const planet = PLANETS.find(item => item.slug === slug);
  useEffect(() => {
    setTab(0);
    if (!slug) return;
    previousFocus.current = document.activeElement;
    panel.current?.focus({preventScroll:true});
    return () => { if (previousFocus.current?.isConnected) previousFocus.current.focus({preventScroll:true}); };
  }, [slug]);
  if (!isNine && !isSun && !planet) return null;
  const species = planet?.species;
  return <aside ref={panel} tabIndex={-1} aria-label={`${isSun ? "The Sun" : planet?.name || "Your world"} information`} className="planet-inspector" onKeyDown={event=>{if(event.key === "Escape") onClose();}}>
    <div className="planet-inspector-heading"><div><p className="mono-label text-cyan-200/60">{isSun ? "THE STAR AT THE CENTER" : isNine ? "THE NEXT DISCOVERY IS YOURS" : `WORLD ${String(planet.order).padStart(2,"0")} / 08`}</p><h2>{isSun ? "The Sun" : isNine ? "Planet Nine" : planet.name}</h2></div><button onClick={onClose} aria-label="Close planet information"><X size={19}/></button></div>
    {isSun ? <div className="planet-tab-content"><p className="planet-lead">Our nearest star—and the source of Earth’s daylight.</p><dl className="planet-facts"><div><dt>What is it?</dt><dd>A star made of hot plasma, mostly hydrogen and helium.</dd></div><div><dt>Visible surface</dt><dd>About 5,500 °C</dd></div><div><dt>At its core</dt><dd>About 15 million °C</dd></div></dl><h4>What powers its light?</h4><p>Nuclear fusion joins hydrogen into helium in the core, releasing energy that eventually escapes as heat and light.</p><p className="planet-note">The Sun is a star, not a planet. This animation’s burst is a cinematic effect, not our Sun exploding.</p><a className="text-cyan-200 text-xs" href="https://science.nasa.gov/sun/facts/" target="_blank" rel="noreferrer">Explore the Sun with NASA ↗</a></div> : isNine ? <div className="planet-tab-content"><p className="text-xl text-white">Now it’s your turn.</p><p>Create a habitat, choose its conditions, and discover what kind of creature might survive there.</p><p className="planet-note">This is an imaginary world you design, not a confirmed ninth planet.</p><Link to="/design" className="planet-create">Create your world <ArrowUpRight size={16}/></Link></div> : <>
      <div role="tablist" aria-label="Planet topics" className="planet-tabs">{TABS.map((name,i)=><button key={name} role="tab" aria-selected={tab===i} aria-controls={`planet-topic-${planet.slug}`} id={`planet-tab-${i}`} tabIndex={tab===i ? 0 : -1} onClick={()=>setTab(i)} onKeyDown={event=>{if(["ArrowLeft","ArrowRight","Home","End"].includes(event.key)){event.preventDefault();const next=event.key==="Home"?0:event.key==="End"?2:(i+(event.key==="ArrowRight"?1:2))%3;setTab(next);event.currentTarget.parentElement.children[next].focus();}}}>{name}</button>)}</div>
      <div role="tabpanel" id={`planet-topic-${planet.slug}`} aria-labelledby={`planet-tab-${tab}`} className="planet-tab-content" tabIndex={0}>
        {tab===0 && <><p className="planet-lead">{planet.tagline}</p><dl className="planet-facts"><div><dt>Distance from the Sun</dt><dd>{planet.distance}</dd></div><div><dt>Day length</dt><dd>{planet.facts.day}</dd></div><div><dt>Planet type</dt><dd>{planet.kind.split("·")[0]}</dd></div></dl><p className="planet-note">Try Conditions to discover what being here would feel like.</p></>}
        {tab===1 && <><p>Every world sets different rules for survival.</p><dl className="planet-facts">{[["Gravity",planet.facts.gravity],["Temperature",planet.facts.temperature],["Atmosphere",planet.facts.atmosphere],["Surface",planet.facts.surface]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="planet-note">Gravity is the pull toward the ground. One g is Earth’s gravity.</p></>}
        {tab===2 && <><span className="planet-fiction">{planet.slug === "earth" ? "KNOWN LIFE" : "IMAGINED LIFE · NOT A DISCOVERY"}</span><h3>{species.name}</h3><img src={SPECIES_IMAGES[planet.slug]} alt={`${species.name}: ${planet.slug === "earth" ? "human illustration" : "imagined alien organism"}`} className="planet-species-image" loading="lazy" onError={event=>{event.currentTarget.hidden=true;}}/><p>{species.summary}</p><h4>What might it look like?</h4><p>{species.bodyPlan}</p><h4>How might it survive?</h4><ul className="planet-adaptations">{species.adaptations.slice(0,2).map((a,i)=><li key={i}><strong>{a.condition}</strong><span>{a.adaptation}</span></li>)}</ul><p className="planet-note">{planet.slug === "earth" ? "Earth is the only planet currently known to support life." : "We have not discovered life on this planet. This creature is a speculative design to help explore adaptation."}</p></>}
      </div>
    </>}
  </aside>;
}
