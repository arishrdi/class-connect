import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type MessageType = {
  desription: string;
  status: boolean;
};

export const joinClassRouter = createTRPCRouter({
  joinClassWithCode: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const classIsExist = await ctx.prisma.class.findUnique({
          where: {
            code: input.code,
          },
        });

        const alreadyJoin = await ctx.prisma.joinClass.findMany({
          where: {
            userId: ctx.session.user.id,
            classId: classIsExist?.id,
          },
        });

        // you can join a class if
        // 1. class has been created
        // 2. you've never joined this class
        // 3. this is not your own class

        let message: MessageType = {
          desription: "Unknown Error",
          status: false,
        };

        if (
          classIsExist &&
          alreadyJoin.length <= 0 &&
          classIsExist.userId !== ctx.session.user.id
        ) {
          await ctx.prisma.joinClass.create({
            data: {
              classId: classIsExist.id,
              userId: ctx.session.user.id,
            },
          });
          message = { desription: "Succesfully join class", status: true };
        } else if (
          classIsExist &&
          classIsExist.userId === ctx.session.user.id
        ) {
          message = {
            desription: "Cannot join your own class!",
            status: false,
          };
        } else if (!classIsExist) {
          message = { desription: "Class does not exist!", status: false };
        } else if (alreadyJoin.length >= 0) {
          message = {
            desription: "You have joined this class!",
            status: false,
          };
        }
        return message;
      } catch (error) {
        console.log(error);
      }
    }),
  getAllJoinedClasses: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.joinClass.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          class: {
            select: {
              user: {},
              id: true,
              name: true,
              section: true,
              code: true,
            },
          },
          user: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),
  getJoinedClasses: protectedProcedure.query(async({ctx}) => {
    try {
      return await ctx.prisma.joinClass.findMany({
        where: {
          userId: ctx.session.user.id
        },
        select: {
          class: {}
        },
      })
    } catch (error) {
      console.log(error);
    }
  }),
  leaveClass: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.joinClass.deleteMany({
          where: {
            classId: input.id,
            userId: ctx.session.user.id
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
