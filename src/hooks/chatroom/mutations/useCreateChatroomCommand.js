import { useMutation } from "react-query";
import securedApi from "../../../api/securedApi";

const useCreateChatroomCommand = () =>
    useMutation((chatroom) =>
        securedApi
            .post("/chatrooms", chatroom)
            .then((response) => response.data)
    );

export default useCreateChatroomCommand;
