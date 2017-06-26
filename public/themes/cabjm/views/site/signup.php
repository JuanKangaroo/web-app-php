<div class="container-fluid container-landing">
    <div class="row justify-content-center pb-2">
        <h2><img src="<?php echo config('logoPath'); ?>" class="d-inline" height="45px"></h2>
    </div>
    <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
            <form class="form signup">
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-addon"><i class="fa fa-envelope-o fa-fw" aria-hidden="true"></i></span>
                        <input id="email" type="email" class="form-control form-control-lg" name="email" value="" placeholder="E-Mail Address" required="" autofocus="">
                    </div>
                </div>
                <div class="form-group ">
                    <div class="input-group">
                        <span class="input-group-addon"><i class="fa fa-key fa-fw" aria-hidden="true"></i></span>
                        <input id="password" type="password" class="form-control form-control-lg" name="password" placeholder="Password" required="" maxlength="4">
                    </div>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary btn-block btn-lg" id="signup_btn"> Register </button>
                </div>
            </form>
        </div>
    </div>
</div>
