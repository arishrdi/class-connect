import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import { Nunito } from "next/font/google";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/ui/theme-provider";

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
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <main className={nunito.className}>
          <Navbar />
          <div className="px-5 pt-20">
            <Component {...pageProps} />
          </div>
          <Toaster />
        </main>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
