<div class="container-fluid container-landing">
    <input type="hidden" name="verify_token" value="<?= $token ?>" >
    <input type="hidden" name="verify_email" value="<?= $email ?>" >
    <div id="profile_subaccounts_form" style="display: none;">
        <h3>Add subaccount</h3>
        <div class="row">
            <div class="col-12 col-md-6">
                <form class="form">
                    <div class="form-group">
                        <input type="text" name="account_id" class="form-control form-control-lg" value="" placeholder="Account ID" autofocus="">
                    </div>
                    <div class="form-group">
                        <input type="text" name="postal_code" class="form-control form-control-lg" value="" placeholder="Postal Code">
                    </div>
                 
                    <div class="form-group">
                        <button class="btn btn-primary btn-block btn-lg" > Save </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
