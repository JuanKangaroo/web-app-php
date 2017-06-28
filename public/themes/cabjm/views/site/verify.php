<div class="container-fluid container-landing">
    <input type="hidden" name="verify_token" value="<?= $token ?>" >
    <input type="hidden" name="verify_email" value="<?= $email ?>" >
    <input type="hidden" name="verify_phone" value="<?= $phone ?>" >

    <div id="profile_subaccounts_form" class="mb-5" style="display: none;">
        <div class="row">
            <div class="col-12 col-md-6 offset-md-3 landing-text-box py-5">
                <?php if (!$action): ?>
                    <div class="alert" role="alert">
                        <h4 class="alert-heading">Welcome!</h4>
                        <p>
                            Caribbean Assurance Brokers Ltd. (CAB), a name synonymous with innovation, 
                            is a multi-line insurance brokerage offering the full spectrum of insurance products 
                            and services throughout Jamaica. Through these offerings, we provide our clients 
                            with peace of mind in preparation for life’s uncertainties.
                        </p>
                    </div>
                <?php elseif($action == 'change' || $action == 'add'): ?>
                    <div id="veify_success_verified" style="display: none;">
                        <h4 class="alert-heading">
                            <i class="fa fa-check" style="color: green;"></i>
                            Successfully verified!
                        </h4>
                        <?php if ($email): ?>
                            <p>Congratulations! You have successfully verified the email address: <? $email ?>.</p>
                            <p>If you want to change the email address, you may go to "Account" and change it.</p>
                        <?php elseif($phone): ?>
                            <p>Congratulations! You have successfully verified the phone number: <? $phone ?>.</p>
                            <p>If you want to change the phone number, you may go to "Account" and change it.</p>
                        <?php endif ?>
                    </div>
                <?php endif ?>

                <div id="verify_email_not_veified" style="display: none;">
                    <h4 class="alert-heading">Your email is not verified.</h4>
                    <p>Click the verification link to verify your email.</p>
                </div>

                <div class="text-center mt-3">
                    <a href="/home" class="btn btn-primary">Go to my Account</a>
                </div>
            </div>
        </div>
    </div>
</div>