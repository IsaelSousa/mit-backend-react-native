import { gql, TypedDocumentNode } from '@apollo/client';

export const GET_COUNTRY_INFORMATION: TypedDocumentNode<IData> = gql`
    query Query {
        countries {
            id,
            code,
            name,
            language,
            defaultLatitude,
            defaultLongitude
        }
    }
`;

export interface IData {
    countries: ICountry[];
}

export interface ICountry {
    id: string;
    code: string;
    name: string;
    language: string[];
    defaultLatitude: number;
    defaultLongitude: number;
}

export interface ICountryParams {
    code: string;
}