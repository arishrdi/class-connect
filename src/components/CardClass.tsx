import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import PopoverMenu from "./ui/PopoverMenu";
import ModalEditClass from "./modal/ModalEditClass";
import ModalDeleteClass from "./modal/ModalDeleteClass";
import { type User, type Class } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";

type CardClassProps = {
  data: IClass;
};

export interface IClass extends Class {
  // id: string
  user: User;
}

const CardClass: React.FC<CardClassProps> = ({ data }) => {
  const { data: session } = useSession();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const isMyClass = data.userId === session?.user.id;
  return (
    <Card className="group relative transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Link href={`/c/${data.id}`} className="line-clamp-2">
            {data.name}
          </Link>
          <div className="-mr-4">
            <PopoverMenu
              label1={isMyClass ? "Edit" : ""}
              label2={isMyClass ? "Delete" : "Leave"}
              onAction1={() => setOpenModalEdit(true)}
              onAction2={() => setOpenModalDelete(true)}
            />
            <ModalEditClass
              data={data}
              open={openModalEdit}
              onOpenChange={setOpenModalEdit}
            />
            <ModalDeleteClass
              isMyClass={isMyClass}
              data={data}
              open={openModalDelete}
              onOpenChange={setOpenModalDelete}
            />
          </div>
        </CardTitle>
        <CardDescription>
          <Link href={`/c/${data.id}`} className="line-clamp-2">
            {data.section}
          </Link>
          {!isMyClass && (
            <Link href={`/c/${data.id}`} className="line-clamp-2">
              {data.user.name}
            </Link>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h1>Code: {data.code}</h1>
        {!isMyClass && (
          <Image
            src={data.user.image as string}
            alt="Profile"
            width={100}
            height={100}
            className="absolute bottom-5 right-5 w-20 rounded-full"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CardClass;
