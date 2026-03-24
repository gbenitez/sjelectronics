<template>
  <div class="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
    <div v-if="title || $slots.actions" class="flex items-start justify-between gap-4 px-5 py-4 bg-neutral-50 border-b border-neutral-200">
      <div>
        <h3 v-if="title" class="font-display font-bold text-neutral-900">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-neutral-600 mt-1">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="shrink-0">
        <slot name="actions" />
      </div>
    </div>

    <div class="overflow-auto">
      <table class="min-w-full text-left text-sm">
        <thead class="bg-white">
          <tr class="border-b border-neutral-200">
            <th
              v-for="col in columns"
              :key="col.key"
              class="whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-wider text-neutral-600"
            >
              {{ col.header }}
            </th>
          </tr>
        </thead>

        <tbody class="bg-white">
          <tr
            v-for="(row, idx) in rows"
            :key="row.id ?? idx"
            class="border-b border-neutral-100 hover:bg-neutral-50/70 transition-colors"
          >
            <td v-for="col in columns" :key="col.key" class="px-5 py-4 align-middle text-neutral-800">
              <slot :name="`cell-${col.key}`" :row="row">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  }
})
</script>

