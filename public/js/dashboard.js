// Execute code when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    welcomeMessage();  // Display a welcome message
    getAllUsers();      // Fetch and display all users
    userProfilre();     // Display user profile details
    GetMygroups();      // Fetch and display user's groups
});

// Initialize Socket.IO
var socket = io();

// Event listener for the "Logout" button
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", logout);

// Get authentication details from local storage
const authenticationAxios = authentication();
const sendButton = document.querySelector(".send");
const tokenData = JSON.parse(localStorage.getItem('token'));
const token = tokenData.token;
const decode = parseJwt(token);
console.log(decode);

// Extract user ID from the decoded token
const tokenUserId = decode.userId;

// Event listeners for profile-related buttons
const prifileBtn = document.getElementById("profile");
prifileBtn.addEventListener("click", profile);
const pro = document.querySelector(".pro");
pro.addEventListener("click", profile);

// Event listener for creating a new group
const topBtn = document.querySelector(".top");
topBtn.addEventListener("click", addNewGroup);
document.getElementById('create-button').addEventListener('click', createGroup);

// Function to handle authentication and create an Axios instance with the authorization header
function authentication() {
    const tokenData = JSON.parse(localStorage.getItem('token'));
    let token;

    // Extract token from tokenData
    if (tokenData) {
        if (typeof tokenData === 'object') {
            token = tokenData.token;
        } else {
            token = tokenData;
        }

        // Create and return an authenticated Axios instance
        const authaxis = axios.create({
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return authaxis;
    } else {
        // Redirect to the login page if no token is found
        window.location.href = "/";
        alert("Please log in first");
    }
}





function welcomeMessage() {
    const frist_time_visit = localStorage.getItem("visited")
    const tokenData = JSON.parse(localStorage.getItem('token'));
    const name = tokenData.username
    if (!frist_time_visit) {
        // alert("welcome " + name)
        const li = document.createElement("li")
        li.className = "feedback"
        li.innerText = `${name} `
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




////////    profile section //////////////////////////////////


function profile() {
    const profile = document.getElementById("userProfile");
    const heroright = document.querySelector(".heroright");

    heroright.classList.toggle("blur");
    profile.classList.toggle("active");
}
/////end profile////////////////////////////////



///addnew Group////


function addNewGroup() {

    const addGroupMembers = document.querySelector(".addGroupMembers");
    addGroupMembers.classList.toggle("visible");
    const heroright = document.querySelector(".hero");





}





///all members

async function getAllUsers() {

    try {

        const response = await authenticationAxios.get("/users");
        console.log(response.data,"userrrr")
        showAllusers(response.data.allUsers)
        // console.log("gootted users")

    } catch (error) {

    }


}


//..........<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<allmembers <<<<<<<<<<<<<<<<<<

// Function to display a list of users and checkboxes for group membership
function showAllusers(userData) {
    // Get references to HTML elements where user data will be displayed
    const groupMemberDiv = document.getElementById("group-member");
    const groupUpdateMemberDiv = document.getElementById("group-update-member");

    // Iterate through each user in the provided user data
    userData.forEach(user => {
        // Create a new div for each user in both sections
        const memberDivForGroupMember = document.createElement("div");
        memberDivForGroupMember.classList.add("member");

        const memberDivForGroupUpdateMember = document.createElement("div");
        memberDivForGroupUpdateMember.classList.add("member");

        // Create a label for the checkbox associated with the user
        const label = document.createElement("label");
        label.setAttribute("for", `user-${user.id}`);
        label.textContent = user.username;

        // Create a checkbox for selecting the user
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", `user-${user.id}`);
        checkbox.setAttribute("value", user.id);

        // Append label and checkbox to the div for group members
        memberDivForGroupMember.appendChild(label);
        memberDivForGroupMember.appendChild(checkbox);

        // Clone label and checkbox to be added to the div for updating group members
        memberDivForGroupUpdateMember.appendChild(label.cloneNode(true));
        memberDivForGroupUpdateMember.appendChild(checkbox.cloneNode(true));

        // Append divs to their respective sections in the HTML
        groupUpdateMemberDiv.appendChild(memberDivForGroupUpdateMember);
        groupMemberDiv.appendChild(memberDivForGroupMember);
    });
}



// //////////////user profile /////////////

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

        const response = await authenticationAxios.post("/group/create", data)

        GetMygroups()//show groups
        console.log(response.data.message)
        groupNameInput.value = '';
        descriptionInput.value = '';
        // Continue with further actions+
        const addGroupMembers = document.querySelector(".addGroupMembers");
        addGroupMembers.classList.toggle("visible");
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
////
//get selectted user
function getSelectedUsers() {
    const checkboxes = document.querySelectorAll('#group-member input[type="checkbox"]:checked');
    const selectedUserIds = Array.from(checkboxes).map(checkbox => checkbox.value);
    return selectedUserIds;
}


//get selected user on update
function getUpadteSelectedUsers() {
    const checkboxes = document.querySelectorAll('#group-update-member input[type="checkbox"]:checked');
    const selectedUserIds = Array.from(checkboxes).map(checkbox => checkbox.value);
    return selectedUserIds;
}

////////////////////////////////        

const heroimgOpacity = document.querySelector(".heroimg")
const heading = document.querySelector(".heading")



// <><<<<<<<<<<show my groups>>>>>>
// Modified showGroups function to attach click event listeners
function showGroups(groups) {
    const groupsContainer = document.querySelector('.buttom');
    const heroright = document.querySelector(".heroright")
    // Clear existing content
    groupsContainer.innerHTML = '';
    groups.forEach(group => {
        const groupList = document.createElement('ul');
        groupList.classList.add('groups-list');



        // Set the image source based on your requirements

        groupList.innerHTML = `
        
                    <li id="img" ><img src="" alt="."></li>
                    <span class="group-name" id="${group.id}"></span>
                    <li id="group-name">${group.name}</li>
            
            
        `;

        // Attach click event listener to each group
        groupList.addEventListener('click', async function () {
            const allGroupsLists = document.querySelectorAll('.groups-list');
            allGroupsLists.forEach(list => {
                list.classList.remove('activeGroup');
            });

            // Add "active" class to the clicked groups-list
            groupList.classList.add('activeGroup');
            heroimgOpacity.classList.add("heroimgOpacity")
            heading.classList.remove("headingTranparent")
            const heroimg2 = document.querySelector(".heroimg2")
            heroimg2.style.display = "block"
            const heroimg = document.querySelector(".heroimg")
            heroimg.style.display = "none"
            heroright.classList.add("heroRightActive")
            const groupid = group.id;
            const input = document.querySelector('.input');
            input.style.visibility = "visible";
            input.id = groupid;
            const response = await authenticationAxios.get(`group?groupid=${groupid}`);
            const heroleft = document.querySelector(".heroleft")
            heroleft.classList.remove("heroleftToggle")
            console.log('Clicked on group with id:', groupid);
            updateHeroSection(response.data.group);
            getGroupMessage()



        });


        groupsContainer.appendChild(groupList);

    })


}

///get my groups////

async function GetMygroups() {
    try {

        const response = await authenticationAxios.get("/groups")
        // console.log(response.data.groups)
        showGroups(response.data.groups)

    } catch (error) {
        console.log(error)
    }

}



////////////////////////////////////////////////////////////////////////

function updateHeroSection(groupData) {
    const groupNameElement = document.querySelector('.group-name-dashboard');
    const groupMemberElement = document.querySelector('.group-member-dashboard');
    const editBtn = document.getElementById("edit-button")
    console.log(groupData, "datatata")

    //socket 
    socket.on('group-message', (groupId) => {
        if (groupData.id == groupId) {
            getGroupMessage()

        }
    })
    // Update group name and member count
    groupNameElement.textContent = groupData.name;
    groupMemberElement.textContent = `${groupData.membersNo} members`;
    scrollButton()
    console.log(groupData.adminId)
    if (groupData.adminId != tokenUserId) {
        editBtn.style.display = "none";
    } else {
        editBtn.setAttribute("groupId", groupData.id)
        editBtn.style.display = "block";

    }


    //

}






//get group message////

async function getGroupMessage() {
    try {
        const input = document.querySelector('.input')
        const String_id = input.getAttribute("id")

        const groupid = Number(String_id)
        const messageContainer = document.querySelector('.message_container');
        messageContainer.innerHTML = '';
        
        const responseChat = await authenticationAxios.get(`group/messages?groupId=${groupid}`);
        const datas = responseChat.data.groups
        console.log(datas)

        datas.forEach((data) => {

            // console.log(isMedia)
            const userId = data.userId;
            const attachment = data.attachment;
            const text = data.text
            
            const timestamp = new Date(data.createdAt).getTime();
            // let messageId=data.id
            // console.log("chat id",data.id)
            // Only process messages with a timestamp greater than the last processed message
            // let response= axios.get(`user?userId=${userId}`)
            // // console.log( response.data.user.username,"uuuuuuuuuu")
            // const username = response.data.user.username;
            const username = data.username

            // Create a new list item
            const listItem = document.createElement('li');

            // Check if the user ID matches the specific user ID you passed
            if (userId === tokenUserId) {
                listItem.className = 'my_message';
            } else {
                listItem.className = 'others_message';
            }

            if (attachment) {
                // Create a paragraph element with the username, message, and date
                const paragraph = document.createElement('p');
                paragraph.className = 'message';

                // Create a span for the username
                const usernameSpan = document.createElement('span');
                usernameSpan.id = 'usernameSpan';
                if (userId === tokenUserId) {
                    usernameSpan.textContent = `you: ${text}`;
                } else {
                    usernameSpan.textContent =`${username}: ${text}`;
                }

                paragraph.appendChild(usernameSpan);

                // Add the message img
                // Check the type of media (image, video, or PDF)
                if (attachment.endsWith('.jpg') || attachment.endsWith('.jpeg') || attachment.endsWith('.png') || attachment.endsWith('.gif')) {
                    // Add the message image
                    const userMessageImg = document.createElement('img');
                    userMessageImg.src = attachment;
                    userMessageImg.id = "chatImg";
                    paragraph.appendChild(userMessageImg);
                } else if (attachment.endsWith('.mp4') || attachment.endsWith('.webm') || attachment.endsWith('.ogg')) {
                    // Add the message video
                    const userMessageVideo = document.createElement('video');
                    userMessageVideo.src = attachment;
                    userMessageVideo.id = "chatVideo";
                    userMessageVideo.controls = true;
                    paragraph.appendChild(userMessageVideo);
                } else if (attachment.endsWith('.pdf')) {
                    // Add a link to the PDF or embed a PDF viewer
                    const userMessagePdf = document.createElement('a');
                    userMessagePdf.href = attachment;
                    userMessagePdf.target = "_blank"; // Open the link in a new tab
                    userMessagePdf.textContent = attachment.split("_")[1];
                    paragraph.appendChild(userMessagePdf);

                }

                const dateSpan = document.createElement('span');
                const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
                dateSpan.textContent = new Date(timestamp).toLocaleString('en-US', options);
                paragraph.appendChild(dateSpan);



                // Append the paragraph to the list item
                listItem.appendChild(paragraph);

            } else {
                // Create a paragraph element with the username, message, and date
                const paragraph = document.createElement('p');
                paragraph.className = 'message';

                // Create a span for the username
                const usernameSpan = document.createElement('span');
                usernameSpan.id = 'usernameSpan';
                if (userId === tokenUserId) {
                    usernameSpan.textContent = "You";
                } else {
                    usernameSpan.textContent = username;
                }

                paragraph.appendChild(usernameSpan);

                // Add the message text
                const Usermessage = document.createElement('h5');
                Usermessage.textContent = text;
                paragraph.appendChild(Usermessage);

                // Create a span for the formatted date
                const dateSpan = document.createElement('span');
                const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
                dateSpan.textContent = new Date(timestamp).toLocaleString('en-US', options);
                paragraph.appendChild(dateSpan);

                // Append the paragraph to the list item
                listItem.appendChild(paragraph);
            }

            // Append the list item to the message container
            const messageContainer = document.querySelector('.message_container');
            messageContainer.appendChild(listItem);
            // console.log("DONE");
            scrollButton()

        });

    } catch (error) {
        console.error("Error sending message:", error);
    }
}



/////<<<<<<send MEssages>>>>>>>>>.


        async function sendMessage(e){
    
    // Check if e is defined and has a preventDefault method
    e.preventDefault()
    const input=document.querySelector('.input')
    const String_id=input.getAttribute("id")
        
    const groupId=Number(String_id)

    const messageInput = document.getElementById("message");
    var fileInput = document.getElementById('file')
            const file = fileInput.files[0]
            
            console.log(file,"fileInput")
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        
            try {
                if(file){
                    const formData = new FormData();
                    formData.append('groupId', groupId);
                    formData.append('text',messageInput.value||"")
                    formData.append('media', file);
                
                    // console.log([...formData])
        
                    const response = await authenticationAxios.post("/group/media",formData,config);

        fileInput.value = "";
        
        messageInput.value = ""
        socket.emit('new-group-message', groupId)
                    scrollButton()
                    getGroupMessage()
                    scrollButton()
                    
                }else{
                    const message = messageInput.value;
                const data={
                    message: message,
                    groupId:groupId
                }
    
                const response = await authenticationAxios.post("/group/message",data);
    
                messageInput.value = ""
        socket.emit('new-group-message', groupId)
                scrollButton()
        getGroupMessage()
        scrollButton()}

    } catch (error) {
        console.error("Error sending message:", error);
    }

}



sendButton.addEventListener("click", sendMessage)

//<<<<<<<<end>>>>>>>>

// setInterval(getGroupMessage,1000)

const updateGroupMembers = document.querySelector(".updateGroupMembers")


///update function
const updateButton = document.querySelector(".edit-button")
updateButton.addEventListener("click", async () => {

    updateGroupMembers.style.visibility = "visible"


})

const removeUpdateForm = document.querySelector("#removeUpdateForm")
removeUpdateForm.addEventListener("click", () => {

    updateGroupMembers.style.visibility = "hidden"
})


async function updateGroup() {
    try {
        const groupNameInput = document.getElementById('updateGroupName');
        const descriptionInput = document.getElementById('updateDescription');
        const editBtn = document.getElementById("edit-button")
        const groupid = editBtn.getAttribute("groupId");



        // Trim to remove leading and trailing spaces
        const groupName = groupNameInput.value.trim();
        let selectedUser = getUpadteSelectedUsers()
        console.log(selectedUser, "selectedUser")
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
        console.log(data)
        const response = await authenticationAxios.put(`/group/update?groupId=${groupid}`, data)


        console.log(response, "success")
        groupNameInput.value = '';
        descriptionInput.value = '';
        GetMygroups()
        // Continue with further actions+

        // alert('Group update Successful');
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




const postupdateButton = document.getElementById("update-button")

postupdateButton.addEventListener("click", () => {

    updateGroup()

    alert("updated successfully")
    GetMygroups()
    updateGroupMembers.style.visibility = "hidden"

})


//exit group
async function exitGroup(groupid) {

    const groupId = groupid
    try {
        const response = await authenticationAxios.delete(`/group/exit?groupId=${groupId}`)
        alert("exit successfully")
        GetMygroups();
        window.location.href = "/dashboard"
    } catch (error) {

    }



}


const exit_button = document.querySelector(".exit-button")
exit_button.addEventListener("click", async () => {
    const input = document.querySelector('.input')
    const String_id = input.getAttribute("id")

    const groupId = Number(String_id)

    exitGroup(groupId)

})







////end exit///

// //   scroll
const sr = ScrollReveal({
    origin: 'top',
    distance: '90px',
    duration: 2000,
    reset: true
})

/* -- HOME -- */
sr.reveal('.nav', {})






const srL = ScrollReveal({
    origin: 'left',
    distance: '120px',
    duration: 2000,
    reset: true
})

srL.reveal('.heroleft', { delay: 200 })



const srR = ScrollReveal({
    origin: 'right',
    distance: '100px',
    duration: 2000,
    reset: true
})

srR.reveal('.hero', { delay: 100 })



//
const menu = document.querySelector(".menu2")
const menu2 = document.querySelector(".menu")
menu2.addEventListener("click", () => {
    const right = document.querySelector(".right")
    right.classList.toggle("rightToggle")


})
menu.addEventListener("click", () => {

    const heroleft = document.querySelector(".heroleft")

    heroleft.classList.toggle("heroleftToggle")

})






///scroll
function scrollButton() {
    const messageContainer = document.querySelector(".view_message");


    messageContainer.scrollTop = messageContainer.scrollHeight;



}

//
async function getUserName(id){

const userId=id;
let response=await axios.get(`user?userId=${userId}`)
console.log( response.data.username)

}
