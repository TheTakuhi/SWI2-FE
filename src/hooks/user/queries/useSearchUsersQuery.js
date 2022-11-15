import { useQuery } from "react-query";
import securedApi from "../../../api/securedApi";

const rootKey = "usersSearch";

export const getUsersSearchQueryKey = (term) => term? [rootKey,term]:rootKey;

export const useSearchUsersQuery = (term) =>
    useQuery(getUsersSearchQueryKey(term), () =>
        securedApi
            .get(`/users/search?term=${term}`)
            .then(response => response.data)
    );
