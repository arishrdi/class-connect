import { createTRPCRouter } from "~/server/api/trpc";
import { classRouter } from "./routers/class";
import { materialRouter } from "./routers/material";
import { joinClassRouter } from "./routers/joinClass";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  class: classRouter,
  material: materialRouter,
  joinClass: joinClassRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
