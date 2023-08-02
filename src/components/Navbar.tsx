import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import PopoverProfile from "./PopoverProfile";
import Sidebar from "./Sidebar";
import ModalClass from "./ModalClass";
import { Button } from "./ui/button";
import { useRouter } from "next/router";

const Navbar = () => {
  const { data } = useSession();
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between border-b px-5 py-3">
      <div className="flex items-center gap-1">
        {data && <Sidebar />}
        <Link href="/">ClassConnect</Link>
      </div>
      <div className="space-x-20">
        {data ? (
          <>
            <Button variant={router.asPath === '/' ? 'default' : 'ghost'}>
              <Link href="/">My Class</Link>
            </Button>
            <Button variant={router.asPath === '/d' ? 'default' : 'ghost'}>
              <Link href="/d">Enrolled Class</Link>
            </Button>
          </>
        ) : (
          <Link href="/about">About</Link>
        )}
      </div>
      <div className="flex items-center">
        {data && <ModalClass />}
        <PopoverProfile />
      </div>
    </div>
  );
};

export default Navbar;
