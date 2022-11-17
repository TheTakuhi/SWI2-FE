import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useEffect, useState } from "react";
import TypeAnimation from "react-type-animation";

const UserShortcutBanner = ({ username, bg, fontSize, animation, tooltip }) => {
    const [hovered, setHovered] = useState(false);
    const [newTimeout, setNewTimeout] = useState(undefined);

    const handleOnMouseOver = () => {
        if (newTimeout) {
            clearTimeout(newTimeout);
            setNewTimeout(undefined);
        }
        setHovered(true);
    }

    const handleOnMouseLeave = () => setNewTimeout(setTimeout(() => {
        setHovered(false);
        setNewTimeout(undefined);
    }, 500));

    const renderWithAnimation = (badge) => (
        <span
            onMouseOver={handleOnMouseOver}
            onMouseLeave={handleOnMouseLeave}
        >
            {badge}
            {hovered && <TypeAnimation
                cursor={true}
                repeat={1}
                sequence={[username, 3000, username]}
                wrapper="span"
                className="h6"
            />}
        </span>
    );

    const renderWithTooltip = (badge) => (
        <OverlayTrigger
            placement="bottom"
            delay={{ show: 20, hide: 50 }}
            overlay={(props) => <Tooltip {...props}>{username}</Tooltip>}
        >
            {badge}
        </OverlayTrigger>
    )


    const renderBadge = () => (
        <Badge
            bg={`${bg || "secondary"}`}
            className="rounded-circle d-inline-block"
            style={{
                fontSize: fontSize || '1rem',
                cursor: "pointer"
            }}
        >{username.toUpperCase()[0]}</Badge>);

    useEffect(() => {
        return () => {
            if (newTimeout)
                clearTimeout(newTimeout);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (animation)
        return renderWithAnimation(renderBadge());

    if (tooltip)
        return renderWithTooltip(renderBadge());

    return renderBadge();
}

export default UserShortcutBanner;