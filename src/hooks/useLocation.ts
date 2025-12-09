import { useMutation, useQuery } from "@apollo/client/react";
import { ADD_LOCATION, AddLocationParams, DELETE_LOCATION, GET_ALL_LOCATIONS, UPDATE_LOCATION, UpdateLocationParams } from "../services/queries/country/location";

export function useLocation() {
  // Hooks no topo
  const queryResult = useQuery(GET_ALL_LOCATIONS);

  const [updateLocationMutate, updateResult] = useMutation(UPDATE_LOCATION);
  const [createLocationMutate, createResult] = useMutation(ADD_LOCATION);
  const [deleteLocationMutate, deleteResult] = useMutation(DELETE_LOCATION);

  // Funções que só chamam o mutate, sem criar hook
  const updateData = (payload: UpdateLocationParams) =>
    updateLocationMutate({ variables: { ...payload } });

  const createData = (payload: AddLocationParams) =>
    createLocationMutate({ variables: { ...payload } });

  const deleteData = (deleteLocationId: string) =>
    deleteLocationMutate({ variables: { deleteLocationId } });

  return {
    // query
    ...queryResult,           // ou data: queryResult.data etc.
    // mutations
    updateData,
    updateResult,
    createData,
    createResult,
    deleteData,
    deleteResult,
  };
}