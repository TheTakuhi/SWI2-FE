import { getByKey } from "../../util/localStorage";
import SockJsClient from "react-stomp";
import { useUserDetailQuery } from "../../hooks/user/queries/useUserDetailQuery";
import { NotificationContainer } from "react-notifications";
import { createNotification } from "./createNotification";
import { useHistory, useLocation, } from "react-router-dom";
import { useEffect, useState } from "react";
import { matchPath } from "react-router";

const getChatroomId = (pathname) => getParams(pathname)?.chatroomId || undefined

const NotificationsHandler = () => {
    const { data: user } = useUserDetailQuery();
    const { push } = useHistory();
    const location = useLocation();

    const [chatroomId, setChatroomId] = useState(() => getChatroomId(location.pathname));

    const handleMessage = (message) => {
        if (!message.type) return;

        if (chatroomId && Number(chatroomId) === Number(message.chatroomId))
            return;

        createNotification("info", message, () => {
            push(`/chatrooms/${message.chatroomId}`)
        });
    }

    useEffect(() => {
        setChatroomId(getChatroomId(location.pathname));
    }, [location])

    if (!user) return <></>;

    return (
        <>
            <SockJsClient
                url="http://localhost:8080/chat"
                headers={{
                    "Authorization": 'Bearer ' + getByKey('token'),
                }}
                topics={[`/topic/user_${user.id}/notifications`]}
                onConnect={() => {
                    console.log("Websocket notifications client connected ");
                }}
                onDisconnect={() => {
                    console.log("Websocket notifications client disconnected")
                }}
                onMessage={handleMessage}
            />
            <NotificationContainer />
        </>
    );
}

export default NotificationsHandler;

const getParams = (pathname) => {
    const matchProfile = matchPath(pathname, {
        path: `/chatrooms/:chatroomId`,
    });
    return (matchProfile && matchProfile.params) || {};
};