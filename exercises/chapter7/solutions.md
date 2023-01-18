# Chapter 7 Exercise Solutions

1. Create a new query field called qualityBusinesses that uses a `@cypher` schema directive to return businesses that have at least two reviews each with four or more stars. Protect this field, using a roles rule and the `@auth` schema directive to require a role of analyst. Create a JWT that includes this role in the claims, and use Apollo Studio to query this new `qualityBusinesses` field.

In our GraphQL type definitions:

```GraphQL
type Query {
    qualityBusinesses: [Business!]!
      @cypher(
        statement: """
        MATCH (b:Business)<-[:REVIEWS]-(r:Review)
        WITH b, COLLECT(r) AS reviews
        WHERE all(r IN reviews WHERE r.stars > 4.0)
        RETURN b
        """
      )
      @auth(rules: [{ roles: ["analyst"] }])
}
```

2. In this chapter, we used a GraphQL mutation to create a new business review. Update the React application to include a form to allow the currently authenticated user to create new business reviews.

In `BusinessResults.js`:

```js
import { starredVar } from "./index";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, gql } from "@apollo/client";

function BusinessResults(props) {
  const { businesses } = props;
  const starredItems = starredVar();
  const { user, isAuthenticated } = useAuth0();

  const ADD_REVIEW_MUTATION = gql`
    mutation AddReview($businessId: ID!, $userId: ID!, $stars: Float!) {
      createReviews(
        input: {
          business: {
            connect: { where: { node: { businessId: $businessId } } }
          }
          date: "2022-01-22" # TODO: get current date
          stars: $stars
          user: { connect: { where: { node: { userId: $userId } } } }
        }
      ) {
        reviews {
          business {
            name
          }
          text
          stars
        }
      }
    }
  `;

  const [addReview, { data, loading, error }] = useMutation(
    ADD_REVIEW_MUTATION
  );

  return (
    <div>
      <h2>Results</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Address</th>
            <th>Category</th>
            {isAuthenticated ? <th>Average Stars</th> : null}
            {isAuthenticated ? <th>Review</th> : null}
          </tr>
        </thead>
        <tbody>
          {businesses.map((b, i) => (
            <tr key={i}>
              <td>
                <button
                  onClick={() =>
                    starredVar([...starredItems, b.businessId])
                  }
                >
                  Star
                </button>
              </td>
              <td style={b.isStarred ? { fontWeight: "bold" } : null}>
                {b.name}
              </td>
              <td>{b.address}</td>
              <td>
                {b.categories.reduce(
                  (acc, c, i) => acc + (i === 0 ? " " : ", ") + c.name,
                  ""
                )}
              </td>
              {isAuthenticated ? <td>{b.averageStars}</td> : null}
              {isAuthenticated ? (
                <td>
                  <select
                    onChange={(event) => {
                      addReview({
                        variables: {
                          userId: user.sub,
                          businessId: b.businessId,
                          stars: parseFloat(event.target.value),
                        },
                      });
                    }}
                  >
                    <option value="1.0">1</option>
                    <option value="2.0">2</option>
                    <option value="3.0">3</option>
                    <option value="4.0">4</option>
                    <option value="5.0">5</option>
                  </select>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BusinessResults;
```
