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

  const refreshList = () => setRefreshes((value) => value + 1);

  const search = (input) => setSearchString(() => input);

  const fetchData = async () => {
    if (selected !== "") {
      console.log("fetch");
      setFetchingCollection(() => true);
      setRecords(await fetchCollection(selected));
      setFetchingCollection(() => false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fetchData(), [refereshes, selected]);

  function getMatches() {
    let arr = [];
    if (searchString !== "") {
      records.forEach((record) => {
        if (
          (record.name || record.title)
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
    return <ContentItem record={record} key={record.id} selected={selected} requestRefresh={refreshList} />
  }

  return (
    <div id="content">
      <ActionBar
        search={search}
        requestRefresh={refreshList}
        show={selected !== ""}
        selected={selected}
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
