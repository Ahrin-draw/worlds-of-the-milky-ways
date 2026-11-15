import { ArrowRight, Orbit, ShieldCheck } from "lucide-react";
import { useClassroomAuth } from "@/components/classroom/ClassroomAuth";

// Entry sign-in for this public educational experience. Private records must
// additionally enforce authentication and authorization on the server.
export default function WelcomeGate({children}) {
  const {user,loading,error,signIn}=useClassroomAuth();
  if(user) return children;
  return <main className="welcome-gate">
    <div className="welcome-orbit" aria-hidden="true"><i/><i/><i/><span/></div>
    <div className="welcome-content">
      <p className="mono-label text-cyan-200/70">WORLDS OF THE MILKY WAY</p>
      <h1>A universe of<br/><span>possibilities.</span></h1>
      <p>Explore real planets. Imagine extraordinary life. Then create a world of your own.</p>
      <button onClick={signIn} disabled={loading} className="welcome-signin">{loading ? "Checking your session…" : "Sign in to explore"}<ArrowRight size={18}/></button>
      {error && <p role="alert" className="welcome-error">{error}</p>}
      <div className="welcome-secure"><ShieldCheck size={14}/><span>Secure sign-in with SSOJet</span></div>
      <div className="welcome-preview"><Orbit size={17}/><span>Eight planets. One star. Your next discovery.</span></div>
    </div>
  </main>;
}
