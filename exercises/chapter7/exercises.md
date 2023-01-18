# Chapter 7 Exercises

1. Create a new query field called qualityBusinesses that uses a `@cypher` schema directive to return businesses that have at least two reviews each with four or more stars. Protect this field, using a roles rule and the `@auth` schema directive to require a role of analyst. Create a JWT that includes this role in the claims, and use Apollo Studio to query this new `qualityBusinesses` field.

2. In this chapter, we used a GraphQL mutation to create a new business review. Update the React application to include a form to allow the currently authenticated user to create new business reviews.