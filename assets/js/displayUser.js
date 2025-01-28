import user from "./user.js";
import inpSettings from "./settings.js";
document.addEventListener("DOMContentLoaded", () => {
  displayUser();
  displayCurrentUser();
  InsertSettings();
  userProfile();
  loadMessages();

  document.addEventListener("click", function (e) {
    const contactElement = e.target.closest(".contact");
    if (contactElement) {
      DisplayUserChatContainer(contactElement);
    }
  });
});

const currentUserMobile = localStorage.getItem("mobile");
const currentUserName = localStorage.getItem("name");
const currentUserProfile = localStorage.getItem("profile");
const currentUserId = localStorage.getItem("userId");
const currentAbout = localStorage.getItem("about");
function displayUser() {
  const ContactList = document.getElementById("ContactsList");
  let users = user();
  let userList = "";
  var message = loadMessages();

  for (let i = 0; i < users.data.length; i++) {
    if (users.data[i].phone != currentUserMobile) {
      userList += `
    <div class="contact row">
        <div class="col-md-2 userImage">
            <img src="${users.data[i].profile}" alt="">
        </div>
        <div class="col-md-10 userChatBox">
            <div class="userMsgDetail row">
                <p class="contactName col-md-9">${users.data[i].name}</p>
                <input type="hidden" class="userPhone" value="${users.data[i].phone}"/>
                <p class="MessageTime col-md-3">00:00</p>
            </div>
             <div class="userChat row">
                
            </div>
        </div>
    </div>
`;
    }
  }
  ContactList.innerHTML = userList;
}
function displayCurrentUser() {
  const ProfileImage = document.getElementById("ProfileImage");
  ProfileImage.src = currentUserProfile;
}
function InsertSettings() {
  const settings = inpSettings();
  const settingsContainer = document.getElementById("leftDropMenu");
  let settingsInputs = "";
  for (let i = 0; i < settings.data.length; i++) {
    settingsInputs += `
                    <div class="dropdownItem">
                            <i class="bi ${settings.data[i].icon}" style="font-size: 18px;"></i>
                            <p>${settings.data[i].name}</p>
                        </div>
        `;
  }
  settingsContainer.innerHTML = settingsInputs;
}
function userProfile() {
  const profile = document.getElementById("rightDropMenu");
  profile.innerHTML = `
        <img src="${currentUserProfile}" alt="">
        <br>
        <br>
        <div class="row">
            <div class="col-md-10">
                <h4>${currentUserName}</h4>
            </div>
            <div class="col-md-2 nameIcon">
                <i class="bi bi-pencil"></i>
            </div>
        </div>
        <br>
        <div class="row">
            <div class="col-md-12 About">
                <h6>About</h6>
                <div class="row">
                    <div class="col-lg-10">
                        <p>${currentAbout}</p>
                    </div>
                    <div class="col-md-2">
                        <i class="bi bi-pencil"></i>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <div class="row">
            <div class="col-md-12 Mobile">
                <h6>Phone number</h6>
                <div class="row">
                    <div class="col-lg-10">
                        <p>${currentUserMobile}</p>
                    </div>
                </div>
            </div>
        </div>
        <hr style="color: white;">
        
    `;
}
function loadMessages() {
  const messages = sessionStorage.getItem("Messages");
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
setInterval(() => {
  const messagess = loadMessages();
  console.log(messagess);
}, 3600);

// var message = loadMessages();
//     let unreadMessage=';'
//     for(let i = 0; i < message.length; i++) {
//         if(message[i].Receiver === currentUserMobile && message[i].sender==currentUserMobile){
//             unreadMessage+=1
//         }
//     }
// function checkSentMessage(){
//     var message = loadMessages();
//     if(message.length>0){
//             message = message.filter(
//                 (message) => message.Sender === currentUserMobile
//             );
//     }
//     console.log(message);

// }
// setInterval(() => {
//     checkSentMessage()
// }, 400);
function DisplayUserChatContainer(clickedElement) {
  document.querySelector(".subChatContainer").style.display = "none";
  const parentElement = clickedElement.closest(".contact");
  const chatWindow = document.getElementById("MainChatContainer");
  const userPhone = parentElement.querySelector(".userPhone").value;
  const userProfile = clickedElement.querySelector(".userImage img").src;
  const userContactName =
    clickedElement.querySelector(".contactName").innerText;
  var message = loadMessages();
  var receive_message = loadMessages();

  chatWindow.innerHTML = "";
  chatWindow.innerHTML += `
    <div class="row chatHeadLine">
      <div class="col-md-10">
        <div class="row chatUserDetails">
          <div class="col-md-1 userImage">
            <img src="${userProfile}" alt="">
          </div>
          <div class="ChatUserMsgDetail col-md-10">
            <p class="contactName">${userContactName}</p>
            <p class="MessageTime">12:00</p>
          </div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="chatCalls">
          <div class="chatCallContainer">
            <button type="button" class="callButton">
              <i class="bi bi-telephone"></i>
            </button>
            <div class="separator"></div>
            <button type="button" class="videoCallButton">
              <i class="bi bi-camera-video"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row ChatMessageContainers">
      <div class="senderEnd">
        ${message
          .map((msg) => {
            if (
              msg.Receiver === userPhone &&
              msg.Sender === currentUserMobile
            ) {
              return `
              <div class="SendChatMessage">
                <p>${msg.message}</p>
                <div id="ReadReceiptContainer">
                  <span class="time">${msg.time}</span> 
                  <span class="ChatReadReceipt">&#10003;<span style="position: relative; right: 5px;">&#10003;</span></span>
                </div>
              </div>`;
            }
            return "";
          })
          .join("")}
      </div>
      <div class="receiverEnd">
  ${message
    .map((msg) => {
      if (msg.Sender === userPhone && msg.Receiver === currentUserMobile) {
        return `
        <div class="receiveChatMessage">
          <p>${msg.message}</p>
          <div id="ReceiveReceiptContainer">
            <span class="time">${msg.time}</span> 
          </div>
        </div>`;
      }
      return "";
    })
    .join("")}
</div>
</div>
    <div class="row chatBottomContainer">
      <div class="col-md-1 EAContainer">
        <button type="button" class="emojiButton">
          <i class="bi bi-emoji-smile"></i>
        </button>
        <button type="button" class="attachmentButton">
          <i class="bi bi-paperclip"></i>
        </button>
      </div>
      <div class="col-md-11 chatInput">
        <input type="text" class="messageInput" id="messageInput" placeholder="Type a message...">
        <button type="button" class="SendVoiceMessageButton">
          <i class="bi bi-mic"></i>
        </button>
        <input type="hidden" class="SenderPhone" value="${currentUserMobile}"/>
        <input type="hidden" class="ReceiverPhone" value="${userPhone}"/>
        <button type="button" class="SendMessageButton">
          <i class="bi bi-send"></i>
        </button>
      </div>
    </div>
  `;
}
