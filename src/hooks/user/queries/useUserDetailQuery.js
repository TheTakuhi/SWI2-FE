import { useQuery } from "react-query";
import securedApi from "../../../api/securedApi";

const rootKey = "userDetail";

export const getUserDetailQueryKey = () => rootKey;

export const useUserDetailQuery = () =>
    useQuery(getUserDetailQueryKey(), () =>
        securedApi
            .get(`/users/detail`)
            .then(response => response.data)
    );
