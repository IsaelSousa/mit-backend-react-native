import { gql, TypedDocumentNode } from '@apollo/client';

export const GET_COUNTRY_INFORMATION: TypedDocumentNode<IData, ICountryParams> = gql`
    query Query ($code: String!) {
        country(code: $code) {
            name
            native
            capital
            emoji
            currency
            languages {
            code
            name
            }
        }
    }
`;

export interface IData {
    country: ICountry;
}

export interface ICountry {
    native: string;
    capital: string;
    emoji: string;
    currency: string;
    languages: Array<{
        code: string;
        name: string;
    }>;
    name: string;
}

export interface ICountryParams {
    code: string;
}