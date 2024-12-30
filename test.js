const { default: axios } = require("axios");


const apiKey = "AIzaSyC6yIW-kR0l2IAyRSyX2E2rDn-QMNxPEuU";  // Get the API key from the environment variable


const call = async()=>{
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
    const data = {
        contents : [
            {
                parts:[{text:"who r u?"}],
                
            }
        ]
    }
    try{
        const res =await axios.post(url,data,{
            headers : {'Content-Type':'application/json'},
        })
        console.log(res.data.candidates[0].content.parts[0].text)

    }catch(error){
        console.error(error.message)
    }
}
call()