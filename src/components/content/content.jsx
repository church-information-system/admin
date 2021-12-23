import "./content.scss";
import loading from "../../assets/loading.gif";

import backup from "../../assets/backup.svg";
import upload from "../../assets/upload.svg";
import ContentItem from "./content-item";
import ActionBar from "./action-bar";
import { useEffect, useState } from "react";
import {
  archiveMultipleRecords,
  fetchCollection,
  recordCounter,
} from "../../api/FirebaseHelper";
import { Loader } from "../misc/loader";
import { showArchive, toDateTime } from "../../helpers";
import CountContent from "./count-content";
import Swal from "sweetalert2";

export default function Content({ selected }) {
  const [records, setRecords] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [fetchingCollection, setFetchingCollection] = useState(false);
  const [refereshes, setRefreshes] = useState(0);
  const [isArchive, setIsArchive] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [recordCounts, setRecordCounts] = useState([]);

  const selectedRecords = [];

  function addToSelected(record) {
    selectedRecords.push(record);
  }

  function removeFromSelected(record) {
    selectedRecords.splice(
      selectedRecords.findIndex((element) => (record.id = element.id)),
      1
    );
  }

  function archiveSelected() {
    archiveMultipleRecords(
      isArchive ? `${selected}_archive` : selected,
      isArchive ? selected : `${selected}_archive`,
      selectedRecords,
      isArchive,
      () => refreshList()
    );
  }

  let yearLastAdded = "";

  const toggleArchive = (value) => setIsArchive(() => value);
  const toggleSelectMode = (value) => setIsSelect(() => value);

  const refreshList = () => setRefreshes((value) => value + 1);

  const search = (input) => setSearchString(() => input);

  const fetchData = async () => {
    if (selected !== "") {
      setFetchingCollection(() => true);
      if (selected === "donation" || selected === "events") {
        setIsArchive(() => false);
      }
      if (!showArchive(selected)) {
        setIsSelect(() => false);
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
        toDateTime(
          a.dateDocumentAdded.seconds !== undefined
            ? a.dateDocumentAdded.seconds
            : a.dateDocumentAdded._seconds
        ) <
        toDateTime(
          b.dateDocumentAdded.seconds !== undefined
            ? b.dateDocumentAdded.seconds
            : b.dateDocumentAdded._seconds
        )
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
    return (
      <ContentItem
        record={record}
        key={record.id + isArchive}
        selected={selected}
        requestRefresh={refreshList}
        isArchive={isArchive}
        isSelect={isSelect}
        addToSelected={addToSelected}
        removeFromSelected={removeFromSelected}
      />
    );
  }

  return (
    <div id="content">
      {selected === "backup" ? (
        // another DRY violation but I couldn't care less
        <div className="backup-card">
          <div
            className="backup-button"
            onClick={() => {
              Swal.fire({
                title: "Backing up your data don't refresh or leave the page",
                html: `<img src="${loading}"/>`,
                allowOutsideClick: false,
                showConfirmButton: false,
              });
            }}
          >
            <span className="backup-label">backup data</span>
            <img className="backup-icon icon" src={backup} alt="backup" />
          </div>
          <div
            className="backup-button"
            onClick={() => {
              Swal.fire({
                title: "Restoring your data don't refresh or leave the page",
                html: `<img src="${loading}"/>`,
                allowOutsideClick: false,
                showConfirmButton: false,
              });
            }}
          >
            <span className="backup-label">restore data</span>
            <img className="backup-icon icon" src={upload} alt="backup" />
          </div>
        </div>
      ) : (
        <div>
          <ActionBar
            search={search}
            requestRefresh={refreshList}
            show={selected !== ""}
            selected={selected}
            toggleArchive={toggleArchive}
            toggleSelectMode={toggleSelectMode}
            isArchive={isArchive}
            isSelect={isSelect}
            archiveSelected={archiveSelected}
          />
          {fetchingCollection ? (
            <Loader />
          ) : selected === "" ? (
            <div className="count-container">
              {recordCounts.map((recordCount) => {
                recordCount.id = recordCount.name;
                return (
                  <CountContent
                    key={recordCount.name}
                    name={recordCount.name}
                    count={recordCount.countOfRecords}
                  />
                );
              })}
            </div>
          ) : isArchive ? (
            getMatches().map((record) => {
              let dateAdded =
                record.props.record.dateDocumentAdded.seconds !== undefined
                  ? toDateTime(
                      record.props.record.dateDocumentAdded.seconds
                    ).getFullYear()
                  : toDateTime(
                      record.props.record.dateDocumentAdded._seconds
                    ).getFullYear();

              if (record.props.record.dateDocumentAdded.seconds !== undefined)
                console.log("never archived");
              let id = record.props.record.id;
              if (yearLastAdded !== dateAdded) {
                yearLastAdded = dateAdded;
                return (
                  <div key={id + isArchive.toString()}>
                    <h3 className="content-message">
                      Records From year {yearLastAdded}
                    </h3>
                    <div className="content-container">{record}</div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={id + isArchive.toString()}
                    className="content-container"
                  >
                    {record}
                  </div>
                );
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
        </div>
      )}
      <div className="background"></div>
    </div>
  );
}
