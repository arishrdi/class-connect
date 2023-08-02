import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { type Class } from "@prisma/client";
import { Input } from "../ui/input";
import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { api } from "~/utils/api";

type ModalDeleteClassProps = {
  data: Class;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ModalDeleteClass: React.FC<ModalDeleteClassProps> = ({
  data,
  open,
  onOpenChange,
}) => {
  const [validName, setValidName] = useState(false);
  const { register, handleSubmit } = useForm<FieldValues>();

  const context = api.useContext();
  const deleteClass = api.class.deleteClass.useMutation({
    async onSuccess() {
      await context.class.invalidate();
      onOpenChange(false);
    },
  });

  const deleteClassHandler: SubmitHandler<Class> = () => {
    deleteClass.mutate({ ...data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure to delete {data.name}?</DialogTitle>
          <DialogDescription>
            Deleting a class also removes the material within it
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(deleteClassHandler)}>
          <Input
            onChange={(e) =>
              setValidName(e.target.value === data.name ? true : false)
            }
            placeholder={`Type "${data.name}" to delete this class`}
            id="name"
            register={register}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!validName}
              variant={validName ? "default" : "disabled"}
              // onClick={deleteClassHandler}
            >
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteClass;
