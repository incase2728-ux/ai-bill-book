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
        <div class="flex justify-between items-center mb-2">
          <label class="block text-gray-700">备注</label>
          <div class="text-sm text-gray-500">{{ formData.remark.length }}/{{MAX_REMARK_LENGTH}}</div>
        </div>
        <input v-model="formData.remark" type="text" placeholder="请输入备注" maxlength="50" class="w-full p-4 border rounded-xl">
      </div>

      <div class="bg-white rounded-xl p-4 mb-4">
        <label class="block text-gray-700 mb-2">日期</label>
        <input v-model="formData.date" type="date" class="w-full p-4 border rounded-xl mb-3">
        <label class="block text-gray-700 mb-2">类型</label>
        <select v-model="formData.category" class="w-full p-4 border rounded-xl">
          <option value="餐饮">餐饮</option>
          <option value="交通">交通</option>
          <option value="购物">购物</option>
          <option value="其他">其他</option>
        </select>
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
import type { Bill } from '@/types/bill';

// 路由
const router = useRouter();

// store
const billStore = useBillStore();

// 表单数据
const formData = reactive({
  type: BillType.INCOME,
  amount: '' as string | number,
  date: new Date().toISOString().split('T')[0], // 默认今天
  remark: '',
  category: '餐饮'as'餐饮' | '交通' | '购物' | '其他'
});

// 最大备注长度
const MAX_REMARK_LENGTH = 30;

// 提交表单
const handleSubmit = () => {
  // 验证备注长度
  if (formData.remark.length > MAX_REMARK_LENGTH) {
    alert(`备注不能超过${MAX_REMARK_LENGTH}个字符`);
    return;
  }
  
  /// 格式化日期
  const dateStr = (formData.date || new Date().toISOString().split('T')[0]) as string
  // 添加账单
  billStore.addBill({
    type: formData.type,
    amount: Number(formData.amount),
    date: dateStr,
    remark: formData.remark,
    category: formData.category
  });

  // 返回首页
  router.push('/');
};
</script>

<style scoped>
/* 使用 Tailwind CSS，无需自定义样式 */
</style>
