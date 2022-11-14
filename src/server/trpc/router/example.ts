import { z } from "zod";
import { fetchDF, voteOnBusiness } from "../../../../lib/airtable";
import { userValid } from "../../../../lib/userLogic";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  getAll: publicProcedure.query(async () => {
    const companies = await fetchDF();
    return { companies };
  }),
  sendOpinion: publicProcedure
    .input(z.object({ companyId: z.string(), verdict: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      if (userValid(ctx.session?.user?.email as string)) {
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
