import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { type FieldValues, useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import { type Class } from "@prisma/client";

type CreateClassFormProps = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateClassForm: React.FC<CreateClassFormProps> = ({ setOpenModal }) => {
  const { register, handleSubmit } = useForm<FieldValues>();

  const context = api.useContext();

  const postClass = api.class.postClass.useMutation({
    async onSuccess() {
      setOpenModal(false);
      await context.class.invalidate();
      // await refetch();
      // reset();
      // setOpenModal(false);
    },
  });

  const submitHandler: SubmitHandler<Class> = (data) => {
    postClass.mutate({
      ...data,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Input id="name" label="Class Name" register={register} />
      <Input id="section" label="Section" register={register} />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          onClick={() => setOpenModal(false)}
          variant="ghost"
        >
          Cancel
        </Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
};

export default CreateClassForm;
