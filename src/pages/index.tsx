import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Head from "next/head";
import { type NextPage } from "next";
import CardClass, { type IClass } from "~/components/CardClass";

const Home: NextPage = () => {
  const [classesData, setClassesData] = useState<IClass[]>();

  const { data: session } = useSession();
  const { data: classes } = api.class.getAllClasses.useQuery();

  
  useEffect(() => {
    if (classes !== undefined) {
      // const idClass = classes[0]?.joinClasses.map((item) => item.id) ?? []
      // console.log("ID", idClass);
      const joinClasses = classes[0]?.joinClasses ?? [];
      const myClasses = classes[0]?.classes ?? [];
      const mergedArray = [
        ...joinClasses.map((item) => item.class),
        ...myClasses,
      ];
      // console.log("Merge", mergedArray);
      
      setClassesData(mergedArray);
    }
  }, [classes]);

  // console.log("AllClass => ", classesData);

  if (!session) {
    return null;
  }
  return (
    <>
      <Head>
        <title>Class Connect | {session.user.name}</title>
      </Head>
      <div className="grid grid-cols-4 gap-5">
        {classesData &&
          classesData.sort((a, b) => a.createdAt.getDate() - b.createdAt.getDate()).map((data) => {
            return <CardClass data={data} key={data.id} />;
          })}
      </div>
    </>
  );
};

export default Home;
