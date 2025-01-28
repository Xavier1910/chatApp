document.addEventListener('DOMContentLoaded', () => {

    // setInterval(fetchNewMessages, 500);
    document.body.addEventListener("click", function (e) {
        if (e.target.closest(".SendMessageButton")) {
            console.log("SendMessageButton clicked!");
            SaveMessage(e.target.closest(".SendMessageButton"));
        }
    });
});
let Messages =loadMessages()||  [];
function loadMessages(){
    const messages=sessionStorage.getItem('Messages')
    if (messages) {
        try {
          return JSON.parse(messages);
        } catch (error) {
          console.error("Error parsing messages:", error);
          return [];
        }
      }
      return [];
}

// function fetchNewMessages() {
//     loadMessages(false);
// }
function getCurrentDateTime() {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; 

    const hours = String(now.getHours()).padStart(2, '0'); 
    const minutes = String(now.getMinutes()).padStart(2, '0'); 
    const time = `${hours}:${minutes}`;

    return { date, time };
}

getCurrentDateTime();

function SaveMessage(clickedElement) {
    const chatInputContainer = clickedElement.closest('.chatInput');

    if (chatInputContainer) {
        const senderPhone = chatInputContainer.querySelector('.SenderPhone').value;
        const receiverPhone = chatInputContainer.querySelector('.ReceiverPhone').value;
        let message = chatInputContainer.querySelector('.messageInput').value;
        let DateTime=getCurrentDateTime();
        // console.log(DateTime)
        // console.log(`Sender Phone: ${senderPhone}`);
        // console.log(`Receiver Phone: ${receiverPhone}`);
        // console.log(message);
        if(message!==""){
        const newToAdd = {
            Sender: senderPhone,
            Receiver: receiverPhone,
            message: message,
            date: DateTime.date,
            time: DateTime.time,
            isRead: false,
        };
        Messages.push(newToAdd);
        message = "";
        SaveNewMessage();

        }
        else{
            alert("Message cannot be empty")
        }
    } else {
        console.error("Failed to find the chat input container.");
    }
}
function SaveNewMessage() {
    sessionStorage.setItem("Messages", JSON.stringify(Messages));
  }
