import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PopoverProfile from "./PopoverProfile";
import Sidebar from "./Sidebar";
import ModalClass from "./ModalClass";
import { Button } from "./ui/button";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { ModeToggle } from "./ui/ModeToogle";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Logo from "../images/wireless-connection.svg";

const Navbar = () => {
  const { data } = useSession();
  const router = useRouter();

  const { id } = router.query;

  const { data: classes } = api.class.getSingleClass.useQuery({
    id: id as string,
  });

  const [scrolled, setScrolled] = useState(false);
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div className={`${scrolled ? 'shadow-lg border-b border-b-transparent dark:border-b-inherit' : 'border-b'} fixed z-10 flex h-16 w-full items-center justify-between bg-white px-5 dark:bg-background`}>
      <div className="flex items-center gap-1 lg:gap-3">
        {data && <Sidebar />}
        <Link href="/" className="flex items-center text-xl">
          <Image src={Logo as string} alt="logo" width={50} height={50} />
          <span className="hidden lg:block">ClassConnect</span>
        </Link>
        {classes && (
          <div className="flex items-center gap-1 lg:gap-3">
            <ChevronRight size={18} className="hidden lg:block" />
            <Link href={`/c/${classes.id}`}>
              {classes.name}
              <div className="text-sm text-muted-foreground">
                {classes.section}
              </div>
            </Link>
          </div>
        )}
      </div>
      <div className="space-x-20">
        {!data && <Link href="/about">About</Link>}
      </div>
      <div className="flex items-center gap-1 lg:gap-5 ">
        <ModeToggle />
        {data && <ModalClass />}
        <PopoverProfile />
      </div>
    </div>
  );
};

export default Navbar;
