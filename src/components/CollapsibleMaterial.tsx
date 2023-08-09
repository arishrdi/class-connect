import { type Class, type Material } from "@prisma/client";
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { formatDistance, subDays } from "date-fns";
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
import { Input } from "./ui/input";
import TextEditor from "./ui/texteditor";
import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { View } from "lucide-react";
import { Pencil } from "lucide-react";
import { Trash } from "lucide-react";
import Link from "next/link";

interface CollapasibleMaterialProps {
  classData: Class;
  material: Material;
  idUser?: string;
}

const CollapsibleMaterial: React.FC<CollapasibleMaterialProps> = ({
  material,
  idUser,
  classData,
}) => {
  const { data: session } = useSession();
  const isMyClass = idUser === session?.user.id;
  const [open, setOpen] = useState(false);
  const [openModalDelete, setModalDelete] = useState(false);
  const [openModalEdit, setModalEdit] = useState(false);

  return (
    <Collapsible
      open={open}
      // defaultOpen={isMyClass}
      onOpenChange={setOpen}
      className={`rounded-lg ${
        !open ? "hover:bg-primary/5" : "mb-5 hover:shadow-md"
      }`}
    >
      <div
        className={`group flex w-full items-center justify-between rounded-t-lg ${
          open ? "bg-primary/10" : ""
        }`}
      >
        <CollapsibleTrigger className={`w-full`}>
          <div className="flex items-center justify-between p-3">
            <span className="text-lg">{material?.title}</span>{" "}
            <div className="flex items-center gap-3 italic">
              Posted{" "}
              {formatDistance(subDays(new Date(), 0), material.createdAt, {
                addSuffix: true,
              })}
            </div>
          </div>
        </CollapsibleTrigger>
        <PopoverMenu
          label1={isMyClass ? "Edit" : "Copy Link"}
          label2={isMyClass ? "Delete" : ""}
          onAction1={() => setModalEdit(true)}
          onAction2={() => setModalDelete(true)}
        />
        <DeleteMaterial
          id={material.id}
          label={material.title}
          open={openModalDelete}
          onOpenChange={setModalDelete}
        />
        <EditMaterial
          material={material}
          open={openModalEdit}
          onOpenChange={setModalEdit}
        />
      </div>
      <CollapsibleContent className="rounded-lg border">
        <article
          className="prose !max-w-full border-b-2 p-6 prose-p:-my-1 prose-li:-my-2"
          dangerouslySetInnerHTML={{
            __html: material.description as TrustedHTML,
          }}
        ></article>
        <div className="m-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMyClass && (
              <>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="rounded-full"
                  onClick={() => setModalEdit(true)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="rounded-full"
                  onClick={() => setModalDelete(true)}
                >
                  <Trash />
                </Button>
              </>
            )}
          </div>
          <Link href={`/c/${classData.id}/${material.id}/detail`}>
            <Button className="" variant="ghost">
              <View className="mr-1" /> View More
            </Button>
          </Link>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleMaterial;

type MaterialModalProps = {
  id: string;
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DeleteMaterial: React.FC<MaterialModalProps> = ({
  id,
  label,
  open,
  onOpenChange,
}) => {
  const materialContext = api.useContext();

  const deleteMaterial = api.material.deleteMaterial.useMutation({
    async onSettled() {
      await materialContext.material.getAllMaterials.invalidate();
    },
  });

  const deleteMaterialHandle = () => {
    onOpenChange(false);
    deleteMaterial.mutate({ id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure to delete {label}?</DialogTitle>
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
          <Button type="button" onClick={deleteMaterialHandle}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type EditMaterialProps = {
  material: Material;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EditMaterial: React.FC<EditMaterialProps> = ({
  material,
  open,
  onOpenChange,
}) => {
  const { register, handleSubmit } = useForm<FieldValues>();
  // const editMaterialHandle = () => {
  //   onOpenChange(false);
  // };

  const [text, setText] = useState<string | undefined>();

  const materialContext = api.useContext();

  const updateMaterial = api.material.updateMaterial.useMutation({
    async onSettled() {
      onOpenChange(false);
      await materialContext.material.getAllMaterials.invalidate();
    },
  });

  const submitHandler: SubmitHandler<Material> = (data) => {
    updateMaterial.mutate({
      ...data,
      id: material.id,
      description: text,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit on {material.title}</DialogTitle>
          <DialogDescription>Happy Editing</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Input
            id="title"
            register={register}
            label="Title"
            defaultValue={material.title}
          />
          <TextEditor
            label="Description"
            value={material.description as string}
            htmlContent={(html) => setText(html)}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {/* <Button type="submit" onClick={editMaterialHandle}> */}
            <Button type="submit">Edit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
