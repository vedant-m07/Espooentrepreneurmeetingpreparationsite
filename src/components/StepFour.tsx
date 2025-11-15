import { DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import type { ApplicationData, Language } from '../App';
import { translations } from '../utils/translations';

interface StepFourProps {
  data: ApplicationData;
  onUpdate: (updates: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
  language: Language;
}

export function StepFour({ data, onUpdate, onNext, onBack, language }: StepFourProps) {
  const t = translations[language];
  
  // Check if company is registered and has Y-tunnus entered
  const hasYtunnus = data.isRegistered && data.ytunnus && data.ytunnus.trim().length > 0;
  const showFinancialInputs = (data.financialKnowledge === 'expert' || data.financialKnowledge === 'intermediate') && !hasYtunnus;

  // Mock financial data retrieved from Kauppalehti
  const mockKauppalehtiData = {
    startupCosts: '€45,000',
    monthlyExpenses: '€8,500',
    projectedRevenue: '€15,000',
    fundingNeeded: '€25,000',
    cashflowStatement: t.step4.mockCashflowStatement,
  };

  const updateFinancialNumbers = (field: string, value: string) => {
    onUpdate({
      financialNumbers: {
        ...data.financialNumbers,
        [field]: value,
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-8 md:p-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#0050BB] rounded-lg flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-[#012169]">{t.step4.title}</h1>
            <p className="text-gray-600">{t.step4.subtitle}</p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {hasYtunnus && (
            <div className="bg-blue-50 border-l-4 border-[#0050BB] p-4 rounded">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-[#0050BB] rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-[#012169] mb-1">
                    {t.step4.kauppalehtiMessage}
                  </p>
                  <p className="text-gray-600">
                    {t.step4.kauppalehtiNote}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="financingStatus">{t.step4.financingLabel}</Label>
            <Select
              value={data.financingStatus}
              onValueChange={(value) => onUpdate({ financingStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.step4.financingPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.step4.financingOptions).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!hasYtunnus && (
            <div>
              <Label>{t.step4.knowledgeLabel}</Label>
              <RadioGroup
                value={data.financialKnowledge}
                onValueChange={(value) => onUpdate({ financialKnowledge: value })}
                className="mt-3 space-y-3"
              >
                {Object.entries(t.step4.knowledgeOptions).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                    <RadioGroupItem value={key} id={`knowledge-${key}`} />
                    <Label htmlFor={`knowledge-${key}`} className="flex-1 cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {hasYtunnus && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-[#012169]">{t.step4.retrievedDataTitle}</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>{t.step4.startupCostsLabel}</Label>
                  <Input
                    value={mockKauppalehtiData.startupCosts}
                    readOnly
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <Label>{t.step4.monthlyExpensesLabel}</Label>
                  <Input
                    value={mockKauppalehtiData.monthlyExpenses}
                    readOnly
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <Label>{t.step4.projectedRevenueLabel}</Label>
                  <Input
                    value={mockKauppalehtiData.projectedRevenue}
                    readOnly
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <Label>{t.step4.fundingNeededLabel}</Label>
                  <Input
                    value={mockKauppalehtiData.fundingNeeded}
                    readOnly
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Label>{t.step4.cashflowStatementLabel}</Label>
                <Textarea
                  value={mockKauppalehtiData.cashflowStatement}
                  readOnly
                  disabled
                  rows={6}
                  className="mt-2 bg-gray-50"
                />
              </div>
            </div>
          )}

          {showFinancialInputs && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-[#012169]">{t.step4.numbersTitle}</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startupCosts">{t.step4.startupCostsLabel}</Label>
                  <Input
                    id="startupCosts"
                    placeholder={t.step4.startupCostsPlaceholder}
                    value={data.financialNumbers?.startupCosts || ''}
                    onChange={(e) => updateFinancialNumbers('startupCosts', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="monthlyExpenses">{t.step4.monthlyExpensesLabel}</Label>
                  <Input
                    id="monthlyExpenses"
                    placeholder={t.step4.monthlyExpensesPlaceholder}
                    value={data.financialNumbers?.monthlyExpenses || ''}
                    onChange={(e) => updateFinancialNumbers('monthlyExpenses', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="projectedRevenue">{t.step4.projectedRevenueLabel}</Label>
                  <Input
                    id="projectedRevenue"
                    placeholder={t.step4.projectedRevenuePlaceholder}
                    value={data.financialNumbers?.projectedRevenue || ''}
                    onChange={(e) => updateFinancialNumbers('projectedRevenue', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="fundingNeeded">{t.step4.fundingNeededLabel}</Label>
                  <Input
                    id="fundingNeeded"
                    placeholder={t.step4.fundingNeededPlaceholder}
                    value={data.financialNumbers?.fundingNeeded || ''}
                    onChange={(e) => updateFinancialNumbers('fundingNeeded', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {data.financialKnowledge === 'expert' && !hasYtunnus && (
            <div className="border-t pt-6">
              <div>
                <Label htmlFor="cashflowStatement">{t.step4.cashflowStatementLabel}</Label>
                <Textarea
                  id="cashflowStatement"
                  placeholder={t.step4.cashflowStatementPlaceholder}
                  value={data.cashflowStatement || ''}
                  onChange={(e) => onUpdate({ cashflowStatement: e.target.value })}
                  rows={6}
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-[#D9D9D9]"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            {t.common.back}
          </Button>
          <Button
            onClick={onNext}
            className="bg-[#0050BB] hover:bg-[#012169] text-white"
          >
            {t.common.continue}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}