let p = document.createElement('p');
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const text = document.querySelector('.text_box');

//-------------------- Speech Part ---------------------
let speech = new SpeechSynthesisUtterance();
let speak = 0;
const speaker = () => {
    if (speak === 0) {
        read.style.color = "red";
        speak = 1;
    } else {
        read.style.color = "whitesmoke";
        speechSynthesis.cancel();
        speak = 0;
    }
}

//------------------------ Gemini API Part-------------------------
const api_key = 'AIzaSyC6yIW-kR0l2IAyRSyX2E2rDn-QMNxPEuU';
const api_call = async (query) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${api_key}`;
    const data = {
        contents: [
            {
                parts: [{ text: `${query}` }]
            }
        ]
    };
    try {
        const res = await axios.post(url, data, {
            headers: { 'Content-Type': 'application/json' }
        });

        // Fixing the issue with output display
        let z = document.createElement('p');
        z.classList.add('reply');
        z.innerText = res.data.candidates[0].content.parts[0].text;
        text.appendChild(z);

        // Adding speech synthesis after the API response
        speech.text = z.innerText;
        window.speechSynthesis.speak(speech);

        if (window.speechSynthesis.speaking) {
            mic = 0;
            read.style.color = "red";
            mic_on.style.color = "whitesmoke";
            recognition.stop();
        }

    } catch (error) {
        console.error(error.message);
    }
};

//---------------------------------------------------------
let mic_on = document.getElementById("mic_on");
let mic_off = document.getElementById("mic_off");
let delete_txt = document.querySelector("#delete");
let send = document.querySelector("#send");
let textarea = document.querySelector("textarea");
let read = document.querySelector("#volume");

// Command key words ---------------------------
const greetings = ['greetings friday', 'howdy friday', 'friday'];
const git = ['github', 'github profile', 'git account', 'open github'];
const bootstrap = ['bootstrap', 'boot strap', 'open bootstrap'];
const chatgpt = ['chatgpt', 'open chatgpt', 'google chatgpt'];
const insta = ['instagram', 'open instagram', "insta"];
const fb = ['facebook', 'open facebook', 'fb'];
const gemini = ['gemini', 'open gemini', 'google gemini'];

// Create a new speech synthesis instance
let isMicActive = false;

// Read logic
let d = 1;
read.addEventListener('click', () => {
    
    if (d === 0) {
        read.style.color = "whitesmoke";
        speechSynthesis.cancel();

        d = 1;
    } else if (d === 1) {
        read.style.color = "red";
        speechSynthesis.speak(speech)

        d = 0;
    }
});



// Send text logic
send.addEventListener('click', () => {
    let z = document.createElement('p');
    z.classList.add('text-box');
    if (textarea.value == "") {
        z.innerHTML = "Type something ";
        text.appendChild(z);
        speaker(z.innerHTML);
    } else {
        z.innerHTML = textarea.value;
        text.appendChild(z);
        checkCommand(z.innerHTML);
        api_call(z.innerHTML);
        speaker(z.innerHTML);
    }
    textarea.value = "";
});

// Initialize Speech Recognition
const recognition = new window.SpeechRecognition();
recognition.interimResults = true;

recognition.addEventListener('result', (e) => {
    p.classList.add('text-box');
    let script = Array.from(e.results)
        .map(result => result[0].transcript)
        .join("");

    p.innerText = script;

    if (e.results[0].isFinal) {
        api_call(script);
        text.appendChild(p);
        checkCommand(script.toLowerCase());
        p = document.createElement('p');
    }
});

// Function to handle commands based on spoken text
function checkCommand(script) {
    if (greetings.some(word => script.includes(word))) {
        let z = document.createElement('p');
        z.innerText = "Hi, I am F R I D A Y, a voice  app designed to chat with humans, I can listen to your queries and generate responses according to my abilities.";
        z.classList.add('reply');
        text.appendChild(z);

        speech.text = z.innerText;
        window.speechSynthesis.speak(speech);
        if (window.speechSynthesis.speaking) {
            mic = 0;
            
            mic_on.style.color = "whitesmoke";
            recognition.stop();
        }
    }

    if (git.some(word => script.includes(word))) {
        speech.text = "Opening Github";
        window.speechSynthesis.speak(speech);
        window.location.href = 'https://github.com/S8kuiry';
    }

    if (bootstrap.some(word => script.includes(word))) {
        speech.text = "Opening Bootstrap";
        window.speechSynthesis.speak(speech);
        window.location.href = "https://getbootstrap.com/docs/5.3/getting-started/introduction/";
    }

    if (chatgpt.some(word => script.includes(word))) {
        speech.text = "Opening Chatgpt";
        window.speechSynthesis.speak(speech);
        window.location.href = "https://chatgpt.com/";
    }

    if (gemini.some(word => script.includes(word))) {
        speech.text = "Opening Gemini";
        window.speechSynthesis.speak(speech);
        window.location.href = "https://gemini.google.com/?hl=en-IN";
    }

    if (insta.some(word => script.includes(word))) {
        speech.text = "Opening Instagram";
        window.speechSynthesis.speak(speech);
        window.location.href = 'https://www.instagram.com/';
    }

    if (fb.some(word => script.includes(word))) {
        speech.text = "Opening Facebook";
        window.speechSynthesis.speak(speech);
        window.location.href = 'https://www.facebook.com/';
    }

    if (script.includes("stop") || script.includes("stop mic")) {
        micOn();
        window.speechSynthesis.cancel();
    }

    if (script.includes("read")) {
        let read = Array.from(text.children)
            .map(child => child.innerText)
            .join(" ");
        speech.text = read;
        window.speechSynthesis.speak(speech);
        if (window.speechSynthesis.speaking) {
            mic = 0;
            mic_on.style.color = "whitesmoke";
            recognition.stop();
        }
    }

    if (script.includes("delete") || script.includes("delete everything")) {
        text.innerHTML = "";
    }
}

// Delete text logic
delete_txt.addEventListener('click', () => {
    text.innerHTML = "";
});

// Mic on/off function
let mic = 0;
const micOn = () => {
    if (mic === 0) {
        mic_on.style.color = "red";
        recognition.start();
        mic = 1;
        recognition.addEventListener('end', () => {
            if (mic === 1) {
                recognition.start();
            }
        });
    } else {
        mic_on.style.color = "whitesmoke";
        recognition.stop();
        mic = 0;
    }
}

mic_on.addEventListener("click", () => {
    micOn();
});
