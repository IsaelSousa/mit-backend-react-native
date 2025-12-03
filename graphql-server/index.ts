import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { v4 as uuidv4 } from 'uuid';

interface Country {
    id: string;
    name: string;
    code: string;
    language: string[];
    defaultLatitude: number;
    defaultLongitude: number;
}

let countries: Country[] = [
    {
        id: uuidv4(), name: "United States", code: "US", language: ["English"],
        defaultLatitude: 37.0902,
        defaultLongitude: -95.7129
    },
    {
        id: uuidv4(), name: "China", code: "CN", language: ["Mandarin"],
        defaultLatitude: 35.8617,
        defaultLongitude: 104.1954
    },
    {
        id: uuidv4(), name: "India", code: "IN", language: ["Hindi", "English"],
        defaultLatitude: 20.5937,
        defaultLongitude: 78.9629
    },
    {
        id: uuidv4(), name: "Indonesia", code: "ID", language: ["Indonesian"],
        defaultLatitude: -0.7893,
        defaultLongitude: 113.9213
    },
    {
        id: uuidv4(), name: "Pakistan", code: "PK", language: ["Urdu", "English"],
        defaultLatitude: 30.3753,
        defaultLongitude: 69.3451
    },
    {
        id: uuidv4(), name: "Brazil", code: "BR", language: ["Portuguese"],
        defaultLatitude: -14.2350,
        defaultLongitude: -51.9253
    },
    {
        id: uuidv4(), name: "Nigeria", code: "NG", language: ["English"],
        defaultLatitude: 9.0820,
        defaultLongitude: 8.6753
    },
    {
        id: uuidv4(), name: "Bangladesh", code: "BD", language: ["Bengali"],
        defaultLatitude: 23.6850,
        defaultLongitude: 90.3563
    },
    {
        id: uuidv4(), name: "Russia", code: "RU", language: ["Russian"],
        defaultLatitude: 61.5240,
        defaultLongitude: 105.3188
    },
    {
        id: uuidv4(), name: "Mexico", code: "MX", language: ["Spanish"],
        defaultLatitude: 23.6345,
        defaultLongitude: -102.5528
    },
    {
        id: uuidv4(), name: "Japan", code: "JP", language: ["Japanese"],
        defaultLatitude: 36.2048,
        defaultLongitude: 138.2529
    },
    {
        id: uuidv4(), name: "Ethiopia", code: "ET", language: ["Amharic"],
        defaultLatitude: 9.1450,
        defaultLongitude: 40.4897
    },
    {
        id: uuidv4(), name: "Philippines", code: "PH", language: ["Filipino", "English"],
        defaultLatitude: 12.8797,
        defaultLongitude: 121.7740
    },
    {
        id: uuidv4(), name: "Egypt", code: "EG", language: ["Arabic"],
        defaultLatitude: 26.8206,
        defaultLongitude: 30.8025
    },
    {
        id: uuidv4(), name: "Vietnam", code: "VN", language: ["Vietnamese"],
        defaultLatitude: 14.0583,
        defaultLongitude: 108.2772
    },
    {
        id: uuidv4(), name: "Turkey", code: "TR", language: ["Turkish"],
        defaultLatitude: 38.9637,
        defaultLongitude: 35.2433
    },
    {
        id: uuidv4(), name: "Iran", code: "IR", language: ["Persian"],
        defaultLatitude: 32.4279,
        defaultLongitude: 53.6880
    },
    {
        id: uuidv4(), name: "Germany", code: "DE", language: ["German"],
        defaultLatitude: 51.1657,
        defaultLongitude: 10.4515
    },
    {
        id: uuidv4(), name: "Thailand", code: "TH", language: ["Thai"],
        defaultLatitude: 15.8700,
        defaultLongitude: 100.9925
    },
    {
        id: uuidv4(), name: "United Kingdom", code: "GB", language: ["English"],
        defaultLatitude: 55.3781,
        defaultLongitude: -3.4360
    },
    {
        id: uuidv4(), name: "France", code: "FR", language: ["French"],
        defaultLatitude: 46.2276,
        defaultLongitude: 2.2137
    },
    {
        id: uuidv4(), name: "Italy", code: "IT", language: ["Italian"],
        defaultLatitude: 41.8719,
        defaultLongitude: 12.5674
    },
    {
        id: uuidv4(), name: "South Africa", code: "ZA", language: ["Afrikaans", "English", "Zulu"],
        defaultLatitude: -30.5595,
        defaultLongitude: 22.9375
    },
    {
        id: uuidv4(), name: "South Korea", code: "KR", language: ["Korean"],
        defaultLatitude: 35.9078,
        defaultLongitude: 127.7669
    },
    {
        id: uuidv4(), name: "Spain", code: "ES", language: ["Spanish"],
        defaultLatitude: 40.4637,
        defaultLongitude: -3.7492
    },
    {
        id: uuidv4(), name: "Canada", code: "CA", language: ["English", "French"],
        defaultLatitude: 56.1304,
        defaultLongitude: -106.3468
    },
    {
        id: uuidv4(), name: "Australia", code: "AU", language: ["English"],
        defaultLatitude: -25.2744,
        defaultLongitude: 133.7751
    }
];

const typeDefs = `#graphql
    type Country {
        id: String!
        name: String!
        code: String!
        language: [String!]!
        defaultLatitude: Float!
        defaultLongitude: Float!
    }

    type Query {
        countries: [Country!]!
        country(code: String!): Country
    }
`;

const resolvers = {
    Query: {
        countries: () => countries,
        country: (_: any, args: { code: string }) => countries.find(country => country.code === args.code),
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

const main = async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });
    console.log(`🚀 Server ready at ${url}`);
};

main();