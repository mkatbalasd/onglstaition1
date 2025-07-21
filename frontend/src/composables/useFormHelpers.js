import { ref, onMounted, watch } from 'vue'

export function useFormHelpers() {
  const issueDate = ref('')
  const expirationDate = ref('')
  const drivers = ref([])
  const vehicles = ref([])

  const facilityId = ref('')

  function addYear(date) {
    const d = new Date(date)
    d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().slice(0, 10)
  }

  function setExpiration() {
    if (issueDate.value) {
      expirationDate.value = addYear(issueDate.value)
    }
  }

  async function loadFacilityOptions(fid) {
    if (!fid) return
    const dRes = await fetch(`/nagl/api/drivers?facilityId=${fid}`)
    drivers.value = await dRes.json()
    const vRes = await fetch(`/nagl/api/vehicles?facilityId=${fid}`)
    vehicles.value = await vRes.json()
  }

  watch(issueDate, setExpiration)
  watch(facilityId, loadFacilityOptions, { immediate: true })

  onMounted(() => {
    if (!issueDate.value) {
      const today = new Date().toISOString().slice(0,10)
      issueDate.value = today
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
