import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const materialRouter = createTRPCRouter({
  postMaterial: protectedProcedure
    .input(
      z.object({
        classId: z.string(),
        title: z.string(),
        description: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.material.create({
          data: {
            classId: input.classId,
            title: input.title,
            description: input.description,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getAllMaterials: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.material.findMany({
          where: {
            classId: input.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getSingleMaterial: protectedProcedure
  .input(z.object({id: z.string()})).query(async({ctx, input}) => {
    try {
      return await ctx.prisma.material.findUnique({
        where: {
          id: input.id
        }
      })
    } catch (error) {
      console.log(error);
    }
  }),
  deleteMaterial: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.material.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {}
    }),
  updateMaterial: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.material.update({
          data: {
            title: input.title,
            description: input.description,
          },
          where: {
            id: input.id
          }
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
