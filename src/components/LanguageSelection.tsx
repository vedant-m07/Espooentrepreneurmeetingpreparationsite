import { useState } from 'react';
import { Button } from './ui/button';
import type { Language } from '../App';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', available: true },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮', available: true },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪', available: true },
  { code: 'zh', name: '中文', flag: '🇨🇳', available: true },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', available: true },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', available: false, redirect: 'Helsinki' },
  { code: 'es', name: 'Español', flag: '🇪🇸', available: false, redirect: 'Helsinki' },
  { code: 'et', name: 'Eesti', flag: '🇪🇪', available: false, redirect: 'Helsinki' },
];

const languageStrings: Record<string, {
  welcome: string;
  selectPrompt: string;
  multilingualPrompt: string;
  continueButton: string;
  advisory: string;
}> = {
  en: {
    welcome: 'Welcome to Business Espoo',
    selectPrompt: 'Select your preferred language for this service',
    multilingualPrompt: 'Valitse palvelun kieli / Välj tjänstens språk',
    continueButton: 'Continue',
    advisory: 'Business Advisory Service / Yritysneuvonta / Företagsrådgivning',
  },
  fi: {
    welcome: 'Tervetuloa Business Espooseen',
    selectPrompt: 'Valitse palvelun kieli',
    multilingualPrompt: 'Select your preferred language / Välj tjänstens språk',
    continueButton: 'Jatka',
    advisory: 'Yritysneuvontapalvelu / Business Advisory Service / Företagsrådgivning',
  },
  sv: {
    welcome: 'Välkommen till Business Espoo',
    selectPrompt: 'Välj tjänstens språk',
    multilingualPrompt: 'Select your preferred language / Valitse palvelun kieli',
    continueButton: 'Fortsätt',
    advisory: 'Företagsrådgivning / Business Advisory Service / Yritysneuvonta',
  },
  zh: {
    welcome: '欢迎来到 Business Espoo',
    selectPrompt: '选择您的首选服务语言',
    multilingualPrompt: 'Select your preferred language / Valitse palvelun kieli / Välj tjänstens språk',
    continueButton: '继续',
    advisory: '商业咨询服务 / Business Advisory Service / Yritysneuvonta / Företagsrådgivning',
  },
  ru: {
    welcome: 'Добро пожаловать в Business Espoo',
    selectPrompt: 'Выберите предпочитаемый язык для этой услуги',
    multilingualPrompt: 'Select your preferred language / Valitse palvelun kieli / Välj tjänstens språk',
    continueButton: 'Продолжить',
    advisory: 'Консультационная служба для бизнеса / Business Advisory Service / Yritysneuvonta',
  },
};

interface LanguageSelectionProps {
  onLanguageSelect: (language: Language) => void;
}

export function LanguageSelection({ onLanguageSelect }: LanguageSelectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleLanguageClick = (lang: typeof languages[0]) => {
    if (!lang.available) {
      // In a real app, this would redirect to Helsinki's service
      alert(`https://www.hel.fi/en/business-and-work/start-a-business/book-a-business-advisory-session`);
      window.open('https://www.hel.fi/en/business-and-work/start-a-business/book-a-business-advisory-session', '_blank');
      return;
    }
    setSelectedLanguage(lang.code);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      onLanguageSelect(selectedLanguage as Language);
    }
  };

  const currentStrings = selectedLanguage
    ? languageStrings[selectedLanguage]
    : languageStrings.en;

  return (
    <div className="min-h-screen flex flex-col bg-[#00162E]">
      {/* Top bar */}
      <div className="bg-[#0050BB] text-white py-2 px-4">
        <div className="container mx-auto">
          <a
            href="https://www.espoo.fi"
            className="inline-flex items-center gap-2 text-white hover:underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Back to the Espoo.fi main site
          </a>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-[#012169] text-white py-4 px-4 border-b border-[#0050BB]">
        <div className="container mx-auto">
          <div className="flex items-center gap-2">
            <div>
              <div className="tracking-wider">BUSINESS</div>
              <div className="tracking-wider">ESPOO</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-[#012169] mb-4">{currentStrings.welcome}</h1>
              <p className="text-gray-600 mb-2">
                {currentStrings.selectPrompt}
              </p>
              <p className="text-gray-500">
                {currentStrings.multilingualPrompt}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageClick(lang)}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg border-2 transition-all
                    ${selectedLanguage === lang.code
                      ? 'border-[#0050BB] bg-blue-50'
                      : lang.available
                        ? 'border-[#D9D9D9] hover:border-[#0050BB] hover:bg-blue-50'
                        : 'border-[#D9D9D9] hover:border-gray-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-4xl">{lang.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="text-gray-900">{lang.name}</div>
                    {!lang.available && (
                      <div className="text-gray-500">Available in {lang.redirect}</div>
                    )}
                  </div>
                  {selectedLanguage === lang.code && (
                    <div className="text-[#0050BB]">✓</div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
              <p>{currentStrings.advisory}</p>
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={handleContinue}
                disabled={!selectedLanguage}
                className="bg-[#0050BB] text-white px-6 py-3 rounded-lg"
              >
                {currentStrings.continueButton}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
