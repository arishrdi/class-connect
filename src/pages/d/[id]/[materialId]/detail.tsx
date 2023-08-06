import { Circle } from "lucide-react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import SubNavbar from "~/components/SubNavbar";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

const Page: NextPage = () => {
  const router = useRouter();
  const { id, materialId } = router.query;
  const { data: material } = api.material.getSingleMaterial.useQuery({
    id: materialId as string,
  });
  const { data: classname } = api.class.getSingleClass.useQuery({
    id: id as string,
  });
  return (
    <>
    <SubNavbar joinedClass={classname}  material={material} />
      <h1 className="text-6xl">{material?.title}</h1>
      <div className="my-3 flex items-center gap-5 border-b border-primary  text-sm text-muted-foreground">
        <p>{classname?.user.name}</p>
        <span>
          <Circle size={5} />
        </span>
        <p>{material?.createdAt.toDateString()}</p>
      </div>
      <div className="border-b">
        {/* <h1>{material?.title}</h1> */}
        <article
          className="prose !max-w-full p-6 prose-p:-my-1 prose-li:-my-2"
          dangerouslySetInnerHTML={{
            __html: material?.description as TrustedHTML,
          }}
        ></article>
      </div>
      {/* <Input id="comment" placeholder="" /> */}
    </>
  );
};

export default Page;
