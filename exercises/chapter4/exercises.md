# Chapter 4 Exercises

1. Query the GraphQL API we created in this chapter using GraphQL Playground to find:
  * Which users have reviewed the business named “Hanabi”?
     * answer
     
      ``` 
         {
           User(filter: {wrote_some:{
             reviews_some: {
               name: "Hanabi"
             }
           }}){
             name
           }
         }

     ```
  * Find any reviews that contain the word "comfortable". What business(es) are they reviewing?
    * answer
    
     ```
        {
          Review(filter: { text_contains: "comfortable" }) {
            reviews {
              name
            }
          }
        }
     ```


  * Which users have given no five-star reviews?
    * answer 

     ```
       {
         User(filter: {
           wrote_some: {
             OR: [{ stars_lt: 5 }, { stars_gt: 5 }] 
           }
         }) {
           name
         }
       } 
       
2.	Add a @cypher directive field to the Category type that computes the number of businesses in each category. How many businesses are in the “Coffee” category?
    * answer : 2
    * graphql

       ```
         type Category {
           _id: Long!
           name: String!
           businesss: [Business] @relation(name: "IN_CATEGORY", direction: IN)
           numOfBusiness: Int! @cypher(statement:"""
              MATCH (this)<-[:IN_CATEGORY]-(b:Business) with b RETURN COUNT(b)
           """)
        }

     * query

        ```
          {
            Category(filter: {name: "Coffee"}){
             numOfBusiness
           }
           }


      
4.	Create a Neo4j Sandbox instance at https://sandbox.neo4j.com choosing from any of the pre-populated datasets. Using the inferSchema method from neo4j-graphql.js, create a GraphQL API for this Neo4j Sandbox instance without manually writing GraphQL type definitions. What data can you query for using GraphQL?
