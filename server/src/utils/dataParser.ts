import type { HeatmapStats } from "../types/stats.ts";


export function fillHeatmapDates(data: HeatmapStats[]): HeatmapStats[] {


  const dataMap = new Map(
    data.map((item) => [item.day, item.total])
  );

  const today = new Date();

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 30);

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 30);

  const filledData: HeatmapStats[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const day = currentDate.toISOString().split("T")[0];

    filledData.push({
      day,
      total: dataMap.get(day) ?? 0,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledData;
}