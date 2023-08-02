import { type Material } from "@prisma/client";
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

interface CollapasibleMaterialProps {
  material: Material;
}

const CollapsibleMaterial: React.FC<CollapasibleMaterialProps> = ({
  material,
}) => {
  const [open, setOpen] = useState(false);
  const [openModalDelete, setModalDelete] = useState(false);
  const [openModalEdit, setModalEdit] = useState(false);

  return (
    <Collapsible
      open={open}
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
          label1="Edit"
          label2="Delete"
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
          className="prose !max-w-full p-6 prose-p:-my-1 prose-li:-my-2"
          dangerouslySetInnerHTML={{
            __html: material.description as TrustedHTML,
          }}
        ></article>
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
