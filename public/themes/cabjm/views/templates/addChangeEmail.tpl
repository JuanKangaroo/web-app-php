<script id="tpl_add_change_email" type="text/x-handlebars-template">

<form class="form mt-5" id="addChangeEmailForm">
    <div class="row justify-content-center">
        <div class="col-12 col-md-6">
            <div class="form-group mt-2">
                <input id="email" type="email" class="form-control form-control-lg text-center" name="email" placeholder="New email" required="true">
            </div>
        </div>
    </div>
</form>

<div class="row mt-5 justify-content-center">
    <div class="col-4 col-sm-8 pr-0 text-right">
        <div class="form-group">
            <button class="btn btn-default btn-lg" id="addChangeEmailCancel"> Cancel </button>
        </div>
    </div>

    <div class="col-8 col-sm-4 text-left">
        <div class="form-group">
            <button class="btn btn-primary btn-lg btn-block px-1" id="addChangeEmailSave"> Save </button>
        </div>
    </div>
</div>
</script>