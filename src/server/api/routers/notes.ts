import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { notes } from "@/server/db/schema";

export const noteRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(notes).values({
        title: input.title,
        content: input.content,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const note = await ctx.db.query.notes.findFirst({
      orderBy: (notes, { desc }) => [desc(notes.createdAt)],
    });

    return note ?? null;
  }),
});
