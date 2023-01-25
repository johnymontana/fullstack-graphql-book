# Chapter 8 Exercises

1. Use Neo4j Bloom to find the user who has reviewed businesses belonging to the greatest number of categories. What are the categories of the businesses this user has reviewed? Hint: creating a Neo4j Bloom search phrase might be helpful with this exercise. Consult the documentation at http://mng.bz/XZR6.

We can create a search phrase in Bloom using the following Cypher query:

```Cypher
MATCH p=(u:User)-[:WROTE]->(:Review)-[:REVIEWS]->(b:Business)-[:IN_CATEGORY]->(c:Category)
WITH u, COLLECT(p) AS paths, COUNT(DISTINCT c) AS num_categories ORDER BY num_categories DESC
WITH u, paths LIMIT $num
UNWIND paths AS p
RETURN p
```

2. Create a new pull request that updates the business review application to always order the results by business name. Use Netlify’s deploy feature to review this update before merging the pull request and updating the application.

In `App.js` change GraphQL query to:

```js
const GET_BUSINESSES_QUERY = gql`
  query BusinessesByCategory($selectedCategory: String!) {
    businesses(options: {sort: {name: ASC}}, where: { categories: { name_CONTAINS: $selectedCategory } }) {
      businessId
      name
      address
      categories {
        name
      }
      ${isAuthenticated ? "averageStars" : ""}
      isStarred @client
    }
  }
`;
```

3. Create a new Netlify Function that uses the Neo4j JavaScript driver to query our Neo4j Aura cluster and return a list of the most recent reviews. Run it locally using the `netlify dev` command before deploying. Use the `netlify.toml` configuration to redirect `/reviews` to this function.

Create `lambda/reviews.js`:

```js
const neo4j = require("neo4j-driver");

const { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } = process.env;

const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
  var reviews = [];
  const session = driver.session({ database: "neo4j" });
  try {
    const reviewsQuery = `
    MATCH (r:Review)-[:REVIEWS]->(b:Business)
    RETURN r{.text, .stars,created: toString(r.date), business: b.name} AS review
    `;

    const result = await session.executeRead((tx) =>
      tx.run(reviewsQuery)
    );

    result.records.forEach((record) => {
      reviews.push(record.get("review"));
    });

    return { statusCode: 200, body: JSON.stringify(reviews) };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  } finally {
    await session.close();
  }
};
```