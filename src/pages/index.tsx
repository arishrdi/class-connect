import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Head from "next/head";
import { type NextPage } from "next";
import CardClass, { type IClass } from "~/components/CardClass";
import dynamic from "next/dynamic";

const DynamicCard = dynamic(() => import('../components/CardClass'), {
  loading: () => <div className="w-full h-full bg-secondary">Loading...</div>
})
const Home: NextPage = () => {
  const [classesData, setClassesData] = useState<IClass[]>();

  const { data: session } = useSession();
  const { data: classes } = api.class.getAllClasses.useQuery();

  useEffect(() => {
    if (classes !== undefined) {
      const joinClasses = classes[0]?.joinClasses ?? [];
      const myClasses = classes[0]?.classes ?? [];
      const mergedArray = [
        ...joinClasses.map((item) => item.class),
        ...myClasses,
      ];
      setClassesData(mergedArray);
    }
  }, [classes]);

  if (!session) {
    return null;
  }
  return (
    <>
      <Head>
        <title>Class Connect | {session.user.name}</title>
      </Head>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {classesData &&
          classesData.sort((a, b) => a.createdAt.getDate() - b.createdAt.getDate()).map((data) => {
            return <DynamicCard data={data} key={data.id} />;
          })}
      </div>
    </>
  );
};

export default Home;
