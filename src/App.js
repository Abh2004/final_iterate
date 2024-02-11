import { OpenAI } from 'openai';
import  OpenAIAPI  from 'openai';
import React, { useState } from 'react';
import './App.css'; 
import axios from 'axios';

// require('dotenv').config() 

function App() {
  const [imgPrompt, setImgPrompt] = useState('');
  const [imgLink, setImgLink] = useState('');
  const [txt, setTxt] = useState('');


  const config = {
    apiKey: process.env.REACT_APP_APIKEY  // Replace with your actual API key
  };

  const openai = new OpenAI({apiKey: process.env.REACT_APP_APIKEY ,dangerouslyAllowBrowser: true });





  const generateResponse = async (prompt) => {
    // Generate response from OpenAI Chat API
    const chatResponse = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content:`relevant products matching the entered idea :"${prompt}"`},
        { role: 'assistant', content: 'Sure, here is the information:' },
      ],
      model: 'gpt-3.5-turbo',
    });
  
    // Extract assistant's reply
    const assistantReply = chatResponse.choices[0].message.content;
  
    // Generate image based on the prompt
    const imageResponse = await openai.images.generate({
      prompt: `relevant icon image representing the category of this "${prompt}"`,
      n: 1,
      size: "256x256",
    });
    const imageUrl = imageResponse.data[0].url;
    const textArray = assistantReply.split('\n');
  
    return { text: textArray, image: imageUrl };
  };
  
  

  // const URL = 'https://iterate-ai-backend-hpux-pkdh130dc-abh2004.vercel.app/';

  const generateData = async (prompt, type) => {
    try {
        console.log(prompt)
        var response= await generateResponse(prompt);
        console.log(response)
      if (type === 'generate') {
        setTxt(response.text);
        setImgLink(response.image);
      } else if (type === 'text') {
        setTxt(response.data.response);
      } else if (type === 'image') {
        setImgLink(response.data.href);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenerate = () => {
    generateData(imgPrompt, 'generate');
  };

  const formatText = (text) => {
   // Check if text is an array, join it to create a string
   if (Array.isArray(text)) {
     text = text.join('\n');
  }
  
  // Use regex to split the text into an array of product items
  const productArray = text.split(/\d+\./).filter((item) => item.trim() !== '');
   // Map over the productArray to format each product as needed
  return productArray.map((product, index) => (
    <div key={index} className="max-w p-6 m-4 border border-gray-200 rounded-lg mx-24 shadow-lg">
      <p className="font-normal text-gray-700 dark:text-gray-400">{`${index + 1}. ${product.trim()}`}</p>
       {/* Additional styling and content for each product card can be added here */}
     </div>
   ));
 };
  


  return (
    <div className="App ">
      <div className="relative w-full md:w-1/2 mx-auto flex flex-col m-4 items-center justify-center">
        <div className='w-full rounded-lg mx-4 bg-gray-50 flex flex-col md:flex-row items-center md:justify-between'>
          <input
            onChange={(e) => setImgPrompt(e.target.value)}
            className="bg-gray-50 text-gray-400 text-bold text-l m-2 p-4 w-full md:w-full"
            placeholder="Enter the prompt"
            required
          />
          {txt === '' ? ' ' : <img src={imgLink} className="h-12 m-2 rounded-xl shadow-xl" alt="Generated Image" />}
        </div>

        <button
          type="button"
          class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-4"
          onClick={handleGenerate}
        >
          Generate
        </button>
      </div>


     <div className="w-full md:w-full mx-auto">
        <span className="">{txt === '' ? 'Generated Text will appear here  ' : formatText(txt)}</span>
      </div>  


    </div>
  );
}

export default App;



