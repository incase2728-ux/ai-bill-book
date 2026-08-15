import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Bill } from '../types/bill'
import { BillType } from '../types/bill'
import { Storage } from '@/utils/storage'
import { onMounted } from 'vue'

const STORAGE_KEY = 'bill-app-data'
const HAS_ACTED_KEY = 'bill-app-has-acted'

export const useBillStore = defineStore('bill', () => {
  // 定义账单分类
  const categories = ['餐饮', '交通', '购物', '其他'] as const

  // 1.定义账单列表默认数据
  const defaultBills: Bill[] = [
    {
      id: '1',
      type: BillType.INCOME,
      amount: 8000,
      date: '2023-05-01',
      remark: '工资收入',
      category: '其他',
    },
    {
      id: '2',
      type: BillType.EXPENSE,
      amount: 50,
      date: '2023-05-02',
      remark: '买菜',
      category: '餐饮',
    },
    {
      id: '3',
      type: BillType.EXPENSE,
      amount: 25,
      date: '2023-05-03',
      remark: '奶茶',
      category: '餐饮',
    },
    {
      id: '4',
      type: BillType.INCOME,
      amount: 2000,
      date: '2023-05-05',
      remark: '兼职收入',
      category: '其他',
    },
    {
      id: '5',
      type: BillType.EXPENSE,
      amount: 120,
      date: '2023-05-06',
      remark: '打车',
      category: '交通',
    },
    {
      id: '6',
      type: BillType.EXPENSE,
      amount: 300,
      date: '2023-05-07',
      remark: '购物',
      category: '购物',
    },
    {
      id: '7',
      type: BillType.EXPENSE,
      amount: 80,
      date: '2023-05-08',
      remark: '聚餐',
      category: '餐饮',
    },
    {
      id: '8',
      type: BillType.INCOME,
      amount: 500,
      date: '2023-05-10',
      remark: '奖金',
      category: '其他',
    },
    {
      id: '9',
      type: BillType.EXPENSE,
      amount: 45,
      date: '2023-05-11',
      remark: '公交卡充值',
      category: '交通',
    },
    {
      id: '10',
      type: BillType.EXPENSE,
      amount: 150,
      date: '2023-05-12',
      remark: '买衣服',
      category: '购物',
    },
    {
      id: '11',
      type: BillType.EXPENSE,
      amount: 60,
      date: '2023-05-13',
      remark: '看电影',
      category: '其他',
    },
    {
      id: '12',
      type: BillType.INCOME,
      amount: 1000,
      date: '2023-05-15',
      remark: '理财收益',
      category: '其他',
    },
    {
      id: '13',
      type: BillType.EXPENSE,
      amount: 200,
      date: '2023-05-16',
      remark: '加油',
      category: '交通',
    },
    {
      id: '14',
      type: BillType.EXPENSE,
      amount: 350,
      date: '2023-05-17',
      remark: '买手机',
      category: '购物',
    },
    {
      id: '15',
      type: BillType.EXPENSE,
      amount: 90,
      date: '2023-05-18',
      remark: '外卖',
      category: '餐饮',
    },
    {
      id: '16',
      type: BillType.INCOME,
      amount: 3000,
      date: '2023-05-20',
      remark: '项目奖金',
      category: '其他',
    },
    {
      id: '17',
      type: BillType.EXPENSE,
      amount: 30,
      date: '2023-05-21',
      remark: '地铁',
      category: '交通',
    },
    {
      id: '18',
      type: BillType.EXPENSE,
      amount: 180,
      date: '2023-05-22',
      remark: '买书',
      category: '购物',
    },
    {
      id: '19',
      type: BillType.EXPENSE,
      amount: 70,
      date: '2023-05-23',
      remark: '理发',
      category: '其他',
    },
    {
      id: '20',
      type: BillType.EXPENSE,
      amount: 40,
      date: '2023-05-24',
      remark: '咖啡',
      category: '餐饮',
    }
  ]

  //2.定义响应式数据bills
  const bills = ref<Bill[]>([])
  const initBills = () => {
    //读取用户是否操作过的标记,默认是false
    const hasActed = Storage.get(HAS_ACTED_KEY, false)
    //如果用户没有操作过,就使用默认数据
    if (!hasActed) {
      bills.value = [...defaultBills]
    } else {
      //如果用户操作过,就永远使用localStorage中的数据,没就为空,绝不使用默认数据
      bills.value = Storage.get(STORAGE_KEY, [])
    }
  }

  //3.调用initBills方法,初始化bills,在组件挂载时调用一次
  onMounted(() => {
    initBills()
  })

  // 4.监听bills的变化,一旦变化就调用Storage.set方法保存到localStorage中
  watch(
    bills,
    (newBills) => {
      Storage.set(STORAGE_KEY, newBills)
      console.log('账单已经保存,当前条数:', newBills.length)
    },
    { deep: true }, // deep: true表示深度监听,即监听bills中的每一个元素的变化
  )

  // 添加账单
  //Omit<Bill, 'id'>表示Bill类型,并且排除id属性
  const addBill = (newBill: Omit<Bill, 'id'>) => {
    //判断用户是否操作过,如果没有操作过,就设置HAS_ACTED_KEY为true
    const hasActed = Storage.get(HAS_ACTED_KEY, false)
    if (!hasActed) {
      Storage.set(HAS_ACTED_KEY, true)
      //如果用户没有操作过,就清空bills
      bills.value = []
    }
    //生成一个唯一的id
    const newID = Date.now().toString() + Math.random().toString(36).slice(2, 6)
    //直接push进响应式数组,vue会自动更新所有依赖这个数组的地方,比如列表,统计等
    bills.value.push({ ...newBill, id: newID })
    console.log('账单已经添加,当前条数:', bills.value.length)
  }

  // 删除账单
  const deleteBill = (id: string) => {
    //根据传进来的id,找到对应的账单,然后过滤出不包含这个id的账单的数组,重新赋值给bills
    bills.value = bills.value.filter((bill) => bill.id !== id)
    console.log('账单已经删除,当前条数:', bills.value.length)
  }

  // 计算总收入
  const totalIncome = computed(() => {
    //computed只有当bills.value发生变化时，会重新计算totalIncome的值
    return (
      bills.value
        //过滤出type为income的账单，然后累加amount
        .filter((bill) => bill.type === BillType.INCOME)
        //reduce方法，第一个参数是累加器，第二个参数是数组中的每一个元素
        .reduce((sum, bill) => sum + bill.amount, 0)
    )
  })

  // 计算总支出
  const totalExpense = computed(() => {
    return bills.value
      .filter((bill) => bill.type === BillType.EXPENSE)
      .reduce((sum, bill) => sum + bill.amount, 0)
  })

  // 计算余额
  const balance = computed(() => {
    return totalIncome.value - totalExpense.value
  })

  // 恢复出场设置
  const reset = () => {
    Storage.set(HAS_ACTED_KEY, false)
    Storage.set(STORAGE_KEY, [])
    bills.value = [...defaultBills]
    console.log('账单已经恢复出场设置,显示默认账单')
  }

  return {
    bills,
    addBill,
    deleteBill,
    totalIncome,
    totalExpense,
    balance,
    reset,
  }
})
