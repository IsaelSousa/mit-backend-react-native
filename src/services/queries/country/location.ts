import { gql, TypedDocumentNode } from "@apollo/client";

export const ADD_LOCATION: TypedDocumentNode<any> = gql`
    mutation AddLocation($input: AddLocationInput!) {
        addLocation(input: $input) { }
    }
`;

export const DELETE_LOCATION: TypedDocumentNode<{ deleteLocation: { id: string } }, { id: string }> = gql`
    mutation DeleteLocation($id: ID!) {
        deleteLocation(id: $id) {
            id
        }
    }
`;

export const GET_ALL_LOCATIONS: TypedDocumentNode<GetLocation> = gql`
    query GetLocations {
        locations {
            id
            latitude
            longitude
            name
            color
            imageBase64
        }
    }
`;

export const UPDATE_LOCATION: TypedDocumentNode<AddLocationParams, AddLocationParams> = gql`
    mutation UpdateLocation($input: UpdateLocationInput!) {
        updateLocation(input: $input) {
            id
            latitude
            longitude
            name
            color
            imageBase64
        }
    }
`;

export interface AddLocation {
    addLocation: AddLocationParams
}

export interface GetLocation {
    locations: AddLocationParams[];
}

export interface AddLocationParams {
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    color: string;
    imageBase64?: string;
}