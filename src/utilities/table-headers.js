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
  { label: "Ref no", value: "ref_no", bg: headers[1].bg },
  { label: "Truck#", value: "truck_number", bg: headers[0].bg },
  { label: "Truck Reg", value: "truck_reg", bg: headers[1].bg },
  { label: "Loading Date", value: "loading_date", bg: headers[0].bg },
  { label: "time", value: "loading_time", bg: headers[1].bg },
  { label: "Delivery Date", value: "delivery_date", bg: headers[0].bg },
  { label: "time", value: "delivery_time", bg: headers[1].bg },
  { label: "Collection Ref", value: "collection_ref", bg: headers[0].bg },
  { label: "Pallet Count", value: "pallet_count", bg: headers[1].bg },
  { label: "Temp", value: "temp", bg: headers[0].bg },
  { label: "Phyto", value: "phyto", bg: headers[1].bg },
  { label: "Export", value: "export", bg: headers[0].bg },
  { label: "Import", value: "import", bg: headers[1].bg },
  { label: "Crossing port", value: "crossing_port", bg: headers[0].bg },
  { label: "Company name", value: "company_name", bg: headers[1].bg },
  { label: "Notes", value: "notes", bg: headers[0].bg },
];

// export const getColumnHeaders = (colorMode, headers) => [
//   { label: "Status", value: "status", bg: headers[0].bg },
//   {
//     label: "Date",
//     value: "collection_date",
//     bg: headers[0].bg,
//   },
//   { label: "Time", value: "Collection Time", bg: headers[0].bg },
//   { label: "ETA:", value: "Collection ETA", bg: headers[0].bg },
//   { label: "Company", value: "Collection Company", bg: headers[0].bg },
//   { label: "Post Code", value: "Collection Post Code", bg: headers[0].bg },
//   { label: "MP PO", value: "MP PO", bg: headers[0].bg },
//   { label: "Reference", value: "Ref", bg: headers[0].bg },
//   { label: "Trailer Type", value: "Trailer Type", bg: headers[0].bg },

//   {
//     label: "Date",
//     value: "delivery_date",
//     bg: headers[1].bg,
//   },
//   { label: "Time", value: "Delivery time", bg: headers[1].bg },
//   { label: "ETA", value: "Delivery ETA", bg: headers[1].bg },
//   { label: "Company", value: "Delivery Company", bg: headers[1].bg },
//   { label: "Post Code", value: "Delivery Post Code", bg: headers[1].bg },
//   { label: "PO", value: "Delivery PO", bg: headers[1].bg },

//   { label: "Rate", value: "Rate", bg: headers[1].bg },
//   { label: "", value: "Actions", bg: headers[1].bg },
// ];
