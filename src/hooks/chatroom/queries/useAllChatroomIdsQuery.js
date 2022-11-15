import {useQuery} from "react-query";
import securedApi from "../../../api/securedApi";

export const getAllChatroomsQueryKey = () => "chatrooms";

export const useAllChatroomIdsQuery = () =>
    useQuery(getAllChatroomsQueryKey(), () =>
        securedApi
            .get(`/chatrooms`)
            .then(response => response.data)
    );
