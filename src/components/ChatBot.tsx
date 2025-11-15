import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Language } from '../App';
import { translations } from '../utils/translations';

interface ChatBotProps {
  language: Language;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const messageText = inputValue;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply ?? 'Sorry, something went wrong on the server.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I could not reach the server.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      const greeting: Message = {
        id: Date.now().toString(),
        text: t.chatbot.greeting,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  };

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#0050BB] text-white rounded-full shadow-lg hover:bg-[#012169] transition-all hover:scale-110 flex items-center justify-center z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-[#0050BB] text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white">{t.chatbot.title}</h3>
                <p className="text-white/80 text-xs">Business Espoo</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-[#0050BB] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.chatbot.placeholder}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                className="bg-[#0050BB] hover:bg-[#012169] text-white"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Mock AI responses based on common questions
function getMockResponse(question: string, language: Language): string {
  const lowerQuestion = question.toLowerCase();
  
  const responses: Record<Language, Record<string, string>> = {
    en: {
      register: "To register a company in Finland, you can use the Business Information System (YTJ). The process typically takes 1-2 weeks and costs around €380. I can help guide you through the registration process during your meeting with the advisor.",
      funding: "There are several funding options available: Business Finland grants, ELY Centre funding, bank loans, and private investors. Your advisor can help you identify the best options for your specific business.",
      tax: "As a business owner in Finland, you'll need to handle VAT, income tax, and potentially employer contributions. The tax rate varies depending on your business structure. Your advisor can provide detailed information.",
      visa: "If you're not an EU citizen, you may need a residence permit for entrepreneurs. The requirements include a viable business plan and sufficient funds. We can discuss this in detail during your meeting.",
      default: "That's a great question! I'd recommend discussing this in detail with your business advisor during your scheduled meeting. They'll have comprehensive information tailored to your specific situation.",
    },
    fi: {
      register: "Yrityksen rekisteröinti Suomessa tapahtuu Yritys- ja yhteisötietojärjestelmän (YTJ) kautta. Prosessi kestää yleensä 1-2 viikkoa ja maksaa noin 380 €. Voin auttaa sinua rekisteröintiprosessissa tapaamisen aikana.",
      funding: "Käytettävissä on useita rahoitusvaihtoehtoja: Business Finlandin avustukset, ELY-keskuksen rahoitus, pankkilainat ja yksityiset sijoittajat. Neuvoja voi auttaa sinua löytämään parhaat vaihtoehdot.",
      tax: "Yrittäjänä Suomessa sinun tulee käsitellä ALV, tulovero ja mahdollisesti työnantajamaksut. Verokanta vaihtelee yritysmuodon mukaan. Neuvoja voi antaa yksityiskohtaista tietoa.",
      visa: "Jos et ole EU-kansalainen, saatat tarvita yrittäjän oleskeluluvan. Vaatimuksiin kuuluu toimiva liiketoimintasuunnitelma ja riittävät varat. Voimme keskustella tästä yksityiskohtaisesti tapaamisen aikana.",
      default: "Hyvä kysymys! Suosittelen keskustelemaan tästä yksityiskohtaisesti yritysneuvojasi kanssa tapaamisen aikana. Heillä on kattavaa tietoa juuri sinun tilanteeseesi.",
    },
    sv: {
      register: "För att registrera ett företag i Finland använder du Företags- och organisationsdatasystemet (YTJ). Processen tar vanligtvis 1-2 veckor och kostar cirka 380 €. Jag kan hjälpa dig genom registreringsprocessen under ditt möte med rådgivaren.",
      funding: "Det finns flera finansieringsalternativ tillgängliga: Business Finland-bidrag, NTM-central finansiering, banklån och privata investerare. Din rådgivare kan hjälpa dig identifiera de bästa alternativen.",
      tax: "Som företagare i Finland måste du hantera moms, inkomstskatt och eventuellt arbetsgivaravgifter. Skattesatsen varierar beroende på din företagsstruktur. Din rådgivare kan ge detaljerad information.",
      visa: "Om du inte är EU-medborgare kan du behöva ett uppehållstillstånd för företagare. Kraven inkluderar en fungerande affärsplan och tillräckliga medel. Vi kan diskutera detta i detalj under ditt möte.",
      default: "Det är en bra fråga! Jag rekommenderar att diskutera detta i detalj med din företagsrådgivare under ditt schemalagda möte. De kommer att ha omfattande information anpassad till din specifika situation.",
    },
    zh: {
      register: "在芬兰注册公司需要使用企业和组织信息系统(YTJ)。该过程通常需要1-2周，费用约为380欧元。我可以在您与顾问会面期间帮助指导您完成注册过程。",
      funding: "有几种融资选择：Business Finland 补助金、ELY中心资助、银行贷款和私人投资者。您的顾问可以帮助您确定最适合您的选择。",
      tax: "作为芬兰的企业主，您需要处理增值税、所得税以及可能的雇主供款。税率因您的企业结构而异。您的顾问可以提供详细信息。",
      visa: "如果您不是欧盟公民，您可能需要企业家居留许可。要求包括可行的商业计划和足够的资金。我们可以在会面期间详细讨论。",
      default: "这是一个很好的问题！我建议在您预定的会面期间与您的商业顾问详细讨论。他们将提供针对您具体情况的全面信息。",
    },
    ru: {
      register: "Чтобы зарегистрировать компанию в Финляндии, вы можете использовать Информационную систему предприятий (YTJ). Процесс обычно занимает 1-2 недели и стоит около 380 евро. Я могу помочь вам в процессе регистрации во время встречи с консультантом.",
      funding: "Доступно несколько вариантов финансирования: гранты Business Finland, финансирование центра ELY, банковские кредиты и частные инвесторы. Ваш консультант поможет определить лучшие варианты.",
      tax: "Как владелец бизнеса в Финляндии, вам нужно будет обрабатывать НДС, подоходный налог и, возможно, взносы работодателя. Налоговая ставка зависит от структуры вашего бизнеса. Ваш консультант может предоставить подробную информацию.",
      visa: "Если вы не являетесь гражданином ЕС, вам может потребоваться вид на жительство для предпринимателей. Требования включают жизнеспособный бизнес-план и достаточные средства. Мы можем обсудить это подробно во время встречи.",
      default: "Это отличный вопрос! Я рекомендую обсудить это подробно с вашим бизнес-консультантом во время запланированной встречи. У них будет исчерпывающая информация, адаптированная к вашей конкретной ситуации.",
    },
  };

  const langResponses = responses[language];
  
  if (lowerQuestion.includes('register') || lowerQuestion.includes('rekister') || lowerQuestion.includes('registrera') || lowerQuestion.includes('注册') || lowerQuestion.includes('регистр')) {
    return langResponses.register;
  } else if (lowerQuestion.includes('fund') || lowerQuestion.includes('money') || lowerQuestion.includes('rahoitus') || lowerQuestion.includes('finansier') || lowerQuestion.includes('资金') || lowerQuestion.includes('финанс')) {
    return langResponses.funding;
  } else if (lowerQuestion.includes('tax') || lowerQuestion.includes('vero') || lowerQuestion.includes('skatt') || lowerQuestion.includes('税') || lowerQuestion.includes('налог')) {
    return langResponses.tax;
  } else if (lowerQuestion.includes('visa') || lowerQuestion.includes('permit') || lowerQuestion.includes('lupa') || lowerQuestion.includes('tillstånd') || lowerQuestion.includes('签证') || lowerQuestion.includes('виза')) {
    return langResponses.visa;
  }
  
  return langResponses.default;
}
