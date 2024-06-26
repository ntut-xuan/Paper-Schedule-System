import { Card } from "react-bootstrap"
import UserAvatar from "./UserAvatar";
import { useNavigate } from "react-router-dom";

function UserCard(props: {
    className?: string
    account: string
    name: string,
    email: string,
    note: string
}) {
    const navigate = useNavigate()
    const account = props.account;
    const name = props.name
    const email = props.email
    const note = props.note
    const className = props.className

    return (
        <div className={className == null ? `col col-md-4 col-12 p-2` : className}>
            <Card className="p-3 d-flex flex-row gap-3" onClick={() => navigate(`/user/${account}/`)} style={{cursor: "pointer"}}>
                <div className="d-flex flex-column">
                    <UserAvatar account={account} size={64}></UserAvatar>
                </div>
                <div className="d-flex flex-column text-start">
                    <span className="fs-5 font-bold">{name}</span>
                    <span>{note}</span>
                    <span>{email}</span>
                </div>
            </Card>
        </div>
    )
}

export default UserCard;