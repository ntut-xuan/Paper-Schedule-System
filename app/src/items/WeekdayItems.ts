import { SelectProps } from "antd";

const weekdayItems: SelectProps["options"] = [
    {
        label: "週一",
        value: "1"
    },
    {
        label: "週二",
        value: "2"
    },
    {
        label: "週三",
        value: "3"
    },
    {
        label: "週四",
        value: "4"
    },
    {
        label: "週五",
        value: "5"
    },
    {
        label: "週六",
        value: "6"
    },
    {
        label: "週日",
        value: "7"
    }
]

export default weekdayItems == null ? [] : weekdayItems;