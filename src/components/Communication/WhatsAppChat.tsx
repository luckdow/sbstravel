import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Phone, Image, Paperclip, Smile, X } from 'lucide-react';
import { WhatsAppService } from '../../services/communication';

interface Message {
  id: string;
  type: 'sent' | 'received';
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  messageType: 'text' | 'image' | 'document' | 'template';
}

interface WhatsAppChatProps {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  onClose?: () => void;
}

export default function WhatsAppChat({ 
  customerId = 'customer1', 
  customerName = 'Ahmet Yılmaz', 
  customerPhone = '+90 555 123 4567',
  onClose 
}: WhatsAppChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [online, setOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load initial messages (mock data)
    const initialMessages: Message[] = [
      {
        id: '1',
        type: 'sent',
        content: '🚐 Merhaba Ahmet Bey! SBS Travel\'dan size mesaj gönderiyorum. Yarınki transferiniz için bilgilendirme yapmak istiyorum.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: 'read',
        messageType: 'text'
      },
      {
        id: '2',
        type: 'received',
        content: 'Merhaba, evet dinliyorum',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 5), // 1h 55m ago
        status: 'read',
        messageType: 'text'
      },
      {
        id: '3',
        type: 'sent',
        content: '📍 Transferiniz yarın 14:30\'da Antalya Havalimanı\'ndan Kemer Marina Hotel\'e olacak. QR kodunuz: SBS-QR-2024001',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1 + 1000 * 60 * 50), // 1h 10m ago
        status: 'read',
        messageType: 'text'
      },
      {
        id: '4',
        type: 'received',
        content: 'Teşekkürler. Şoför kim olacak?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: 'read',
        messageType: 'text'
      }
    ];

    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      type: 'sent',
      content: newMessage,
      timestamp: new Date(),
      status: 'sent',
      messageType: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message delivery status update
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    // Simulate auto-response (for demo)
    if (newMessage.toLowerCase().includes('şoför')) {
      setTimeout(() => {
        const autoResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'received',
          content: 'Şoförünüz Mehmet Bey olacak. Plaka: 07 ABC 123. Size yaklaştığında arayacak.',
          timestamp: new Date(),
          status: 'read',
          messageType: 'text'
        };
        setMessages(prev => [...prev, autoResponse]);
      }, 2000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const message: Message = {
        id: Date.now().toString(),
        type: 'sent',
        content: `📎 ${file.name}`,
        timestamp: new Date(),
        status: 'sent',
        messageType: file.type.startsWith('image/') ? 'image' : 'document'
      };

      setMessages(prev => [...prev, message]);
    }
  };

  const sendQuickReply = (text: string) => {
    setNewMessage(text);
    setTimeout(() => handleSendMessage(), 100);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: Date) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Bugün';
    } else {
      return messageDate.toLocaleDateString('tr-TR');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  const quickReplies = [
    'Merhaba! Size nasıl yardımcı olabilirim?',
    'Transferiniz onaylandı ✅',
    'Şoförümüz yola çıktı, 10 dakika içinde orada olacak',
    'QR kodunuzu hazır bulundurun lütfen',
    'Transfer tamamlandı. İyi günler! 🙏'
  ];

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center font-semibold">
              {customerName.split(' ').map(n => n[0]).join('')}
            </div>
            {online && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-300 rounded-full border-2 border-green-600"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{customerName}</h3>
            <p className="text-sm text-green-100">
              {online ? 'Çevrimiçi' : 'En son bugün 14:30\'da görüldü'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-green-700 rounded-full transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-green-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="text-center my-4">
              <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                {date}
              </span>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'sent'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  {/* Message Content */}
                  <div className="mb-1">
                    {message.messageType === 'image' ? (
                      <div className="space-y-2">
                        <div className="w-48 h-32 bg-gray-200 rounded flex items-center justify-center">
                          <Image className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ) : message.messageType === 'document' ? (
                      <div className="flex items-center space-x-2">
                        <Paperclip className="w-4 h-4" />
                        <span className="text-sm">{message.content}</span>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>

                  {/* Timestamp and Status */}
                  <div className={`text-xs flex items-center justify-end space-x-1 ${
                    message.type === 'sent' ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.type === 'sent' && (
                      <span className={message.status === 'read' ? 'text-blue-200' : 'text-green-200'}>
                        {getStatusIcon(message.status)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {typing && (
          <div className="flex justify-start mb-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 bg-gray-100 border-t">
        <div className="flex space-x-2 overflow-x-auto">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => sendQuickReply(reply)}
              className="whitespace-nowrap px-3 py-1 bg-white text-sm rounded-full text-gray-700 hover:bg-gray-50 border"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Mesajınızı yazın..."
              className="w-full p-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}