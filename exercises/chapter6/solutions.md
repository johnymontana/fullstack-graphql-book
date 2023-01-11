# Chapter 6 Exercise Solutions

1. What other GraphQL fragments could we use across our application? Write some fragments, and try using them in your queries in Apollo Studio. When would it make sense to use multiple fragments in the same query?

GraphQL fragments help with code reuse and "don't repeat yourself". Fragments can be useful when a common subset of fields in a selection set are used by multiple views or components in the application.


2. Using GraphQL mutations, create relationships connecting business and category nodes to add businesses to additional categories. For example, add the newly created Philz Coffee business to the Restaurant and Breakfast categories. Add your favorite business and corresponding categories to the graph.

```GraphQL
mutation {
  updateBusinesses(
    where: { businessId: "b10" }
    connect: {
      categories: {
        where: { node: { OR: [{ name: "Restaurant" }, { name: "Breakfast" }] } }
      }
    }
  ) {
    businesses {
      name
      categories {
        name
      }
    }
  }
}
```

```json
{
  "data": {
    "updateBusinesses": {
      "businesses": [
        {
          "name": "Philz Coffee",
          "categories": [
            {
              "name": "Restaurant"
            },
            {
              "name": "Breakfast"
            }
          ]
        }
      ]
    }
  }
}
```

3. Turn the Star button into a toggle. If the business is already starred, remove it from the starred list.

In `web-react/src/BusinessResults.js`: 

```jsx
<tbody>
  {businesses.map((b, i) => (
    <tr key={i}>
      <td>
        <button
          onClick={() => {
            // toggle starred item, if starred then remove businessId from starredVar
            if (b.isStarred) {
              starredVar(
                starredItems.filter((i) => {
                  return i !== b.businessId;
                })
              );
            } else {
              // not starred, add businessId to starredVar
              starredVar([...starredItems, b.businessId]);
            }
          }}
        >
          Star
        </button>
      </td>
      <td style={b.isStarred ? { fontWeight: "bold" } : null}>
        {b.name}
      </td>
            
```
