import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { GraduationCap, Menu, Users } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { type Class } from "@prisma/client";
import Image from "next/image";
import Logo from "../images/wireless-connection.svg";
import { Minus } from "lucide-react";

const Sidebar = () => {
  const { data: classes } = api.class.getAllClasses.useQuery();
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
      <SheetTrigger>
        <Button size={"icon"} variant="ghost" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-scroll pt-0">
        <div className="z-10 flex items-center border-b sticky top-0 bg-white dark:bg-background !-mt-8">
          <Image src={Logo as string} alt="logo" width={80} height={80} />
          <h1 className="text-xl font-bold">ClassConnect</h1>
        </div>
        <Accordion type="multiple" className="mt-10 w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold text-foreground">
              <div className="flex gap-5">
                <Users />
                Teaching
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {classes &&
                classes.map((c) => {
                  return c.classes.map((item) => {
                    return (
                      <ButtonSidebar
                        key={item.id}
                        item={item}
                        setOpenSidebar={setOpenSidebar}
                      />
                    );
                  });
                })}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold text-foreground">
              <div className="flex gap-5">
                <GraduationCap />
                Enrolled
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {classes &&
                classes.map((c) => {
                  return c.joinClasses.map((item) => {
                    return (
                      <ButtonSidebar
                        key={item.class.id}
                        item={item.class}
                        setOpenSidebar={setOpenSidebar}
                      />
                    );
                  });
                })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;

type ButtonSidebarProps = {
  item: Class;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const ButtonSidebar: React.FC<ButtonSidebarProps> = ({
  item,
  setOpenSidebar,
}) => {
  const router = useRouter();
  const handleSidebar = async (id: string) => {
    setOpenSidebar(false);
    await router.push({
      pathname: "/c/[id]",
      query: { id: id },
    });
  };

  const activeClass = (id: string) => router.asPath === `/c/${id}`;

  return (
    <Button
      onClick={() => void handleSidebar(item.id)}
      variant={"ghost"}
      className={`w-full justify-start ${
        activeClass(item.id) ? "bg-muted" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <Minus size={15} />
        {item.name}
      </div>
    </Button>
  );
};
