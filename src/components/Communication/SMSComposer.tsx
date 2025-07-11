import React, { useState } from 'react';
import { Send, MessageSquare, Users, X, AlertCircle } from 'lucide-react';
import { smsTemplates } from '../../services/communication/templates';
// import { SMSService } from '../../services/communication';

interface SMSComposerProps {
  onClose?: () => void;
  defaultRecipients?: string[];
  defaultTemplate?: string;
}

export default function SMSComposer({ onClose, defaultRecipients = [], defaultTemplate }: SMSComposerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate || 'booking_confirmation_tr');
  const [recipients, setRecipients] = useState<string[]>(defaultRecipients);
  const [newRecipient, setNewRecipient] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [useTemplate, setUseTemplate] = useState(true);
  const [variables, setVariables] = useState({
    bookingId: 'SBS2024001',
    pickupDate: '15 Ocak 2024',
    pickupTime: '14:30',
    qrCode: 'SBS-QR-2024001',
    amount: '250',
    hours: '2',
    driverName: 'Mehmet Şoför',
    vehiclePlate: '07 ABC 123',
    otp: '123456'
  });
  const [sending, setSending] = useState(false);

  const template = smsTemplates[selectedTemplate];

  const renderTemplate = (content: string, vars: Record<string, string>) => {
    let rendered = content;
    Object.keys(vars).forEach(key => {
      const placeholder = `{${key}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), vars[key] || `{${key}}`);
    });
    return rendered;
  };

  const getMessage = () => {
    if (useTemplate && template) {
      return renderTemplate(template.content, variables);
    }
    return customMessage;
  };

  const getMessageLength = () => {
    const message = getMessage();
    return message.length;
  };

  const getSMSCount = () => {
    return Math.ceil(getMessageLength() / 160);
  };

  const addRecipient = () => {
    const phone = newRecipient.trim();
    if (phone && !recipients.includes(phone)) {
      if (SMSService.isValidPhone(phone)) {
        setRecipients([...recipients, SMSService.formatTurkishPhone(phone)]);
        setNewRecipient('');
      } else {
        alert('Geçersiz telefon numarası formatı');
      }
    }
  };

  const removeRecipient = (phone: string) => {
    setRecipients(recipients.filter(r => r !== phone));
  };

  const handleSend = async () => {
    if (recipients.length === 0) {
      alert('En az bir alıcı eklemelisiniz');
      return;
    }

    const message = getMessage();
    if (!message.trim()) {
      alert('Mesaj boş olamaz');
      return;
    }

    setSending(true);
    
    try {
      // Simulate sending SMS
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`${recipients.length} alıcıya SMS gönderildi!`);
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      alert('SMS gönderilirken hata oluştu');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2" />
              SMS Composer
            </h2>
            <p className="text-gray-600 mt-1">
              Toplu SMS gönderimi ve template yönetimi
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Recipients & Settings */}
          <div className="space-y-6">
            {/* Recipients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Alıcılar ({recipients.length})
              </label>
              
              {/* Add Recipient */}
              <div className="flex space-x-2 mb-3">
                <input
                  type="tel"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="+90 555 123 4567"
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                />
                <button
                  onClick={addRecipient}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Ekle
                </button>
              </div>

              {/* Recipients List */}
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded">
                {recipients.length === 0 ? (
                  <div className="p-3 text-gray-500 text-center">
                    Henüz alıcı eklenmemiş
                  </div>
                ) : (
                  recipients.map((phone, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border-b last:border-b-0">
                      <span className="text-sm text-gray-700">{phone}</span>
                      <button
                        onClick={() => removeRecipient(phone)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Message Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mesaj Tipi
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={useTemplate}
                    onChange={() => setUseTemplate(true)}
                    className="mr-2"
                  />
                  Template Kullan
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!useTemplate}
                    onChange={() => setUseTemplate(false)}
                    className="mr-2"
                  />
                  Özel Mesaj
                </label>
              </div>
            </div>

            {/* Template Selection */}
            {useTemplate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Seçin
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.keys(smsTemplates).map((key) => (
                    <option key={key} value={key}>
                      {smsTemplates[key].name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Template Variables */}
            {useTemplate && template && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Değişkenleri
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {template.variables.map((variable) => (
                    <div key={variable}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {variable}
                      </label>
                      <input
                        type="text"
                        value={variables[variable] || ''}
                        onChange={(e) => setVariables(prev => ({
                          ...prev,
                          [variable]: e.target.value
                        }))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder={`{${variable}}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Message Preview & Send */}
          <div className="space-y-6">
            {/* Message Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mesaj Önizleme
              </label>
              
              {useTemplate ? (
                <div className="border border-gray-300 rounded p-4 bg-gray-50 min-h-32">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {getMessage()}
                  </p>
                </div>
              ) : (
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-32"
                  placeholder="SMS mesajınızı buraya yazın..."
                />
              )}
              
              {/* Character Count */}
              <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                <span>
                  {getMessageLength()}/160 karakter
                </span>
                <span>
                  {getSMSCount()} SMS
                </span>
              </div>
              
              {getMessageLength() > 160 && (
                <div className="flex items-center mt-2 text-amber-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Mesaj 160 karakterden uzun, {getSMSCount()} SMS olarak gönderilecek
                </div>
              )}
            </div>

            {/* Cost Estimation */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Maliyet Tahmini</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Alıcı sayısı:</span>
                  <span>{recipients.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>SMS sayısı (per alıcı):</span>
                  <span>{getSMSCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Toplam SMS:</span>
                  <span>{recipients.length * getSMSCount()}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-blue-200 pt-1">
                  <span>Tahmini maliyet:</span>
                  <span>₺{(recipients.length * getSMSCount() * 0.05).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Send Button */}
            <div className="space-y-3">
              <button
                onClick={handleSend}
                disabled={sending || recipients.length === 0 || !getMessage().trim()}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {recipients.length} Alıcıya SMS Gönder
                  </>
                )}
              </button>
              
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Test SMS Gönder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}