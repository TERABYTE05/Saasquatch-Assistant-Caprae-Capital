import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

interface Message {
  text: string;
  isUser: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "👋 Hello! I'm your SaaSquatch assistant. I can help you find detailed information about any organization. Just type the name!",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    // Add user message
    const userMessage: Message = { text: message, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      // Add bot response
      const botMessage: Message = {
        text:
          data.response || "Sorry, I encountered an error. Please try again.",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Message error:", error);
      const errorMessage: Message = {
        text: "❌ Sorry, there was an error processing your request. Please try again.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-dark">
      <div className="w-full max-w-4xl h-[700px] flex flex-col bg-card rounded-2xl shadow-card overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-chat-header px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-glow">
              <span className="text-2xl">🦎</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                SaaSquatch <span className="text-primary">Assistant</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Organization Intelligence Bot
              </p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-chat-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-md ${
                  message.isUser
                    ? "bg-primary text-primary-foreground ml-12"
                    : "bg-chat-bot text-foreground border border-border mr-12"
                }`}
              >
                <div className="text-sm leading-relaxed prose-chat">
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="max-w-[85%] rounded-2xl px-5 py-3 bg-chat-bot border border-border shadow-md mr-12">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Searching
                  </span>
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-primary rounded-full animate-bounce-dot"
                      style={{ animationDelay: "0s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-primary rounded-full animate-bounce-dot"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-primary rounded-full animate-bounce-dot"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Container */}
        <div className="p-4 bg-chat-header border-t border-border">
          <div className="flex gap-2">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for an organization..."
              disabled={isLoading}
              className="flex-1 bg-secondary border-border focus-visible:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow transition-all hover:shadow-[0_0_50px_hsl(174_85%_51%/0.4)]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
