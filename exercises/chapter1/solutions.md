# Chapter One Exercise Solutions

## Exercise 1

Using the GraphQL endpoint at `movies.neo4j-graphql.com` write GraphQL queries to answer the following questions:

> Find the titles of the first 10 movies, ordered by title.

We'll start with the `movies` Query field as the entry point for our GraphQL operation. Then we'll need to make use of the `limit` and `sort` arguments.

```GraphQL
{
  movies(options: { limit: 10, sort: { title: ASC } }) {
    title
  }
}
```

```JSON
{
  "data": {
    "movies": [
      {
        "title": "\"Great Performances\" Cats"
      },
      {
        "title": "$9.99"
      },
      {
        "title": "'Hellboy': The Seeds of Creation"
      },
      {
        "title": "'Neath the Arizona Skies"
      },
      {
        "title": "'Round Midnight"
      },
      {
        "title": "'Salem's Lot"
      },
      {
        "title": "'Til There Was You"
      },
      {
        "title": "'burbs, The"
      },
      {
        "title": "'night Mother"
      },
      {
        "title": "(500) Days of Summer"
      }
    ]
  }
}
```

> Who acted in the movie "Jurassic Park"?

Here we'll make use of the `where` argument to filter for the movie *Jurassic Park*, then traverse to actors connected to the movie by adding the `actors` field to our GraphQL selection set.

```GraphQL
{
  movies(where: { title: "Jurassic Park" }) {
    title
    actors {
      name
    }
  }
}
```

```JSON
{
  "data": {
    "movies": [
      {
        "title": "Jurassic Park",
        "actors": [
          {
            "name": "Jeff Goldblum"
          },
          {
            "name": "Laura Dern"
          },
          {
            "name": "Richard Attenborough"
          },
          {
            "name": "Sam Neill"
          }
        ]
      }
    ]
  }
}
```

> What are the genres of "Jurassic Park"? What other movies are in those genres?

First, we'll add `genres` to our GraphQL selection set to find the genres for *Jurassic Park*.

```GraphQL
{
  movies(where: { title: "Jurassic Park" }) {
    title
    genres {
      name
    }
  }
}
```

```JSON
{
  "data": {
    "movies": [
      {
        "title": "Jurassic Park",
        "genres": [
          {
            "name": "Thriller"
          },
          {
            "name": "Sci-Fi"
          },
          {
            "name": "Adventure"
          },
          {
            "name": "Action"
          }
        ]
      }
    ]
  }
}
```

Now to find the movies in the same genres as *Jurassic Park* we add a nested selection to traverse to movie nodes from the genre nodes, adding a limit to only return 3 movies per genre.

```GraphQL
{
  movies(where: { title: "Jurassic Park" }) {
    title
    genres {
      name
      movies(options: { limit: 3 }) {
        title
      }
    }
  }
}
```

```JSON
{
  "data": {
    "movies": [
      {
        "title": "Jurassic Park",
        "genres": [
          {
            "name": "Thriller",
            "movies": [
              {
                "title": "Captive, The"
              },
              {
                "title": "Helter Skelter"
              },
              {
                "title": "Nightcrawler"
              }
            ]
          },
          {
            "name": "Sci-Fi",
            "movies": [
              {
                "title": "Predestination"
              },
              {
                "title": "Giver, The"
              },
              {
                "title": "Jupiter Ascending"
              }
            ]
          },
          {
            "name": "Adventure",
            "movies": [
              {
                "title": "Boxtrolls, The"
              },
              {
                "title": "The Book of Life"
              },
              {
                "title": "Teenage Mutant Ninja Turtles"
              }
            ]
          },
          {
            "name": "Action",
            "movies": [
              {
                "title": "Dracula Untold"
              },
              {
                "title": "Stretch"
              },
              {
                "title": "Predestination"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

> What movie has the highest `imdbRating`?

This one is a bit tricky because we'll need to filter out any movies that have a null value for `imdbRating`.

```GraphQL
{
  movies(
    where: { imdbRating_NOT: null }
    options: { sort: { imdbRating: DESC }, limit: 3 }
  ) {
    title
    imdbRating
  }
}
```

```JSON
{
  "data": {
    "movies": [
      {
        "title": "Band of Brothers",
        "imdbRating": 9.6
      },
      {
        "title": "Civil War, The",
        "imdbRating": 9.5
      },
      {
        "title": "Cosmos",
        "imdbRating": 9.3
      }
    ]
  }
}
```

## Exercise 2

> Consider the business reviews application we described earlier in the chapter. See if you can create the GraphQL type definitions necessary for this application.

There are many ways to approach this, but here's a sensible example of what the GraphQL type definitions for this API might look like:

```GraphQL
type Query {
  allBusinesses: [Business]
  businessBySearchTerm(search: String!): [Business]
  userById(id: ID!): User
}

type Business {
  businessId: ID!
  name: String
  address: String  
  avgStars: Float
  photos: [Photo]
  reviews: [Review]
}

type User {
  userId: ID!
  name: String
  photos: [Photo]
  reviews: [Review]
}

type Photo {
  business: Business
  user: User
  photoId: ID!
  url: String
}

type Review {
  reviewId: ID!
  stars: Float
  text: String
  user: User
  business: Business
}
```

## Exercise 3

> Download Neo4j and familiarize yourself with Neo4j Desktop and Neo4j Browser. Work through a Neo4j Sandbox example dataset guide at `neo4j.com/sandbox`

