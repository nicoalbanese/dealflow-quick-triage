import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import type { Company } from "../../lib/airtable";

const Home: NextPage = () => {
  return (
    <>
      <main className="h-screen w-full bg-slate-800 text-slate-50">
        <div className="p-8">
          <MainApplication />
        </div>
      </main>
    </>
  );
};

export default Home;

const MainApplication: React.FC = () => {
  const company = trpc.example.getAll.useQuery();

  const { data: sessionData } = useSession();
  if (sessionData?.user) {
    if (company.status === "loading") {
      return <>loading...</>;
    } else if (company.data?.message == "success") {
      if (company.data.companies.length > 0) {
        return (
          <>
            <Header />
            {company.data?.companies && (
              <CompanyViewer company={company.data.companies[0] as Company} />
            )}
          </>
        );
      } else {
        return (
          <>
            <Header />
            <div>No more companies!</div>
          </>
        );
      }
    } else
      return (
        <>
          <h1>
            Your account has not been approved. Please contact the
            administrator.
          </h1>
          <button onClick={() => signOut()}>Log out</button>
        </>
      );
  } else {
    return (
      <>
        <h1>Please log in</h1>
        <button onClick={() => signIn()}>log in</button>
      </>
    );
  }
};

const CompanyViewer: React.FC<{ company: Company }> = ({
  company,
}: {
  company: Company;
}) => {
  // const { data: sessionData } = useSession();
  const utils = trpc.useContext();
  const sendOpinion = trpc.example.sendOpinion.useMutation({
    onSuccess: () => utils.example.getAll.refetch(),
  });
  return (
    <div className="flex w-full">
      <div id="left" className="w-1/2 pr-8">
        <h1>{company.name}</h1>
        <Link
          href={company.recordURL}
          className="text-sm opacity-50 hover:opacity-100"
        >
          open in airtable
        </Link>
        <div className="py-4">
          <DetailedSection
            sectionName="Amount Raising"
            body={"??".concat(company.amountRaising.toLocaleString())}
          />
          <DetailedSection
            sectionName="First raise?"
            body={company.isFirstRound.toString()}
          />
          <DetailedSection
            sectionName="Description"
            body={company.description}
          />
          <DetailedSection sectionName="Problem" body={company.problem} />
        </div>
        <div className="my-0 flex w-full items-center justify-center">
          {sendOpinion.isLoading ? (
            <div className="opacity-70">submitting...</div>
          ) : (
            <>
              <button
                className="border-green-500 bg-green-500"
                onClick={() =>
                  sendOpinion.mutate({ companyId: company.id, verdict: "like" })
                }
              >
                Like
              </button>
              <button
                className="border-red-500 bg-red-500 text-white"
                onClick={() =>
                  sendOpinion.mutate({
                    companyId: company.id,
                    verdict: "dislike",
                  })
                }
              >
                {"Don't like"}
              </button>
            </>
          )}
        </div>
      </div>
      <div id="right" className="w-full">
        {company.deck.includes("https://dl.airtable.com/.attachments") ? (
          <iframe src={company.deck} width="100%" height="800px"></iframe>
        ) : (
          <div>
            This deck is hosted externally. Please{" "}
            <Link
              className="underline hover:opacity-75"
              target="_blank"
              href={company.deck}
            >
              click here
            </Link>{" "}
            to view this deck.
          </div>
        )}
      </div>
    </div>
  );
};

const DetailedSection = ({
  sectionName,
  body,
}: {
  sectionName: string;
  body: string;
}) => {
  return (
    <div className="border-t border-b border-slate-500 py-2">
      <h5 className="mb-1 text-sm font-bold uppercase text-slate-400">
        {sectionName}
      </h5>
      <p>{body}</p>
    </div>
  );
};

const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>{""}</div>
      <h1>Welcome {sessionData?.user?.email}</h1>
      <button onClick={() => signOut()}>sign out</button>
    </div>
  );
};
