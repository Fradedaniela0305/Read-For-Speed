import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function TestPage() {
  const [result, setResult] = useState(null);

  async function testBackendAuth() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error);
      return;
    }

    const token = data.session?.access_token;

    const res = await fetch("http://localhost:3001/api/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    console.log(json);
    setResult(json);
  }

  return (
    <div>
      <button onClick={testBackendAuth}>Test Backend Auth</button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}