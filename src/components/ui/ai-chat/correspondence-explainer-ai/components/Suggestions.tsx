import { useLanguage } from '@/context/language';
import { Collapse, Tooltip, Space } from 'antd';
import { FileTextOutlined, TranslationOutlined, BulbOutlined, UnorderedListOutlined, InfoCircleOutlined, FilePdfFilled, CalendarFilled, CalendarOutlined, RedEnvelopeOutlined, MailOutlined } from '@ant-design/icons';
import React from 'react';
import { Box } from '@mui/material';

interface Props {
  handleAsk: (query: string) => void;
  fileList: string[];
}

export default function Suggestions({ handleAsk, fileList }: Props) {
  const { isEnglish } = useLanguage();

  // Helper to extract display name from file
  const getDisplayName = (filename: string) => {
    const match = filename.match(/^[^-]+(?:-[^-]+)*-(.+)$/);
    return match ? match[1] : filename;
  };

  // Action options for each file
  const getActions = (filename: string) => [
    {
      icon: <TranslationOutlined />,
      label: isEnglish ? 'Translate to Arabic' : `ترجمة إلى العربية`,
      query: isEnglish ? `Translate ${filename} document to Arabic` :` ترجمة الوثيقة ${filename} إلى العربية`,
    },
     {
      icon: <TranslationOutlined />,
      label: isEnglish ? 'Translate to English' : 'ترجمة إلى الإنجليزية',
      query: isEnglish ? `Translate ${filename} document to English` : `ترجمة الوثيقة ${filename} إلى الإنجليزية`,
    },
    {
      icon: <FileTextOutlined />,
      label: isEnglish ? 'Summarize' : 'تلخيص',
      query: isEnglish ? `Summarize the document ${filename} in detail` : `تلخيص الوثيقة ${filename} بالتفصيل`,
    },
    {
      icon: <UnorderedListOutlined />,
      label: isEnglish ? 'Key Points' : 'النقاط الرئيسية',
      query: isEnglish ? `What are the key points of the document ${filename}?` : `ما هي النقاط الرئيسية في الوثيقة ${filename}؟`,
    },
    {
      icon: <BulbOutlined />,
      label: isEnglish ? 'Main Takeaways' : 'الدروس المستفادة الرئيسية',
      query: isEnglish ? `What are the main takeaways from the document ${filename}?` : `ما هي الدروس المستفادة الرئيسية من الوثيقة ${filename}؟`,
    },
    {
      icon: <InfoCircleOutlined />,
      label: isEnglish ? 'Explain More' : 'اشرح أكثر',
      query: isEnglish ? `Explain the document ${filename} in more depth` : `اشرح الوثيقة ${filename} بمزيد من العمق`,
    },
   
      {
        icon: <CalendarOutlined />, 
        label: isEnglish ? 'Extract Dates' : 'استخراج التواريخ',
        query: isEnglish ? `List all important dates mentioned in the document ${filename}` : `اذكر جميع التواريخ المهمة المذكورة في الوثيقة ${filename}`,
      },
      {
        icon: <InfoCircleOutlined />, 
        label: isEnglish ? 'List Entities' : 'قائمة الكيانات',
        query: isEnglish ? `List all people, organizations, and places mentioned in the document ${filename}` : `اذكر جميع الأشخاص والمنظمات والأماكن المذكورة في الوثيقة ${filename}`,
      },
      {
        icon: <MailOutlined />, 
        label: isEnglish ? 'Summarize for Email' : 'تلخيص للبريد الإلكتروني',
        query: isEnglish ? `Summarize the document ${filename} in a short paragraph suitable for email` : `تلخيص الوثيقة ${filename} في فقرة قصيرة مناسبة للبريد الإلكتروني`,
      },
    
  ];

  // Helper to get file type icon
  const getFileIcon = (filename: string, size: number|string = 10) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FilePdfFilled style={{ fontSize: size }} />;
      case 'txt':
        return <FileTextOutlined style={{ fontSize: size }} />;
      case 'doc':
      case 'docx':
        return <FileTextOutlined style={{ color: '#2b579a', fontSize: size }} />;
      case 'xls':
      case 'xlsx':
        return <UnorderedListOutlined style={{ color: '#217346', fontSize: size }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  return (
   
      fileList.map((filename, idx) => (
         
        <div>
           {getActions(filename).map((action, i) => (
              <Tooltip title={action.label} key={i}>
                <span
                  style={iconButtonStyle}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleAsk(action.query)}
                  onKeyPress={e => { if (e.key === 'Enter') handleAsk(action.query); }}
                >
                  {action.icon}
                </span>
              </Tooltip>
            ))}
        </div>
      ))
   
  );
}

const iconButtonStyle: React.CSSProperties = {
  fontSize: 16,
  padding:0,
  cursor: 'pointer',
  marginRight: 16,
  marginBottom: 8,
  transition: 'color 0.2s',
  color: '#1677ff',
};