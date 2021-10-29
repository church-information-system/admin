import "./content.scss";

import ContentItem from "./content-item";
import ActionBar from "./action-bar";
import { useEffect, useState } from "react";
import { fetchCollection } from "../../api/FirebaseHelper";
import { Loader } from "../misc/loader";

export default function Content({ selected }) {
  const [records, setRecords] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [fetchingCollection, setFetchingCollection] = useState(false);
  const [refereshes, setRefreshes] = useState(0);
  const [isArchive, setIsArchive] = useState(false);

  const toggleArchive = (value) => setIsArchive(() => value);

  const refreshList = () => setRefreshes((value) => value + 1);

  const search = (input) => setSearchString(() => input);

  const fetchData = async () => {
    if (selected !== "") {
      console.log("fetch");
      setFetchingCollection(() => true);
      if (selected === "donation" || selected === "post") {
        setIsArchive(() => false)
      }
      setRecords(await fetchCollection(selected + (isArchive ? "_archive" : "")));
      setFetchingCollection(() => false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fetchData(), [refereshes, isArchive, selected]);

  function getMatches() {
    let arr = [];
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
      />
      {selected === "" ? (
        <h3 className="content-message">Nothing Selected</h3>
      ) : fetchingCollection ? (
        <Loader />
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
  );
}
