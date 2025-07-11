import React, { useState } from 'react';
import { Eye, Send, FileText, X } from 'lucide-react';
import { emailTemplates } from '../../services/communication/templates';

interface EmailPreviewProps {
  templateId?: string;
  variables?: Record<string, string>;
  onClose?: () => void;
}

export default function EmailPreview({ templateId = 'booking_confirmation_tr', variables = {}, onClose }: EmailPreviewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(templateId);
  const [previewVariables, setPreviewVariables] = useState({
    customerName: 'Ahmet Yılmaz',
    bookingId: 'SBS2024001',
    transferType: 'Havalimanı → Otel',
    pickupLocation: 'Antalya Havalimanı',
    dropoffLocation: 'Kemer Marina Hotel',
    pickupDate: '15 Ocak 2024',
    pickupTime: '14:30',
    passengerCount: '2 Yetişkin',
    vehicleType: 'Standard Araç',
    totalPrice: '250',
    qrCode: 'SBS-QR-2024001',
    ...variables
  });

  const template = emailTemplates[selectedTemplate];

  if (!template) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">Template bulunamadı: {selectedTemplate}</p>
      </div>
    );
  }

  const renderTemplate = (content: string, vars: Record<string, string>) => {
    let rendered = content;
    Object.keys(vars).forEach(key => {
      const placeholder = `{${key}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), vars[key]);
    });
    return rendered;
  };

  const renderedSubject = renderTemplate(template.subject, previewVariables);
  const renderedHtml = renderTemplate(template.htmlContent, previewVariables);
  const renderedText = renderTemplate(template.textContent, previewVariables);

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Email Template Önizleme
            </h2>
            <p className="text-gray-600 mt-1">
              Email template'lerini önizleyebilir ve test edebilirsiniz
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selector & Variables */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Seçin
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.keys(emailTemplates).map((key) => (
                  <option key={key} value={key}>
                    {emailTemplates[key].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Variables */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Değişkenleri
              </label>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {template.variables.map((variable) => (
                  <div key={variable}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {variable}
                    </label>
                    <input
                      type="text"
                      value={previewVariables[variable] || ''}
                      onChange={(e) => setPreviewVariables(prev => ({
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

            {/* Template Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Template Bilgileri</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Kategori:</strong> {template.category}</p>
                <p><strong>Dil:</strong> {template.language.toUpperCase()}</p>
                <p><strong>Değişken Sayısı:</strong> {template.variables.length}</p>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              {/* Email Header */}
              <div className="bg-gray-50 p-4 border-b">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-16">Konu:</span>
                    <span className="text-sm text-gray-900">{renderedSubject}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-16">Kimden:</span>
                    <span className="text-sm text-gray-900">SBS Travel &lt;noreply@sbstravel.com&gt;</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-16">Kime:</span>
                    <span className="text-sm text-gray-900">{previewVariables.customerName} &lt;customer@example.com&gt;</span>
                  </div>
                </div>
              </div>

              {/* Email Content */}
              <div className="bg-white">
                <div 
                  className="p-4"
                  dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
              </div>
            </div>

            {/* Text Version */}
            <div className="mt-6">
              <div className="bg-gray-50 p-3 rounded-t-lg border-b">
                <h4 className="text-sm font-medium text-gray-700">Metin Versiyonu</h4>
              </div>
              <div className="bg-white p-4 border border-gray-300 rounded-b-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {renderedText}
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Send className="w-4 h-4 mr-2" />
                Test Email Gönder
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Eye className="w-4 h-4 mr-2" />
                Yeni Sekmede Aç
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}