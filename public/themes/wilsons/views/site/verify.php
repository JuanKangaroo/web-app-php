<div class="container-fluid container-landing">
    <input type="hidden" name="verify_token" value="<?= $token ?>" >
    <input type="hidden" name="verify_email" value="<?= $email ?>" >

    <!-- <div class="row">
        <div class="col-12 col-md-6 offset-md-3">
            <div class="alert alert-success alert-dismissible fade show" role="alert" style="display: none;">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div id="message"></div>
            </div>
        </div>
    </div> -->

    <div id="profile_subaccounts_form" class="mb-5" style="display: none;">
        <div class="row">
            <div class="col-12 col-md-6 offset-md-3">
                <div class="alert alert-info" role="alert">
                    <h4 class="alert-heading">Welcome <?= $email ?></h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo</p>
                    <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod</p>
                </div>

                <div class="text-center">
                    <h4 class="mb-3">Add your Accounts</h4>

                    <button class="btn btn-outline-primary" data-toggle="modal" 
                        data-target="#addAccountsModal" data-pos-id=3 data-pos-name="Home Heat">
                        Home Heat
                    </button>
                    <button class="btn btn-outline-primary" data-toggle="modal" 
                        data-target="#addAccountsModal" data-pos-id=4 data-pos-name="Security">
                        Security
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="addAccountsModal" tabindex="-1" role="dialog" aria-labelledby="addAccountsModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addAccountsModalLabel">Add your Accounts</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form class="form" id="add_pos_account__form">
                    <input type="hidden" name="pos_id">
                    <div class="form-group">
                        <input type="text" name="account_id" class="form-control form-control-lg" value="" placeholder="Account ID" autofocus="">
                    </div>
                    <div class="form-group">
                        <input type="text" name="postal_code" class="form-control form-control-lg" value="" placeholder="Postal Code">
                    </div>
                </form>
            </div>
            <div class="modal-footer align-self-center">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary js-add-pos-account__confirm-btn">Add Account</button>
            </div>
        </div>
    </div>
</div>

