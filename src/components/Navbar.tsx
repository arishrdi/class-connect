import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import PopoverProfile from "./PopoverProfile";
import Sidebar from "./Sidebar";
import ModalClass from "./ModalClass";
import { Button } from "./ui/button";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const Navbar = () => {
  const { data } = useSession();
  const router = useRouter();

  const { id } = router.query;

  const { data: classes } = api.class.getSingleClass.useQuery({
    id: id as string,
  });

  return (
    <div className="fixed flex w-full items-center justify-between border-b bg-white px-5 py-3">
      <div className="flex items-center gap-1">
        {data && <Sidebar />}
        <Link href="/">ClassConnect</Link>
        {classes && <Link href={'/'}>{classes.name}</Link>}
      </div>
      <div className="space-x-20">
        {data ? (
          <>
            <Button
              variant={router.asPath === "/" ? "tabActive" : "tab"}
              className=""
            >
              <Link href="/">My Class</Link>
            </Button>
            <Button
              variant={router.asPath === "/d" ? "tabActive" : "tab"}
              className="-my-3"
            >
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
