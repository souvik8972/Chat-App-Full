document.addEventListener("DOMContentLoaded", () => {

    welcomeMessage()
    // getMessage()
    getAllUsers();
    userProfilre()
    GetMygroups()//show groups
    // getGroupMessage()

})



// >>>>>>>>>
const logoutBtn = document.getElementById("logout")
logoutBtn.addEventListener("click", logout)
const authenticationAxios = authentication()
const sendButton = document.querySelector(".send");
const tokenData = JSON.parse(localStorage.getItem('token'));
const token = tokenData.token
const decode = parseJwt(token)
console.log(decode)


const tokenUserId = decode.userId
// setInterval(getMessage, 1000);
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
        console.log(datas)

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
    // heroright.classList.toggle("blur");




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
    const groupUpdateMemberDiv = document.getElementById("group-update-member");

    userData.forEach(user => {
        // Create a new div for each user in both sections
        const memberDivForGroupMember = document.createElement("div");
        memberDivForGroupMember.classList.add("member");

        const memberDivForGroupUpdateMember = document.createElement("div");
        memberDivForGroupUpdateMember.classList.add("member");

        const label = document.createElement("label");
        label.setAttribute("for", `user-${user.id}`);
        label.textContent = user.username;

        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", `user-${user.id}`);
        checkbox.setAttribute("value", user.id);

        // Append elements to both divs
        memberDivForGroupMember.appendChild(label);
        memberDivForGroupMember.appendChild(checkbox);

        memberDivForGroupUpdateMember.appendChild(label.cloneNode(true));
        memberDivForGroupUpdateMember.appendChild(checkbox.cloneNode(true));

        // Append divs to their respective sections
        groupUpdateMemberDiv.appendChild(memberDivForGroupUpdateMember);
        groupMemberDiv.appendChild(memberDivForGroupMember);
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
////

function getSelectedUsers() {
    const checkboxes = document.querySelectorAll('#group-member input[type="checkbox"]:checked');
    const selectedUserIds = Array.from(checkboxes).map(checkbox => checkbox.value);
    return selectedUserIds;
}
function getUpadteSelectedUsers() {
    const checkboxes = document.querySelectorAll('#group-update-member input[type="checkbox"]:checked');
    const selectedUserIds = Array.from(checkboxes).map(checkbox => checkbox.value);
    return selectedUserIds;
}

////////////////////////////////        

const heroimgOpacity=document.querySelector(".heroimg")
const heading=document.querySelector(".heading")
// <><<<<<<<<<<show my groups>>>>>>
// Modified showGroups function to attach click event listeners
function showGroups(groups) {
    const groupsContainer = document.querySelector('.buttom');
    const heroright=document.querySelector(".heroright")
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
        groupList.addEventListener('click',async function () {
            const allGroupsLists = document.querySelectorAll('.groups-list');
            allGroupsLists.forEach(list => {
                list.classList.remove('activeGroup');
            });

            // Add "active" class to the clicked groups-list
            groupList.classList.add('activeGroup');
            heroimgOpacity.classList.add("heroimgOpacity")
            heading.classList.remove("headingTranparent")
            
            heroright.classList.add("heroRightActive")
            const groupid = group.id;
        const input=document.querySelector('.input');
    input.id = groupid;
            const response = await authenticationAxios.get(`getGroupById?groupid=${groupid}`);
            console.log('Clicked on group with id:', groupid);
            updateHeroSection(response.data.group);
            getGroupMessage()
            
            
        });
    
    
        groupsContainer.appendChild(groupList);
        
    })

    
}



