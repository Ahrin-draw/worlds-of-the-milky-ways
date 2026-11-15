import { createFileRoute, Link } from "@tanstack/react-router";
import { useClassroomAuth } from "@/components/classroom/ClassroomAuth";
export const Route = createFileRoute("/auth/callback")({ component: Callback });
function Callback() {
  const { error } = useClassroomAuth();
  return <main className="flex min-h-screen items-center justify-center bg-[#020408] p-8 text-white"><div className="max-w-md text-center"><h1 className="font-heading text-3xl">{error ? "Sign-in needs another try" : "Opening your learning space…"}</h1><p role="status" className="mt-4 text-white/60">{error || "Completing secure sign-in with SSOJet."}</p><Link to="/classroom" className="mt-6 inline-block text-cyan-300">Return to classroom</Link></div></main>;
}
