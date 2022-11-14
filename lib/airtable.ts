export type Company = {
  name: string;
  amountRaising: number;
  website: string;
  deck: string;
  dateAdded: string;
  isFirstRound: boolean;
  problem: string;
  description: string;
  id: string;
  recordURL: string;
};


const fetchAirtable = async () => {
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`
  );
  myHeaders.append("Cookie", "brw=brwy1TrDiZyNAsU5u");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const AIRTABLE_URL = `https://api.airtable.com/v0/apptcOM65nkIWJy1l/Pipeline?view=${encodeURI(
    "(Quick Triage API)"
  )}&maxRecords=1`;

  // AIRTABLE_URL = urlWithoutSort;
  const res = await fetch(AIRTABLE_URL, requestOptions as RequestInit);
  // console.log(res);
  const data = await res.json();
  return data;
};

export const fetchDF = async () => {
  const data = await fetchAirtable();
  //   return data;

  const structuredData = data.records.map((company: any): Company => {
    return {
      name: company.fields.Company,
      amountRaising: company.fields["Amount Raising"],
      website: company.fields["Website (for extension)"],
      deck: company.fields["Link to Deck"],
      dateAdded: company.fields["Date Added"],
      isFirstRound: company.fields["First Round?"],
      problem: company.fields["Problem in Focus"],
      description: company.fields["Description"],
      id: company.id,
      recordURL: `https://airtable.com/apptcOM65nkIWJy1l/tblltzjPiwy7gOkKE/viwg63PSZQ8mWWeID/${company.id}?blocks=hide`,
    };
  });
  return structuredData as Company[];
};

const patchAirtable = async (
  companyId: string,
  verdict: "Explore" | "Reject"
) => {
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`
  );
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "brw=brwy1TrDiZyNAsU5u");

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    redirect: "follow",
    body: JSON.stringify({
      records: [{ id: companyId, fields: { "Nico's opinion": verdict } }],
    }),
  };
  const AIRTABLE_URL = "https://api.airtable.com/v0/apptcOM65nkIWJy1l/Pipeline";

  // AIRTABLE_URL = urlWithoutSort;
  const res = await fetch(AIRTABLE_URL, requestOptions as RequestInit);
  // console.log(res);
  const data = await res.json();
  return data;
};

export const voteOnBusiness = async (
  voterName: string,
  companyId: string,
  verdict: string
) => {
  console.log(voterName, companyId, verdict);

  let finalVerdict: "Explore" | "Reject";
  if (verdict == "like") {
    finalVerdict = "Explore";
  } else {
    finalVerdict = "Reject";
  }
  // POST Request to airtabl
  return await patchAirtable(companyId, finalVerdict);
};
