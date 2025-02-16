import { CiLocationArrow1 } from "react-icons/ci";
import { chatbotActive } from '@/Ruduxtoolkit/registerSlice';
import React, { useState, useEffect } from 'react';
import { GiCrossMark } from 'react-icons/gi';
import { useDispatch } from 'react-redux';
import { Input } from '../ui/input';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define the shape of a message
interface Message {
    sender: "user" | "ai"; // Either "user" or "ai"
    text: string;          // The content of the message
}

const Chatbot = () => {
    const dispatch = useDispatch();
    const [content, setContent] = useState<string>(""); // Explicitly type as string
    const [messages, setMessages] = useState<Message[]>([]); // Use the Message interface
    const [loading, setLoading] = useState<boolean>(false);

    // Ensure API key is loaded correctly
    const Api_key = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
    if (!Api_key) {
        throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }

    // Add a default greeting message when the chatbox opens
    useEffect(() => {
        const greetingMessage: Message = {
            sender: "ai",
            text: "Hello! I'm here to help you with career advice, skill recommendations, and job-related questions. How can I assist you today?",
        };
        setMessages([greetingMessage]); // Initialize messages with the greeting
    }, []);

    const handleSend = async () => {
        if (!content.trim()) return; // Prevent sending empty messages

        setLoading(true);
        try {
            // Add user message to the chat
            const newMessage: Message = { sender: "user", text: content };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setContent("");

            // Call the Google Generative AI API
            const genAI = new GoogleGenerativeAI(Api_key);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Provide contextual instructions for the AI
            const systemPrompt = `
                You are an AI assistant for an online job platform. Your role is to help users with:
                1. Career advice.
                2. Recommendations for skills that can help them get better jobs.
                3. General conversations about their career goals.
                Stay focused on these topics and avoid unrelated discussions.
            `;

            // Combine the system prompt with the user's input
            const fullPrompt = `${systemPrompt}\nUser: ${content}`;

            const result = await model.generateContent(fullPrompt);

            // Extract the response text (ensure proper typing)
            const responseText = result.response.text() as string;

            // Add AI response to the chat
            const aiResponse: Message = { sender: "ai", text: responseText };
            setMessages((prevMessages) => [...prevMessages, aiResponse]);
        } catch (error) {
            console.error("Error:", (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgotpassword w-[300px] sm:w-[400px] h-[400px] bg-[#af8dff65] z-50 p-4 rounded-lg backdrop-blur-md relative overflow-hidden">
            {/* Close Button */}
            <GiCrossMark
                className="text-3xl text-white cursor-pointer hover:text-red-500 absolute right-4 top-4"
                onClick={() => dispatch(chatbotActive(false))}
            />

            {/* Chat History */}
            <div className="chat-history h-[300px] overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"} mb-2`}
                    >
                        <div
                            className={`max-w-[70%] p-2 rounded-lg ${
                                msg.sender === "user" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Field */}
            <div className="input flex w-full justify-center items-center bg-white absolute bottom-0 left-0 rounded-md pr-3">
                <Input
                    type="text"
                    placeholder="Enter your question?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="w-full outline-none text-lg focus-visible:ring-0 bg-transparent border-none"
                />
                <CiLocationArrow1
                    size={30}
                    cursor={"pointer"}
                    onClick={handleSend}
                    className={`${loading ? "animate-spin" : ""}`}
                />
            </div>
        </div>
    );
};

export default Chatbot;