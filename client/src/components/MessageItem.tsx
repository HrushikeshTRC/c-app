import { Col, Row } from "react-bootstrap"
import { Message } from "../types/message"
import { USER_ID } from "../constants"
import CheckIcon from "../assets/CheckIcon"

type Props = {
    message: Message
}

const MessageItem = (props: Props) => {
    const { message } = props
    const userId = localStorage.getItem(USER_ID)
    const isMyMsg = message.sender_id === userId
    const fx = { span: 6, offset: isMyMsg ? 6 : 0 }

    return (
        <Row className="m-0 mb-2">
            <Col sm={fx} xs={fx} className={`border p-1 rounded border ${isMyMsg ? "border-primary" : ""}`}>
                <div>{message.content}</div>
                {isMyMsg ? <div className="d-flex justify-content-end"><CheckIcon fill={message.read ? "green" : "grey"} /></div> : null}
            </Col>
        </Row>
    )
}

export default MessageItem