function authentication() {
    const tokenData = JSON.parse(localStorage.getItem('token'));
    // console.log('Token Data:', tokenData);
 
    let token;
 
    if (tokenData) {
       if (typeof tokenData === 'object') {
          token = tokenData.token;
       } else {
          // If tokenData is not an object, assume it's the actual token value
          token = tokenData;
       }
 
       // console.log(token, "ttttt");
 
       // Return the authenticated axios instance
       const authaxis = axios.create({
          // baseURL: 'http://localhost:8080',
          headers: {
             'Authorization': `Bearer ${token}`,
          },
       });
 
       return authaxis;
    } else {
       window.location.href = "/";
       alert("Please log in first");
       
    }
 }
 

 const authenticationAxios=authentication()


console.log(authenticationAxios)




// async function postMessage(e) {
//     // Check if e is defined and has a preventDefault method
//     e.preventDefault()

//     const message = document.getElementById("message").value;

//     try {
        
//         const response = await authenticationAxios.post("/message", { message: message });
//         alert("Message sent successfully");
//     } catch (error) {
//         console.error("Error sending message:", error);
//     }
// }

const sendButton = document.querySelector(".send");


    sendButton.addEventListener("click",async (e)=>{
        {
            // Check if e is defined and has a preventDefault method
            e.preventDefault()
        
            const messageInput = document.getElementById("message");
    const message = messageInput.value;
        
            try {
                
                const response = await authenticationAxios.post("/message", { message: message });
                
                messageInput.value=""
                
            } catch (error) {
                console.error("Error sending message:", error);
            }
    }
})










// async function getMessage(){
//     try {
                
//         const response = await authenticationAxios.get("/message");
//         const datas=response.data.rawMessages
        
// datas.forEach((data) => {
//     const userId = data.userId;
//     const message = data.message;
//     const username = data.username;
//     const dateTime = new Date(data.createdAt);
//     const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, timeZoneName: 'short' };

//     // Create a new list item
//     const listItem = document.createElement('li');
//     listItem.className = 'others_message'; // Assuming it's an others_message type, modify if needed

//     // Create a paragraph element with the username, message, and date
//     const paragraph = document.createElement('p');
//     paragraph.className = 'message';

//     // Create a span for the username
//     const usernameSpan = document.createElement('span');
//     usernameSpan.id='usernameSpan';
//     usernameSpan.textContent = username;
//     paragraph.appendChild(usernameSpan);

//     // Add the message text
//     const Usermessage= document.createElement('h5')
// Usermessage.textContent=message
// paragraph.appendChild(Usermessage);
    

//     // Create a span for the formatted date
//     const dateSpan = document.createElement('span');
//     dateSpan.textContent = dateTime.toLocaleString('en-US', options);
//     paragraph.appendChild(dateSpan);

//     // Append the paragraph to the list item
//     listItem.appendChild(paragraph);

//     // Append the list item to the message container
//     const messageContainer = document.querySelector('.message_container');
//     messageContainer.appendChild(listItem);
//     console.log("DONE")
// });
        
//     } catch (error) {
//         console.error("Error sending message:", error);
//     }

// }


// setInterval(getMessage, 1000)
// setInterval(getMessage, 1000);

function welcomeMessage(){
    const frist_time_visit=localStorage.getItem("visited")
    const tokenData= JSON.parse(localStorage.getItem('token'));
    const name=tokenData.username
    if(!frist_time_visit){
        alert("welcome "+name)
        const li=document.createElement("li")
        li.className="feedback"
        li.innerText=`${name} joined`
        const message_container=document.querySelector(".message_container")
        message_container.appendChild(li)
        localStorage.setItem("visited",true)
    }

}
function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("visited")
    window.location.href="/"
}



const logoutBtn=document.getElementById("logout")
logoutBtn.addEventListener("click",logout)



document.addEventListener("DOMContentLoaded", () => {
    
    welcomeMessage()
    getMessage()
    
    
})


    


////
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
 
    return JSON.parse(jsonPayload);
 }
 const tokenData= JSON.parse(localStorage.getItem('token'));
 const token = tokenData.token
 const decode=parseJwt(token)
 console.log("jkkkk",decode.userId)

const tokenUserId=decode.userId


 async function getMessage() {
    try {
        const response = await authenticationAxios.get("/message");
        const datas = response.data.rawMessages;

        datas.forEach((data) => {
            const userId = data.userId;
            const message = data.message;
            const username = data.username;
            const dateTime = new Date(data.createdAt);
            const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, timeZoneName: 'short' };

            // Create a new list item
            const listItem = document.createElement('li');

            // Check if the user ID matches the specific user ID you passed
            if (userId === tokenUserId) {
                listItem.className = 'my_message';
            } else {
                listItem.className = 'others_message';
            }

            // Create a paragraph element with the username, message, and date
            const paragraph = document.createElement('p');
            paragraph.className = 'message';

            // Create a span for the username
            const usernameSpan = document.createElement('span');
            usernameSpan.id = 'usernameSpan';
            usernameSpan.textContent = username;
            paragraph.appendChild(usernameSpan);

            // Add the message text
            const Usermessage = document.createElement('h5');
            Usermessage.textContent = message;
            paragraph.appendChild(Usermessage);

            // Create a span for the formatted date
            const dateSpan = document.createElement('span');
            dateSpan.textContent = dateTime.toLocaleString('en-US', options);
            paragraph.appendChild(dateSpan);

            // Append the paragraph to the list item
            listItem.appendChild(paragraph);

            // Append the list item to the message container
            const messageContainer = document.querySelector('.message_container');
            messageContainer.appendChild(listItem);
            console.log("DONE");
        });

    } catch (error) {
        console.error("Error sending message:", error);
    }
}



