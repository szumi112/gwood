export const ColHeader = (colorMode) => [
  {
    label: "Collection",
    bg: colorMode === "dark" ? "#262b37" : "#cbe0bf",
    colSpan: 9,
  },
];

export const DelHeader = (colorMode) => [
  {
    label: "Delivery",
    bg: colorMode === "dark" ? "#1d232f" : "#e2efda",
    colSpan: 8,
  },
];

export const getColumnHeaders = (colorMode, headers) => [
  { label: "Status", value: "status", bg: headers[0].bg },
  {
    label: "Date",
    value: "collection_date",
    bg: headers[0].bg,
  },
  { label: "Time", value: "Collection Time", bg: headers[0].bg },
  { label: "ETA:", value: "Collection ETA", bg: headers[0].bg },
  { label: "Company", value: "Collection Company", bg: headers[0].bg },
  { label: "Post Code", value: "Collection Post Code", bg: headers[0].bg },
  { label: "MP PO", value: "MP PO", bg: headers[0].bg },
  { label: "Reference", value: "Ref", bg: headers[0].bg },
  { label: "Trailer Type", value: "Trailer Type", bg: headers[0].bg },

  {
    label: "Date",
    value: "delivery_date",
    bg: headers[1].bg,
  },
  { label: "Time", value: "Delivery time", bg: headers[1].bg },
  { label: "ETA", value: "Delivery ETA", bg: headers[1].bg },
  { label: "Company", value: "Delivery Company", bg: headers[1].bg },
  { label: "Post Code", value: "Delivery Post Code", bg: headers[1].bg },
  { label: "PO", value: "Delivery PO", bg: headers[1].bg },

  { label: "Rate", value: "Rate", bg: headers[1].bg },
  { label: "", value: "Actions", bg: headers[1].bg },
];
