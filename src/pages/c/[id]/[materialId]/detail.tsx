import { Circle } from "lucide-react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import SubNavbar from "~/components/SubNavbar";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

type CommentType = {
  comment: string;
};

const Page: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, resetField } = useForm<FieldValues>();
  const { id, materialId } = router.query;
  const { data: material } = api.material.getSingleMaterial.useQuery({
    id: materialId as string,
  });
  const { data: classname } = api.class.getSingleClass.useQuery({
    id: id as string,
  });

  const onCommentHandler: SubmitHandler<CommentType> = (data) => {
    console.log(data);
    resetField('comment')
  };

  return (
    <>
      {/* <SubNavbar joinedClass={classname}  material={material} /> */}
      <h1 className="text-6xl">{material?.title}</h1>
      <div className="my-3 flex items-center gap-5 border-b border-primary  text-sm text-muted-foreground">
        <p>{classname?.user.name}</p>
        <span>
          <Circle size={5} />
        </span>
        <p>{material?.createdAt.toDateString()}</p>
      </div>
      <div className="mb-4 border-b">
        {/* <h1>{material?.title}</h1> */}
        <article
          className="prose !max-w-full p-6 prose-p:-my-1 prose-li:-my-2"
          dangerouslySetInnerHTML={{
            __html: material?.description as TrustedHTML,
          }}
        ></article>
      </div>
      <form onSubmit={handleSubmit(onCommentHandler)}>
        <Input
          id="comment"
          register={register}
          placeholder="Type your comment..."
          label="Class Comments"
        />
      </form>
    </>
  );
};

export default Page;
