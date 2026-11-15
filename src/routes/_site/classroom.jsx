import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Orbit, ShieldCheck } from "lucide-react";
import { useClassroomAuth } from "@/components/classroom/ClassroomAuth";
export const Route = createFileRoute("/_site/classroom")({
  head: () => ({ meta: [{ title: "Classroom — Worlds of the Milky Way" }] }),
  component: Classroom,
});
function Classroom() {
  const { user, loading, error, signIn, signOut } = useClassroomAuth();
  return <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
    <p className="mono-label text-cyan-300">THE OBSERVATORY · LEARNING SPACE</p>
    <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
      <div><h1 className="font-heading text-4xl font-medium leading-tight sm:text-6xl">Big questions.<br/><span className="text-cyan-300">Other worlds.</span></h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">How would life change under a heavier sky? Explore planetary science, test your predictions, and explain the adaptations that help an organism survive.</p>
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"><BookOpen className="mt-1 shrink-0 text-cyan-300"/><p className="text-sm leading-relaxed text-white/65">Earth is the only world known to support life. Our alien organisms are speculative designs, not discoveries. Use evidence to decide which traits make sense.</p></div>
      </div>
      <div className="glass rounded-3xl border border-cyan-300/20 p-8">
        <ShieldCheck className="h-9 w-9 text-cyan-300"/>
        <h2 className="mt-5 font-heading text-2xl">{user ? `Welcome, ${user.profile.given_name || user.profile.name || "explorer"}` : "Your classroom starts here"}</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/55">{user ? "You're signed in with SSOJet. Explore a world or begin designing one of your own." : "Sign in securely through SSOJet to enter your learning space."}</p>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
        {!user ? <button onClick={signIn} disabled={loading} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">{loading ? "Checking sign-in…" : "Sign in with SSOJet"}<ArrowRight size={18}/></button> : <><Link to="/design" className="mt-7 flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 font-semibold text-slate-950">Open the planet lab <Orbit size={18}/></Link><button onClick={signOut} className="mt-4 w-full text-sm text-white/60 hover:text-white">Sign out of this website</button></>}
        <p className="mt-5 text-xs leading-relaxed text-white/40">Class assignments, submissions, and teacher access are being added. This preview does not yet store classroom records.</p>
      </div>
    </div>
    <div className="mt-14 grid gap-4 sm:grid-cols-3">{[["01", "Observe", "Compare gravity, temperature, water, and atmosphere."],["02", "Predict", "Explain what a living organism would need in that environment."],["03", "Investigate", "Design a world and challenge its organism's adaptations."]].map(([n,title,body])=><div key={n} className="rounded-2xl border border-white/10 p-6"><p className="mono-label text-cyan-300/60">{n}</p><h2 className="mt-3 font-heading text-xl">{title}</h2><p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p></div>)}</div>
  </section>;
}
