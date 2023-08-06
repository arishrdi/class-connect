import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { randomChar } from "~/utils/randomChar";

export const classRouter = createTRPCRouter({
  postClass: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        section: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.class.create({
          data: {
            name: input.name,
            section: input.section,
            userId: ctx.session.user.id,
            code: randomChar(6),
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  getAllClasses: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.user.findMany({
        where: {
          id: ctx.session.user.id
        },
        include: {
          joinClasses: {
            select: {
              // id: true,
              class: {
                include: {
                  user: true
                }
              }
            }
          },
          classes: {
            include: {
              user: true
            }
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),
  getSingleClass: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.class.findUnique({
          where: {
            id: input.id,
          },
          select: {
            user: {},
            name: true,
            createdAt: true,
            section: true,
            code: true,
            id: true,
            updatedAt: true,
            userId: true,
            // joinClasses: {},
            materials: {}
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  updateClass: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        section: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.class.update({
          data: {
            name: input.name,
            section: input.section,
          },
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  deleteClass: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const theClass = await ctx.prisma.class.findUnique({
          where: {
            id: input.id,
          },
        });
        if (theClass?.name === input.name) {
          return await ctx.prisma.class.delete({
            where: {
              id: input.id,
            },
          });
        }
        throw new Error("Unexpected Error");
      } catch (error) {}
    }),
});
