import axios from "axios";



const apievo = axios.create({
  baseURL: "https://evolutionapi.catalaonoticias.com.br/message/sendText/caua", 
  headers: {
    'Content-Type': 'application/json',
    'apikey': '8063d2ec6e2013e6e58f2f9b025c0c42', 
  }
});


const sendMessage = async (number, text) => {
    const data = {
        number: number, 
        textMessage: {  
            text: text  
        },
        delay: 1,      
    };

    try {
        const response = await apievo.post('', data); 
        console.log('Message sent successfully:', response.data);
    } catch (err) {
        console.error('Error sending message:', err.response?.data || err);
        alert("Failed to send the message: " + (err.response?.data.message || err.message));
    }
};

export { sendMessage };
