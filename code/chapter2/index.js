const { ApolloServer } = require("apollo-server");

const businesses = [
  {
    businessId: "b1",
    name: "Missoula Public Library",
    address: "301 E Main St, Missoula, MT 59802",
    reviewIds: ["r1", "r2"],
  },
  {
    businessId: "b2",
    name: "San Mateo Public Library",
    address: "55 W 3rd Ave, San Mateo, CA 94402",
    reviewIds: ["r3"],
  },
];

const reviews = [
  {
    reviewId: "r1",
    stars: 3,
    text: "Friendly staff. Interlibrary loan is super fast",
    businessId: "b1",
    userId: "u1",
  },
  {
    reviewId: "r2",
    stars: 4,
    text: "Easy downtown access, lots of free parking",
    businessId: "b1",
    userId: "u2",
  },
  {
    reviewId: "r3",
    stars: 5,
    text: "Lots of glass and sunlight for reading. Comfy chairs in large print section.",
    businessId: "b1",
    userId: "u1",
  },
];

const users = [
  {
    userId: "u1",
    name: "Will",
    reviewIds: ["r1", "r2"],
  },
  {
    userId: "u2",
    name: "Bob",
    reviewIds: ["r3"],
  },
];

const db = { businesses, reviews, users };

const typeDefs = /* GraphQL */ `
  type Business {
    businessId: ID!
    name: String
    address: String
    avgStars: Float
    photos(first: Int = 3, offset: Int = 0): [Photo!]!
    reviews(first: Int = 3, offset: Int = 0): [Review!]!
  }

  type User {
    userId: ID!
    name: String
    photos: [Photo!]!
    reviews: [Review!]!
  }

  type Photo {
    business: Business!
    user: User!
    photoId: ID!
    url: String
  }

  type Review {
    reviewId: ID!
    stars: Float
    text: String
    user: User!
    business: Business!
  }

  enum BusinessOrdering {
    name_asc
    name_desc
  }

  type Query {
    allBusinesses(first: Int = 10, offset: Int = 0): [Business!]!
    businessBySearchTerm(
      search: String
      first: Int = 10
      offset: Int = 0
      orderBy: BusinessOrdering = name_asc
    ): [Business!]!
    userById(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    businessBySearchTerm: (obj, args, context, info) => {
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
      return context.db.businesses
        .filter((v) => {
          return v["name"].indexOf(args.search) !== -1;
        })
        .slice(args.offset, args.first)
        .sort(compare);
    },
    allBusinesses: (obj, args, context, info) => {
      return context.db.businesses;
    },
  },
  Business: {
    reviews: (obj, args, context, info) => {
      return obj.reviewIds.map((v) => {
        return context.db.reviews.find((review) => {
          return review.reviewId === v;
        });
      });
    },
    avgStars: (obj, args, context, info) => {
      const reviews = obj.reviewIds.map((v) => {
        return context.db.reviews.find((review) => {
          return review.reviewId === v;
        });
      });

      return (
        reviews.reduce((acc, review) => {
          return acc + review.stars;
        }, 0) / reviews.length
      );
    },
  },
  Review: {
    user: (obj, args, context, info) => {
      return context.db.users.find((user) => {
        return user.userId === obj.userId;
      });
    },
    business: (obj, args, context, info) => {
      return context.db.businesses.find((b) => {
        return b.businessId === obj.businessId;
      });
    },
  },
  User: {
    reviews: (obj, args, context, info) => {
      return obj.reviewIds.map((v) => {
        return context.db.reviews.find((review) => {
          return review.reviewId === v;
        });
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { db },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
