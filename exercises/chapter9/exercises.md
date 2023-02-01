# Chapter 9 Exercises

1. The price a customer pays for an item can vary. For example, the price may change or be temporarily reduced as part of a promotion. Add a relationship property to store the price for each item paid in an order.
2. Write a `@cypher` directive field to compute the order subtotal. Be sure to take into account the quantity of each item included in the order.
3. Write a GraphQL query to paginate the items included in an order, first using offset pagination and then using cursor-based pagination. Can you navigate from the last page to the first page as well?