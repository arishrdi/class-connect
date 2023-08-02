import { type Class } from "@prisma/client";
import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { api } from "~/utils/api";

type ModalEditClassProps = {
  data: Class;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ModalEditClass: React.FC<ModalEditClassProps> = ({
  data,
  open,
  onOpenChange,
}) => {
  const context = api.useContext();

  const updateClass = api.class.updateClass.useMutation({
    async onSuccess() {
      onOpenChange(false);
      await context.class.invalidate();
    },
  });
  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      id: data.id,
    },
  });

  const submitHandler: SubmitHandler<Class> = (data) => {
    updateClass.mutate({
      ...data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Input
            id="name"
            label="Class Name"
            register={register}
            defaultValue={data.name}
          />
          <Input
            id="section"
            label="Section"
            register={register}
            defaultValue={data.section as string}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Edit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditClass;
