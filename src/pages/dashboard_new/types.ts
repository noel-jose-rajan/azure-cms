export type Dropdown = {
  enLabel: string | undefined;
  arLabel: string | undefined;
  onClick: () => void;
};

export type StatisticsData = {
  enLabel: string;
  arLabel: string;
  count: number;
  dropdown?: Dropdown[];
  color: string;
  icon: React.ReactNode;
};

export type PieChartData = {
  arLabel: string;
  enLabel: string;
  process_id: number;
  kpi: number;
  color: string;
};
