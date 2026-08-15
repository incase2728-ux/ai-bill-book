<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="flex items-center p-4 bg-white shadow-sm">
      <button @click="router.back()" class="mr-4 text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-xl font-bold">记一笔</h1>
    </div>

    <!-- 类型切换 -->
    <div class="flex p-4 bg-white mt-2">
      <button @click="formData.type = BillType.INCOME"
        :class="formData.type === BillType.INCOME ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'"
        class="flex-1 py-3 rounded-l-xl font-medium transition">
        收入
      </button>
      <button @click="formData.type = BillType.EXPENSE"
        :class="formData.type === BillType.EXPENSE ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'"
        class="flex-1 py-3 rounded-r-xl font-medium transition">
        支出
      </button>
    </div>

    <!-- 表单输入 -->
    <div class="p-4">
      <div class="bg-white rounded-xl p-4 mb-4">
        <label class="block text-gray-700 mb-2">金额</label>
        <input v-model.number="formData.amount" type="number" placeholder="请输入金额" class="w-full p-4 border rounded-xl">
      </div>

      <div class="bg-white rounded-xl p-4 mb-4">
        <label class="block text-gray-700 mb-2">备注</label>
        <input v-model="formData.remark" type="text" placeholder="请输入备注" class="w-full p-4 border rounded-xl">
      </div>

      <div class="bg-white rounded-xl p-4 mb-4">
        <label class="block text-gray-700 mb-2">日期</label>
        <input v-model="formData.date" type="date" class="w-full p-4 border rounded-xl">
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
      <button @click="handleSubmit"
        class="w-full bg-green-500 text-white py-4 rounded-xl font-medium text-lg hover:bg-green-600 transition">
        保存账单
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useBillStore } from '../stores/useBillStore';
import { BillType } from '@/types/bill';

// 路由
const router = useRouter();

// store
const billStore = useBillStore();

// 表单数据
const formData = reactive({
  type: BillType.INCOME,
  amount: '' as string | number,
  date: new Date().toISOString().split('T')[0], // 默认今天
  remark: ''
});

// 提交表单
const handleSubmit = () => {
  /// 格式化日期
  const dateStr = (formData.date || new Date().toISOString().split('T')[0]) as string
  // 添加账单
  billStore.addBill({
    type: formData.type,
    amount: Number(formData.amount),
    date: dateStr,
    remark: formData.remark
  });

  // 返回首页
  router.push('/');
};
</script>

<style scoped>
/* 使用 Tailwind CSS，无需自定义样式 */
</style>
