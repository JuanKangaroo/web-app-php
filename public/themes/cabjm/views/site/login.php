<div class="container-fluid container-landing">
    <div class="row justify-content-center pb-2">
        <h3> <img src="<?php echo config('logoPath'); ?>" class="d-inline" height="45px"> </h3>
    </div>
    <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
            <form class="form login">
                <div class="form-group">
                    <div class="input-group">
                        <!-- <span class="input-group-addon"><i class="fa fa-envelope-o fa-fw" aria-hidden="true"></i></span> -->
                        <input id="email" type="email" class="form-control form-control-lg" name="email" value="" placeholder="Email" required="" autofocus="">
                    </div>
                </div>
                <div class="form-group ">
                    <div class="input-group">
                        <!-- <span class="input-group-addon"><i class="fa fa-key fa-fw" aria-hidden="true"></i></span> -->
                        <input id="password" type="password" class="form-control form-control-lg" name="password" placeholder="Password" required="" maxlength="4">
                    </div>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary btn-block btn-lg" id="login__btn"> Log In </button>
                </div>
            </form>

            <div class="text-center">
                <a href="/site/forgotPassword">Having trouble logging in?</a>
            </div>

            <hr>

            <div class="form-group">
                <a href="/site/register" class="btn btn-secondary btn-block btn-lg">Register</a>
            </div>
        </div>
    </div>
</div>