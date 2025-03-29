import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (isSignup) {
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.success) {
          await signIn("credentials", { email, password, redirect: false });
          setMessage("Signup successful!");
        } else {
          setMessage("Signup failed.");
        }
      } catch (error) {
        setMessage("Signup error: " + error.message);
      }
    } else {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setMessage("Login failed. Check your credentials.");
      }
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user.name} ({session.user.email})!</p>
        <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <h1>{isSignup ? "Sign Up" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
      </form>
      <p>{message}</p>
      <button onClick={() => setIsSignup(!isSignup)}>
        Switch to {isSignup ? "Login" : "Sign Up"}
      </button>
    </div>
  );
}