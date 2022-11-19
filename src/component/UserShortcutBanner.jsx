import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";

const UserShortcutBanner = ({ username, bg, fontSize, animation, tooltip }) => {
    const renderWithUsername = (badge) => (
        <span>
            {badge}
            {username}
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

    if (animation)
        return renderWithUsername(renderBadge());

    if (tooltip)
        return renderWithTooltip(renderBadge());

    return renderBadge();
}

export default UserShortcutBanner;