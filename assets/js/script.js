const userId = prompt("Enter your user ID (e.g., user1 or user2):");

document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    setInterval(fetchNewMessages, 1000);
});

function fetchNewMessages() {
    loadMessages(false);
}

function loadMessages(shouldMarkAsRead = true) {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.innerHTML = '';

    const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];

    storedMessages.forEach(messageObj => {
        const messageElement = createMessageElement(messageObj.text, messageObj.timestamp, messageObj.userId, messageObj.isRead, true);
        chatWindow.appendChild(messageElement);
    });
    chatWindow.scrollTop = chatWindow.scrollHeight;

    if (shouldMarkAsRead) {
        markMessagesAsRead();
    }
}

function createMessageElement(messageText, timestamp, senderId, isRead, isInitialLoad = false) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = messageText;

    // Style message based on sender
    if (senderId === userId) {
        messageElement.classList.add('user');
    } else {
        messageElement.classList.add('received');
    }

    const timestampElement = document.createElement('span');
    timestampElement.className = 'timestamp';
    timestampElement.textContent = timestamp;

    const readReceipt = document.createElement('div');
    readReceipt.className = 'message read-receipt';
    readReceipt.textContent = isRead ? 'Read' : 'Unread';
    if (senderId === userId) {
        readReceipt.style.display = 'none'; 
    }

    messageElement.appendChild(timestampElement);
    messageElement.appendChild(readReceipt);

    if (!isInitialLoad) {
        saveMessageToLocalStorage(messageText, timestamp, senderId, false);
    }

    return messageElement;
}

function saveMessageToLocalStorage(text, timestamp, senderId, isRead) {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    storedMessages.push({ text, timestamp, userId: senderId, isRead });
    localStorage.setItem('chatMessages', JSON.stringify(storedMessages));
}

function sendMessage(event) {
    if (event.key !== 'Enter' && event.type !== 'click') return;

    const messageInput = document.getElementById('messageInput');
    const chatWindow = document.getElementById('chatWindow');

    if (messageInput.value.trim() !== '') {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageElement = createMessageElement(messageInput.value, currentTime, userId, false);
        chatWindow.appendChild(messageElement);

        chatWindow.scrollTop = chatWindow.scrollHeight;

        messageInput.value = '';
    }
}

function clearChat() {
    localStorage.removeItem('chatMessages');
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.innerHTML = '';
}

function markMessagesAsRead() {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    let updated = false;

    const updatedMessages = storedMessages.map(message => {
        if (message.userId !== userId && !message.isRead) {
            message.isRead = true;
            updated = true;
        }
        return message;
    });

    if (updated) {
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    }
}
