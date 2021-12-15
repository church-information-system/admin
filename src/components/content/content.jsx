import "./content.scss";

import ContentItem from "./content-item";
import ActionBar from "./action-bar";
import { useEffect, useState } from "react";
import { fetchCollection, recordCounter } from "../../api/FirebaseHelper";
import { Loader } from "../misc/loader";
import { toDateTime } from "../../helpers";

export default function Content({ selected }) {
  const [records, setRecords] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [fetchingCollection, setFetchingCollection] = useState(false);
  const [refereshes, setRefreshes] = useState(0);
  const [isArchive, setIsArchive] = useState(false);
  const [recordCounts, setRecordCounts] = useState([]);

  let yearLastAdded = "";

  const toggleArchive = (value) => setIsArchive(() => value);

  const refreshList = () => setRefreshes((value) => value + 1);

  const search = (input) => setSearchString(() => input);

  const fetchData = async () => {
    if (selected !== "") {
      setFetchingCollection(() => true);
      if (selected === "donation" || selected === "events") {
        setIsArchive(() => false);
      }
      setRecords(
        await fetchCollection(selected + (isArchive ? "_archive" : ""))
      );
      setFetchingCollection(() => false);
    } else {
      setFetchingCollection(() => true);
      let records = [
        "marriage",
        "death",
        "donation",
        "events",
        "requests",
        "schedule",
      ];

      let _recordCounts = [];
      records.forEach(async (record, index) => {
        await recordCounter(record, (data) => {
          _recordCounts.push({
            name: record,
            countOfRecords: data.size,
          });
          if (index === records.length - 1) {
            setRecordCounts(() => _recordCounts);
            setFetchingCollection(() => false);
          }
        });
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fetchData(), [refereshes, isArchive, selected]);

  function getMatches() {
    let arr = [];
    records.sort(
      (a, b) =>
        toDateTime(a.dateDocumentAdded.seconds) <
        toDateTime(b.dateDocumentAdded.seconds)
    );
    if (searchString !== "") {
      records.forEach((record) => {
        if (
          (record.name || record.wifeName || record.husbandName || record.title)
            .trim()
            .toLowerCase()
            .includes(searchString.trim().toLowerCase())
        ) {
          arr.push(createItem(record));
        }
      });
    } else {
      arr = records.map((record) => createItem(record));
    }
    return arr;
  }

  function createItem(record) {
    if (isArchive) {
      return (
        <ContentItem
          record={record}
          key={record.id}
          selected={selected}
          requestRefresh={refreshList}
          isArchive={isArchive}
        >
          <div className="content-message">
            {toDateTime(record.dateDocumentAdded.seconds).getFullYear()}
          </div>
        </ContentItem>
      );
    }
    return (
      <ContentItem
        record={record}
        key={record.id}
        selected={selected}
        requestRefresh={refreshList}
        isArchive={isArchive}
      />
    );
  }

  return (
    <div id="content">
      <ActionBar
        search={search}
        requestRefresh={refreshList}
        show={selected !== ""}
        selected={selected}
        toggleArchive={toggleArchive}
        isArchive={isArchive}
      />
      {fetchingCollection ? (
        <Loader />
      ) : selected === "" ? (
        <div className="content-container">
          {recordCounts.map((recordCount) => {
            recordCount.id = recordCount.name;
            return createItem(recordCount);
          })}
        </div>
      ) : isArchive ? (
        getMatches().map((record) => {
          let dateAdded = toDateTime(
            record.props.record.dateDocumentAdded.seconds
          ).getFullYear();
          if (yearLastAdded !== dateAdded) {
            yearLastAdded = dateAdded;
            return (
              <div>
                <h3 className="content-message">
                  Records From year {yearLastAdded}
                </h3>
                <div className="content-container">{record}</div>
              </div>
            );
          } else {
            return <div className="content-container">{record}</div>;
          }
        })
      ) : (
        <div className="content-container">
          {getMatches()[0] ? (
            getMatches()
          ) : (
            <h3 className="content-message">No Records found</h3>
          )}
        </div>
      )}
      <div className="background"></div>
    </div>
  );
}
