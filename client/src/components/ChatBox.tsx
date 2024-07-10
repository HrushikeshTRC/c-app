import { Button, Card, Form, Image, InputGroup } from "react-bootstrap"
import { Chat } from "../types/chat"
import BackIcon from "../assets/BackIcon"
import { useEffect, useState } from "react";
import { Message } from "../types/message";
import { getMessagesByChat, getMessagesByChatAfter, readMessages, sendMsg } from "../services/message-service";
import { PAGE_LIMIT, USER_ID } from "../constants";
import InfiniteScroll from "react-infinite-scroll-component";
import MessageItem from "./MessageItem";
import Loader from "./shared/Loader";
import useInterval from "../hooks/useInterval";
import SendIcon from "../assets/SendIcon";

type Props = {
    chat: Chat;
    handleBack: () => void
}

const ChatBox = (props: Props) => {
    const { chat, handleBack } = props
    const [messages, setMessages] = useState<Array<Message>>([])
    const [hasMore, sethasMore] = useState(true);
    const [page, setpage] = useState(2);
    const [inputMsg, setInputMsg] = useState("")
    const userId = localStorage.getItem(USER_ID)

    useEffect(() => {
        (async () => {
            try {
                const res = await getMessagesByChat({ chatId: chat.id, page: 1, limit: PAGE_LIMIT })
                const msgs = res.data
                setMessages(msgs.reverse())
                if (msgs.length === 0 || msgs.length < PAGE_LIMIT) {
                    sethasMore(false);
                }

            } catch (error) { }
        })()
    }, [])

    useEffect(() => {
        markAllAsRead();
    }, [messages])

    useInterval(async () => {
        await getLatestMsgs()
    }, 5000);

    async function getLatestMsgs() {
        if (messages.length === 0) return;
        const lastMessageId = messages[messages.length - 1].id;
        try {
            const res = await getMessagesByChatAfter({ chatId: chat.id, lastMessageId });
            const msgs = res.data;
            if (msgs.length > 0) {
                setMessages((prev) => {
                    return [...prev, ...msgs.reverse()];
                });
            }
        } catch (error) { }
    }

    function markAllAsRead() {
        const unreadMessageIds = messages.filter(msg => msg.recipient_id === userId && !msg.read).map(msg => msg.id);
        if (unreadMessageIds.length > 0) {
            readMessages(unreadMessageIds);
        }
    }

    const fetchData = async () => {
        const res = await getMessagesByChat({ chatId: chat.id, page, limit: PAGE_LIMIT });
        const msgs = res.data
        setMessages((prev) => [...msgs.reverse(), ...prev]);

        if (msgs.length === 0 || msgs.length < PAGE_LIMIT) {
            sethasMore(false);
        }
        setpage(page + 1);
    };

    async function handleSendMsg(e: any) {
        e.preventDefault()
        if (!userId || !inputMsg) return
        const res = await sendMsg({
            chat_id: chat.id,
            content: inputMsg,
            created_at: new Date().toISOString(),
            recipient_id: chat.sender_details.id,
            sender_id: userId
        })
        if (res.success) {
            setInputMsg("")
            getLatestMsgs()
        }
    }

    return (
        <div>
            <Card >
                <Card.Body>
                    <Card.Title>
                        <div className="d-flex align-items-center border-bottom pb-2">
                            <Button size="sm" variant="muted" className="pb-2" onClick={handleBack}><BackIcon /></Button>
                            <Image src={chat.sender_details.profile_pic} roundedCircle width={40} height={40} />
                            <h5 className="ms-2">{chat.sender_details.first_name} {chat.sender_details.last_name}</h5>
                        </div>
                    </Card.Title>
                    <Card.Text>
                        <div id="reverseScrollableDiv" style={{
                            height: "67vh", overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column-reverse',
                        }}>
                            <InfiniteScroll
                                dataLength={messages.length}
                                next={fetchData}
                                style={{ display: 'flex', flexDirection: 'column-reverse' }}
                                inverse={true}
                                hasMore={hasMore}
                                loader={<Loader />}
                                // endMessage={<small className="text-muted d-flex justify-content-center">No more messages to display.</small>}
                                scrollableTarget="reverseScrollableDiv"
                            >
                                <div className="mt-2">
                                    {
                                        messages.map((msg) => <MessageItem key={msg.id} message={msg} />)
                                    }
                                </div>
                            </InfiniteScroll>
                        </div>
                        <Form onSubmit={handleSendMsg}>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    placeholder="Message"
                                    value={inputMsg}
                                    onChange={(e) => setInputMsg(e.target.value)}
                                />
                                <Button type="submit" disabled={!inputMsg} variant="outline-secondary">
                                    <SendIcon />
                                </Button>
                            </InputGroup>
                        </Form>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default ChatBox