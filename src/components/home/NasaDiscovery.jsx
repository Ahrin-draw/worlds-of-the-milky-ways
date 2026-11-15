import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNasaImages } from "@/lib/nasa-fns";
export default function NasaDiscovery() {
  const [topic,setTopic]=useState("mars");
  const query=useQuery({queryKey:["nasa-library",topic],queryFn:()=>getNasaImages({data:{topic}}),staleTime:15*60*1000,retry:1});
  return <section className="nasa-discovery" aria-labelledby="nasa-title">
    <p className="mono-label text-cyan-200/60">REAL OBSERVATIONS / NASA IMAGE & VIDEO LIBRARY</p>
    <div className="reading-heading"><div><h2 id="nasa-title">Through NASA’s lens.</h2></div><p>Real images and explanations, fetched from NASA’s public collection. What can you observe?</p></div>
    <div className="nasa-topics" aria-label="Choose a NASA image topic">{[["mars","Mars"],["sun","The Sun"],["jupiter","Jupiter"]].map(([value,label])=><button key={value} onClick={()=>setTopic(value)} aria-pressed={topic===value}>{label}</button>)}</div>
    <div aria-live="polite">
      {query.isPending ? <p className="nasa-status">Loading NASA’s observations…</p> : query.isError ? <div className="nasa-status"><p>NASA’s collection couldn’t load right now.</p><button onClick={()=>query.refetch()}>Try again</button><a href="https://images.nasa.gov/" target="_blank" rel="noreferrer">Explore the NASA library ↗</a></div> : <div className="nasa-image-grid">{query.data.items.map(item=><article key={item.id}><img src={item.image} alt={item.title} loading="lazy"/><div><p className="nasa-credit">Source: NASA Image & Video Library · {item.credit}</p><h3>{item.title}</h3><details><summary>What am I looking at?</summary><p>{item.description}</p></details><a href={item.source} target="_blank" rel="noreferrer">View the NASA record ↗</a></div></article>)}</div>}
    </div>
    <p className="nasa-attribution">Images and metadata are requested from NASA’s open API; they are separate from our imagined alien species. <a href="https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf" target="_blank" rel="noreferrer">Data source & API documentation ↗</a></p>
  </section>;
}
