import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Bill } from '../types/bill';
import { BillType } from '../types/bill';

export const useBillStore = defineStore('bill', () => {
  // 定义账单列表
  const bills = ref<Bill[]>([
    {
      id: '1',
      type: BillType.INCOME,
      amount: 8000,
      date: '2023-05-01',
      remark: '工资收入'
    },
    {
      id: '2',
      type: BillType.EXPENSE,
      amount: 50,
      date: '2023-05-02',
      remark: '买菜'
    },
    {
      id: '3',
      type: BillType.EXPENSE,
      amount: 25,
      date: '2023-05-03',
      remark: '奶茶'
    }
  ]);

  // 添加账单
  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...bill,
      id: Math.random().toString(36).substring(2, 9) // 生成随机id
    };
    bills.value.push(newBill);
  };

  // 删除账单
  const deleteBill = (id: string) => {
    bills.value = bills.value.filter(bill => bill.id !== id);
  };

  // 计算总收入
  const totalIncome = computed(() => {
    return bills.value
      .filter(bill => bill.type === BillType.INCOME)
      .reduce((sum, bill) => sum + bill.amount, 0);
  });

  // 计算总支出
  const totalExpense = computed(() => {
    return bills.value
      .filter(bill => bill.type === BillType.EXPENSE)
      .reduce((sum, bill) => sum + bill.amount, 0);
  });

  // 计算余额
  const balance = computed(() => {
    return totalIncome.value - totalExpense.value;
  });

  return {
    bills,
    addBill,
    deleteBill,
    totalIncome,
    totalExpense,
    balance
  };
});
