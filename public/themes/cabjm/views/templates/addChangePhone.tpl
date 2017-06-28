<script id="tpl_add_change_phone" type="text/x-handlebars-template">

<form class="form mt-5" id="addChangePhoneForm">
    <div class="row justify-content-center">
        <div class="col-12 col-md-6">
            <div class="form-group mt-2">
                <input id="phone" type="phone" class="form-control form-control-lg text-center" name="phone" placeholder="New phone" required>
                <input id="userPhoneCountryCode" type="hidden" name="country_code" value="{{country_code}}">
            </div>

            <div class="row mt-5 justify-content-center">
                <div class="col-4 pr-0 text-right">
                    <div class="form-group">
                        <button class="btn btn-default btn-lg" id="addChangePhoneCancel"> Cancel </button>
                    </div>
                </div>

                <div class="col-8 text-left">
                    <div class="form-group">
                        <button class="btn btn-primary btn-lg btn-block px-1" id="addChangePhoneSave"> Save </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>
</script>