import React, { useState, useEffect, useRef } from 'react';

const AiAssistant = () => {
  // Chat messages state
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'ai', 
      content: "Hello! I'm your AI nutrition assistant. How can I help you with your nutrition planning today?" 
    }
  ]);
  
  // Input state
  const [messageInput, setMessageInput] = useState('');
  
  // Ref for auto-scrolling chat
  const chatEndRef = useRef(null);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  // Handle message input change
  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };
  
  // Handle Enter key press
  const handleMessageKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Send message
  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    
    // Add user message
    setChatMessages(prevMessages => [
      ...prevMessages, 
      { sender: 'user', content: messageInput.trim() }
    ]);
    
    // Clear input
    setMessageInput('');
    
    // Generate AI response (simulated)
    setTimeout(() => {
      generateAiResponse(messageInput.trim());
    }, 1000);
  };
  
  // Generate AI response
  const generateAiResponse = (userInput) => {
    let response = "I'm processing your request...";
    
    // Simple keyword-based responses
    if (userInput.toLowerCase().includes('meal plan')) {
      response = "Creating effective meal plans involves understanding the client's goals, preferences, and any dietary restrictions. Would you like me to help you create a personalized meal plan template?";
    } else if (userInput.toLowerCase().includes('protein')) {
      response = "Good sources of protein include lean meats, poultry, fish, eggs, dairy products, legumes, tofu, and tempeh. For vegetarians, I recommend focusing on a combination of legumes, grains, nuts, and seeds to ensure complete protein intake.";
    } else if (userInput.toLowerCase().includes('calories')) {
      response = "Calorie needs vary based on age, sex, weight, height, and activity level. For weight maintenance, women typically need 1,600-2,400 calories per day, while men need 2,000-3,000. For weight loss, a deficit of 500-1,000 calories per day is often recommended.";
    } else if (userInput.toLowerCase().includes('sugar')) {
      response = "To help clients reduce sugar intake, suggest gradually cutting back on added sugars, reading nutrition labels, choosing whole foods, using natural sweeteners in moderation, staying hydrated, and focusing on protein and fiber-rich foods to help control cravings.";
    } else {
      response = "That's an interesting nutrition question. To provide you with the most accurate information, I'd need a bit more context. Could you provide additional details about your client's specific goals or dietary needs?";
    }
    
    // Add AI response to chat
    setChatMessages(prevMessages => [
      ...prevMessages, 
      { sender: 'ai', content: response }
    ]);
  };
  
  // Handle popular question click
  const handlePopularQuestionClick = (question) => {
    setChatMessages(prevMessages => [
      ...prevMessages, 
      { sender: 'user', content: question }
    ]);
    
    setTimeout(() => {
      generateAiResponse(question);
    }, 1000);
  };
  
  // Generate meal plan
  const handleGenerateMealPlan = () => {
    setChatMessages(prevMessages => [
      ...prevMessages, 
      { 
        sender: 'user', 
        content: "Can you generate a sample meal plan for a weight loss client?" 
      }
    ]);
    
    setTimeout(() => {
      setChatMessages(prevMessages => [
        ...prevMessages, 
        { 
          sender: 'ai', 
          content: `Here's a sample 1-day meal plan for weight loss (1,500 calories):

Breakfast (350 cal):
- 1/2 cup oatmeal with 1 tbsp almond butter
- 1 medium apple
- 1 cup unsweetened almond milk

Mid-morning Snack (150 cal):
- 1 small Greek yogurt (0% fat)
- 1/4 cup berries

Lunch (400 cal):
- Salad with 4 oz grilled chicken
- 2 cups mixed greens
- 1/4 avocado
- 1 tbsp olive oil vinaigrette

Afternoon Snack (200 cal):
- 1/4 cup hummus
- 1 cup sliced vegetables
- 10 whole grain crackers

Dinner (400 cal):
- 4 oz baked salmon
- 1 cup roasted Brussels sprouts
- 1/2 cup quinoa

Would you like me to customize this for specific dietary needs?` 
        }
      ]);
    }, 1500);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Nutrition AI Assistant</h3>
        <div className="flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.sender === 'ai' ? 'flex' : 'flex justify-end'}`}>
                <div className={`max-w-3/4 p-3 rounded-lg ${
                  msg.sender === 'ai' 
                    ? 'bg-white border border-gray-200 text-gray-800' 
                    : 'bg-purple-600 text-white'
                }`}>
                  <div className={`whitespace-pre-wrap ${msg.sender === 'ai' ? 'text-gray-800' : 'text-white'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="border-t border-gray-200 pt-4">
            <div className="mb-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Questions:</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handlePopularQuestionClick("How do I create a balanced meal plan?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                >
                  How do I create a balanced meal plan?
                </button>
                <button 
                  onClick={() => handlePopularQuestionClick("What are good protein sources for vegetarians?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                >
                  Protein for vegetarians?
                </button>
                <button 
                  onClick={() => handlePopularQuestionClick("How can I help clients reduce sugar intake?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                >
                  Reducing sugar intake
                </button>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={messageInput}
                onChange={handleMessageInputChange}
                onKeyDown={handleMessageKeyDown}
                placeholder="Ask your nutrition question here..."
                className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-12 focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows="3"
              ></textarea>
              <button
                onClick={handleSendMessage}
                className="absolute right-3 bottom-3 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="mt-3 flex justify-between">
              <button
                onClick={handleGenerateMealPlan}
                className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Generate Meal Plan
              </button>
              <button 
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setChatMessages([{ 
                  sender: 'ai', 
                  content: "Hello! I'm your AI nutrition assistant. How can I help you with your nutrition planning today?" 
                }])}
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant; 