import death from "../../assets/death.svg";
import marriage from "../../assets/marriage.svg";
import donation from "../../assets/donation.svg";
import post from "../../assets/post.svg";
import records from "../../assets/records.svg";
import requests from "../../assets/request.svg";
import church from "../../assets/church.svg";

export default function CountContent({ name, count }) {
  function iconSwitch() {
    switch (name) {
      case "death":
        return death;
      case "marriage":
        return marriage;
      case "donation":
        return donation;
      case "events":
        return post;
      case "requests":
        return requests;
      case "schedule":
        return church;
      default:
        return records;
    }
  }

  return (
    <div className="content-item">
      <div className="count-icon-container">
        <img src={iconSwitch()} alt={name} className="icon count-icon" />
      </div>
      <div className="count-item-container">
        <h3> {name}</h3>
        <h1> {count}</h1>
      </div>
    </div>
  );
}
