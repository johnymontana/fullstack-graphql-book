import React, { useState } from "react";
import BusinessResults from "./BusinessResults";

const businesses = [
  {
    businessId: "b1",
    name: "San Mateo Public Library",
    address: "55 W 3rd Ave",
    city: "San Mateo",
    category: "Library",
  },
  {
    businessId: "b2",
    name: "Ducky's Car Wash",
    address: "716 N San Mateo Dr",
    city: "Santa Clara",
    category: "Car Wash",
  },
  {
    businessId: "b3",
    name: "Hanabi",
    address: "723 California Dr",
    city: "Burlingame",
    category: "Restaurant",
  },
];

function BusinessSearch(props) {
  const [selectedCategory, setSelectedCategory] = useState([
    true,
    true,
    true,
  ]);
  const [selectedCity, setSelectedCity] = useState("All");

  const filterBusinesses = () => {
    const categories = ["Library", "Restaurant", "Car Wash"];

    const getSelectedCategories = () => {
      return categories.filter((c, index) => {
        return selectedCategory[index] === true;
      });
    };

    const selectedCategories = getSelectedCategories();

    const categoryFiltered = businesses.filter((b) => {
      return selectedCategories.includes(b.category);
    });

    console.log(categoryFiltered);

    const cityFiltered =
      selectedCity === "All"
        ? categoryFiltered
        : categoryFiltered.filter((b) => {
            return b.city === selectedCity;
          });
    return cityFiltered;
  };

  const handleOnChange = (position) => {
    const updatedCheckState = selectedCategory.map((item, index) => {
      return index === position ? !item : item;
    });

    setSelectedCategory(updatedCheckState);
  };

  return (
    <div>
      <h1>Business Search</h1>
      <form>
        <label>
          Select Business Category:
          <input
            type="checkbox"
            name="Library"
            value="Library"
            checked={selectedCategory[0]}
            onChange={() => handleOnChange(0)}
          />
          <label>Library</label>
          <input
            type="checkbox"
            name="Restaurant"
            value="Restaurant"
            checked={selectedCategory[1]}
            onChange={() => handleOnChange(1)}
          />
          <label>Restaurant</label>
          <input
            type="checkbox"
            name="Car Wash"
            value="Car Wash"
            checked={selectedCategory[2]}
            onChange={() => handleOnChange(2)}
          />
          <label>Car Wash</label>
        </label>

        <label>
          Select Business City:
          <select
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
          >
            <option value="All">All</option>
            <option value="San Mateo">San Mateo</option>
            <option value="Santa Clara">Santa Clara</option>
            <option value="Burlingame">Burlingame</option>
          </select>
        </label>
      </form>

      <BusinessResults businesses={filterBusinesses()} />
    </div>
  );
}

export default BusinessSearch;
