      
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
