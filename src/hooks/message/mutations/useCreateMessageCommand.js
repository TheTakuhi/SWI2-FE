import { useMutation } from "react-query";
import securedApi from "../../../api/securedApi";

const useCreateMessageCommand = () =>
    useMutation((newMessage) =>
        securedApi
            .post("/messages", newMessage)
            .then((response) => response.data)
    );

export default useCreateMessageCommand;
