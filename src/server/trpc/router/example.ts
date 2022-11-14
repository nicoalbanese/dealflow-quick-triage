import { z } from "zod";
import { fetchDF, voteOnBusiness } from "../../../../lib/airtable";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const currentUser = await ctx.prisma.user.findUnique({
      where: { email: ctx.session?.user?.email as string },
    });

    if (currentUser?.authorised) {
      const companies = await fetchDF();
      return { message: "success", companies };
    } else {
      return { message: "unauthorised", companies: [] };
    }
  }),
  sendOpinion: publicProcedure
    .input(z.object({ companyId: z.string(), verdict: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      const currentUser = await ctx.prisma.user.findUnique({
        where: { email: ctx.session?.user?.email as string },
      });

      if (currentUser?.authorised) {
        const res = await voteOnBusiness(
          ctx.session?.user?.email as string,
          input.companyId,
          input.verdict
        );
        console.log(res);
        return { res };
      } else {
        return { message: "invalid user..." };
      }
      return { message: "hello" };
    }),
});
