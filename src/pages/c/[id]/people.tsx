import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const Page = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data } = api.joinClass.getPeoples.useQuery({ id });
  const { data: session } = useSession();

  const context = api.useContext();

  const removePeople = api.joinClass.removePeople.useMutation({
    async onSuccess() {
      await context.joinClass.getPeoples.invalidate();
    },
  });

  const removePeopleHandler = (classId: string, userId: string) => {
    removePeople.mutate({ classId, userId });
  };

  const isMyClass: boolean =
    data?.map((item) => item.class.userId).toString() === session?.user.id;

  return (
    <div>
      People: {data?.length}, {isMyClass}
      <div className="flex flex-col space-y-3">
        {data?.map((item) => {
          return (
            <div key={item.id} className="flex items-center gap-5">
              <Image
                alt="profile"
                src={item.user.image as string}
                width={50}
                height={50}
                className="rounded-full"
              />
              <span className="font-bold">{item.user.name}</span>
              {isMyClass && (
                <Button
                  onClick={() => removePeopleHandler(item.classId, item.userId)}
                  size={"sm"}
                >
                  Remove
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
