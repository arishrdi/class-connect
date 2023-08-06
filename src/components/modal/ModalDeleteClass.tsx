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
import { IClass } from "../CardClass";

type ModalDeleteClassProps = {
  data: IClass;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMyClass: boolean;
};

const ModalDeleteClass: React.FC<ModalDeleteClassProps> = ({
  data,
  open,
  onOpenChange,
  isMyClass,
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

  const leaveClass = api.joinClass.leaveClass.useMutation({
    async onSuccess() {
      await context.class.invalidate();
      onOpenChange(false);
    },
  });

  const deleteClassHandler: SubmitHandler<Class> = () => {
    if (isMyClass) {
      deleteClass.mutate({ ...data });
    } else {
      leaveClass.mutate({id: data.id})
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isMyClass ? "Are you sure to delete: " : "Leave this class: "}
            {data.name}?
          </DialogTitle>
          <DialogDescription>
            Deleting a class also removes the material within it
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(deleteClassHandler)}>
          <Input
            onChange={(e) =>
              setValidName(e.target.value === data.name ? true : false)
            }
            placeholder={`Type "${data.name}" to ${
              isMyClass ? "delete" : "leave"
            } this class`}
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
              {isMyClass ? "Delete" : "Leave"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteClass;
