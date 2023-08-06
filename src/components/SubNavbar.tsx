import { type Class, type Material } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

type SubNavbarProps = {
  joinedClass?: Class | null;
  material?: Material | null;
};

const SubNavbar: React.FC<SubNavbarProps> = ({ joinedClass, material }) => {
  return (
    <div className="-mx-5 flex  items-center justify-between border-b px-5">
      <div>
        <Button variant={"tab"}>
          <Link href={"/"}>Materials</Link>
        </Button>
        <Button
          variant={"tab"}
        >
          <Link href={"/"}>People</Link>
        </Button>
      </div>
      <Link href={`/d/${joinedClass?.id as string}`} className="text-lg">
        {joinedClass && <div>{joinedClass?.name}</div>}
      </Link>
    </div>
  );
};

export default SubNavbar;
