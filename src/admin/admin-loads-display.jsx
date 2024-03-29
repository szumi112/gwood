import { useEffect, useRef, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Text,
  useColorMode,
  SkeletonText,
  Center,
  HStack,
  Button,
  Input,
  Flex,
  Select,
} from "@chakra-ui/react";
import {
  startOfWeek,
  endOfWeek,
  getWeek,
  isWithinInterval,
  getYear,
} from "date-fns";
import {
  doc,
  deleteDoc,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase-config/firebase-config";
import DeleteConfirmationModal from "./delete-modal";
import { getColumnHeaders } from "../utilities/table-headers";
import LoadDataRow from "../dashboard/table/loads-data-row";
import { useLoadContext } from "../load-context";
import FilterComponent from "./filter-loads";
import AddLoadForm from "./add-loads";

const AdminLoads = () => {
  const { loads, setLoads } = useLoadContext();
  const [loadToDelete, setLoadToDelete] = useState(null);
  const { colorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(true);
  const [showNoLoadsFound, setShowNoLoadsFound] = useState(false);
  const [filteredLoads, setFilteredLoads] = useState(loads);
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
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

  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const totalWeeks = getWeeksInYear(selectedYear);
    setTotalNumberOfPages(totalWeeks);

    setCurrentPage(
      selectedYear === getYear(new Date())
        ? getWeek(new Date(), { weekStartsOn: 1 })
        : 1
    );
  }, [selectedYear]);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const loadsForCurrentPage = filteredLoads.slice(startIndex, endIndex);
  const [collectionSortOrder, setCollectionSortOrder] = useState("desc");
  const [deliverySortOrder, setDeliverySortOrder] = useState("desc");
  const [sortedColumn, setSortedColumn] = useState("collection_date");
  const [displayedLoads, setDisplayedLoads] = useState([]);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState("52");
  const [inputValue, setInputValue] = useState(currentPage.toString());

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
    const totalWeeks = getWeeksInYear(selectedYear);
    setTotalNumberOfPages(totalWeeks);

    const now = new Date();
    const isCurrentYear = selectedYear === getYear(now);
    if (isCurrentYear) {
      setCurrentPage(getWeek(now, { weekStartsOn: 1 }));
    } else {
      setCurrentPage(1);
    }
  }, [selectedYear]);

  function filterLoadsByWeek(loads, weekNumber, year) {
    return loads.filter((load) => {
      const loadDate = parseDate(load.formData.collection_date);
      return (
        getWeek(loadDate, { weekStartsOn: 1 }) === weekNumber &&
        getYear(loadDate) === year
      );
    });
  }

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (filteredLoads.length === 0) {
        setShowNoLoadsFound(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loads, filteredLoads]);

  useEffect(() => {
    const handleFirestoreUpdates = (querySnapshot) => {
      const updatedLoads = [];
      querySnapshot.forEach((doc) => {
        updatedLoads.push({
          ...doc.data(),
          id: doc.id,
        });
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

      setFilteredLoads(sortedLoads);
      setLoads(sortedLoads);
      setIsLoading(false);
    };

    const unsubscribe = onSnapshot(
      collection(db, "loads"),
      handleFirestoreUpdates
    );

    return () => unsubscribe();
  }, []);

  const headers = [
    {
      label: "Collection",
      bg: colorMode === "dark" ? "#262b37" : "#cbe0bf",
      colSpan: 8,
    },
    {
      label: "Delivery",
      bg: colorMode === "dark" ? "#1d232f" : "#e2efda",
      colSpan: 9,
    },
  ];

  const columnHeaders = getColumnHeaders(colorMode, headers);

  const openDeleteModal = (loadId) => setLoadToDelete(loadId);
  const closeDeleteModal = () => setLoadToDelete(null);

  const deleteLoad = async (id) => {
    const loadDoc = doc(db, "loads", id);
    await deleteDoc(loadDoc);
    setLoads((prevLoads) => prevLoads.filter((load) => load.id !== id));
  };

  function getWeekNumber(dateStr) {
    const [day, month, year] = dateStr.split("/");
    const date = new Date(year, month - 1, day);
    return getWeek(date, { weekStartsOn: 1 });
  }

  function filterLoadsByWeek(loads, weekNumber) {
    return loads.filter((load) => {
      return getWeekNumber(load.formData.collection_date) === weekNumber;
    });
  }

  useEffect(() => {
    const now = new Date();
    const weekNumber = getWeek(now, { weekStartsOn: 1 });
    const totalWeeks = getWeeksInYear(getYear(now));

    const safeWeekNumber = weekNumber <= totalWeeks ? weekNumber : totalWeeks;

    setCurrentPage(safeWeekNumber);
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentWeekNumber = getWeek(now, { weekStartsOn: 1 });

    setCurrentPage(currentWeekNumber);
  }, [filteredLoads, itemsPerPage]);

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
    <Box pb={10}>
      <Box
        bg="rgba(0,0,0,0.1)"
        borderBottom={"1px solid"}
        borderBottomColor={colorMode == "dark" ? "gray.700" : "gray.300"}
        mb={8}
      >
        <Center py={6}>
          <HStack spacing={4}>
            <Flex flexDir={"column"} alignContent={"center"}>
              <Flex alignItems={"center"}>
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

      <AddLoadForm />
      <FilterComponent applyFilters={applyFilters} />

      <Text fontSize="32px" mx={4}>
        All loads ({filteredLoads.length}):
      </Text>

      {filterLoadsByWeek(loads, currentPage).length === 0 ? (
        isLoading ? (
          <SkeletonText height="100px">Loading..</SkeletonText>
        ) : (
          <Text textAlign={"center"} mb={8}>
            No loads found.
          </Text>
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
                />
              ))}
            </Tbody>
          </Table>
        </>
      )}

      <DeleteConfirmationModal
        isOpen={loadToDelete !== null}
        onClose={closeDeleteModal}
        onDelete={() => {
          if (loadToDelete) {
            deleteLoad(loadToDelete);
          }
          closeDeleteModal();
        }}
      />
    </Box>
  );
};

export default AdminLoads;
