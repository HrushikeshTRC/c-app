
const getLastMessageByChat = (messages, chatId) => {
    const chatMessages = messages.filter(msg => msg.chat_id === chatId);
    if (chatMessages.length === 0) {
        return null;
    }
    chatMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return chatMessages[0];
};

const getUnreadCountByChat = (messages, chatId, userId) => {
    const chatMessages = messages.filter(msg => msg.chat_id === chatId);
    if (chatMessages.length === 0) {
        return 0;
    }
    const unreadCount = chatMessages.filter(m => m.recipient_id === userId && !m.read).length
    return unreadCount;
};

module.exports = {
    getLastMessageByChat,
    getUnreadCountByChat
} 