import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import Head from "next/head";
import { type NextPage } from "next";
import CardClass from "~/components/CardClass";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const { data: classes } = api.class.getAllClasses.useQuery();

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
            return <CardClass data={data} key={data.id} />;
          })}
      </div>
    </>
  );
};

export default Home;
