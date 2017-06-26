<div class="container-fluid container-landing">
    <input type="hidden" name="verify_token" value="<?= $token ?>" >
    <input type="hidden" name="verify_email" value="<?= $email ?>" >

    <div id="profile_subaccounts_form" class="mb-5" style="display: none;">
        <div class="row">
            <div class="col-12 col-md-6 offset-md-3 landing-text-box py-5">
                <div class="alert" role="alert">
                    <h4 class="alert-heading">Welcome <?= $email ?></h4>
                    <p>
                        Caribbean Assurance Brokers Ltd. (CAB), a name synonymous with innovation, 
                        is a multi-line insurance brokerage offering the full spectrum of insurance products 
                        and services throughout Jamaica. Through these offerings, we provide our clients 
                        with peace of mind in preparation for life’s uncertainties.
                    </p>
                </div>

                <div class="text-center mt-3">
                    <a href="/home" class="btn btn-primary">Go to my Account</a>
                </div>
            </div>
        </div>
    </div>
</div>