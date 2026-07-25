export { HireEmployeesForm, type HireEmployeesValues } from './hire-employees-form';
export { ChangePriceForm, type ChangePriceValues } from './change-price-form';
export { MarketingInvestmentForm, type MarketingInvestmentValues } from './marketing-investment-form';
export { EquipmentPurchaseForm, type EquipmentPurchaseValues } from './equipment-purchase-form';
export { PaymentDelayForm, type PaymentDelayValues } from './payment-delay-form';

import type { ScenarioType } from '@/features/simulations/adapters/simulations.adapter';

export type FormComponent = 'HireEmployeesForm' | 'ChangePriceForm' | 'MarketingInvestmentForm' | 'EquipmentPurchaseForm' | 'PaymentDelayForm';

const FORM_MAP: Record<ScenarioType, FormComponent> = {
  custom: 'HireEmployeesForm',
  hire_employees: 'HireEmployeesForm',
  change_price: 'ChangePriceForm',
  marketing_investment: 'MarketingInvestmentForm',
  purchase_equipment: 'EquipmentPurchaseForm',
  expand_location: 'EquipmentPurchaseForm',
  payment_delay: 'PaymentDelayForm',
  financing: 'EquipmentPurchaseForm',
};

export function getFormForScenario(type: ScenarioType): FormComponent {
  return FORM_MAP[type] || 'HireEmployeesForm';
}
