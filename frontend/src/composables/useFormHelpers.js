import { ref, onMounted, watch } from 'vue'
import { getExpiration } from './dateHelpers.js'

export function useFormHelpers() {
  const issueDate = ref({ date: '', type: 'hijri' })
  const expirationDate = ref({ date: '', type: 'hijri' })
  const drivers = ref([])
  const vehicles = ref([])

  const facilityId = ref('')

  function setExpiration() {
    if (issueDate.value.date && !expirationDate.value.date) {
      expirationDate.value = {
        ...expirationDate.value,
        date: getExpiration(issueDate.value.date, expirationDate.value.date)
      }
    }
  }

  async function loadFacilityOptions(fid) {
    if (!fid) return
    const dRes = await fetch(`/nagl/api/drivers?facilityId=${fid}`)
    drivers.value = await dRes.json()
    const vRes = await fetch(`/nagl/api/vehicles?facilityId=${fid}`)
    vehicles.value = await vRes.json()
  }

  watch(() => issueDate.value.date, setExpiration)
  watch(facilityId, loadFacilityOptions, { immediate: true })

  onMounted(() => {
    if (!issueDate.value.date) {
      const today = new Date().toISOString().slice(0,10)
      issueDate.value.date = today
    }
    setExpiration()
  })

  return {
    issueDate,
    expirationDate,
    drivers,
    vehicles,
    facilityId,
    loadFacilityOptions
  }
}
