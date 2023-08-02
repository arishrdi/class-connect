import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import { Nunito } from "next/font/google";
import { Toaster } from "~/components/ui/toaster";

const nunito = Nunito({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={nunito.className}>
        <Navbar />
        <div className="px-5">
          <Component {...pageProps} />
        </div>
        <Toaster />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
