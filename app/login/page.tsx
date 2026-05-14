"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { BrandLogo, SvgIcon } from "@/components/chat/UI";
import { Mail, Lock, ChevronRight, Globe } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { setStatus, setAuthUser, setSession, setAccountMode } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus("Please fill in all fields.");
      return;
    }

    setLoading(true);
    if (!supabase) {
      setLoading(false);
      setStatus("Database configuration missing. Please check environment variables.");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    if (data.user && data.session) {
      setAuthUser(data.user);
      setAccountMode("registered");
      // Set session logic here - ideally enterRegisteredApp logic should be moved to AppContext too
      setStatus("Logged in successfully!");
      router.push("/app");
    }
  };


  return (
    <div className="authPage">
      <div className="authCard glass">
        <div className="authHeader">
          <BrandLogo />
          <h1>Welcome Back</h1>
          <p>Login to your registered OnChat profile</p>
        </div>

        <form onSubmit={handleLogin} className="authForm">
          <div className="inputGroup">
            <label htmlFor="email">Email Address</label>
            <div className="inputWrapper">
              <Mail className="inputIcon" size={20} />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <div className="inputWrapper">
              <Lock className="inputIcon" size={20} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="authSubmitBtn" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
            <ChevronRight size={20} />
          </button>
        </form>


        <div className="authFooter">
          <p>
            Don't have an account? <Link href="/register">Create one</Link>
          </p>
          <Link href="/" className="backToHome">Back to Landing</Link>
        </div>
      </div>
    </div>
  );
}
