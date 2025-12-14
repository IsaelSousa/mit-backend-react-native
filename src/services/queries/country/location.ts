import { gql, TypedDocumentNode } from "@apollo/client";

export interface AddLocation {
    addLocation: AddLocationParams
}

export interface AddLocationParams {
    latitude: number;
    longitude: number;
    name: string;
    color: string;
    imageBase64?: string;
}

export interface LocationData {
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    color: string;
    imageBase64?: string;
}

export interface AddLocationResponse {
    createLocation: LocationData;
}

export interface DeleteLocationResponse {
    deleteLocation: boolean;
}

export interface DeleteLocationParams {
    deleteLocationId: string;
}

export interface UpdateLocationParams {
    updateLocationId: string;
    name: string;
    longitude: number;
    latitude: number;
    color: string;
    imageBase64: string;
}

export const ADD_LOCATION: TypedDocumentNode<AddLocationResponse, AddLocationParams> = gql`
    mutation CreateLocation($latitude: Float!, $longitude: Float!, $name: String!, $color: String!, $imageBase64: String) {
        createLocation(latitude: $latitude, longitude: $longitude, name: $name, color: $color, imageBase64: $imageBase64) {
            id, name, color, latitude, longitude, imageBase64
        }
    }
`;

export const DELETE_LOCATION: TypedDocumentNode<DeleteLocationResponse, DeleteLocationParams> = gql`
    mutation DeleteLocation($deleteLocationId: String!) {
        deleteLocation(id: $deleteLocationId)
    }
`;

export const GET_ALL_LOCATIONS: TypedDocumentNode<{ location: LocationData[] }> = gql`
    query Location {
        location {
            color
            id
            imageBase64
            latitude
            longitude
            name
        }
    }
`;

export const UPDATE_LOCATION: TypedDocumentNode<{ location: LocationData }, UpdateLocationParams> = gql`
    mutation UpdateLocation($updateLocationId: String!, $name: String, $longitude: Float, $latitude: Float, $color: String, $imageBase64: String) {
        updateLocation(id: $updateLocationId, name: $name, longitude: $longitude, latitude: $latitude, color: $color, imageBase64: $imageBase64) {
            name
            longitude
            latitude
            imageBase64
            id
            color
        }
    }
`;