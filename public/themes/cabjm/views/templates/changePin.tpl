<script id="tpl_change_pin" type="text/x-handlebars-template">

<form class="form mt-5" id="changePinForm">
    <div class="row justify-content-center">
        <div class="col-12 col-md-6">
            <div class="form-group mt-2">
                <input id="pin_code" type="number" class="form-control form-control-lg text-center" name="pin_code" placeholder="Enter a 4 digits PIN Code" maxlength="4" required>
            </div>

            <div class="row mt-5 justify-content-center">
                <div class="col-4 pr-0 text-right">
                    <div class="form-group">
                        <button class="btn btn-default btn-lg" id="changePinCancel"> Cancel </button>
                    </div>
                </div>

                <div class="col-8 text-left">
                    <div class="form-group">
                        <button class="btn btn-primary btn-lg btn-block px-1" id="changePinSave"> Save </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>
</script>