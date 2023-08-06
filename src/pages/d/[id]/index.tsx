import { formatDistance, subDays } from "date-fns";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/utils/api";

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: materials } = api.material.getAllMaterials.useQuery({ id });
  return (
    <>
      <div className="grid grid-cols-1 gap-5">
        {materials &&
          materials.map((material) => {
            return (
              <Link
                href={`/d/${id}/${material.id}/detail`}
                key={material.id}
                className="hover:shadow-md"
              >
                <Card>
                  <CardHeader className="flex justify-between">
                    <CardTitle>{material.title}</CardTitle>
                    <CardDescription>
                      Posted{" "}
                      {formatDistance(
                        subDays(new Date(), 0),
                        material.createdAt,
                        {
                          addSuffix: true,
                        }
                      )}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
      </div>
    </>
  );
};

export default Page;
