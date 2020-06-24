# Chapter 4 Exercises

1. Query the GraphQL API we created in this chapter using GraphQL Playground to find:
  * Which users have reviewed the business named “Hanabi”?
  * Find any reviews that contain the word "comfortable". What business(es) are they reviewing?
  * Which users have given no five-star reviews?
2.	Add a @cypher directive field to the Category type that computes the number of businesses in each category. How many businesses are in the “Coffee” category?
3.	Create a Neo4j Sandbox instance at https://sandbox.neo4j.com choosing from any of the pre-populated datasets. Using the inferSchema method from neo4j-graphql.js, create a GraphQL API for this Neo4j Sandbox instance without manually writing GraphQL type definitions. What data can you query for using GraphQL?