async function GetMygroups() {
    try {

        const response = await authenticationAxios.get("/getMyGroups")
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
    const editBtn=document.getElementById("edit-button")
    console.log(groupData,"datatata")
    // Update group name and member count
    groupNameElement.textContent = groupData.name;
    groupMemberElement.textContent = `${groupData.membersNo} members`;
if(groupData.AdminId!=tokenUserId ){
editBtn.style.display="none";
}else{
    editBtn.setAttribute("groupId",groupData.id)
editBtn.style.display="block";
    
}
    

    // Assuming messages is an array of messages in groupData
    
}

// Example usage:






async function getGroupMessage() {
    try {
        const input=document.querySelector('.input')
            const String_id=input.getAttribute("id")
        
            const groupid=Number(String_id)
            const messageContainer = document.querySelector('.message_container');
            messageContainer.innerHTML = '';
    
        const responseChat=await authenticationAxios.get(`GroupMessage?groupId=${groupid}`);
        const datas=responseChat.data.groups
        
        datas.forEach((data) => {
            
            const userId = data.userId;
            const message = data.message;
            const username = data.username;
            const timestamp = new Date(data.createdAt).getTime();
            // let messageId=data.id
            // console.log("chat id",data.id)
            // Only process messages with a timestamp greater than the last processed message
        


        
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
                scrollButton()
                
        });

    } catch (error) {
        console.error("Error sending message:", error);
    }
}


    
        /////<<<<<<send MEssages>>>>>>>>>.


        async function sendMesage(e){
    
            // Check if e is defined and has a preventDefault method
            e.preventDefault()
            const input=document.querySelector('.input')
            const String_id=input.getAttribute("id")
        
            const id=Number(String_id)
            
            const messageInput = document.getElementById("message");
            const message = messageInput.value;
    
            try {

                const data={
                    message: message,
                    groupId:id
                }
    
                const response = await authenticationAxios.post("/GroupMessage",data);
    
                messageInput.value = ""
                getGroupMessage()
                scrollButton()
    
            } catch (error) {
                console.error("Error sending message:", error);
            }
            
        }


sendButton.addEventListener("click",sendMesage)

//<<<<<<<<end>>>>>>>>

// setInterval(getGroupMessage,1000)

const updateGroupMembers=document.querySelector(".updateGroupMembers")


///update function
const updateButton=document.querySelector(".edit-button")
updateButton.addEventListener("click",async()=>{

updateGroupMembers.style.visibility="visible"


})

const removeUpdateForm=document.querySelector("#removeUpdateForm")
removeUpdateForm.addEventListener("click",()=>{
    
    updateGroupMembers.style.visibility="hidden"
 })


 async function updateGroup() {
    try {
        const groupNameInput = document.getElementById('updateGroupName');
        const descriptionInput = document.getElementById('updateDescription');
        const editBtn=document.getElementById("edit-button")
        const groupid=editBtn.getAttribute("groupId");
        
        

        // Trim to remove leading and trailing spaces
        const groupName = groupNameInput.value.trim();
        let selectedUser = getUpadteSelectedUsers()
        console.log(selectedUser,"selectedUser")
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
        const response = await authenticationAxios.put(`updateGroup?groupId=${groupid}`,data)
        
    
        console.log(response,"success")
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




const postupdateButton=document.getElementById("update-button")

postupdateButton.addEventListener("click",()=>{

    updateGroup()

    alert("updated successfully")
    GetMygroups()
    updateGroupMembers.style.visibility="hidden"

})







////scroll
function scrollButton() {
    const messageContainer = document.querySelector(".view_message");
    
    // Scroll to the bottom of the message container
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
  



  ////

//   scroll
const sr = ScrollReveal({
    origin: 'top',
    distance: '90px',
    duration: 2000,
    reset: true     
})

/* -- HOME -- */
sr.reveal('.nav',{})






const srL = ScrollReveal({
    origin: 'left',
    distance: '120px',
    duration: 2000,
    reset: true     
})

srL.reveal('.heroleft',{delay: 200})

  

const srR = ScrollReveal({
    origin: 'right',
    distance: '100px',
    duration: 2000,
    reset: true     
})

srR.reveal('.hero',{delay: 100})



