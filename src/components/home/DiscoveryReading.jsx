import NasaDiscovery from "@/components/home/NasaDiscovery";
import { PLANETS } from "@/data/solar-system";
import PlanetSphere from "@/components/PlanetSphere";
import { ChevronDown } from "lucide-react";

export default function DiscoveryReading() {
  return <div className="discovery-reading">
    <section className="cosmic-story" aria-labelledby="cosmic-story-title">
      <p className="mono-label text-amber-200/60">KEEP EXPLORING / THE BIGGER PICTURE</p>
      <h2 id="cosmic-story-title">Two beginnings.<br/><span>Billions of years apart.</span></h2>
      <p className="reading-intro">That opening was a cinematic shortcut. Here’s the real story.</p>
      <div className="cosmic-story-grid">
        <article><span className="story-date">13.8 BILLION YEARS AGO</span><h3>The universe begins</h3><p>The Big Bang describes the universe expanding from an extremely hot, dense early state. Space itself expanded—it wasn’t a star exploding into empty space.</p><p>As the universe cooled, atoms formed. Much later, gravity gathered matter into stars and galaxies.</p><a href="https://spaceplace.nasa.gov/big-bang/en/" target="_blank" rel="noreferrer">Explore the Big Bang with NASA ↗</a></article>
        <article><span className="story-date">4.6 BILLION YEARS AGO</span><h3>Our solar system takes shape</h3><p>A cloud of gas and dust collapsed under gravity and flattened into a spinning disk. The Sun formed at the center.</p><p>In the surrounding disk, small pieces joined together and grew into planets. This took millions of years.</p><a href="https://science.nasa.gov/solar-system/solar-system-facts/" target="_blank" rel="noreferrer">Explore solar-system formation with NASA ↗</a></article>
      </div>
    </section>
    <NasaDiscovery />
    <section className="planet-library" aria-labelledby="planet-library-title">
      <div className="reading-heading"><div><p className="mono-label text-cyan-200/60">THE FIELD GUIDE / LOOK A LITTLE CLOSER</p><h2 id="planet-library-title">Every world has a story.</h2></div><p>Choose a planet to read its dossier. Open one at a time, at your own pace.</p></div>
      <div className="planet-library-list">{PLANETS.map(planet=><details key={planet.slug} name="planet-dossier" className="planet-dossier"><summary><PlanetSphere planet={planet} size={38}/><span><strong>{planet.name}</strong><small>{planet.kind}</small></span><ChevronDown size={18}/></summary><div className="planet-dossier-body"><div><h3>The conditions</h3><p>{planet.tagline}</p><dl className="planet-facts">{[["Distance from the Sun",planet.distance],["Gravity",planet.facts.gravity],["Temperature",planet.facts.temperature],["Atmosphere",planet.facts.atmosphere],["Day length",planet.facts.day],["Surface",planet.facts.surface]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div><div><span className="planet-fiction">{planet.slug==="earth"?"KNOWN LIFE":"SPECULATIVE BIOLOGY · FICTIONAL CREATURE"}</span><h3>{planet.species.name}</h3><p>{planet.species.summary}</p><h4>What would it look like?</h4><p>{planet.species.bodyPlan}</p><h4>Adaptations to investigate</h4><ul className="planet-adaptations">{planet.species.adaptations.map((a,i)=><li key={i}><strong>{a.condition}</strong><span>{a.adaptation}</span></li>)}</ul><p className="planet-note">Earth is the only planet where life is currently known to exist. Other species in this guide are imagined examples, not verified organisms.</p></div></div></details>)}</div>
    </section>
  </div>;
}
