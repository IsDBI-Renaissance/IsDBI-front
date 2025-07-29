"use client"

import { useState, useEffect, useRef } from "react"
import { SidebarHeader, SidebarContent, SidebarFooter } from "@/components/chat/sidebar"
import { HeaderDropdown, type Challenge } from "@/components/chat/header-dropdown"
import type { Message } from "@/components/chat/chat-container"
import { FileUpload, type UploadedFile } from "@/components/chat/file-upload"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { LogOut, Plus, Search, History, User, FileText, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from 'react-markdown';
import Image from "next/image"
import { AnimatedResponse } from "@/components/chat/animated-response"
import axios from "axios"
import Cookies from "js-cookie"
import { JournalEntryForm } from "@/components/chat/journal-entry-form"

// Sample challenges
const challenges: Challenge[] = [
  { id: "use-cases", name: "Use Case Scenario", topic: "Use Case Scenario" },
  { id: "reverse-transactions", name: "Reverse Transactions", topic: "Reverse Transactions" },
  { id: "standards-enhancement", name: "Standards Enhancements", topic: "Standards Enhancements" },
  { id: "custom-category", name: "FinFraud Shield", topic: "FinFraud Shield" },
]

// Utility to map topic to API endpoint
const topicToApiEndpoint = (topic: string) => {
  switch (topic) {
    case "Use Case Scenario":
      return "/api/ai/use-case";
    case "Reverse Transactions":
      return "/api/ai/reverse";
    case "Standards Enhancements":
      return "/api/ai/standards";
    case "FinFraud Shield":
      return "/api/ai/team";
    default:
      return "/api/ai/general";
  }
};

// Utility to map topic to service ID
const topicToServiceId = (topic: string) => {
  switch (topic) {
    case "Use Case Scenario":
      return "service1";
    case "Reverse Transactions":
      return "service2";
    case "Standards Enhancements":
      return "service3";
    case "FinFraud Shield":
      return "service4";
    default:
      return "service1";
  }
};

// Initial sample conversations
const initialConversations = [
  {
    id: "1",
    title: "Ijarah (Lease-to-Own) Accounting",
    date: "3 days ago",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    topic: "Use Case Scenario",
    challengeId: "use-cases",
    messages: [
      {
        id: "1-1",
        content: "I just completed an Ijarah Muntahia Bittamleek contract for a vehicle. Can you help me generate the accounting entries?",
        isUser: true,
        timestamp: "09:00 AM",
      },
      {
        id: "1-2",
        content: "Sure! Please provide the asset cost, lease term, any additional costs, and the ownership transfer price.",
        isUser: false,
        timestamp: "09:01 AM",
      },
      {
        id: "1-3",
        content: "The vehicle cost is $60,000. Lease term is 3 years. Delivery fee is $2,000. Ownership transfer price is $1,000.",
        isUser: true,
        timestamp: "09:02 AM",
      },
      {
        id: "1-4",
        content: "Thanks! Based on FAS 32, your Right of Use (ROU) asset is calculated as $62,000 (cost + delivery), then reduced by the $1,000 transfer price.\n\nThe initial journal entry would be:\n\n- **Dr. ROU Asset**: $61,000\n- **Dr. Deferred Ijarah Cost**: calculated from rental terms\n- **Cr. Ijarah Liability**: total rental obligations\n\nWould you like a step-by-step breakdown?",
        isUser: false,
        timestamp: "09:03 AM",
      },
    ],
  },
  {
    id: "2",
    title: "Reverse Engineering Journal Entries",
    date: "1 week ago",
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    topic: "Reverse Transactions",
    challengeId: "reverse-transactions",
    messages: [
      {
        id: "2-1",
        content: "Here's a journal entry I found, but I'm not sure what it's for:\n\n- Dr. Investment in Real Estate: $500,000\n- Cr. Cash: $500,000",
        isUser: true,
        timestamp: "10:00 AM",
      },
      {
        id: "2-2",
        content: "Let me analyze it. This entry closely matches contracts under **FAS 28**, commonly used for **Diminishing Musharakah**.\n\nThere's a 78% probability this is a Musharakah-based real estate investment.\n\nWould you like to see the reasoning and AAOIFI references?",
        isUser: false,
        timestamp: "10:01 AM",
      },
      {
        id: "2-3",
        content: "Yes, please show me the logic.",
        isUser: true,
        timestamp: "10:02 AM",
      },
      {
        id: "2-4",
        content: "✅ Entry involves equity-based asset acquisition\n✅ No interest-bearing liability present\n✅ Common in Diminishing Musharakah real estate structures\n\nBased on this, the system identifies FAS 28 as the most likely standard.",
        isUser: false,
        timestamp: "10:03 AM",
      },
    ],
  },
  {
    id: "3",
    title: "Standards Clarification – FAS 10",
    date: "2 weeks ago",
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    topic: "Standards Enhancements",
    challengeId: "standards-enhancement",
    messages: [
      {
        id: "3-1",
        content: "I'm going through FAS 10 for Istisna'a. Can you explain how progress billing works under this standard?",
        isUser: true,
        timestamp: "11:00 AM",
      },
      {
        id: "3-2",
        content: "Absolutely! Under FAS 10, progress billing is recognized based on the **percentage of completion** of the construction.\n\nI can simulate scenarios for revenue recognition and cost treatment. Want to input your project stages?",
        isUser: false,
        timestamp: "11:01 AM",
      },
      {
        id: "3-3",
        content: "Sure. It's a 3-stage contract over 12 months. Can I also track the revenue over time?",
        isUser: true,
        timestamp: "11:02 AM",
      },
      {
        id: "3-4",
        content: "Yes. Once you enter stage details, I'll show you a timeline of:\n\n- Revenue recognition\n- Cost of construction\n- Journal entries for each phase\n\nAll aligned with AAOIFI FAS 10.",
        isUser: false,
        timestamp: "11:03 AM",
      },
    ],
  }
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [selectedChallenge, setSelectedChallenge] = useState(challenges[0])
  const [conversations, setConversations] = useState(initialConversations)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(initialConversations[0]?.id || null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [activeInput, setActiveInput] = useState<"text" | "file" | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mobile sidebar states
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const [search, setSearch] = useState("");

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Get current conversation
  const currentConversation = conversations.find((c) => c.id === currentConversationId)
  const messages = currentConversation ? currentConversation.messages : []

  // Filter and sort conversations
  const filteredConversations = search
    ? conversations
        .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.title.localeCompare(b.title))
    : [...conversations].sort((a, b) => b.createdAt - a.createdAt);

  // When the challenge changes, start a new conversation for that challenge
  useEffect(() => {
    // Start a new conversation for the new challenge
    const newId = Date.now().toString();
    const newConversation = {
      id: newId,
      title: "Untitled Conversation",
      date: "Just now",
      createdAt: Date.now(),
      messages: [],
      challengeId: selectedChallenge.id,
      topic: selectedChallenge.topic ?? selectedChallenge.name,
    };
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    setActiveInput(null);
    setUploadedFiles([]);
  }, [selectedChallenge]);

  // Handle journal entry form submission for Reverse Transactions
  const handleJournalEntrySubmit = async (data: { entries: any[], description: string }) => {
    if (!currentConversationId) return;

    const messageContent = JSON.stringify(data, null, 2);

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === currentConversationId) {
          const isFirst = conv.messages.length === 0;
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            title: isFirst ? "Journal Entry Analysis" : conv.title,
          };
        }
        return conv;
      })
    );

    setIsLoading(true);

    try {
      const conv = conversations.find((c) => c.id === currentConversationId);
      if (!conv) {
        throw new Error('Conversation not found');
      }

      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Send JSON body, not FormData
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/gateway/service2`,
        {
          entries: data.entries,
          description: data.description,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: JSON.stringify(response.data || {}, null, 2),
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? { ...conv, messages: [...conv.messages, aiResponse] }
            : conv
        )
      );
    } catch (error) {
      console.error('Error analyzing journal entries:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
          logout();
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? { ...conv, messages: [...conv.messages, errorResponse] }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new conversation
  const startNewChat = () => {
    const newId = Date.now().toString();
    const newConversation = {
      id: newId,
      title: "Untitled Conversation",
      date: "Just now",
      createdAt: Date.now(),
      messages: [],
      challengeId: selectedChallenge.id,
      topic: selectedChallenge.topic ?? selectedChallenge.name,
    };
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    setActiveInput(null);
    setUploadedFiles([]);
  };

  // Send a message in the current conversation
  const handleSendMessage = async (content: string) => {
    if (!currentConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === currentConversationId) {
          // If this is the first message, update the title
          const isFirst = conv.messages.length === 0;
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            title: isFirst ? (content.length > 30 ? content.substring(0, 30) + "..." : content) : conv.title,
          };
        }
        return conv;
      })
    );

    setIsLoading(true);

    try {
      // Get the topic from the current conversation
      const conv = conversations.find((c) => c.id === currentConversationId);
      if (!conv) {
        throw new Error('Conversation not found');
      }

      const topic = conv.topic;
      const serviceId = topicToServiceId(topic);

      // Get token from cookies
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Create form data
      const formData = new FormData();
      formData.append('text', content);

      // Send request to backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gateway/${serviceId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: JSON.stringify(response.data || {}, null, 2),
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? { ...conv, messages: [...conv.messages, aiResponse] }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
          // Optionally redirect to login page or trigger re-authentication
          logout();
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? { ...conv, messages: [...conv.messages, errorResponse] }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load a conversation and set as current
  const loadConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId)
    setActiveInput("text")
    // Close mobile sidebar if open
    if (isMobile && leftSidebarOpen) {
      setLeftSidebarOpen(false)
    }
    // Scroll to bottom after a short delay to ensure messages are rendered
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  // Delete a conversation by id (no confirmation)
  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    if (currentConversationId === id) {
      const next = conversations.find((c) => c.id !== id);
      setCurrentConversationId(next ? next.id : null);
    }
  };

  // Handle file upload
  const handleFileUpload = async (files: File[]) => {
    if (!currentConversationId) return;

    files.forEach(async (file) => {
      const fileId = Date.now().toString();

      // Create initial file entry with 0 progress
      setUploadedFiles(prev => [...prev, {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0
      }]);

      try {
        // Get the topic from the current conversation
        const conv = conversations.find((c) => c.id === currentConversationId);
        if (!conv) {
          throw new Error('Conversation not found');
        }

        const topic = conv.topic;
        const serviceId = topicToServiceId(topic);

        // Get token from cookies
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        // Create form data
        const formData = new FormData();
        formData.append('file', file);

        // Send request to backend
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gateway/${serviceId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setUploadedFiles(prev => 
              prev.map(f => f.id === fileId ? { ...f, progress } : f)
            );
          },
        });

        // Add file message to conversation
        const fileMessage: Message = {
          id: fileId,
          content: `Uploaded file: ${file.name}`,
          isUser: true,
          timestamp: new Date().toLocaleTimeString(),
        };

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentConversationId
              ? { ...conv, messages: [...conv.messages, fileMessage], title: conv.messages.length === 0 ? (fileMessage.content.length > 30 ? fileMessage.content.substring(0, 30) + "..." : fileMessage.content) : conv.title }
              : conv
          )
        );

        // Add AI response
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: JSON.stringify(response.data || {}, null, 2),
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentConversationId
              ? { ...conv, messages: [...conv.messages, aiResponse] }
              : conv
          )
        );
      } catch (error) {
        console.error('Error uploading file:', error);
        let errorMessage = `Error uploading file ${file.name}. Please try again.`;

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            errorMessage = 'Your session has expired. Please log in again.';
            // Optionally redirect to login page or trigger re-authentication
            logout();
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: errorMessage,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentConversationId
              ? { ...conv, messages: [...conv.messages, errorResponse] }
              : conv
          )
        );
      } finally {
        // Remove file from uploaded files list
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      }
    });
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen)
    if (!leftSidebarOpen && rightSidebarOpen && isMobile) {
      setRightSidebarOpen(false)
    }
  }

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen)
    if (!rightSidebarOpen && leftSidebarOpen && isMobile) {
      setLeftSidebarOpen(false)
    }
  }

  return (
    <div className="flex h-screen bg-light dark:bg-dark overflow-hidden flex-col md:flex-row">
      {/* Left Sidebar - History */}
      <AnimatePresence>
        {(!isMobile || leftSidebarOpen) && (
          <>
            {isMobile && leftSidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
                onClick={toggleLeftSidebar}
                aria-label="Close sidebar overlay"
              />
            )}
            <motion.div
              initial={isMobile ? { x: -300, opacity: 0 } : false}
              animate={{ x: 0, opacity: 1 }}
              exit={isMobile ? { x: -300, opacity: 0 } : {}}
              transition={{ duration: 0.3 }}
              className={`sidebar sidebar-left ${isMobile ? "fixed z-40 h-full shadow-xl w-11/12 max-w-xs" : "w-[90vw] max-w-xs md:w-[280px]"} dark:bg-dark-accent dark:border-gray-700`}
              style={{ left: 0, top: 0, bottom: 0 }}
            >
              <SidebarHeader>
                <div className="flex items-center justify-between">
                  <div className="text-primary font-bold text-lg flex items-center">
                    <Link href="/">
                      <Image src="/images/Mizanex.png" alt="Mizanex" width={120} height={120} className="mr-2" />
                    </Link>
                  </div>
                  <div className="flex gap-2 items-center">
                    {isMobile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-neutral hover:text-primary transition-colors"
                        onClick={toggleLeftSidebar}
                        aria-label="Close sidebar"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral hover:text-primary transition-colors"
                      onClick={startNewChat}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </SidebarHeader>
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search analyses..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 dark:bg-dark-accent dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <SidebarContent className="px-3 py-2">
                <div className="space-y-1">
                  <div className="flex items-center text-xs font-medium text-neutral px-2 py-1.5">
                    <History className="w-4 h-4 mr-2" />
                    Recent Analyses
                  </div>
                  <AnimatePresence>
                    {filteredConversations.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`flex items-center group history-item dark:hover:bg-gray-700 dark:text-gray-200 ${currentConversationId === item.id ? 'bg-primary/10 dark:bg-primary/20' : ''}`}
                      >
                        <button
                          className="flex-1 text-left px-2 py-1 truncate"
                          onClick={() => loadConversation(item.id)}
                        >
                          <div className="font-medium text-dark dark:text-gray-200 truncate">{item.title}</div>
                          <div className="text-xs text-neutral">{item.date}</div>
                        </button>
                        <button
                          className="ml-2 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-500 opacity-70 group-hover:opacity-100 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(item.id);
                          }}
                          title="Delete conversation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </SidebarContent>
              <SidebarFooter>
                <div className="flex items-center justify-between">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center text-sm text-neutral hover:text-primary transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral hover:text-red-600 transition-colors"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </div>
              </SidebarFooter>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 max-w-full">
        {/* Header */}
        <header className="h-14 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-2 sm:px-4 bg-white dark:bg-dark-accent w-full">
          <HeaderDropdown
            challenges={challenges}
            selectedChallenge={selectedChallenge}
            onSelect={setSelectedChallenge}
            className="w-64"
          />

          <div className="flex items-center gap-2">
            <ThemeToggle className="bg-transparent shadow-none" />
            {isMobile && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-neutral hover:text-primary transition-colors"
                  onClick={toggleLeftSidebar}
                  aria-label="Toggle history sidebar"
                >
                  <History className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-neutral hover:text-primary transition-colors"
                  onClick={toggleRightSidebar}
                  aria-label="Toggle file upload sidebar"
                >
                  <FileText className="w-5 h-5" />
                </Button>
              </div>
            )}
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral hover:text-primary transition-colors"
                onClick={startNewChat}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            )}
          </div>
        </header>

        {/* Chat Container */}
        <div className="chat-messages dark:bg-dark overflow-y-auto max-h-[calc(100vh-8rem)] px-0 sm:px-2 md:px-4">
          {messages.length === 0 && selectedChallenge.id === "reverse-transactions" ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                className="w-full max-w-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <JournalEntryForm onSubmit={handleJournalEntrySubmit} isLoading={isLoading} />
              </motion.div>
            </div>
          ) : (
            messages.map((message, index) => {
              const isNewMessage = index === messages.length - 1 && !message.isUser;
              return (
                <AnimatedResponse
                  key={message.id}
                  content={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                  shouldAnimate={isNewMessage}
                />
              );
            })
          )}
          {isLoading && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="chat-message-ai bg-white dark:bg-dark-accent dark:border-gray-700 py-4 px-6">
                <div className="loading-spinner">
                  <div className="loading-dot loading-dot-1"></div>
                  <div className="loading-dot loading-dot-2"></div>
                  <div className="loading-dot loading-dot-3"></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-container dark:bg-dark-accent dark:border-gray-700 px-0 sm:px-2 md:px-4 pb-2 pt-2">
          <form onSubmit={(e) => {
            e.preventDefault();
            const textarea = e.currentTarget.querySelector('textarea');
            if (textarea && textarea.value.trim()) {
              handleSendMessage(textarea.value.trim());
              textarea.value = '';
              textarea.style.height = 'auto';
            }
          }} className="chat-input dark:border-gray-700">
            {rightSidebarOpen && (
              <button
                type="button"
                onClick={() => toggleRightSidebar()}
                className="p-2 rounded-full text-neutral hover:text-primary hover:bg-primary-light/30 transition-colors"
                title="Attach file"
                disabled={selectedChallenge.id === "reverse-transactions"}
              >
                <FileText className="w-5 h-5" />
              </button>
            )}
            <textarea
              placeholder={selectedChallenge.id === "reverse-transactions" ? "Use the journal entry form above to analyze transactions" : "Type your message..."}
              disabled={isLoading || selectedChallenge.id === "reverse-transactions"}
              className="chat-textarea dark:bg-dark-accent dark:text-white"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (e.currentTarget.value.trim()) {
                    handleSendMessage(e.currentTarget.value.trim());
                    e.currentTarget.value = "";
                    e.currentTarget.style.height = 'auto';
                  }
                }
              }}
              onChange={(e) => {
                // Auto-resize textarea
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
              }}
            />
            <button
              type="submit"
              disabled={isLoading || selectedChallenge.id === "reverse-transactions"}
              className="chat-send-button"
              title="Send message"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:rotate-45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Right Sidebar - File Upload */}
      <AnimatePresence>
        {(!isMobile || rightSidebarOpen) && (
          <>
            {isMobile && rightSidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
                onClick={toggleRightSidebar}
                aria-label="Close sidebar overlay"
              />
            )}
            <motion.div
              initial={isMobile ? { x: 300, opacity: 0 } : false}
              animate={{ x: 0, opacity: 1 }}
              exit={isMobile ? { x: 300, opacity: 0 } : {}}
              transition={{ duration: 0.3 }}
              className={`sidebar sidebar-right ${isMobile ? "fixed right-0 z-40 h-full shadow-xl w-11/12 max-w-xs" : "w-[90vw] max-w-xs md:w-[320px]"} dark:bg-dark-accent dark:border-gray-700`}
              style={{ right: 0, top: 0, bottom: 0 }}
            >
              <SidebarHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium dark:text-white">File Upload</h3>
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral hover:text-primary transition-colors"
                      onClick={toggleRightSidebar}
                      aria-label="Close sidebar"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </Button>
                  )}
                </div>
              </SidebarHeader>
              <SidebarContent className="p-4">
                <FileUpload
                  onUpload={handleFileUpload}
                  uploadedFiles={uploadedFiles}
                  onRemoveFile={handleRemoveFile}
                  disabled={selectedChallenge.id === "reverse-transactions"}
                />
              </SidebarContent>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
