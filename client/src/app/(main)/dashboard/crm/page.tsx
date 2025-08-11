import pb from "../../../../../connections/pocketbase";
import { InsightCards } from "./_components/insight-cards";
import { OperationalCards } from "./_components/operational-cards";
import { OverviewCards } from "./_components/overview-cards";
import { TableCards } from "./_components/table-cards";
import Lead from "./types";

function countObjectsByMonth(data: Lead[]) {
  const monthCounts: { [key: string]: number } = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0
};

for (const item of data) {
    const date = new Date(item.Date);
    const month = date.toLocaleString('default', { month: 'long' }); // Get month name
    monthCounts[month]++;
}

return monthCounts;

}


export default async function Page() {
  const resultList = await pb.collection('Leads').getList(1, 50).then(res => {
    return res
  });
  console.log(resultList)
  // const monthlyCounts = countObjectsByMonth(resultList);
  
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <OverviewCards />
      <OperationalCards />
      <TableCards />
    </div>
  );
}
