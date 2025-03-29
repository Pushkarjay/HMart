import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
    </SessionProvider>
  );
}

function AuthWrapper({ children }) {
  const { data: session, status } = useSession(); // This requires the import below
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && router.pathname === "/") {
      router.push("/dashboard");
    }
    if (status === "unauthenticated" && router.pathname === "/dashboard") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;
  return children;
}

// Ensure this import is present at the top
import { useSession } from "next-auth/react";