'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/admin",
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials.");
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-teal-400 text-center">Admin Portal</p>
        <h1 className="mt-2 mb-6 text-center text-3xl font-semibold">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-zinc-400">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="block text-sm text-zinc-400">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
              placeholder="********"
              required
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-teal-500 py-3 text-sm font-semibold text-black transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
