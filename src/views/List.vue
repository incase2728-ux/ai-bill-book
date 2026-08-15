<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <div class="flex justify-between items-center p-4 bg-white shadow-sm">
      <h1 class="text-xl font-bold">💰 我的账本</h1>
      <div class="flex space-x-2">
        <button @click="handleReset"
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重置
        </button>
        <router-link to="/add"
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          + 添加
        </router-link>
      </div>
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

    <!-- 搜索和过滤区 -->
    <div class="p-4 bg-white shadow-sm flex space-x-4">
      <div class="flex-1">
        <input v-model="searchText" type="text" placeholder="搜索备注"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
      </div>
      <div class="w-48">
        <select v-model="selectedCategory"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="全部">全部</option>
          <option value="餐饮">餐饮</option>
          <option value="交通">交通</option>
          <option value="购物">购物</option>
          <option value="其他">其他</option>
        </select>
      </div>
    </div>

    <!-- 账单列表 -->
    <div v-if="filteredBills.length > 0" class="p-4">
      <!-- // key使用bill.id,不使用index,vue的diff算法才能精准识别,不会出现删除列表第一项的时候,后面全部都得渲染 -->
      <div v-for="bill in filteredBills" :key="bill.id"
        class="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
        <div class="flex flex-col flex-1 mr-4">
          <div class="font-medium">{{ bill.remark || '无备注' }}</div>
          <div class="text-gray-500 text-sm">{{ bill.date }}</div>
          <div class="text-gray-400 text-xs">{{ bill.category }}</div>
        </div>
        <div :class="bill.type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'" class="font-bold mr-4">
          {{ bill.type === 'INCOME' ? '+' : '-' }}¥{{ bill.amount.toFixed(2) }}
        </div>
        <button @click="handleDelete(bill.id)" class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="删除账单">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
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
import { useRouter, } from 'vue-router';
import { ref, computed } from 'vue';

// 使用 store
const billStore = useBillStore();
const { bills, totalIncome, totalExpense, balance } = storeToRefs(billStore);

// 路由
const router = useRouter();

// 搜索和过滤
const searchText = ref('');
const selectedCategory = ref('全部');

// 过滤后的账单
const filteredBills = computed(() => {
  return bills.value.filter(bill => {
    // 按备注模糊过滤
    const matchSearch = searchText.value === '' ||
      (bill.remark && bill.remark.toLowerCase().includes(searchText.value.toLowerCase()));
    // 按分类精确过滤
    const matchCategory = selectedCategory.value === '全部' || bill.category === selectedCategory.value;

    return matchSearch && matchCategory;
  });
});

// 删除账单
const handleDelete = (id: string) => {
  if (confirm('确定要删除这条账单吗？')) {
    billStore.deleteBill(id);
  }
};

// 重置所有数据到默认账单
const handleReset = () => {
  if (confirm('确定要重置所有数据吗？这将删除所有账单并恢复到默认数据。')) {
    billStore.reset();
  }
};
</script>

<style scoped>
/* 使用 Tailwind CSS，无需自定义样式 */
</style>
