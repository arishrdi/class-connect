import { useSession } from "next-auth/react";

import Head from "next/head";
import React from "react";
import CardJoinedClass from "~/components/CardJoinedClass";
import { api } from "~/utils/api";

const Page = () => {
  const { data: session } = useSession();
  const { data: classes } = api.joinClass.getAllJoinedClasses.useQuery();
  if (!session) {
    return null;
  }
  return (
    <>
      <Head>
        <title>Class Connect | {session.user.name}</title>
      </Head>
      <div className="grid grid-cols-4 gap-5">
        {classes &&
          classes.map((data) => {
            return <CardJoinedClass key={data.id} data={data} />;
          })}
      </div>
    </>
  );
};

export default Page;
