
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import CreateClassForm from "./form/CreateClassForm";
import JoinClassForm from "./form/JoinClassForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

const ModalClass = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Plus size={19} />
        </Button>
      </DialogTrigger>
      <DialogContent className="!top-40 !translate-y-0">
        <DialogHeader>
          <DialogTitle className="text-center">Create or Join Class</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="create">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="join">Join</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <CreateClassForm setOpenModal={setOpenModal} />
          </TabsContent>
          <TabsContent value="join">
            <JoinClassForm setOpenModal={setOpenModal} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ModalClass;
