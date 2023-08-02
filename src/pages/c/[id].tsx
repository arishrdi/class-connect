import { type Material } from "@prisma/client";
import { FolderPlus } from "lucide-react";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { type FieldValues, useForm, type SubmitHandler } from "react-hook-form";
import CollapsibleMaterial from "~/components/CollapsibleMaterial";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import TextEditor from "~/components/ui/texteditor";
import { api } from "~/utils/api";

const Page:NextPage = () => {
  const { register, handleSubmit, reset } = useForm<FieldValues>();
  const [text, setText] = useState<string | undefined>();
  const [resetEditor, setResetEditor] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();
  const id = router.query.id as string;

  const { data } = api.class.getSingleClass.useQuery({ id });
  const { data: materials, refetch } = api.material.getAllMaterials.useQuery({
    id,
  });
  const postMaterial = api.material.postMaterial.useMutation({
    async onSuccess() {
      setResetEditor(true);
      reset();
      setOpenModal(false);
      await refetch().then(() => setResetEditor(false));
    },
  });

  const submitHandler: SubmitHandler<Material> = (data) => {
    postMaterial.mutate({
      ...data,
      classId: id,
      description: text,
    });
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{data?.name}</title>
      </Head>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger>
          <Button variant="ghost">
            <FolderPlus size={20} className="mr-2"/>
            New material
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-full">
          <DialogTitle>New Material in {data?.name}</DialogTitle>
          <DialogDescription>{data?.section}</DialogDescription>
          <form onSubmit={handleSubmit(submitHandler)} className="">
            <Input id="title" register={register} label="Title" required />
            <TextEditor
              label="Description"
              htmlContent={(html) => setText(html)}
              clearContent={resetEditor}
              className=""
            />
            <Button type="submit">Create</Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="mt-5 grid grid-cols-1 divide-y">
        {materials &&
          materials.map((material) => {
            return (
              <CollapsibleMaterial key={material.id} material={material} />
            );
          })}
      </div>
    </>
  );
};

export default Page;
