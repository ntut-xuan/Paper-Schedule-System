from typing import Any, List

from psycopg.rows import TupleRow, class_row, dict_row

from store.db import connection
from store.model.role import Role
from store.model.user import User

def get_user(account: str) -> User | None:
    with connection.cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select u.id, u."name", u.email, u.note, u."blocked", r.id as "roleId", r.name as "roleName", u.account
            from "user" u 
            join "role" r on r.id = u."role"
            where u.account = %s;            
        """
        cursor.execute(sql, (account,))
        result: dict[str, Any] = cursor.fetchone()
        cursor.close()
        return User(
            result["id"],
            result["account"],
            result["name"],
            result["email"],
            result["note"],
            result["blocked"],
            Role(
                result["roleId"],
                result["roleName"]
            )
        )


def get_users() -> List[User]:
    with connection.cursor(row_factory=class_row(User)) as cursor:
        sql: str = """
            select u.id, u."name", u.email, u.note, u."blocked", r.id as "roleId", r.name as "roleName", u.account
            from "user" u 
            join "role" r on r.id = u."role";       
        """
        cursor.execute(sql)
        result: List[User] = cursor.fetchall()
        cursor.close()
        return User(
            result["id"],
            result["account"],
            result["name"],
            result["email"],
            result["note"],
            result["blocked"],
            Role(
                result["roleId"],
                result["roleName"]
            )
        )

        
def add_user(user: User) -> None:
    try:
        with connection.cursor() as cursor:
            sql: str = """
                INSERT INTO public."user"
                ("name", email, note, "blocked", "role", account)
                VALUES(%s, %s, %s, %s, %s, %s);            
                """
            cursor.execute(sql, (
                user.name, 
                user.email, 
                user.note, 
                user.blocked, 
                user.role,  
                user.account
            ))
            connection.commit()
            cursor.close()
    except Exception as e:
        connection.rollback()
        raise e
    

def set_user(account: str, user: User) -> None:
    try:
        with connection.cursor() as cursor:
            sql: str = """
                UPDATE public."user"
                SET "name"=%s, email=%s, note=%s, "blocked"=%s, "role"=%s
                WHERE account=%s;            
                """
            cursor.execute(sql, (
                user.name, 
                user.email, 
                user.note, 
                user.blocked, 
                user.role,  
                account
            ))
            connection.commit()
            cursor.close()
    except Exception as e:
        connection.rollback()
        raise e