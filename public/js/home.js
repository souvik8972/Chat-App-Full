


















const signupbtn=document.getElementById("signup");
const loginbtn=document.getElementById("login")
const signupuser=document.querySelector(".user")
const loginuser=document.querySelector(".userlogin")
const signupbtn2=document.getElementById("signupbtn").addEventListener("click",popup)
const hero=document.querySelector(".hero")  
const closeBtn=document.querySelector(".close").addEventListener("click",close)    
const closeBtn1=document.querySelector(".close1").addEventListener("click",close)    
const signinToggle=document.querySelector("#signupToggle").addEventListener("click",popup)
const loginToggle=document.querySelector("#signinToggle").addEventListener("click",popupsignin)
function close(){
    hero.classList.remove("blur")
    signupuser.classList.remove("active");
    loginuser.classList.remove("active")
}
signupbtn.addEventListener("click",popup)
function popup(){
    hero.classList.add("blur")
    
    signupuser.classList.toggle("active");
    if (signupuser.classList.contains('active')) {
        hero.classList.add("blur")
    } else {
        hero.classList.remove("blur")
    }
    loginuser.classList.remove("active")

}
function popupsignin(){
    
    hero.classList.add("blur")
    loginuser.classList.toggle("active")
    if (loginuser.classList.contains('active')) {
        hero.classList.add("blur")
    } else {
        hero.classList.remove("blur")
    }
    signupuser.classList.remove("active");
}

loginbtn.addEventListener("click",popupsignin)












const flashMessage = document.querySelector(".flashMessage");
const signFormbtn = document.getElementById("signupForm");

signFormbtn.addEventListener("submit", signup);

function signup(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phonenumber = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const confpassword = document.getElementById("confpassword").value;

    const formData = {
        username,
        email,
        phonenumber,
        password,
        confpassword
    };

    console.log(formData);

    axios.post('/signup', formData)
        .then(response => {
            console.log('Response Status:', response.status);
            console.log('Response Data:', response.data);
            e.target.reset();
            flashMessage.classList.add("success");
            flashMessage.textContent = response.data.message;

            setTimeout(() => {
                flashMessage.classList.remove("success");
                popupsignin();
            }, 2000);
        })
        .catch(error => {
            flashMessage.classList.add("failed");
            
            // Check if the error object has a response and data property
            if (error.response && error.response.data) {
                flashMessage.textContent = error.response.data.error;
            } else {
                flashMessage.textContent = 'An error occurred.';
            }

            setTimeout(() => {
                flashMessage.classList.remove("failed");
            }, 2000);

            console.log('Error Data:', error.response);
        });
}







////


const loginForm = document.getElementById("loginForm");
const flashMessage1 = document.querySelector(".flashMessage1");
loginForm.addEventListener("submit", login);

async function login(e) {
    e.preventDefault();
    const email = document.getElementById("emailLogin").value;
    const password = document.getElementById("passwordLogin").value;

    const formData = {
        email,
        password
    };

    console.log(formData);

    try {
        const response = await axios.post('/login', formData);
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
        e.target.reset();
        flashMessage1.classList.add("success");
        flashMessage1.textContent = response.data.message;

        setTimeout(() => {
            flashMessage1.classList.remove("success");
            alert("done")
            // Add any logic or redirect to the logged-in user's dashboard
        }, 2000);
    } catch (error) {
        flashMessage1.classList.add("failed");

        // Check if the error object has a response and data property
        if (error.response && error.response.data) {
            flashMessage1.textContent = error.response.data.error;
        } else {
            flashMessage1.textContent = 'An error occurred.';
        }

        setTimeout(() => {
            flashMessage1.classList.remove("failed");
        }, 2000);

        console.error('Error Data:', error.response);
    }
}
