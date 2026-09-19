export interface CreateSchoolPaymentConfigInput {
  paystackSubaccountCode?: string;
  paystackAccountName?: string;
  settlementBankCode?: string;
  settlementBankName?: string;
  settlementAccountNumber?: string;
  isEnabled?: boolean;
}

export interface UpdateSchoolPaymentConfigInput {
  paystackSubaccountCode?: string;
  paystackAccountName?: string;
  settlementBankCode?: string;
  settlementBankName?: string;
  settlementAccountNumber?: string;
  isEnabled?: boolean;
}