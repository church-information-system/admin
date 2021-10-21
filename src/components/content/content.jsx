import "./content.scss";

import ContentItem from "./content-item";
import ActionBar from "./action-bar";
import { useEffect, useState } from "react";
import { fetchCollection } from "../../api/FirebaseHelper";
import { Loader } from "../misc/loader";

export default function Content({ selected }) {
  const [persons, setPersons] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [fetchingCollection, setFetchingCollection] = useState(false);
  const [refereshes, setRefreshes] = useState(0);

  const refreshList = () => setRefreshes((value) => value + 1);

  const search = (input) => setSearchString(() => input);

  const fetchData = async () => {
    if (selected !== "") {
      console.log("fetch");
      setFetchingCollection(() => true);
      setPersons(await fetchCollection(selected));
      setFetchingCollection(() => false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fetchData(), [refereshes, selected]);

  function getMatches() {
    let arr = [];
    if (searchString !== "") {
      persons.forEach((person) => {
        if (
          person.name
            .trim()
            .toLowerCase()
            .includes(searchString.trim().toLowerCase())
        ) {
          arr.push(createItem(person));
        }
      });
    } else {
      arr = persons.map((person) => createItem(person));
    }
    return arr;
  }

  function createItem(person) {
    // switch (selected) {
    //   case "death":
    //     return (
    //       <ContentItem
    //         name={person.name}
    //         age={person.age}
    //         address={person.address}
    //         dayOfBirth={person.dayOfBirth}
    //         dayOfDeath={person.dayOfDeath}
    //         dateOfMass={person.dateOfMass}
    //         key={person.id}
    //         id={person.id}
    //         selected={selected}
    //         requestRefresh={refreshList}
    //       />
    //     );
    //   case "marriage":
    //   default:
    //     return (
    //       <ContentItem
    //         name={person.name}
    //         address={person.address}
    //         phone={person.phone}
    //         key={person.id}
    //         id={person.id}
    //         selected={selected}
    //         requestRefresh={refreshList}
    //       />
    //     );
    // }
    return <ContentItem person={person} key={person.id} selected={selected} />
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
