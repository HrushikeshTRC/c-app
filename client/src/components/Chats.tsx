import { Container, Tab, Tabs } from "react-bootstrap"
import ChatList from "./ChatList"
import { useState } from "react"
import { Chat } from "../types/chat"
import ChatBox from "./ChatBox"

const Chats = () => {
    const [currentChat, setCurrentChat] = useState<Chat | null>(null)

    function handleCurrentChat(chat: Chat) {
        setCurrentChat(chat)
    }

    function handleBack() {
        setCurrentChat(null)
    }

    return (
        <Container>
            {currentChat ? <ChatBox chat={currentChat} handleBack={handleBack} /> : <Tabs
                defaultActiveKey="all"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="all" title="All">
                    <ChatList handleCurrentChat={handleCurrentChat} />
                </Tab>
                <Tab eventKey="unread" title="Unread">
                    <ChatList unread handleCurrentChat={handleCurrentChat} />
                </Tab>
            </Tabs>}
        </Container>
    )
}

export default Chats