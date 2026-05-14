"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { BrandLogo, SvgIcon } from "@/components/chat/UI";
import { Mail, Lock, User, ChevronRight, Globe } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { isUsernameValid } from "@/lib/helpers";

export default function RegisterPage() {
  const { setStatus, setAuthUser, setAccountMode } = useApp();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const usernameError = isUsernameValid(username);
    if (usernameError) {
      setStatus(usernameError);
      return;
    }

    if (password !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }

    setLoading(true);
    if (!supabase) {
      setLoading(false);
      setStatus("Database configuration missing.");
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.trim(),
        },
      },
    });
    setLoading(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    if (data.user && !data.session) {
      setStatus("Check your email to confirm your account!");
      return;
    }

    if (data.user && data.session) {
      setAuthUser(data.user);
      setAccountMode("registered");
      setStatus("Account created successfully!");
      router.push("/app");
    }
  };

  return (
    <div className="authPage">
      <div className="authCard glass">
        <div className="authHeader">
          <BrandLogo />
          <h1>Create Account</h1>
          <p>Join the OnChat community today</p>
        </div>

        <form onSubmit={handleRegister} className="authForm">
          <div className="inputGroup">
            <label htmlFor="username">Username</label>
            <div className="inputWrapper">
              <User className="inputIcon" size={20} />
              <input
                id="username"
                type="text"
                placeholder="chat_master"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

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

          <div className="inputGroup">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="inputWrapper">
              <Lock className="inputIcon" size={20} />
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="authSubmitBtn" disabled={loading}>
            {loading ? "Creating Account..." : "Register Now"}
            <ChevronRight size={20} />
          </button>
        </form>

        <div className="authFooter">
          <p>
            Already have an account? <Link href="/login">Log in</Link>
          </p>
          <Link href="/" className="backToHome">Back to Landing</Link>
        </div>
      </div>
    </div>
  );
}
