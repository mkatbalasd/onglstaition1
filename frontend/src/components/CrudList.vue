<template>
  <div>
    <div class="flex justify-between mb-4">
      <FormInput v-model="search" placeholder="Search..." />
      <button class="px-4 py-2 rounded bg-blue-600 text-white" @click="openForm()">
        Add {{ itemLabel }}
      </button>
    </div>

    <DataTable :headers="[label, 'Actions']">
      <tr v-for="i in filteredItems" :key="i[idKey]">
        <td class="px-6 py-2">{{ i[nameKey] }}</td>
        <td class="px-6 py-2 text-right">
          <button class="text-indigo-600 mr-2" @click="openForm(i)">Edit</button>
          <button class="text-red-600" @click="deleteItem(i[idKey])">Delete</button>
        </td>
      </tr>
    </DataTable>

    <Modal v-model="showForm" :title="formTitle">
      <form @submit.prevent="saveItem">
        <FormInput v-model="form[nameKey]" :label="label" required />
        <div class="flex justify-end space-x-2 rtl:space-x-reverse">
          <button type="button" @click="showForm = false" class="px-4 py-2 rounded bg-gray-200">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import FormInput from '@/components/FormInput.vue'
import { useNotificationStore } from '@/stores/notification'

const props = defineProps({
  store: { type: Object, required: true },
  idKey: { type: String, required: true },
  nameKey: { type: String, required: true },
  itemLabel: { type: String, required: true },
})

const notify = useNotificationStore()

onMounted(() => {
  if (props.store.items.length === 0) props.store.fetch()
})

const search = ref('')
const showForm = ref(false)
const selected = ref(null)
const form = ref({})

const label = computed(() => props.itemLabel + ' Name')

const filteredItems = computed(() => {
  if (!search.value) return props.store.items
  return props.store.items.filter(i =>
    String(i[props.nameKey]).toLowerCase().includes(search.value.toLowerCase())
  )
})

const formTitle = computed(() =>
  selected.value ? `Edit ${props.itemLabel}` : `Add ${props.itemLabel}`
)

function openForm(item = null) {
  selected.value = item
  form.value = { [props.nameKey]: item ? item[props.nameKey] : '' }
  showForm.value = true
}

async function saveItem() {
  try {
    if (selected.value) {
      await props.store.update(selected.value[props.idKey], { ...form.value })
    } else {
      await props.store.create({ ...form.value })
    }
    notify.success(`${props.itemLabel} saved`)
    showForm.value = false
  } catch {
    notify.error(`Failed to save ${props.itemLabel.toLowerCase()}`)
  }
}

async function deleteItem(id) {
  try {
    await props.store.remove(id)
    notify.success(`${props.itemLabel} deleted`)
  } catch {
    notify.error(`Failed to delete ${props.itemLabel.toLowerCase()}`)
  }
}
</script>

<style scoped>
</style>
