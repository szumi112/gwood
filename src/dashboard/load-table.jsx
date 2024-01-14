import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  useColorMode,
  Text,
  SkeletonText,
  HStack,
  Button,
  Center,
  Flex,
  Tooltip,
  Checkbox,
  Input,
  Select,
} from "@chakra-ui/react";
import {
  startOfWeek,
  endOfWeek,
  getWeek,
  isWithinInterval,
  getYear,
} from "date-fns";

import "./table.css";

import { db } from "../firebase-config/firebase-config";
import { collection, doc, getDocs, onSnapshot } from "@firebase/firestore";
import { getColumnHeaders } from "../utilities/table-headers";
import LoadDataRow from "./table/loads-data-row";
import FilterComponent from "../admin/filter-loads";
import { CSVLink } from "react-csv";

const itemsPerPage = 10;

const LoadTable = () => {
  const [loads, setLoads] = useState([]);
  const [collectionSortOrder, setCollectionSortOrder] = useState("desc");
  const [deliverySortOrder, setDeliverySortOrder] = useState("desc");
  const [sortedColumn, setSortedColumn] = useState("collection_date");
  const [filteredLoads, setFilteredLoads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoLoadsFound, setShowNoLoadsFound] = useState(false);
  const getWeeksInYear = (year) => {
    const isLeapYear = new Date(year, 1, 29).getMonth() === 1;
    return isLeapYear ? 53 : 52;
  };
  const [currentPage, setCurrentPage] = useState(() => {
    const now = new Date();
    const currentYear = getYear(now);
    const weekNumber = getWeek(now, { weekStartsOn: 1 });
    const totalWeeks = getWeeksInYear(currentYear);

    return weekNumber > totalWeeks ? totalWeeks : weekNumber;
  });
  const [displayedLoads, setDisplayedLoads] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsForExport, setSelectedRowsForExport] = useState([]);
  const [CSVData, setCSVData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(() => {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });
    return { start, end };
  });
  const [totalNumberOfPages, setTotalNumberOfPages] = useState("52");
  const [inputValue, setInputValue] = useState(currentPage.toString());
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const loadsCollectionRef = collection(db, "loads");
  const { colorMode } = useColorMode();
  const headers = [
    {
      label: "Collection",
      bg: colorMode === "dark" ? "#262b37" : "#cbe0bf",
      colSpan: 9,
    },
    {
      label: "Delivery",
      bg: colorMode === "dark" ? "#1d232f" : "#e2efda",
      colSpan: 8,
    },
  ];

  const generateYearOptions = (startYear) => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };
  const YearSelector = ({ selectedYear, setSelectedYear }) => {
    const yearOptions = generateYearOptions(2024);

    if (yearOptions.length === 1 && yearOptions[0] === 2024) {
      return null;
    }

    return (
      <Select
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
      >
        {yearOptions.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>
    );
  };

  useEffect(() => {
    const year = selectedYear;
    const totalWeeks = getWeeksInYear(year);
    setTotalNumberOfPages(totalWeeks);

    const currentYear = getYear(new Date());
    if (currentYear === year) {
      const currentWeekNumber = getWeek(new Date(), { weekStartsOn: 1 });
      setCurrentPage(currentWeekNumber);
    } else {
      setCurrentPage(1);
    }
  }, [selectedYear]);

  function filterLoadsByWeek(loads, weekNumber) {
    return loads.filter((load) => {
      const loadDate = parseDate(load.formData.collection_date);
      return getWeek(loadDate, { weekStartsOn: 1 }) === weekNumber;
    });
  }

  useEffect(() => {
    const loadsWithinCurrentWeek = currentPage
      ? filteredLoads.filter((load) => {
          const loadDate = parseDate(load.formData.collection_date);
          return isWithinInterval(loadDate, currentWeek);
        })
      : [];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newDisplayedLoads = loadsWithinCurrentWeek.slice(
      startIndex,
      endIndex
    );

    setDisplayedLoads(newDisplayedLoads);
  }, [currentPage, currentPage, itemsPerPage, filteredLoads]);

  useEffect(() => {
    const now = new Date();
    const currentWeekNumber = getWeek(now, { weekStartsOn: 1 });
    setCurrentPage(currentWeekNumber);
  }, []);

  const toggleRowSelection = (loadId) => {
    let updatedSelectedRows;
    if (selectedRows.includes(loadId)) {
      setSelectedRows(selectedRows.filter((id) => id !== loadId));
      setSelectedRowsForExport(
        selectedRowsForExport.filter((id) => id !== loadId)
      );
      updatedSelectedRows = selectedRows.filter((id) => id !== loadId);
    } else {
      setSelectedRows([...selectedRows, loadId]);
      setSelectedRowsForExport([...selectedRowsForExport, loadId]);
      updatedSelectedRows = [...selectedRows, loadId];
    }

    setSelectedRows(updatedSelectedRows);

    const updatedCSVData = updatedSelectedRows.map((loadId) => {
      const load = displayedLoads.find((load) => load?.id === loadId);
      const formDataEntries = Object?.entries(load?.formData)?.reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {}
      );
      return formDataEntries;
    });
    setCSVData(updatedCSVData);
    setSelectedRowsCount(updatedCSVData.length);
  };

  const handleSortByDate = (column) => {
    if (column === sortedColumn) {
      if (column === "collection_date") {
        setCollectionSortOrder(collectionSortOrder === "asc" ? "desc" : "asc");
      } else if (column === "delivery_date") {
        setDeliverySortOrder(deliverySortOrder === "asc" ? "desc" : "asc");
      }
    } else {
      setSortedColumn(column);
      if (column === "collection_date") {
        setCollectionSortOrder("asc");
        setDeliverySortOrder("asc");
      } else if (column === "delivery_date") {
        setDeliverySortOrder("asc");
        setCollectionSortOrder("asc");
      }
    }
  };

  const columnHeaders = getColumnHeaders(colorMode, headers);

  function parseDate(dateString) {
    if (!dateString) return null;

    const parts = dateString.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

  useEffect(() => {
    const sortedLoads = [...filteredLoads].sort((load1, load2) => {
      if (
        sortedColumn === "collection_date" ||
        sortedColumn === "delivery_date"
      ) {
        const date1 = parseDate(load1.formData[sortedColumn]);
        const date2 = parseDate(load2.formData[sortedColumn]);

        if (!date1 || !date2) {
          return 0;
        }

        const timestamp1 = date1.getTime();
        const timestamp2 = date2.getTime();

        if (sortedColumn === "collection_date") {
          return collectionSortOrder === "asc"
            ? timestamp1 - timestamp2
            : timestamp2 - timestamp1;
        } else {
          return deliverySortOrder === "asc"
            ? timestamp1 - timestamp2
            : timestamp2 - timestamp1;
        }
      }

      return 0;
    });

    setFilteredLoads(sortedLoads);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const newDisplayedLoads = sortedLoads.slice(startIndex, endIndex);

    setDisplayedLoads(newDisplayedLoads);
  }, [sortedColumn, collectionSortOrder, deliverySortOrder, itemsPerPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (loads.length === 0) {
        setShowNoLoadsFound(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loads]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDocs(loadsCollectionRef);
        const allLoads = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const sortedLoads = [...allLoads].sort((load1, load2) => {
          const date1 = parseDate(load1.formData.collection_date);
          const date2 = parseDate(load2.formData.collection_date);

          if (!date1 || !date2) {
            return 0;
          }

          const timestamp1 = date1.getTime();
          const timestamp2 = date2.getTime();

          return timestamp2 - timestamp1;
        });

        setLoads(sortedLoads);
        setFilteredLoads(sortedLoads);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching loads:", error);
      }
    };

    fetchData();

    const unsubscribe = onSnapshot(loadsCollectionRef, (snapshot) => {
      const updatedLoads = [];
      snapshot.forEach((doc) => {
        const updatedLoadData = doc.data();
        updatedLoads.push({ ...updatedLoadData, id: doc.id });
      });

      const sortedLoads = [...updatedLoads].sort((load1, load2) => {
        const date1 = parseDate(load1.formData.collection_date);
        const date2 = parseDate(load2.formData.collection_date);

        if (!date1 || !date2) {
          return 0;
        }

        const timestamp1 = date1.getTime();
        const timestamp2 = date2.getTime();

        return timestamp2 - timestamp1;
      });

      setLoads(sortedLoads);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const applyFilters = (
    companyFilter,
    reference,
    status,
    startDate,
    endDate,
    statusDescription,
    loadStatusFilter
  ) => {
    let filtered = [...loads];

    if (reference) {
      const referenceLower = reference.toLowerCase();
      filtered = filtered.filter(
        (load) =>
          load.formData.ref_mp_po.toLowerCase().includes(referenceLower) ||
          load.formData.ref_ref.toLowerCase().includes(referenceLower)
      );
    }

    if (companyFilter) {
      const companyFilterLower = companyFilter.toLowerCase();
      filtered = filtered.filter(
        (load) =>
          load.formData.collection_company
            .toLowerCase()
            .includes(companyFilterLower) ||
          load.formData.delivery_company
            .toLowerCase()
            .includes(companyFilterLower)
      );
    }

    if (status) {
      filtered = filtered.filter((load) =>
        load.formData.status.includes(status)
      );
    }

    if (statusDescription) {
      const statusDescriptionLower = statusDescription?.toLowerCase();
      filtered = filtered.filter((load) =>
        load?.formData?.status_description
          ?.toLowerCase()
          ?.includes(statusDescriptionLower)
      );
    }

    if (startDate || endDate) {
      filtered = filtered.filter((load) => {
        const colLoadDate = load.formData.collection_date;
        const delLoadDate = load.formData.delivery_date;
        return (
          (!startDate || (colLoadDate && colLoadDate >= startDate)) &&
          (!endDate || (delLoadDate && delLoadDate <= endDate))
        );
      });
    }

    if (loadStatusFilter != "All") {
      if (loadStatusFilter == "Finished") {
        filtered = filtered.filter((load) =>
          load.formData.status.includes("4")
        );
      } else if (loadStatusFilter == "In progress") {
        filtered = filtered.filter((load) => !load.formData.status.includes(4));
      }
    }

    setFilteredLoads(filtered);
  };

  useEffect(() => {
    setFilteredLoads(loads);
  }, [loads]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newDisplayedLoads = filteredLoads.slice(startIndex, endIndex);
    setDisplayedLoads(newDisplayedLoads);
  }, [currentPage]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;

    if (newValue === "") {
      setInputValue(newValue);
      return;
    }

    const numericValue = parseInt(newValue, 10);
    if (
      !isNaN(numericValue) &&
      numericValue >= 1 &&
      numericValue <= totalNumberOfPages
    ) {
      setInputValue(newValue);
      setCurrentPage(numericValue);
    }
  };

  return (
    <Box pb={4}>
      <Box
        bg="rgba(0,0,0,0.1)"
        borderBottom={"1px solid"}
        borderBottomColor={colorMode == "dark" ? "gray.700" : "gray.300"}
        mb={8}
      >
        <Center py={6}>
          <HStack spacing={4}>
            <Flex flexDir={"column"} alignContent={"center"}>
              <Flex alignItems={"center"} mx="auto">
                <Button
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage((prevPage) => prevPage - 1);
                    } else {
                      return;
                    }
                  }}
                >
                  Previous
                </Button>
                <Text mx={4}>
                  Week {currentPage} / {totalNumberOfPages}
                </Text>
                <Button
                  onClick={() => {
                    if (currentPage < totalNumberOfPages) {
                      setCurrentPage((prevPage) => prevPage + 1);
                    } else {
                      return;
                    }
                  }}
                >
                  Next
                </Button>
              </Flex>

              <Flex alignItems={"center"} mx="auto" mt={6}>
                <Text mr={2} whiteSpace={"nowrap"}>
                  Week:
                </Text>
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  size="sm"
                  width="50px"
                  textAlign="center"
                  mr={8}
                />
                {generateYearOptions(2024).length === 1 &&
                generateYearOptions(2024)[0] === 2024 ? null : (
                  <>
                    <Text mr={2} whiteSpace={"nowrap"}>
                      Year:
                    </Text>
                    <Box>
                      <YearSelector
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                      />
                    </Box>
                  </>
                )}
              </Flex>
            </Flex>
          </HStack>
        </Center>
      </Box>

      <FilterComponent applyFilters={applyFilters} />
      <Flex
        w="100%"
        justifyContent={"space-between"}
        px={4}
        flexDir={{ base: "column", md: "row" }}
      >
        <Text
          mb={8}
          fontSize={{ base: "21px", "2xl": "32px" }}
          fontWeight={"500"}
        >
          Your Loads ({filteredLoads.length}):
        </Text>
        {showExportOptions ? (
          <Box mr={{ base: "auto", md: 0 }} w={{ base: "100%", md: "auto" }}>
            <Flex mb={4}>
              <HStack ml="auto" w={{ base: "100%", md: "auto" }}>
                <Tooltip
                  label={
                    selectedRowsForExport.length === 0
                      ? "Add at least 1 row to export"
                      : ""
                  }
                >
                  <Button
                    isDisabled={selectedRowsForExport.length === 0}
                    onClick={() => {
                      setSelectedRowsForExport([]);
                      setCSVData([]);
                      setShowExportOptions(false);
                    }}
                    w={{ base: "100%" }}
                    mr={{ base: 4, md: 0 }}
                  >
                    <CSVLink data={CSVData}>
                      Export Selected ({CSVData.length})
                    </CSVLink>
                  </Button>
                </Tooltip>
                <Button
                  onClick={() => {
                    setShowExportOptions(false);
                    setSelectedRowsForExport([]);
                  }}
                  colorScheme="red"
                  w="50%"
                >
                  Cancel
                </Button>
              </HStack>
            </Flex>
            <Flex mb={4}>
              <HStack spacing={4} ml="auto">
                <Checkbox
                  as="div"
                  isChecked={selectAll}
                  onChange={() => {
                    if (selectAll) {
                      setSelectedRowsForExport([]);
                      setCSVData([]);
                    } else {
                      setSelectedRowsForExport(
                        filteredLoads.map((load) => load.id)
                      );
                      setCSVData(
                        filteredLoads.map((load) => {
                          const formDataEntries = Object.entries(
                            load.formData
                          ).reduce((acc, [key, value]) => {
                            acc[key] = value;
                            return acc;
                          }, {});
                          return formDataEntries;
                        })
                      );
                    }
                    setSelectAll(!selectAll);
                  }}
                >
                  <Button
                    variant="ghost"
                    _hover={{ bg: "transparent" }}
                    onClick={() => {
                      if (selectAll) {
                        setSelectedRowsForExport([]);
                        setCSVData([]);
                        setSelectedRows([]);
                        setSelectAll(false);
                      } else {
                        setSelectedRowsForExport(
                          filteredLoads.map((load) => load.id)
                        );
                        setCSVData(
                          filteredLoads.map((load) => {
                            const formDataEntries = Object.entries(
                              load.formData
                            ).reduce((acc, [key, value]) => {
                              acc[key] = value;
                              return acc;
                            }, {});
                            return formDataEntries;
                          })
                        );
                      }
                      setSelectAll(!selectAll);
                    }}
                  >
                    Select all
                  </Button>
                </Checkbox>

                <Button
                  variant="ghost"
                  _hover={{ bg: "transparent" }}
                  onClick={() => {
                    setSelectedRowsForExport([]);
                    setCSVData([]);
                    setSelectedRows([]);
                    setSelectAll(false);
                  }}
                  textDecoration={"underline"}
                >
                  Deselect all
                </Button>
              </HStack>
            </Flex>
          </Box>
        ) : (
          <Button onClick={() => setShowExportOptions(true)}>
            Export to CSV
          </Button>
        )}
      </Flex>

      {filterLoadsByWeek(loads, currentPage).length === 0 ? (
        isLoading ? (
          <SkeletonText height="100px">Loading..</SkeletonText>
        ) : (
          <Text textAlign={"center"}>No loads found</Text>
        )
      ) : (
        <>
          <Table mt={8} mb={12}>
            <Thead>
              <Tr>
                {columnHeaders.map((column, index) => (
                  <Th
                    key={index}
                    className="table-responsive-sizes-text"
                    bg={column.bg}
                    fontSize="14px"
                    fontWeight="400"
                    onClick={() => {
                      handleSortByDate(column.value);
                    }}
                    cursor={
                      column.value === "delivery_date" ||
                      column.value === "collection_date"
                        ? "pointer"
                        : "default"
                    }
                  >
                    {column.label}
                    {column.value === "delivery_date" &&
                      sortedColumn === "delivery_date" && (
                        <span style={{ marginLeft: "5px" }}>
                          {deliverySortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    {column.value === "collection_date" &&
                      sortedColumn === "collection_date" && (
                        <span style={{ marginLeft: "5px" }}>
                          {collectionSortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody className="table-responsive-sizes-text">
              {filterLoadsByWeek(loads, currentPage).map((load) => (
                <LoadDataRow
                  key={load.id}
                  load={load}
                  onDelete={() => openDeleteModal(load.id)}
                  onEdit={(id) => saveEdits(id)}
                  isSelected={selectedRowsForExport.includes(load.id)}
                  toggleRowSelection={() => toggleRowSelection(load.id)}
                  showExportOptions={showExportOptions}
                />
              ))}
            </Tbody>
          </Table>
        </>
      )}
    </Box>
  );
};

export default LoadTable;
