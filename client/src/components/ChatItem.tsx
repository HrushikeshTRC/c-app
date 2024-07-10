import { Badge, Card, Image, ListGroup } from "react-bootstrap"
import { Chat } from "../types/chat"

type Props = {
    chat: Chat
    handleCurrentChat: (chat: Chat) => void
}

const ChatItem = (props: Props) => {
    const { chat, handleCurrentChat } = props

    return (
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start"
            action
            onClick={() => handleCurrentChat(chat)}
        >
            <div className="ms-2 me-auto d-flex align-items-center">
                <Image src={chat.sender_details.profile_pic} roundedCircle width={40} height={40} />
                <div className="ms-3">
                    <div className="fw-bold">{chat.sender_details.first_name} {chat.sender_details.last_name}</div>
                    <div>{chat.last_message.content}</div>
                </div>
            </div>
            {
                (chat.unread_count) ?
                    <Badge bg="primary" pill>
                        {chat.unread_count}
                    </Badge> : null
            }

        </ListGroup.Item>
    )
}

export default ChatItem