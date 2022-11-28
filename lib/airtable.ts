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

const fetchAirtable = async (userEmail: string) => {
  console.log(userEmail);

  let colName = "Nico's opinion";

  switch (userEmail) {
    case "gcalbanese96@gmail.com":
      colName = "Sonia's opinion";
      break;
    case "nico@ascension.vc":
      colName = "Nico's opinion";
      break;
    case "remy@ascension.vc":
      colName = "Remy's opinion";
      break;
    case "sonia@ascension.vc":
      colName = "Sonia's opinion";
      break;
    default:
      console.log("default");
      break;
  }
  console.log(colName)

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
  )}&maxRecords=1&filterByFormula=${encodeURI(`{${colName}} = BLANK()`)}`;
  console.log(AIRTABLE_URL)

  // AIRTABLE_URL = urlWithoutSort;
  const res = await fetch(AIRTABLE_URL, requestOptions as RequestInit);
  // console.log(res);
  const data = await res.json();
  return data;
};

export const fetchDF = async (userEmail: string) => {
  const data = await fetchAirtable(userEmail);
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
  verdict: "Explore" | "Reject",
  userEmail: string
) => {
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`
  );
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "brw=brwy1TrDiZyNAsU5u");

  let colName = "Nico's opinion";

  switch (userEmail) {
    case "gcalbanese96@gmail.com":
      colName = "Nico's opinion";
      break;
    case "nico@ascension.vc":
      colName = "Nico's opinion";
      break;
    case "remy@ascension.vc":
      colName = "Remy's opinion";
      break;
    case "sonia@ascension.vc":
      colName = "Sonia's opinion";
      break;
    default:
      console.log("default");
      break;
  }

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    redirect: "follow",
    body: JSON.stringify({
      records: [{ id: companyId, fields: { [colName]: verdict } }],
    }),
  };
  const AIRTABLE_URL = "https://api.airtable.com/v0/apptcOM65nkIWJy1l/Pipeline";

  const res = await fetch(AIRTABLE_URL, requestOptions as RequestInit);

  const data = await res.json();
  return data;
};

export const voteOnBusiness = async (
  userEmail: string,
  companyId: string,
  verdict: string
) => {
  console.log(userEmail, companyId, verdict);

  let finalVerdict: "Explore" | "Reject";
  if (verdict == "like") {
    finalVerdict = "Explore";
  } else {
    finalVerdict = "Reject";
  }
  // POST Request to airtabl
  return await patchAirtable(companyId, finalVerdict, userEmail);
};
