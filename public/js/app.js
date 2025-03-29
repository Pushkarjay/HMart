import { SessionProvider, useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && router.pathname === "/") {
      router.push("/dashboard"); // Redirect to dashboard after login
    }
    if (status === "unauthenticated" && router.pathname === "/dashboard") {
      router.push("/"); // Redirect to login if not authenticated
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;
  return children;
}