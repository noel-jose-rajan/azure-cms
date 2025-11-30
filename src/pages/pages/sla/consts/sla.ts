export const getSlaTypes = (bool: boolean) => [
  {
    label: bool ? "hour" : "ساعة",
    value: 1,
  },
  {
    label: bool ? "day" : "يوم",
    value: 2,
  },
];
