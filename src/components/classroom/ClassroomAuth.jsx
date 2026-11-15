import { createContext, useContext, useEffect, useState } from "react";

const Context = createContext(null);
let managerPromise;
// Browser-only initialization keeps storage and OIDC redirects out of SSR.
function getManager() {
  if (!managerPromise) managerPromise = import("oidc-client-ts").then(({ UserManager, WebStorageStateStore }) => new UserManager({
    authority: import.meta.env.VITE_SSOJET_AUTHORITY,
    client_id: import.meta.env.VITE_SSOJET_CLIENT_ID,
    redirect_uri: `${window.location.origin}/auth/callback`,
    response_type: "code",
    scope: "openid profile email",
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    automaticSilentRenew: false,
    loadUserInfo: true,
    // oidc-client-ts generates and verifies state, nonce, and PKCE S256.
  }));
  return managerPromise;
}
let callbackPromise;
export function ClassroomAuth({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    // SSOJet's URL validator accepts localhost; use the same origin for PKCE storage.
    if (window.location.hostname === "127.0.0.1" && window.location.port === "5174") {
      const canonical = new URL(window.location.href);
      canonical.hostname = "localhost";
      window.location.replace(canonical.href);
      return;
    }
    let alive = true;
    let cleanup = () => {};
    getManager().then(async manager => {
      const update = next => { if (alive) setUser(next && !next.expired ? next : null); };
      manager.events.addUserLoaded(update);
      const clear = () => update(null);
      manager.events.addUserUnloaded(clear);
      manager.events.addAccessTokenExpired(clear);
      cleanup = () => {
        manager.events.removeUserLoaded(update);
        manager.events.removeUserUnloaded(clear);
        manager.events.removeAccessTokenExpired(clear);
      };
      if (window.location.pathname === "/auth/callback") {
        callbackPromise ||= manager.signinRedirectCallback();
        await callbackPromise;
        if (alive) window.location.replace("/");
      } else update(await manager.getUser());
    }).catch(() => { if (alive) setError("We couldn't complete sign-in. Check your login settings, then try again."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; cleanup(); };
  }, []);
  async function signIn() {
    setError("");
    try { await (await getManager()).signinRedirect(); }
    catch { setError("Sign-in couldn't start. Please try again."); }
  }
  async function signOut() {
    await (await getManager()).removeUser();
    setUser(null);
  }
  return <Context.Provider value={{ user, loading, error, signIn, signOut }}>{children}</Context.Provider>;
}
export function useClassroomAuth() { return useContext(Context); }
