import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { type User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import PopoverMenu from "./ui/PopoverMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { api } from "~/utils/api";

type CardJoinedClassProps = {
  data: {
    id: string;
    class: {
      user: User;
      id: string;
      name: string;
      section: string | null;
      code: string;
    };
    user: User;
  };
};

const CardJoinedClass: React.FC<CardJoinedClassProps> = ({ data }) => {
  const [openModal, setOpenModal] = useState(false)
  return (
    <Card className="group relative transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Link href={`/d/${data.class.id}`}>{data.class.name}</Link>
          <div className="-mr-4">
            <PopoverMenu label1="Leave" onAction1={() => setOpenModal(true)} />
            <LeaveClassModal id={data.id} label={data.class.name} open={openModal} onOpenChange={setOpenModal} />
          </div>
        </CardTitle>
        <CardDescription>{data.class.section}</CardDescription>
        <CardDescription>{data.class.user.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <h1>Code: {data.class.code}</h1>
        <Image
          src={data.class.user.image as string}
          alt="Profile"
          width={100}
          height={100}
          className="absolute bottom-5 right-5 w-20 rounded-full"
        />
      </CardContent>
    </Card>
  );
};

export default CardJoinedClass;

type LeaveClassModalProps = {
  id: string;
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const LeaveClassModal: React.FC<LeaveClassModalProps> = ({
  id,
  label,
  open,
  onOpenChange,
}) => {
  const context = api.useContext()
  const leaveClass = api.joinClass.leaveClass.useMutation({
    async onSuccess() {
      await context.joinClass.invalidate()
    },
  });
  const leaveClassHandler = () => {
    leaveClass.mutate({id})
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave this class: {label}?</DialogTitle>
          <DialogDescription>This action cannot be undo</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={leaveClassHandler}>
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
