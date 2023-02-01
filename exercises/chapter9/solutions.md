# Chapter 9 Solutions

Starting with the following type definitions:

```GraphQL
interface Contains {
  quantity: Int
}
type User {
  username: String
  orders: [Order!]! @relationship(type: "PLACED", direction: OUT)
}
type Order {
  orderId: ID! @id
  created: DateTime! @timestamp(operations: [CREATE])
  customer: User! @relationship(type: "PLACED", direction: IN)
  products: [Product!]!
    @relationship(type: "CONTAINS", direction: OUT, properties: "Contains")
}
type Video {
  title: String
  sku: String
}
type Book {
  title: String
  isbn: String
}
union Product = Video | Book
```

1. The price a customer pays for an item can vary. For example, the price may change or be temporarily reduced as part of a promotion. Add a relationship property to store the price for each item paid in an order.

```GraphQL
interface Contains {
  quantity: Int
  pricePaid: Float
}
```

2. Write a `@cypher` directive field to compute the order subtotal. Be sure to take into account the quantity of each item included in the order.

extend type Order {
  subtotal: Float
    @cypher(
      statement: """
      MATCH (this)-[r:CONTAINS]->(:Book|Video)
      RETURN sum(r.quantity * r.pricePaid)
      """
    )
}

3. Write a GraphQL query to paginate the items included in an order, first using offset pagination and then using cursor-based pagination. Can you navigate from the last page to the first page as well?

First, using offset pagination (for each page we would adjust the value of the `limit` and `offset` arguments):

```GraphQL
{
  orders(options: {limit: 1}) {
    products(options: {limit: 1, offset: 0}) {
      __typename
      ... on Video {
        title
        sku
      }
      ... on Book {
        title
        isbn
      }
    }
  }
}
```


Then using cursor-based pagination (replacing the value of the `after` argument with the `endCursor` value to retrieve the next page):

```GraphQL
{
  orders(options: { limit: 1 }) {
    productsConnection(first: 1, after: "YXJyYXljb25uZWN0aW9uOjI=") {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        quantity
        pricePaid
        node {
          __typename
          ... on Video {
            title
            sku
          }
          ... on Book {
            title
            isbn
          }
        }
      }
    }
  }
}

```