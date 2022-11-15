import { useMutation } from "react-query";
import axios from "axios";

const useAuthenticateCommand = () =>
    useMutation((credentials) =>
        axios
            .post("http://localhost:8080/login", credentials)
            .then((response) => response.headers)
    );

export default useAuthenticateCommand;
