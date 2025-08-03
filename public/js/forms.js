$(function () {
  $('.hijri-date').hijriDatePicker({
    hijri: true,
    showSwitcher: false,
    format: 'iYYYY-iMM-iDD'
  });

  const issue = $('input[name="IssueDate"], input[name="LicenseIssueDate"]');
  const exp = $('input[name="ExpirationDate"], input[name="LicenseExpirationDate"]');

  function setExpiration(i) {
    const val = issue.eq(i).val();
    if (!val) return;
    const m = moment(val, 'iYYYY-iMM-iDD');
    if (!m.isValid()) return;
    const d = m.clone().add(1, 'iYear');
    exp.eq(i).val(d.format('iYYYY-iMM-iDD'));
  }

  if (issue.length && exp.length) {
    issue.each(function (i) {
      const $iss = $(this);
      if (!$iss.val()) {
        $iss.val(moment().format('iYYYY-iMM-iDD'));
      }
      setExpiration(i);
      $iss.on('change input dp.change', () => setExpiration(i));
    });
  }

  $('table.data-table').DataTable({
    order: [],
    responsive: true,
    stripeClasses: [],
    pageLength: 10,
    lengthMenu: [10, 20, 50, 100],
    language: {
      url: '/nagl/vendor/datatables/i18n/ar.json',
      searchPlaceholder: 'بحث...',
      search: ' '
    },
    dom: "<'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'lp>>" +
         "<'row'<'col-sm-12'tr>>" +
         "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    pagingType: 'simple_numbers'
  });

  $('.select2')
    .select2({
      dir: 'rtl',
      width: '100%',
      placeholder: 'اختر...',
      allowClear: true
    })
    .on('select2:open', () => {
      const searchField = document.querySelector('.select2-container--open .select2-search__field');
      if (searchField) searchField.focus();
    });

  $('select[name="FacilityID"]').on('change', function () {
    const fid = $(this).val();
    if (!fid) return;
    $('#addDriverBtn').attr('href', '/nagl/drivers/new?facilityId=' + fid);
    $('#addVehicleBtn').attr('href', '/nagl/vehicles/new?facilityId=' + fid);
    $.getJSON('/nagl/api/drivers', { facilityId: fid }, function (data) {
      const dSel = $('select[name="DriverID"]');
      if (dSel.length) {
        dSel.empty();
        data.forEach(d =>
          dSel.append(`<option value="${d.DriverID}">${d.FirstName} ${d.LastName} - ${d.IdentityNumber || ''}</option>`)
        );
        const hidden = $('#driverHidden');
        if (hidden.length && hidden.val()) {
          dSel.val(hidden.val());
        }
        dSel.trigger('change');
      }
    });
    $.getJSON('/nagl/api/vehicles', { facilityId: fid }, function (data) {
      const vSel = $('select[name="VehicleID"]');
      if (vSel.length) {
        vSel.empty();
        data.forEach(v =>
          vSel.append(`<option value="${v.ID}">${v.PlateNumber || v.SerialNumber}</option>`)
        );
        const hidden = $('#vehicleHidden');
        if (hidden.length && hidden.val()) {
          vSel.val(hidden.val());
        }
        vSel.trigger('change');
      }
    });
  }).trigger('change');
  $('.year-picker').datepicker({
    format: 'yyyy',
    minViewMode: 'years',
    autoclose: true
    });

  $(document).on('submit', 'form.delete-form', function (e) {
    if (!confirm('هل أنت متأكد من الحذف؟')) {
      e.preventDefault();
    }
  });
});
