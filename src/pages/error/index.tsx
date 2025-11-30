import React from 'react';
import { useLanguage } from '../../context/language';
import { Result } from 'antd';
import { ResultStatusType } from 'antd/es/result';
import { LanguageType } from '../../types/language';

type ErrorMessage = {
    title: string;
    message: string;
}

type ErrorMessages = {
    [key in LanguageType]: {
        [code in ResultStatusType]: ErrorMessage;
    };
};

const errorMessages: ErrorMessages = {
    'en-INT': {
        "403": {
            title: '403 - Forbidden',
            message: 'You don’t have permission to access this page.',
        },
        "404": {
            title: '404 - Page Not Found',
            message: 'The page you are looking for does not exist.',
        },
        "500": {
            title: '500 - Internal Server Error',
            message: 'Something went wrong on our end. Please try again later.',
        },

        error: {
            title: 'Error',
            message: 'An unexpected error occurred. Please try again later.',
        },
        info: {
            title: 'Information',
            message: 'Here is some information for your attention.',
        },
        success: {
            title: 'Success',
            message: 'Your action was completed successfully.',
        },
        warning: {
            title: 'Warning',
            message: 'Please be cautious and check the details.',
        }
    },
    'ar-KW': {
        "403": {
            title: '٤٠٣ - ممنوع',
            message: 'ليس لديك إذن للوصول إلى هذه الصفحة.',
        },
        "404": {
            title: '٤٠٤ - الصفحة غير موجودة',
            message: 'الصفحة التي تبحث عنها غير موجودة.',
        },
        "500": {
            title: '٥٠٠ - خطأ في الخادم الداخلي',
            message: 'حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقاً.',
        },
        error: {
            title: 'خطأ',
            message: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.',
        },
        info: {
            title: 'معلومة',
            message: 'إليك بعض المعلومات التي تحتاج إلى الانتباه إليها.',
        },
        success: {
            title: 'نجاح',
            message: 'تم إتمام العملية بنجاح.',
        },
        warning: {
            title: 'تحذير',
            message: 'يرجى توخي الحذر والتحقق من التفاصيل.',
        },
    },
};

const ErrorPage: React.FC<{ errorCode?: ResultStatusType }> = ({ errorCode = 404 }) => {
    const { language } = useLanguage();
    const error = errorMessages[language][errorCode];

    return (
        <div style={{ direction: language === 'ar-KW' ? 'rtl' : 'ltr' }}>
            <Result
                status={errorCode.toString() as ResultStatusType}
                title={error.title}
                subTitle={error.message}
            />
        </div>
    );
};

export default ErrorPage;
