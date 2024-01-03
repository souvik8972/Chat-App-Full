


















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














const signFormbtn=document.getElementById("signupForm")

signFormbtn.addEventListener("submit",signup)
function signup(e){
    e.preventDefault()
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
    }
    console.log(formData);
    axios.post('/signup', formData)
    .then(response => {
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
        e.target.reset();
        popupsignin()
    })
    .catch(error => {
        console.error('Error Status:', error.response.status);
        console.error('Error Data:', error.response.data);
    });

}