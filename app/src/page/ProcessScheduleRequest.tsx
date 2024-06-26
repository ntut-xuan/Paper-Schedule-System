import { CheckCircleOutlined, ClockCircleOutlined, LinkOutlined } from "@ant-design/icons";
import { Badge, Button, Calendar, Descriptions, DescriptionsProps, Result, StepProps, Steps, Tabs, Tag, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ScheduleType } from "../type/schedule/ScheduleType";
import UserAvatar from "./components/UserAvatar";
import { useNavigate, useParams } from "react-router-dom";
import TemporaryEventTooltip from "../components/TemporaryEventTooltip";
import { getAllSchedule, getSchedule } from "../store/dataApi/ScheduleApiSlice";
import { useAppDispatch } from "../store/hook";
import { specificScheduleDate } from "../store/dataApi/ScheduleAdminApiSlice";

export default function ProcessScheduleRequest(){
    const { scheduleId } = useParams()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [steps, setSteps] = useState<number>(0)
    const [specificSchedule, setSpecificSchedule] = useState<ScheduleType>()
    const [schedules, setSchedules] = useState<ScheduleType[]>([])
    const [cursorSelect, setCursorSelect] = useState<{
        hostRuleId: number,
        account: string,
        hostRuleIter: number,
        datetime: Dayjs
    } | null>(null)
    const getUserPendingSchedule = () => schedules.filter((schedule) => (schedule.user && schedule.status.id === 4 && schedule.user.account === specificSchedule?.user.account))
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(Date.now()))
    const stepItems: StepProps[] = [
        {
            title: '確認相關資料',
        },
        {
            title: '排定時間',
        },
        {
            title: '確認審核結果',
        },
        {
            title: '完成',
        }
    ]
    const descriptionItems: DescriptionsProps['items'] = [
        {
            key: "1",
            label: "名稱",
            children: `${specificSchedule?.name}`,
            span: 3
        },
        {
            key: "2",
            label: "主持人",
            children: `${specificSchedule?.user.name}`,
        },
        {
            key: "4",
            label: "報告時間",
            children: `${cursorSelect == null ? "待定" : cursorSelect.datetime.format("YYYY-MM-DD")}`,
            span: 2
        },
        {
            key: "5",
            label: "論文連結",
            children: (
                <Button type="link">{specificSchedule?.link}</Button>
            ),
            span: 1
        },
        {
            key: "6",
            label: "附件",
            children: <>
                { 
                    specificSchedule?.attachments.map((attachment) => {
                        return <Button type="link" icon={<LinkOutlined />} href={`/api/schedule/fetch_attachment/${attachment.virtualName}`}>{attachment.realName}</Button>
                    })
                }
            </>,
            span: 1
        }
    ]

    const EventTooltip = (props: {
        schedule: ScheduleType
    }) => {
        const schedule = props.schedule;
        return (
            <div className="p-2 d-flex flex-column gap-2">
                { schedule.user &&
                    <div className="d-flex flex-row gap-1">
                        <UserAvatar account={schedule.user.account} size={22}></UserAvatar>
                        <span className="my-auto">{schedule.user.name}</span>
                    </div>
                }
                <div className="d-flex flex-column gap-1">
                    <Tag color="default">{schedule.hostRule?.name}</Tag>
                    <Tag icon={<CheckCircleOutlined />} color="green">{schedule.status.name}</Tag>
                </div>
                <div className="d-flex flex-row gap-3">
                    <span>{schedule.name}</span>
                </div>
                <div className="w-100">
                    <span style={{color: "#bbbbbb"}}>不可覆蓋，該行程已被安排</span>
                </div>
            </div>
        )
    }

    const PendingTooltip = (props: {
        schedule: ScheduleType
    }) => {
        const schedule = props.schedule;
        
        return (
            <div className="p-2 d-flex flex-column gap-2">
                <div className="d-flex flex-row gap-1">
                    <UserAvatar account={schedule.user.account} size={22}></UserAvatar>
                    <span className="my-auto">{schedule.user.name}</span>
                </div>
                <div className="d-flex flex-column gap-1">
                    <Tag color="default">{schedule.hostRule?.name}</Tag>
                    <Tag icon={<ClockCircleOutlined />} color="default">等待規劃中</Tag>
                </div>
                <div className="w-100">
                    { specificSchedule?.user.id != schedule.user.id ? 
                        <span style={{color: "#bbbbbb"}}>不可覆蓋，行程主持人不相符</span> :
                        <span style={{color: "#bbbbbb"}}>點擊行程來進行覆蓋</span>
                    }
                </div>
            </div>
        )
    }

    const cellRender = (date: Dayjs, _info: any) => {
        return (
            <ul className="events">
                {
                    schedules.filter((schedule) => schedule.datetime == date.format("YYYY-MM-DD") && dayjs(schedule.datetime, "YYYY-MM-DD").isSame(selectedDate, 'month')).map((schedule) => {
                        if(schedule.status.id == 5){
                            return (
                                <Tooltip placement="right" title={<TemporaryEventTooltip schedule={schedule} />}>
                                    <li key={schedule.name}>
                                        <Badge status="error" style={{color: "#bbbbbb"}} text={`活動暫停：${schedule.name}`}></Badge>
                                    </li>
                                </Tooltip>
                            )
                        }
                        if(schedule.status.id == 4){
                            return (
                                <Tooltip placement="right" title={<PendingTooltip schedule={schedule}/>}>
                                    <li key={schedule.name} onClick={() => {
                                        if(specificSchedule?.user.id != schedule.user.id){
                                            return
                                        }
                                        setCursorSelect({
                                            hostRuleId: schedule.hostRule!.id,
                                            account: schedule.user.account,
                                            hostRuleIter: schedule.hostRuleIter,
                                            datetime: date
                                        })
                                    }}>
                                        { (schedule.hostRule && cursorSelect && schedule.hostRule.id == cursorSelect.hostRuleId && schedule.hostRuleIter == cursorSelect.hostRuleIter && schedule.user.account == cursorSelect.account) ?
                                            <Badge status="processing" className="p-1 bg-opacity-25 rounded" style={{backgroundColor: "#00ff8844"}} text={`${schedule.user.name} - ${schedule.hostRule?.name}`}></Badge> :
                                            <Badge status="processing" style={{color: specificSchedule?.user.id == schedule.user.id ? "black" : "#bbbbbb"}} text={`${schedule.user.name} - ${schedule.hostRule?.name}`}></Badge>
                                        }
                                    </li>
                                </Tooltip>
                            )
                        }
                        return (
                            <Tooltip placement="right" title={<EventTooltip schedule={schedule}/>}>
                                <li key={schedule.name}>
                                    { schedule.user ? 
                                        <Badge status="success" style={{color: "#bbbbbb"}} text={schedule.user.name + " - " + schedule.name}></Badge> :
                                        <Badge status="success" style={{color: "#bbbbbb"}} text={schedule.name}></Badge>
                                    }
                                </li>
                            </Tooltip>
                        )
                    })
                }
            </ul>
        )
    }

    const submit = () => {
        if(specificSchedule == null){
            throw Error("specificSchedule should not be null.")
        }
        if(cursorSelect == null){
            throw Error("cursorSelect should not be null.")
        }
        dispatch(specificScheduleDate({
            scheduleId: specificSchedule.id,
            hostRuleId: cursorSelect.hostRuleId,
            iteration: cursorSelect.hostRuleIter
        })).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                setSteps(steps + 1)
            }
        })
    }

    useEffect(() => {
        if(getUserPendingSchedule().length !== 0){  
            setSelectedDate(dayjs(getUserPendingSchedule()[0].datetime, "YYYY-MM-DD"))
        }
    }, [schedules])

    useEffect(() => {
        dispatch(getAllSchedule()).then((response: any) => {
            if(response.meta.requestStatus == 'fulfilled'){
                const payload = response.payload;
                const datas = payload["data"] as ScheduleType[];
                setSchedules(datas.filter((data => data.status.id === 2 || data.status.id === 4 || data.status.id === 5)))
            }
        })
    }, [scheduleId])

    useEffect(() => {
        if(scheduleId == undefined){
            return
        }
        dispatch(getSchedule(scheduleId)).then((response) => {
            if(response.meta.requestStatus == 'fulfilled'){
                const payload = response.payload;
                const data = payload["data"] as ScheduleType;
                setSpecificSchedule(data)
            }
        })
    }, [scheduleId])


    return (
        <Container className="p-5">
            <h2 className="text-center mb-5">審核活動</h2>
            <Steps className="border p-4 rounded mb-3" items={stepItems} current={steps}></Steps>
            { steps == 0 &&
                <div className="p-5 border rounded d-flex flex-column gap-3">
                    <Descriptions className="w-100" bordered title={"活動相關資訊"} items={descriptionItems}></Descriptions>
                    <hr></hr>
                    <Button type="primary" onClick={() => setSteps(steps + 1)}>完成確認</Button>
                </div>
            }
            { steps == 1 &&
                <div className="p-5 border rounded d-flex flex-column gap-3">
                    <h6> 請覆蓋某個已被規則所排定的活動 </h6>
                    <div className="d-flex flex-row gap-3" style={{height: "73vh"}}>
                        <Tabs
                            tabPosition="left"
                            items={getUserPendingSchedule().map((schedule) => {
                                return {
                                    label: (
                                        <div className="d-flex flex-column">
                                            <span>{schedule.user.name} - {schedule.hostRule?.name}</span>
                                            <span>{schedule.datetime}</span>
                                        </div>
                                    ),
                                    key: schedule.datetime
                                }
                            })}
                            onTabClick={(key: string, _e) => {
                                setSelectedDate(dayjs(key, "YYYY-MM-DD"))
                            }}
                        />
                        <Calendar 
                            cellRender={cellRender}
                            className="w-100 p-3 border rounded process-schedule-calendar"
                            value={selectedDate}
                            onSelect={(date, _selectInfo) => setSelectedDate(date)}
                            disabledDate={(date) => !date.isSame(selectedDate, 'month')}
                        ></Calendar>
                    </div>
                    <hr></hr>
                    <Button type="primary" disabled={cursorSelect == null} onClick={() => setSteps(steps + 1)}>提交</Button>
                </div>
            }
            { steps == 2 &&
                <div className="p-5 border rounded d-flex flex-column gap-3">
                    <Descriptions className="w-100" bordered title={"活動相關資訊"} items={descriptionItems}></Descriptions>
                    <hr></hr>
                    <Button type="primary" onClick={() => submit()}>完成確認</Button>
                </div>
            }
            { steps == 3 &&
                <div className="border rounded p-5 d-flex flex-column gap-5">
                <Result
                    status={"success"}
                    title="審核活動成功"
                    extra={[
                        <Button type="primary" className="w-100" onClick={() => navigate("/")}>回到首頁</Button>
                    ]}
                />
                </div>
            }
        </Container>
    )
}