document.addEventListener("DOMContentLoaded", () => {

    welcomeMessage()
    getMessage()
    getAllUsers();
    userProfilre()
    GetMygroups()//show groups

})



// >>>>>>>>>
const logoutBtn = document.getElementById("logout")
logoutBtn.addEventListener("click", logout)
const authenticationAxios = authentication()
const sendButton = document.querySelector(".send");
const tokenData = JSON.parse(localStorage.getItem('token'));
const token = tokenData.token
const decode = parseJwt(token)
let lastMessageTimestamp = 0;

const tokenUserId = decode.userId
setInterval(getMessage, 1000);
const prifileBtn = document.getElementById("profile");
const pro = document.querySelector(".pro")
pro.addEventListener("click", profile)
prifileBtn.addEventListener("click", profile);
const topBtn = document.querySelector(".top");
topBtn.addEventListener("click", addNewGroup);
const remove = document.querySelector(".remove").addEventListener("click", addNewGroup);
document.getElementById('create-button').addEventListener('click', createGroup);

//<<<<<authntication>>>>>>>>>>>>>>.


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



/////<<<<<<send MEssages>>>>>>>>>.





sendButton.addEventListener("click", async (e) => {
    {
        // Check if e is defined and has a preventDefault method
        e.preventDefault()

        const messageInput = document.getElementById("message");
        const message = messageInput.value;

        try {

            const response = await authenticationAxios.post("/message", { message: message });

            messageInput.value = ""

        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
})

//<<<<<<<<end>>>>>>>>




function welcomeMessage() {
    const frist_time_visit = localStorage.getItem("visited")
    const tokenData = JSON.parse(localStorage.getItem('token'));
    const name = tokenData.username
    if (!frist_time_visit) {
        alert("welcome " + name)
        const li = document.createElement("li")
        li.className = "feedback"
        li.innerText = `${name} joined`
        const message_container = document.querySelector(".message_container")
        message_container.appendChild(li)
        localStorage.setItem("visited", true)
    }

}
function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("visited")
    window.location.href = "/"
}


//// decode Token////////////////////////////////////
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


/////////////////////// end decodeed token /////////////////////////////////////////////////

///<<<<<<get ALL Message>>>>>>>>



async function getMessage() {
    try {
        const response = await authenticationAxios.get("/message");
        const datas = response.data.rawMessages;

        datas.forEach((data) => {
            const userId = data.userId;
            const message = data.message;
            const username = data.username;
            const timestamp = new Date(data.createdAt).getTime();

            // Only process messages with a timestamp greater than the last processed message
            if (timestamp > lastMessageTimestamp) {
                // Update the last processed timestamp
                lastMessageTimestamp = timestamp;

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
                const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, timeZoneName: 'short' };
                dateSpan.textContent = new Date(timestamp).toLocaleString('en-US', options);
                paragraph.appendChild(dateSpan);

                // Append the paragraph to the list item
                listItem.appendChild(paragraph);

                // Append the list item to the message container
                const messageContainer = document.querySelector('.message_container');
                messageContainer.appendChild(listItem);
                console.log("DONE");
            }
        });


    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// Uncomment the following line to fetch messages every second



////////////////////////   end here   ////////////////////////////////////////////////





////////    profile section //////////////////////////////////


function profile() {
    const profile = document.getElementById("userProfile");
    const heroright = document.querySelector(".heroright");

    heroright.classList.toggle("blur");
    profile.classList.toggle("active");
}
/////end profile////////////////////////////////






function addNewGroup() {

    const addGroupMembers = document.querySelector(".addGroupMembers");
    addGroupMembers.classList.toggle("visible");
    const heroright = document.querySelector(".hero");
    heroright.classList.toggle("blur");



}





///all members

async function getAllUsers() {

    try {

        const response = await authenticationAxios.get("/allUsers");
        console.log(response.data)
        showAllusers(response.data.allUsers)
        // console.log("gootted users")

    } catch (error) {

    }


}




function showAllusers(userData) {
    const groupMemberDiv = document.getElementById("group-member");

    userData.forEach(user => {
        const memberDiv = document.createElement("div");
        memberDiv.classList.add("member");

        const label = document.createElement("label");
        label.setAttribute("for", `user-${user.id}`);
        label.textContent = user.username;

        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", `user-${user.id}`);
        checkbox.setAttribute("value", user.id);

        memberDiv.appendChild(label);
        memberDiv.appendChild(checkbox);

        groupMemberDiv.appendChild(memberDiv);
    });

}

//..........<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<allmembers <<<<<<<<<<<<<<<<<<



function userProfilre() {
    const tokenData = JSON.parse(localStorage.getItem('token'));

    const userProfileContainer = document.getElementById("userProfile")

    const div = document.createElement("div")
    div.className = "userDetails"
    const h3 = document.createElement("h3")
    h3.className = "userName"
    h3.textContent = tokenData.username
    const h4 = document.createElement("h4")
    h4.className = "phonenumber"
    h4.textContent = tokenData.phonenumber
    const h42 = document.createElement("h4")
    h42.className = "email"
    h42.textContent = tokenData.email;
    div.appendChild(h3)
    div.appendChild(h4)
    div.appendChild(h42)
    userProfileContainer.appendChild(div)

}




//<<<<<<<<<<<create Group>>>>>>>>>>>>>>>>






async function createGroup() {
    try {
        const groupNameInput = document.getElementById('groupName');
        const descriptionInput = document.getElementById('description');
        // Trim to remove leading and trailing spaces
        const groupName = groupNameInput.value.trim();
        let selectedUser = getSelectedUsers();
        const description = descriptionInput.value;

        // Check if groupName is empty
        if (!groupName) {
            alert('Group Name cannot be empty');
            return;
        }
        if (selectedUser.length < 1) {
            alert("please add some members to the group")
            return
        }
        const numOfmember = selectedUser.length + 1
        const data = {
            name: groupName,
            membersNo: numOfmember,
            membersIds: selectedUser

        }

        const response = await authenticationAxios.post("/createGroup", data)
        
        GetMygroups()//show groups
        console.log(response.data.message)
        groupNameInput.value = '';
        descriptionInput.value = '';
        // Continue with further actions+

        alert('Create Group Successful');
        // console.log(selectedUser);
        // console.log(groupName);
        // console.log(description);
        // console.log(numOfmember)

        // Add your logic to send data to the backend or perform other actions

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response && error.response.data) {
            // If the server responds with a specific error message
            alert(`Error: ${error.response.data.message}`);
        } else {
            // If it's a generic error or network issue
            alert('An error occurred. Please try again later.');
        }
    }
}


function getSelectedUsers() {
    const checkboxes = document.querySelectorAll('#group-member input[type="checkbox"]:checked');
    const selectedUserIds = Array.from(checkboxes).map(checkbox => checkbox.value);
    return selectedUserIds;
}


////////////////////////////////        


// <><<<<<<<<<<show my groups>>>>>>
function showGroups(groups) {
    const groupsContainer = document.querySelector('.buttom');

    // Clear existing content
    groupsContainer.innerHTML = '';

    groups.forEach(group => {
        const groupList = document.createElement('ul');
        groupList.classList.add('groups-list');

        const groupItem = document.createElement('li');
        groupItem.innerHTML = `
            
            <span class="group-name" id="${group.id}">${group.name}</span>
        `;
        groupList.addEventListener('click', function () {
            const groupid = group.id;
            groupById (groupid)
            console.log('Clicked on group with id:', groupid);
            // You can perform additional actions or call a function here with the groupId
        });
        

        groupList.appendChild(groupItem);
        groupsContainer.appendChild(groupList);
    });
    
}




async function GetMygroups() {
    try {

        const response = await authenticationAxios.get("/getMyGroups")
        console.log(response.data.groups)
        showGroups(response.data.groups)

    } catch (error) {
        console.log(error)
    }

}



////////////////////////////////////////////////////////////////////////

function updateHeroSection(groupData) {
    const groupNameElement = document.querySelector('.group-name-dashboard');
    const groupMemberElement = document.querySelector('.group-member-dashboard');
    const messageContainerElement = document.querySelector('.message_container');
    
    // Update group name and member count
    groupNameElement.textContent = groupData.name;
    groupMemberElement.textContent = `${groupData.membersNo} members`;

    // Clear existing messages
    messageContainerElement.innerHTML = '';

    // Assuming messages is an array of messages in groupData
    groupData.messages.forEach(message => {
        const li = document.createElement('li');
        li.classList.add(message.type);

        const p = document.createElement('p');
        p.classList.add('message');
        p.innerHTML = `
            <span>${message.sender}</span>
            ${message.content}
            <span>${message.timestamp}</span>
        `;

        li.appendChild(p);
        messageContainerElement.appendChild(li);
    });
}

// Example usage:


updateHeroSection(exampleGroupData);


async function groupById(id) {
    try {
        const response = await authenticationAxios.get(`getGroupById?groupid=${id}`);
        updateHeroSection(response.data.group);
        console.log(response.data.group);
    } catch (error) {
        console.log(error);
    }
}