# Chapter Two Exercise Solutions

## Exercise 1

> Consider the other requirements of our business reviews application. Can you write GraphQL queries to address these requirements? What are the results?

Searching for business by search term:

```GraphQL
query {
  businessBySearchTerm(search: "San Mateo") {
    name
  }
}
```

```JSON
{
  "data": {
    "businessBySearchTerm": [
      {
        "name": "San Mateo Public Library"
      }
    ]
  }
}
```

Viewing reviews for a business:

```GraphQL
query {
  businessBySearchTerm(search: "San Mateo") {
    name
    reviews {
      stars
      text
      user {
        name
      }
    }
  }
}
```

```JSON
{
  "data": {
    "businessBySearchTerm": [
      {
        "name": "San Mateo Public Library",
        "reviews": [
          {
            "stars": 5,
            "text": "Lots of glass and sunlight for reading. Comfy chairs in large print section.",
            "user": {
              "name": "Will"
            }
          }
        ]
      }
    ]
  }
}
```




## Exercise 2

> What other fields should make use of pagination and ordering in our API? Update the type definitions to include the appropriate ordering and pagination fields and update the resolvers to handle these pagination arguments.

Let's add the ability to sort business reviews by stars. First, in our GraphQL type definitions we'll declare an enum called `ReviewOrdering` following the convention used for `BusinessOrdering`:

```GraphQL
enum ReviewOrdering {
  stars_asc
  stars_desc
}
```

Next, we'll use this enum as a field argument for the `Business.reviews` field, setting `stars_desc` as the default value for a new `orderBy` field argument:

```GraphQL
    reviews(first: Int = 3, offset: Int = 0, orderBy: ReviewOrdering = stars_desc): [Review!]!

```

Then we'll need to implement the `Business.reviews` resolver function (borrowing the `compare` function for the `businessBySearchTerm` resolver):

```JavaScript
Business: {
    reviews: (obj, args, context, info) => {
      const compare = (a, b) => {
        const [orderField, order] = args.orderBy.split("_");
        const left = a[orderField],
          right = b[orderField];
      
        if (left < right) {
          return order === "asc" ? -1 : 1;
        } else if (left > right) {
          return order === "desc" ? -1 : 1;
        } else {
          return 0;
        }
      };
      return obj.reviewIds.map((v) => {
        return context.db.reviews.find((review) => {
          return review.reviewId === v;
        })
      }).sort(compare);
    },
    // other resolvers implemented here
}
```

Finally we can verify this works by specifying a sort order for reviews:

```GraphQL
query {
  allBusinesses {
    name
    reviews(orderBy: stars_asc) {
      stars
      text
    }
  }
}

```

```JSON
{
  "data": {
    "allBusinesses": [
      {
        "name": "Missoula Public Library",
        "reviews": [
          {
            "stars": 3,
            "text": "Friendly staff. Interlibrary loan is super fast"
          },
          {
            "stars": 4,
            "text": "Easy downtown access, lots of free parking"
          }
        ]
      },
      {
        "name": "San Mateo Public Library",
        "reviews": [
          {
            "stars": 5,
            "text": "Lots of glass and sunlight for reading. Comfy chairs in large print section."
          }
        ]
      }
    ]
  }
}
```

## Exercise 3

> Implement the root-level resolver for `userById`.

`usersById` is included in the GraphQL type definitions already:

```GraphQL
type Query {
    # other fields here
    userById(id: ID!): User
  }
```

so we just need to implement the `Query.userById` resolver function:

```JavaScript
Query: {
  userById: (obj, args, context, info) => {
      return context.db.users.filter( (v) => {
        return v.userId == args.id
      })[0]
    },
    // Other resolver functions implemented here
}
```

## Exercise 4

> Our example GraphQL API conspicuously lacks business categories. Update the sample data, GraphQL type definitions, and resolvers to take advantage of business categories. Consider how you would model categories in the API given that searching by category was specifically identified as a business requirement.

First, let's update the sample data to include categories:

```JavaScipt
const businesses = [
  {
    businessId: "b1",
    name: "Missoula Public Library",
    address: "301 E Main St, Missoula, MT 59802",
    reviewIds: ["r1", "r2"],
    categories: ["Library", "Downtown"]
  },
  {
    businessId: "b2",
    name: "San Mateo Public Library",
    address: "55 W 3rd Ave, San Mateo, CA 94402",
    reviewIds: ["r3"],
    categories: ["Library"]
  },
];

const categories = [
  {
    name: "Downtown"
  },
  {
    name: "Library"
  }
]

// We don't need to modify reviews or users

const db = { businesses, reviews, users, categories };

```

Then we'll need to include category in our type definitions. Since we want to be able to search for businesses by category we'll make category its own type and include a root-level query field for category.

```GraphQL
extend type Query {
  categories: [Category]
}

type Category {
  name: String!
  businesses: [Business]
}

extend type Business {
  categories: [Category]
}
```

Then for the resolver function implementation:

```JavaScript
Category: {
    businesses: (obj, args, context, info) => {
      return context.db.businesses.filter( (v) => {
        return v.categories.includes(obj.name)
      })
    }
  }
```

```JavaScript
Query: {
  categories: (obj, args, context, info) => {
      return context.db.categories;
    },
    // Other resolvers implemented here
}
```

