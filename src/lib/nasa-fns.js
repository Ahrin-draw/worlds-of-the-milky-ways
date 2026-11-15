import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
const cache = new Map();
const topics={mars:"Mars",sun:"Sun",jupiter:"Jupiter"};
const plain=value=>String(value || "").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
export const getNasaImages=createServerFn({method:"GET"})
  .validator(z.object({topic:z.enum(["mars","sun","jupiter"])}))
  .handler(async ({data})=>{
    const previous=cache.get(data.topic);
    if(previous && previous.until>Date.now()) return previous.value;
    const url=new URL("https://images-api.nasa.gov/search");
    url.searchParams.set("title",topics[data.topic]);
    url.searchParams.set("media_type","image");
    url.searchParams.set("page_size","3");
    const response=await fetch(url,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(10000)});
    if(!response.ok) throw new Error("NASA's image library is temporarily unavailable. Please try again.");
    const payload=await response.json();
    const items=(payload.collection?.items || []).slice(0,3).flatMap(item=>{
      const info=item.data?.[0];
      const preview=item.links?.find(link=>link.rel==="preview" && link.render==="image");
      if(!info?.nasa_id || !preview?.href) return [];
      let image;
      try {image=new URL(preview.href);} catch {return [];}
      if(image.hostname!=="images-assets.nasa.gov") return [];
      image.protocol="https:";
      return [{id:String(info.nasa_id).slice(0,150),title:plain(info.title).slice(0,200),description:plain(info.description).slice(0,1800),image:image.href,credit:plain(info.secondary_creator || info.photographer || info.center || "NASA" ).slice(0,300),source:`https://images.nasa.gov/details/${encodeURIComponent(info.nasa_id)}`}];
    });
    if(!items.length) throw new Error("No NASA images are available for this topic right now.");
    const value={items,source:url.href};
    cache.set(data.topic,{until:Date.now()+15*60*1000,value});
    return value;
  });
