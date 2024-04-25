from typing import Any

from flask import Blueprint, request, make_response

import store.db.query.host_rule as host_rule_db 
from store.db.db import create_transection
from store.db.model.host_rule import HostRule, HostRuleOrder
from route_util import audit_route


host_bp = Blueprint("host", __name__, url_prefix="/api/host")

@audit_route(host_bp, "/", methods=["POST"])
def add_hostrule():
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    name: str = payload["name"]
    weekday: int = payload["weekday"]
    period: int = payload["period"]
    startDate: str = payload["startDate"]
    endDate: str = payload["endDate"]
    rule: str = payload["rule"]
    orders: list[dict[str, Any]] = payload["orders"]

    with create_transection() as (connection, transection):
        id: int = host_rule_db.add_host_rule_without_commit(
            HostRule(
                name=name,
                startDate=startDate,
                endDate=endDate,
                period=period,
                weekday=weekday,
                rule=rule,
                deleted=False
            ), 
            connection
        )
        host_rule_db.add_host_rule_user_without_commit(
            [HostRuleOrder(id, order["account"], order["index"]) for order in orders],
            connection
        )

    return make_response({"status": "OK"})


@audit_route(host_bp, "/", methods=["GET"])
def getHostRules():
    host_rules: list[HostRule] = host_rule_db.get_host_rules()
    result = []

    for host_rule in host_rules:
        host_rule_json = host_rule.to_json()
        host_rule_json |= {
            "users": host_rule_db.get_host_rule_users(host_rule.id)
        }
        result.append(host_rule_json)

    return make_response({
        "status": "OK",
        "data": result
    })