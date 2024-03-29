import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { UserType } from "../type/user/userType";
import { useAppDispatch } from "../store/hook";
import { getUsers } from "../store/dataApi/UserApiSlice";
import UserCard from "./components/UserCard";
import { getRoles } from "../store/dataApi/SettingApiSlice";
import { RoleType } from "../type/setting/RoleType";

function Member(){
    const [users, setUsers] = useState<UserType[]>([]);
    const [roles, setRoles] = useState<RoleType[]>([]);
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getUsers()).then((response) => {
            if(response.meta.requestStatus == 'fulfilled'){
                const payload = response.payload;
                const users = payload["data"] as UserType[]
                setUsers(users);
            }
        })
    }, [])

    useEffect(() => {
        dispatch(getRoles()).then((response) => {
            if(response.meta.requestStatus == "fulfilled"){
                const payload = response.payload;
                const roles = payload["data"] as RoleType[]
                setRoles(roles)
            }
        })
    }, [])

    return (
        <Container className="p-5 text-center">
            <h2>實驗室成員</h2>
            <hr></hr>
            {
                roles.map((role: RoleType) => {
                    return (
                        <div className="pb-4 d-flex flex-column gap-3">
                            { users.filter((user) => user.role.id == role.id).length == 0 ? null :  
                                <h4>{role.name}</h4>
                            }
                            <div className="d-flex flex-row" style={{flexWrap: "wrap"}}>
                            {
                                users.filter((user) => user.role.id == role.id).map((user) => {
                                    return (
                                        <UserCard
                                            account={user.account}
                                            name={user.name} 
                                            email={user.email} 
                                            note={user.note}
                                        />
                                    )
                                })
                            }
                            </div>
                        </div>
                    )
                })
            }
        </Container>
    )
}

export default Member;