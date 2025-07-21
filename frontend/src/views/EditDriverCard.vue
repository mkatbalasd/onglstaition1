<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">
      {{ route.params.id ? 'Edit Driver Card' : 'New Driver Card' }}
    </h1>

    <div v-if="loading" class="space-y-2 animate-pulse">
      <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
    </div>

    <form v-else @submit.prevent="submit" class="space-y-4">
      <div>
        <Listbox v-model="facilityId" as="div" class="w-full">
          <ListboxLabel class="block text-sm font-medium mb-1">Facility</ListboxLabel>
          <div class="relative">
            <ListboxButton class="relative w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700 py-2 pl-3 pr-10 text-left">
              <span class="block truncate">{{ selectedFacility ? selectedFacility.Name : 'Select...' }}</span>
            </ListboxButton>
            <TransitionRoot leave="transition ease-in duration-100" leave-from="opacity-100" leave-to="opacity-0" as="template">
              <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ListboxOption v-for="f in facilities" :key="f.FacilityID" :value="f.FacilityID" v-slot="{ active, selected }" class="relative cursor-default select-none py-2 pl-4 pr-4">
                  <span :class="selected ? 'font-semibold' : 'font-normal'" class="block truncate">{{ f.Name }}</span>
                </ListboxOption>
              </ListboxOptions>
            </TransitionRoot>
          </div>
        </Listbox>
      </div>

      <div>
        <Listbox v-model="driverId" as="div" class="w-full">
          <ListboxLabel class="block text-sm font-medium mb-1">Driver</ListboxLabel>
          <div class="relative">
            <ListboxButton class="relative w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700 py-2 pl-3 pr-10 text-left">
              <span class="block truncate">{{ selectedDriver ? selectedDriver.FirstName + ' ' + selectedDriver.LastName : 'Select...' }}</span>
            </ListboxButton>
            <TransitionRoot leave="transition ease-in duration-100" leave-from="opacity-100" leave-to="opacity-0" as="template">
              <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ListboxOption v-for="d in drivers" :key="d.DriverID" :value="d.DriverID" v-slot="{ active, selected }" class="relative cursor-default select-none py-2 pl-4 pr-4">
                  <span :class="selected ? 'font-semibold' : 'font-normal'" class="block truncate">{{ d.FirstName }} {{ d.LastName }}</span>
                </ListboxOption>
              </ListboxOptions>
            </TransitionRoot>
          </div>
        </Listbox>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Card Type</label>
        <input v-model="cardType" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" required />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="block text-sm font-medium mb-1">Issue Date</label>
          <input v-model="issueDate" type="date" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Expiration Date</label>
          <input v-model="expirationDate" type="date" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" required />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Supplier</label>
        <input v-model="supplier" type="text" class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
      </div>

      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions, TransitionRoot } from '@headlessui/vue'

const route = useRoute()
const router = useRouter()
const cardId = route.params.id

const loading = ref(true)
const facilities = ref([])
const drivers = ref([])

const cardType = ref('')
const facilityId = ref('')
const driverId = ref('')
const issueDate = ref('')
const expirationDate = ref('')
const supplier = ref('')

onMounted(async () => {
  try {
    const [facRes, drvRes] = await Promise.all([
      fetch('/nagl/api/facilities'),
      fetch('/nagl/api/drivers')
    ])
    facilities.value = await facRes.json()
    drivers.value = await drvRes.json()

    if (cardId) {
      const res = await fetch(`/nagl/api/driver-cards/${cardId}`)
      if (res.ok) {
        const c = await res.json()
        cardType.value = c.CardType || ''
        facilityId.value = c.FacilityID || ''
        driverId.value = c.DriverID || ''
        issueDate.value = c.IssueDate || ''
        expirationDate.value = c.ExpirationDate || ''
        supplier.value = c.Supplier || ''
      }
    }
  } finally {
    loading.value = false
  }
})

watch(facilityId, async (val) => {
  if (!val) return
  const res = await fetch(`/nagl/api/drivers?facilityId=${val}`)
  drivers.value = await res.json()
})

const selectedFacility = computed(() => facilities.value.find(f => f.FacilityID === facilityId.value))
const selectedDriver = computed(() => drivers.value.find(d => d.DriverID === driverId.value))

async function submit() {
  const payload = {
    CardType: cardType.value,
    FacilityID: facilityId.value,
    DriverID: driverId.value,
    IssueDate: issueDate.value,
    ExpirationDate: expirationDate.value,
    Supplier: supplier.value || null
  }

  if (cardId) {
    await fetch(`/nagl/api/driver-cards/${cardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } else {
    await fetch('/nagl/api/driver-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }

  router.push('/driver-cards')
}
</script>

<style scoped>
</style>

