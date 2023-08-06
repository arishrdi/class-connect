import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { Menu } from "lucide-react";

const Sidebar = () => {
  const { data: classes } = api.class.getAllClasses.useQuery();
  const { data: joinedClasses } = api.joinClass.getAllJoinedClasses.useQuery();
  const [openSidebar, setOpenSidebar] = useState(false);
  const router = useRouter();
  const handleSidebar = async (id: string) => {
    setOpenSidebar(false);
    await router.push({
      pathname: "/c/[id]",
      query: { id: id },
    });
  };
  return (
    <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
      <SheetTrigger>
        <Button size={"icon"} variant="ghost" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col gap-1">
        <SheetTitle>Teaching</SheetTitle>
        {classes &&
          classes.map((c) => {
            return (
              <Button
                key={c.id}
                onClick={() => void handleSidebar(c.id)}
                variant={router.asPath === `/c/${c.id}` ? "default" : "ghost"}
                className="w-full justify-self-start"
              >
                {c.name}
              </Button>
            );
          })}
        <SheetTitle>Enrolled</SheetTitle>
        {joinedClasses &&
          joinedClasses.map((d) => {
            // return <Button key={d.id}>{d.class.name}</Button>;
            return (
              <Button
                key={d.id}
                onClick={() => void handleSidebar(d.id)}
                variant={
                  router.asPath.includes(`/d/${d.class.id}`) ? "default" : "ghost"
                }
                className="w-full justify-self-start"
              >
                {d.class.name}
              </Button>
            );
          })}
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
