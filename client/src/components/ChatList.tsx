import { useEffect, useState } from "react"
import { Chat } from "../types/chat"
import ChatItem from "./ChatItem"
import { getChats } from "../services/chat-service"
import { ListGroup } from "react-bootstrap"
import InfiniteScroll from "react-infinite-scroll-component"
import Loader from "./shared/Loader"
import { PAGE_LIMIT, USER_ID } from "../constants"

type Props = {
    unread?: boolean;
    handleCurrentChat: (chat: Chat) => void
}

const ChatList = (props: Props) => {
    const { unread, handleCurrentChat } = props
    const [chats, setChats] = useState<Array<Chat>>([])
    const [hasMore, sethasMore] = useState(true);
    const [page, setpage] = useState(2);
    const userId = localStorage.getItem(USER_ID)!

    useEffect(() => {
        (async () => {
            try {
                const res = await getChats({ user_id: userId, page: 1, limit: PAGE_LIMIT, unread })
                const chats = res.data
                setChats(chats)
                if (chats.length === 0 || chats.length < PAGE_LIMIT) {
                    sethasMore(false);
                }

            } catch (error) { }
        })()
    }, [])

    const fetchData = async () => {
        const res = await getChats({ user_id: userId, page, limit: PAGE_LIMIT, unread });
        const chats = res.data
        setChats((prev) => [...prev, ...chats]);

        if (chats.length === 0 || chats.length < PAGE_LIMIT) {
            sethasMore(false);
        }
        setpage(page + 1);
    };

    return (
        <div id="scrollableDiv" style={{ height: "80vh", overflowY: "scroll" }}>
            <InfiniteScroll
                dataLength={chats.length}
                next={fetchData}
                hasMore={hasMore}
                loader={<Loader />}
                endMessage={<small className="text-muted d-flex justify-content-center">No more chats to display.</small>}
                scrollableTarget="scrollableDiv"
            >
                <ListGroup>
                    {
                        chats.map((chat) => <ChatItem key={chat.id} chat={chat} handleCurrentChat={handleCurrentChat} />)
                    }
                </ListGroup>
            </InfiniteScroll>
        </div>
    )
}

export default ChatList