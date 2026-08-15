// 定义账单类型枚举
export enum BillType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

// 定义账单接口
export interface Bill {
  id: string;
  type: BillType;
  amount: number;
  date: string;
  remark?: string;
}
