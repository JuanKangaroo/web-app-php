<?php
    $this->title = 'Register';
?>

<div class="container-fluid pt-3">
    <div class="row justify-content-md-center">
        <h2>Register</h2>
    </div>
    <div class="row justify-content-md-center">
        <div class="col-12 col-md-6 col-lg-4">
            <form class="form login">
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-addon"><i class="fa fa-envelope-o fa-fw" aria-hidden="true"></i></span>
                        <input id="email" type="email" class="form-control form-control-lg" name="email" value="" placeholder="E-Mail Address" required="" autofocus="">
                    </div>
                </div>
                <div class="form-group ">
                    <div class="input-group">
                        <span class="input-group-addon"><i class="fa fa-key fa-fw" aria-hidden="true"></i></span>
                        <input id="password" type="password" class="form-control form-control-lg" name="password" placeholder="Password" required="">
                    </div>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary btn-block btn-lg"> Continue </button>
                </div>
            </form>
        </div>
    </div>
</div>
