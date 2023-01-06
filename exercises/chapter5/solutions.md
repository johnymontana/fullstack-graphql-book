# Chapter 5 Exercise Solutions

1. Move the search logic into a new component called `BusinessSearch`, and render that component from within the App component.

Create a new file `BusinessSearch.js`:

```js
import React, { useState } from "react";
import BusinessResults from "./BusinessResults";

const businesses = [
  {
    businessId: "b1",
    name: "San Mateo Public Library",
    address: "55 W 3rd Ave",
    category: "Library",
  },
  {
    businessId: "b2",
    name: "Ducky's Car Wash",
    address: "716 N San Mateo Dr",
    category: "Car Wash",
  },
  {
    businessId: "b3",
    name: "Hanabi",
    address: "723 California Dr",
    category: "Restaurant",
  },
];

function BusinessSearch(props) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div>
      <h1>Business Search</h1>
      <form>
        <label>
          Select Business Category:
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)} 
          >
            <option value="All">All</option>
            <option value="Library">Library</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Car Wash">Car Wash</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>

      <BusinessResults
        businesses={
          selectedCategory === "All"
            ? businesses
            : businesses.filter((b) => {
                return b.category === selectedCategory;
              })
        }
      />
    </div>
  );
}

export default BusinessSearch;

```

Then, App.js becomes:

```js
import React, { useState } from "react";
import BusinessResults from "./BusinessResults";
import BusinessSearch from "./BusinessSearch";

function App() {
  return <BusinessSearch />;
}

export default App;
```


2. Allow the business search to include filtering by city in addition to the business category. You’ll need to add the city to the sample data and include it in the table results.

In `BusinessSearch.js`:

```js
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
  const [selectedCategory, setSelectedCategory] = useState("All);
  const [selectedCity, setSelectedCity] = useState("All");

  const filterBusinesses = () => {

    const categoryFiltered = 
      selectedCategory === "All" 
        ? businesses 
        : businesses.filter((b) => {
          return b.category === selectedCategory; 
    })

    const cityFiltered =
      selectedCity === "All"
        ? categoryFiltered
        : categoryFiltered.filter((b) => {
            return b.city === selectedCity;
          });

    return cityFiltered;
  };

  return (
    <div>
      <h1>Business Search</h1>
      <form>
        <label>
          Select Business Category:
          <select
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
          >
            <option value="All">All</option>
            <option value="Library">Library</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Car Wash">Car Wash</option>
          </select>
          
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

        <input type="submit" value="Submit" />
      </form>

      <BusinessResults businesses={filterBusinesses()} />
    </div>
  );
}

export default BusinessSearch;

```

3. How would you handle searching by multiple categories? Modify the sample data to include multiple categories. Change form handling to allow selecting multiple categories. Update the filtering logic to pass the correct business search results to the BusinessResults component.


In `BusinessSearch.js`:

```js
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

  const handleOnChange = (position) => {
    const updatedCheckState = selectedCategory.map((item, index) => {
      return index === position ? !item : item;
    });

    setSelectedCategory(updatedCheckState);
  };

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

    //return categoryFiltered

    const cityFiltered =
      selectedCity === "All"
        ? categoryFiltered
        : categoryFiltered.filter((b) => {
            return b.city === selectedCity;
          });

    return cityFiltered;
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

        <input type="submit" value="Submit" />
      </form>

      <BusinessResults businesses={filterBusinesses()} />
    </div>
  );
}

export default BusinessSearch;
```