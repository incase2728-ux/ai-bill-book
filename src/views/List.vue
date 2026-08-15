<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <div class="flex justify-between items-center p-4 bg-white shadow-sm">
      <h1 class="text-xl font-bold">💰 我的账本</h1>
      <router-link to="/add" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
        + 添加
      </router-link>
    </div>

    <!-- 统计卡片区 -->
    <div class="grid grid-cols-3 gap-4 p-4">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-gray-500 text-sm">总收入</div>
        <div class="text-emerald-500 font-bold text-lg">¥{{ totalIncome.toFixed(2) }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-gray-500 text-sm">总支出</div>
        <div class="text-rose-500 font-bold text-lg">¥{{ totalExpense.toFixed(2) }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-gray-500 text-sm">结余</div>
        <div :class="balance >= 0 ? 'text-emerald-500' : 'text-rose-500'" class="font-bold text-lg">
          ¥{{ balance.toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- 账单列表 -->
    <div v-if="bills.length > 0" class="p-4">
      <div v-for="bill in bills" :key="bill.id" class="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
        <div class="flex flex-col">
          <div class="font-medium">{{ bill.remark || '无备注' }}</div>
          <div class="text-gray-500 text-sm">{{ bill.date }}</div>
        </div>
        <div :class="bill.type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'" class="font-bold">
          {{ bill.type === 'INCOME' ? '+' : '-' }}¥{{ bill.amount.toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex justify-center items-center h-64">
      <div class="text-gray-400 text-lg">还没有账单</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBillStore } from '../stores/useBillStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

// 使用 store
const billStore = useBillStore();
const { bills, totalIncome, totalExpense, balance } = storeToRefs(billStore);

// 路由
const router = useRouter();
</script>

<style scoped>
/* 使用 Tailwind CSS，无需自定义样式 */
</style>
