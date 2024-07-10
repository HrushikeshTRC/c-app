const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const initialUsers = require('./testData/users')
const { getLastMessageByChat, getUnreadCountByChat } = require('./helpers')
const initialChats = require('./testData/chats')
const initialMessages = require('./testData/messages')
const app = express()
const port = 5000

let messages = [...initialMessages]
let users = [...initialUsers]
let chats = [...initialChats]

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body
    const user = users.find(u => u.username === username)
    if (!user) {
        res.status(404).json({
            success: true,
            msg: "user not found."
        })
    }
    if (user.password === password) {
        res.status(200).json({
            success: true,
            msg: "login successfull.",
            data: user
        })
    } else {
        res.status(200).json({
            success: true,
            msg: "incorrect password."
        })
    }
})

app.get('/chat/all/:userId', (req, res) => {
    const { userId } = req.params
    const { unread, page = 1, limit = 10 } = req.query

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const userChats = chats.filter(x => x.user_id === userId)
    const senderChats = userChats.map(x => {
        const senderChat = chats.find(c => c.id === x.id && c.user_id !== userId)
        return senderChat
    })
    let data = senderChats.map(c => {
        const sender_details = users.find(x => x.id === c.user_id)
        const last_message = getLastMessageByChat(messages, c.id)
        const unread_count = getUnreadCountByChat(messages, c.id, userId)
        return ({
            id: c.id,
            sender_details,
            last_message,
            unread_count
        })
    })

    if (unread === "true") {
        data = data.filter(x => x.last_message.recipient_id === userId && x.last_message.read === false)
    }

    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    const paginatedData = data.slice(startIndex, endIndex);

    res.status(200).json({
        success: true,
        data: paginatedData,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(data.length / limitNumber),
        totalItems: data.length,
    })
})

app.get('/message/:chatId', (req, res) => {
    const { chatId } = req.params
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const chatMessages = messages.filter(x => x.chat_id === chatId)

    chatMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    const paginatedMessages = chatMessages.slice(startIndex, endIndex);

    res.status(200).json({
        success: true,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(chatMessages.length / limitNumber),
        totalItems: chatMessages.length,
        data: paginatedMessages
    })
})

app.get('/messages/after/:chatId/:lastMessageId', (req, res) => {
    const { chatId, lastMessageId } = req.params;
    const lastMsg = messages.find(m => m.id === lastMessageId)
    const newMessages = messages.filter(message => message.chat_id === chatId && new Date(message.created_at) > new Date(lastMsg.created_at));
    newMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.status(200).json({ success: true, data: newMessages });
});

app.post('/message', (req, res) => {
    const message = req.body
    const newMessage = { ...message, id: uuidv4(), read: false }
    messages.push(newMessage)
    res.status(200).json({
        success: true,
        msg: "msg sent successfully."
    })
})

app.patch('/message/read', (req, res) => {
    const { messageIds, read } = req.body
    messages = messages.map(msg => {
        if (messageIds.includes(msg.id)) {
            return { ...msg, read };
        }
        return msg;
    });
    res.status(200).json({
        success: true,
        msg: "status updated successfully."
    })
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})