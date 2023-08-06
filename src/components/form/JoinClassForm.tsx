import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { api } from "~/utils/api";
import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";
import { type Class } from "@prisma/client";

type JoinClassFormProps = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const JoinClassForm: React.FC<JoinClassFormProps> = ({ setOpenModal }) => {
  const context = api.useContext();
  const { toast } = useToast();
  const joinClass = api.joinClass.joinClassWithCode.useMutation({
    async onSuccess(data) {
      setOpenModal(false);
      await context.class.invalidate();
      toast({
        variant: !data?.status ? "destructive" : "default",
        title: data?.desription,
      });
    },
  });
  const { register, handleSubmit } = useForm<FieldValues>();

  const joinClassHandler: SubmitHandler<Class> = (data) => {
    joinClass.mutate({
      code: data.code,
    });
  };

  return (
    <form onSubmit={handleSubmit(joinClassHandler)}>
      <Input type="text" register={register} id="code" label="Enter code" />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          onClick={() => setOpenModal(false)}
          variant="ghost"
        >
          Cancel
        </Button>
        <Button type="submit">Join</Button>
      </div>
    </form>
  );
};

export default JoinClassForm;
