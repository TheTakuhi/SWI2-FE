import { useQuery } from "react-query";
import securedApi from "../../../api/securedApi";

const rootKey = "chatroomMessages";

export const getChatroomMessagesQueryKey = (chatroomId) => chatroomId ? [rootKey, String(chatroomId)] : rootKey;

export const useChatroomMessagesQuery = (chatroomId, onCompleted) =>
    useQuery(getChatroomMessagesQueryKey(chatroomId), () =>
        securedApi
            .get(`/chatrooms/${chatroomId}/messages`)
            .then(response => {
                onCompleted && onCompleted(response.data);
                return response.data;
            })
    );